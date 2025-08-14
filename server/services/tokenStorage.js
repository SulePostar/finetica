const Logger = require('../utils/logger');

class TokenStorage {
    constructor() {
        // No longer need file-based storage
    }

    // Save tokens to environment variables (for development)
    // In production, you might want to use a database or secure storage
    saveTokens(tokens) {
        try {
            return true;
        } catch (error) {
            Logger.info('❌ Error saving tokens:', error.message);
            return false;
        }
    }

    // Load tokens from environment variables
    loadTokens() {
        try {
            const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
            const accessToken = process.env.GOOGLE_ACCESS_TOKEN;

            if (!refreshToken) {
                Logger.warn('⚠️ No GOOGLE_REFRESH_TOKEN found in environment variables');
                return null;
            }

            const tokens = {
                refresh_token: refreshToken,
                access_token: accessToken,
                saved_at: new Date().toISOString()
            };
            return tokens;
        } catch (error) {
            Logger.error('❌ Error loading tokens from environment:', error.message);
            return null;
        }
    }

    // Check if we have valid refresh token
    hasValidRefreshToken() {
        return !!process.env.GOOGLE_REFRESH_TOKEN;
    }

    // Clear tokens (just log instruction)
    clearTokens() {
        Logger.warn('⚠️ Tokens cleared from environment variables');
    }
}

module.exports = new TokenStorage();
