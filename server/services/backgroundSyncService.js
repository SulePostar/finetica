const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { createDriveClient, oauth2Client } = require('../config/driveConfig');

class BackgroundSyncService {
    constructor() {
        this.activeSessions = new Map(); // Store active user sessions
        this.isRunning = false;
        this.syncInterval = '* * * * *'; // Every 1 minute
    }

    // Register user session for background sync
    registerUserSession(userId, tokens, sessionCreated) {
        this.activeSessions.set(userId, {
            tokens,
            sessionCreated,
            lastSync: null
        });
    }

    // Remove user session from background sync
    unregisterUserSession(userId) {
        this.activeSessions.delete(userId);
    }

    // Start the background sync service
    start() {
        if (this.isRunning) {
            console.log('⚠️ Background sync service is already running');
            return;
        }

        this.cronJob = cron.schedule(this.syncInterval, async () => {
            await this.performSync();
        }, {
            scheduled: false,
            timezone: "Europe/Sarajevo"
        });

        this.cronJob.start();
        this.isRunning = true;
        console.log('✅ Background sync service started successfully');
    }

    // Stop the background sync service
    stop() {
        if (this.cronJob) {
            this.cronJob.stop();
            this.isRunning = false;
            console.log('🛑 Background sync service stopped');
        }
    }

    // Main sync function that runs in background
    async performSync() {
        if (this.activeSessions.size === 0) {
            console.log('ℹ️ No active sessions for background sync');
            return;
        }

        console.log(`🔄 Starting background sync for ${this.activeSessions.size} user(s)...`);

        for (const [userId, sessionData] of this.activeSessions) {
            try {
                await this.syncUserFiles(userId, sessionData);
            } catch (error) {
                console.error(`❌ Background sync failed for user ${userId}:`, error.message);

                // If authentication failed, remove the session
                if (error.message.includes('authentication') || error.message.includes('unauthorized')) {
                    this.unregisterUserSession(userId);
                }
            }
        }

        console.log('✅ Background sync completed');
    }

    // Sync files for a specific user
    async syncUserFiles(userId, sessionData) {
        const { tokens, sessionCreated } = sessionData;
        const now = Date.now();
        const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;

        // Check if session is still valid
        let isSessionValid = tokens && sessionCreated && (now - sessionCreated < oneMonthInMs);

        // Try to refresh token if needed
        if (tokens && !isSessionValid && tokens.refresh_token) {
            try {
                console.log(`🔄 Refreshing token for user ${userId}...`);
                oauth2Client.setCredentials(tokens);
                const { credentials } = await oauth2Client.refreshAccessToken();

                // Update session data
                sessionData.tokens = credentials;
                sessionData.sessionCreated = Date.now();
                isSessionValid = true;

                console.log(`✅ Token refreshed for user ${userId}`);
            } catch (refreshError) {
                console.error(`❌ Failed to refresh token for user ${userId}:`, refreshError.message);
                throw new Error('Token refresh failed - authentication required');
            }
        }

        if (!isSessionValid) {
            throw new Error('Session invalid or expired - authentication required');
        }

        // Set up Google Drive client
        oauth2Client.setCredentials(sessionData.tokens);
        const drive = createDriveClient();

        // Find the "finetica" folder
        const fineticaFolderId = await this.findFineticaFolderId(drive);
        if (!fineticaFolderId) {
            console.log(`⚠️ Finetica folder not found for user ${userId}`);
            return;
        }

        // List and download files
        const response = await drive.files.list({
            pageSize: 20, // Increased for background sync
            fields: 'files(id, name, modifiedTime, mimeType, size)',
            q: `'${fineticaFolderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
            orderBy: 'modifiedTime desc'
        });

        const files = response.data.files;
        const downloadPath = path.join(__dirname, '../googleDriveDownloads');
        mkdirp.sync(downloadPath);

        let downloadedCount = 0;
        let skippedCount = 0;

        for (const file of files) {
            try {
                const result = await this.downloadOrExportFile(drive, file, downloadPath);
                if (result.downloaded) {
                    downloadedCount++;
                } else {
                    skippedCount++;
                }
            } catch (err) {
                console.error(`❌ Failed to process ${file.name} for user ${userId}:`, err.message);
            }
        }

        sessionData.lastSync = new Date().toISOString();
        console.log(`📊 User ${userId}: ${downloadedCount} new, ${skippedCount} skipped files`);
    }

    // Helper function to find the "finetica" folder ID
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

    // Helper function to download or export files (copied from drive.js)
    async downloadOrExportFile(drive, file, downloadPath) {
        const isGoogleAppsFile = file.mimeType.startsWith('application/vnd.google-apps.');
        let fileName = file.name;
        let destPath;

        if (isGoogleAppsFile) {
            const extension = this.getExtensionForGoogleAppsFile(file.mimeType);
            fileName = `${file.name}${extension}`;
            destPath = path.join(downloadPath, fileName);

            if (fs.existsSync(destPath)) {
                const localFileStats = fs.statSync(destPath);
                const remoteModifiedTime = new Date(file.modifiedTime);

                if (localFileStats.mtime >= remoteModifiedTime) {
                    return { downloaded: false, reason: 'Already up to date' };
                }
            }

            await this.exportGoogleAppsFile(drive, file, destPath);
            const remoteModifiedTime = new Date(file.modifiedTime);
            fs.utimesSync(destPath, remoteModifiedTime, remoteModifiedTime);

            return { downloaded: true, type: 'exported' };
        } else {
            destPath = path.join(downloadPath, fileName);

            if (fs.existsSync(destPath)) {
                const localFileStats = fs.statSync(destPath);
                const remoteModifiedTime = new Date(file.modifiedTime);

                if (localFileStats.mtime >= remoteModifiedTime) {
                    return { downloaded: false, reason: 'Already up to date' };
                }
            }

            await this.downloadRegularFile(drive, file, destPath);
            const remoteModifiedTime = new Date(file.modifiedTime);
            fs.utimesSync(destPath, remoteModifiedTime, remoteModifiedTime);

            return { downloaded: true, type: 'downloaded' };
        }
    }

    // Helper functions (copied from drive.js)
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

    // Get status of background service
    getStatus() {
        return {
            isRunning: this.isRunning,
            activeUsers: this.activeSessions.size,
            syncInterval: this.syncInterval,
            activeSessions: Array.from(this.activeSessions.entries()).map(([userId, data]) => ({
                userId,
                lastSync: data.lastSync,
                sessionCreated: new Date(data.sessionCreated).toISOString()
            }))
        };
    }
}

// Export singleton instance
module.exports = new BackgroundSyncService();
