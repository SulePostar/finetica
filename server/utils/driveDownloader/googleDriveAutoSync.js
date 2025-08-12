const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { createDriveClient, oauth2Client } = require('../../config/driveConfig');
const tokenStorage = require('../../services/tokenStorage');

class GoogleDriveAutoSync {
    constructor() {
        this.isRunning = false;
        this.syncInterval = '* * * * *'; // Every 1 minute
        this.downloadPath = path.join(__dirname, '../googleDriveDownloads');
        this.lastSyncTime = null;
    }

    // Start the auto sync service
    start() {
        if (this.isRunning) {
            console.log('⚠️ Google Drive auto sync is already running');
            return;
        }
        // Ensure download directory exists
        mkdirp.sync(this.downloadPath);

        this.cronJob = cron.schedule(this.syncInterval, async () => {
            await this.performSync();
        }, {
            scheduled: false,
            timezone: "Europe/Belgrade"
        });

        this.cronJob.start();
        this.isRunning = true;

        // Perform initial sync
        setTimeout(() => this.performSync(), 5000);
    }

    // Stop the sync service
    stop() {
        if (this.cronJob) {
            this.cronJob.stop();
            this.isRunning = false;
            console.log('🛑 Google Drive auto sync stopped');
        }
    }

    // Main sync function
    async performSync() {
        try {

            // Load tokens from environment variables
            const tokens = tokenStorage.loadTokens();
            if (!tokens || !tokens.refresh_token) {
                console.log('⚠️ No refresh token available. Skipping sync.');
                return;
            }

            // Set up OAuth client with tokens from environment
            oauth2Client.setCredentials(tokens);

            // Try to refresh access token if needed
            try {
                const { credentials } = await oauth2Client.refreshAccessToken();

                // Use refreshed credentials for this session only (no file storage)
                oauth2Client.setCredentials(credentials);
            } catch (refreshError) {
                console.error('❌ Failed to refresh access token:', refreshError.message);
                return;
            }

            // Create Drive client and sync files
            const drive = createDriveClient();
            await this.syncFiles(drive);

            this.lastSyncTime = new Date().toISOString();
            console.log('✅ Google Drive sync completed successfully');

        } catch (error) {
            console.error('❌ Google Drive sync failed:', error.message);
        }
    }

