class BackgroundSyncService {
    constructor() {
        this.activeSessions = new Map(); // Store active user sessions
        this.isRunning = false;
        this.syncInterval = '* * * * *'; // Every 1 minute
    }


}
// Export singleton instance
module.exports = new BackgroundSyncService();
