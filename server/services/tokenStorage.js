const Logger = require('../utils/logger');

class TokenStorage {
    constructor() {

    }

    saveTokens() {
        Logger.info('⚡ No tokens to save with Service Account');
        return true;
    }

    loadTokens() {
        Logger.info('⚡ No tokens to load with Service Account');
        return null;
    }

    hasValidRefreshToken() {
        return true; // Always valid
    }

    clearTokens() {
        Logger.info('⚡ Nothing to clear');
    }
}

module.exports = new TokenStorage();