    // Sync files from Google Drive
    async syncFiles(drive) {
        try {
            // Find the "finetica" folder
            const fineticaFolderId = await this.findFineticaFolderId(drive);
            if (!fineticaFolderId) {
                console.log('⚠️ "finetica" folder not found in Google Drive');
                return;
            }

            // List files from the "finetica" folder
            const response = await drive.files.list({
                pageSize: 50,
                fields: 'files(id, name, modifiedTime, mimeType, size)',
                q: `'${fineticaFolderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
                orderBy: 'modifiedTime desc'
            });

            const files = response.data.files;
            console.log(`📁 Found ${files.length} files in "finetica" folder`);

            let downloadedCount = 0;
            let skippedCount = 0;

            for (const file of files) {
                try {
                    const result = await this.downloadOrExportFile(drive, file);
                    if (result.downloaded) {
                        downloadedCount++;
                        console.log(`📥 ${result.action}: ${file.name}`);
                    } else {
                        skippedCount++;
                    }
                } catch (err) {
                    console.error(`❌ Failed to process ${file.name}:`, err.message);
                }
            }

            console.log(`📊 Sync complete: ${downloadedCount} downloaded, ${skippedCount} skipped`);

        } catch (error) {
            console.error('❌ Error syncing files:', error.message);
        }
    }

    // Find the "finetica" folder ID
    async findFineticaFolderId(drive) {
        try {
            const response = await drive.files.list({
                q: "name='finetica' and mimeType='application/vnd.google-apps.folder' and trashed=false",
                fields: 'files(id, name)',
                pageSize: 1
            });

            if (response.data.files.length > 0) {
                return response.data.files[0].id;
            }
            return null;
        } catch (err) {
            console.error('❌ Error finding finetica folder:', err.message);
            return null;
        }
    }

    // Download or export files based on their type
    async downloadOrExportFile(drive, file) {
        const isGoogleAppsFile = file.mimeType.startsWith('application/vnd.google-apps.');
        let fileName = file.name;
        let destPath;

        if (isGoogleAppsFile) {
            const extension = this.getExtensionForGoogleAppsFile(file.mimeType);
            fileName = `${file.name}${extension}`;
            destPath = path.join(this.downloadPath, fileName);

            if (fs.existsSync(destPath)) {
                const localFileStats = fs.statSync(destPath);
                const remoteModifiedTime = new Date(file.modifiedTime);

                if (localFileStats.mtime >= remoteModifiedTime) {
                    return { downloaded: false, reason: 'Already up to date' };
                }
            }

            const fileExistedBefore = fs.existsSync(destPath);
            await this.exportGoogleAppsFile(drive, file, destPath);

            // Set the local file's modification time to match the remote file
            const remoteModifiedTime = new Date(file.modifiedTime);
            fs.utimesSync(destPath, remoteModifiedTime, remoteModifiedTime);

            return {
                downloaded: true,
                action: fileExistedBefore ? 'Updated' : 'Downloaded',
                type: 'exported'
            };
        } else {
            destPath = path.join(this.downloadPath, fileName);

            if (fs.existsSync(destPath)) {
                const localFileStats = fs.statSync(destPath);
                const remoteModifiedTime = new Date(file.modifiedTime);

                if (localFileStats.mtime >= remoteModifiedTime) {
                    return { downloaded: false, reason: 'Already up to date' };
                }
            }

            const fileExistedBefore = fs.existsSync(destPath);
            await this.downloadRegularFile(drive, file, destPath);

            // Set the local file's modification time to match the remote file
            const remoteModifiedTime = new Date(file.modifiedTime);
            fs.utimesSync(destPath, remoteModifiedTime, remoteModifiedTime);

            return {
                downloaded: true,
                action: fileExistedBefore ? 'Updated' : 'Downloaded',
                type: 'downloaded'
            };
        }
    }

    // Helper functions
    getExtensionForGoogleAppsFile(mimeType) {
        switch (mimeType) {
            case 'application/vnd.google-apps.spreadsheet':
                return '.xlsx';
            case 'application/vnd.google-apps.document':
                return '.docx';
            case 'application/vnd.google-apps.presentation':
                return '.pptx';
            case 'application/vnd.google-apps.drawing':
                return '.pdf';
            case 'application/vnd.google-apps.form':
                return '.pdf';
            default:
                return '.pdf';
        }
    }

    async exportGoogleAppsFile(drive, file, destPath) {
        let exportFormat = '';

        switch (file.mimeType) {
            case 'application/vnd.google-apps.spreadsheet':
                exportFormat = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
            case 'application/vnd.google-apps.document':
                exportFormat = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
            case 'application/vnd.google-apps.presentation':
                exportFormat = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
                break;
            case 'application/vnd.google-apps.drawing':
            case 'application/vnd.google-apps.form':
            default:
                exportFormat = 'application/pdf';
                break;
        }

        return new Promise((resolve, reject) => {
            const dest = fs.createWriteStream(destPath);
            dest.on('finish', resolve);
            dest.on('error', reject);

            drive.files.export({
                fileId: file.id,
                mimeType: exportFormat
            }, {
                responseType: 'stream'
            })
                .then(response => {
                    response.data.pipe(dest);
                })
                .catch(reject);
        });
    }

    async downloadRegularFile(drive, file, destPath) {
        return new Promise((resolve, reject) => {
            const dest = fs.createWriteStream(destPath);
            dest.on('finish', resolve);
            dest.on('error', reject);

            drive.files.get({
                fileId: file.id,
                alt: 'media'
            }, {
                responseType: 'stream'
            })
                .then(response => {
                    response.data.pipe(dest);
                })
                .catch(reject);
        });
    }

    // Get service status
    getStatus() {
        return {
            isRunning: this.isRunning,
            lastSync: this.lastSyncTime,
            syncInterval: 'Every minute',
            hasRefreshToken: tokenStorage.hasValidRefreshToken(),
            downloadPath: this.downloadPath
        };
    }

    // Manual sync trigger
    async manualSync() {
        if (!this.isRunning) {
            throw new Error('Sync service is not running');
        }
        await this.performSync();
    }
}

module.exports = new GoogleDriveAutoSync();
