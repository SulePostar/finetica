const path = require('path');
const {
    performSync,
    syncFiles,
    start: helperStart
} = require('../utils/googleDrive/googleDriveHelper');
const tokenStorage = require('../services/tokenStorage');

class GoogleDriveAutoSync {
    constructor() {
        this.isRunning = false;
        this.syncInterval = '* * * * *'; // 1 MINUTA
        this.downloadPath = path.join(__dirname, './../googleDriveDownloads');
        this.lastSyncTime = null;
    }

    // Start the auto sync service
    async start() {
        await helperStart.call(this);
    }
    // Main sync function
    async performSync() {
        return performSync.call(this);
    }

    // Sync files from Google Drive
    async syncFiles(drive) {
        return syncFiles.call(this, drive);
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
}

module.exports = new GoogleDriveAutoSync();
