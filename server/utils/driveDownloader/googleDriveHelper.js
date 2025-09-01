const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const cron = require('node-cron');
const tokenStorage = require('../../services/tokenStorage');
const { createDriveClient, oauth2Client } = require('../../config/driveConfig');

async function findFineticaFolderId(drive) {
    try {
        const response = await drive.files.list({ // drive.files.list vraća listu fajlova u Google Drive-u (MORA SE KORISTITI await)
            q: "name='finetica' and mimeType='application/vnd.google-apps.folder' and trashed=false", // q -> query string, trazi folder sa imenom 'finetica' koji nije obrisan, i koristeci 'mimeType' ogranicava pretragu na foldere
            fields: 'files(id, name)', // definisemo polja koja nam trebaju, samo id i ime fajla
            pageSize: 1 // ako ima vise foldera sa istim imenom, uzet ce samo prvi 
        });

        if (response.data.files.length > 0) {
            const folderId = response.data.files[0].id; // WE CAN INSPECT ID OF FOLDER
            return folderId; // ako se pronadje fajl, ispise se u konzoli njegov id, obrisati conosle.log po potrebi 
        } else {
            console.log('⚠️ "finetica" folder not found in Google Drive');
            return null;
        }
    } catch (err) {
        console.error('❌ Error finding finetica folder:', err.message);
        return null;
    }
}
async function downloadOrExportFile(drive, file, downloadPath) {
    const isGoogleAppsFile = file.mimeType.startsWith('application/vnd.google-apps.');

    let fileName = file.name;
    let destPath;

    if (isGoogleAppsFile) {
        // For Google Apps files, add appropriate extension and export
        const extension = getExtensionForGoogleAppsFile(file.mimeType);
        fileName = `${file.name}${extension}`;
        destPath = path.join(downloadPath, fileName);

        // Check if file already exists and compare modification times
        if (fs.existsSync(destPath)) {
            const localFileStats = fs.statSync(destPath);
            const remoteModifiedTime = new Date(file.modifiedTime);

            // If remote file is newer, download it; otherwise skip
            if (localFileStats.mtime >= remoteModifiedTime) {
                return { downloaded: false, reason: 'Already up to date' };
            } else {
                console.log(`🔄 File has been updated on Drive, re-downloading: ${fileName}`);
            }
        }

        const fileExistedBefore = fs.existsSync(destPath);
        await exportGoogleAppsFile(drive, file, destPath);

        // Set the local file's modification time to match the remote file
        const remoteModifiedTime = new Date(file.modifiedTime);
        fs.utimesSync(destPath, remoteModifiedTime, remoteModifiedTime);
        return { downloaded: true, type: 'exported', reason: fileExistedBefore ? 'Updated' : 'New' };
    } else {
        // For regular files, download directly
        destPath = path.join(downloadPath, fileName);

        // Check if file already exists and compare modification times
        if (fs.existsSync(destPath)) {
            const localFileStats = fs.statSync(destPath);
            const remoteModifiedTime = new Date(file.modifiedTime);

            // If remote file is newer, download it; otherwise skip
            if (localFileStats.mtime >= remoteModifiedTime) {
                return { downloaded: false, reason: 'Already up to date' };
            } else {
                console.log(`🔄 File has been updated on Drive, re-downloading: ${fileName}`);
            }
        }

        const fileExistedBefore = fs.existsSync(destPath);
        await downloadRegularFile(drive, file, destPath);

        // Set the local file's modification time to match the remote file
        const remoteModifiedTime = new Date(file.modifiedTime);
        fs.utimesSync(destPath, remoteModifiedTime, remoteModifiedTime);

        console.log(`✅ Downloaded: ${fileName}`);
        return { downloaded: true, type: 'downloaded', reason: fileExistedBefore ? 'Updated' : 'New' };
    }
}
function getExtensionForGoogleAppsFile(mimeType) {
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
            return '.pdf'; // Fallback to PDF
    }
}
async function exportGoogleAppsFile(drive, file, destPath) {
    let exportFormat = '';

    // Determine export format based on file type
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
async function downloadRegularFile(drive, file, destPath) {
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
async function start() {
    if (this.isRunning) {
        console.log('⚠️ Background sync service is already running');
        return;
    }

    // Ensure download directory exists
    try {
        mkdirp.sync(this.downloadPath);
    } catch (err) {
        console.log('❌ Failed to create download directory:', err);
        return;
    }
    try {
        await this.performSync();
    } catch (err) {
        console.log('❌ Initial sync failed:', err);
    }

    // Schedule periodic sync
    this.cronJob = cron.schedule(this.syncInterval, async () => {
        await this.performSync();
    }, {
        scheduled: false,
        timezone: "Europe/Sarajevo"
    });

    this.cronJob.start();
    this.isRunning = true;
}
async function stop() {
    if (this.cronJob) {
        this.cronJob.stop();
        this.isRunning = false;
        console.log('🛑 Google Drive auto sync stopped');
    }
}
async function syncFiles(drive) {
    try {
        const fineticaFolderId = await findFineticaFolderId(drive);
        const subfoldersResponse = await drive.files.list({
            q: `'${fineticaFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed=false`,
            fields: 'files(id, name)',
        });

        const subfolders = subfoldersResponse.data.files;

        for (const folder of subfolders) {
            const localSubfolder = path.join(this.downloadPath, folder.name);
            if (!fs.existsSync(localSubfolder)) {
                fs.mkdirSync(localSubfolder, { recursive: true });
            }

            const response = await drive.files.list({
                pageSize: 50,
                fields: 'files(id, name, modifiedTime, mimeType, size)',
                q: `'${folder.id}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
                orderBy: 'modifiedTime desc'
            });

            const files = response.data.files;

            for (const file of files) {
                try {
                    await downloadOrExportFile(drive, file, localSubfolder);
                } catch (err) {
                    console.error(`❌ Failed to process ${file.name} in ${folder.name}:`, err.message);
                }
            }
        }
    } catch (error) {
        console.error('❌ Error syncing files:', error.message);
    }
}

async function getStatus() {
    return {
        isRunning: this.isRunning,
        lastSync: this.lastSyncTime,
        syncInterval: 'Every minute',
        hasRefreshToken: tokenStorage.hasValidRefreshToken(),
        downloadPath: this.downloadPath
    };
}
async function performSync() {
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

    } catch (error) {
        console.error('❌ Google Drive sync failed:', error.message);
    }
}
module.exports = {
    findFineticaFolderId,
    downloadOrExportFile,
    getExtensionForGoogleAppsFile,
    exportGoogleAppsFile,
    downloadRegularFile,
    start,
    stop,
    getStatus,
    syncFiles,
    performSync
};
