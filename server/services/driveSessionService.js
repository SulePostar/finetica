const googleDriveAutoSync = require('../tasks/googleDriveAutoSync');
const tokenStorage = require('./tokenStorage');

class DriveSessionService {
    getDriveConnectionStatus() {
        try {
            const hasToken = tokenStorage.hasValidRefreshToken();
            const status = googleDriveAutoSync.getStatus();
            return {
                connected: hasToken && status.isRunning,
                isRunning: status.isRunning,
                hasToken: hasToken
            };
        } catch (error) {
            return {
                connected: false,
                isRunning: false,
                hasToken: false
            };
        }
    }
}

module.exports = new DriveSessionService();
