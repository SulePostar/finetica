const fs = require('fs');
const path = require('path');

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
            console.error('❌ Error logging tokens:', error.message);
            return false;
        }
    }

    // Load tokens from environment variables
    loadTokens() {
        try {
            const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
            const accessToken = process.env.GOOGLE_ACCESS_TOKEN;

            if (!refreshToken) {
                console.log('⚠️ No GOOGLE_REFRESH_TOKEN found in environment variables');
                return null;
            }

            const tokens = {
                refresh_token: refreshToken,
                access_token: accessToken,
                saved_at: new Date().toISOString()
            };
            return tokens;
        } catch (error) {
            console.error('❌ Error loading tokens from environment:', error.message);
            return null;
        }
    }

    // Check if we have valid refresh token
    hasValidRefreshToken() {
        return !!process.env.GOOGLE_REFRESH_TOKEN;
    }

    // Clear tokens (just log instruction)
    clearTokens() {
        console.log('💡 To clear tokens, remove these from your .env file:');
        console.log('GOOGLE_REFRESH_TOKEN');
        console.log('GOOGLE_ACCESS_TOKEN');
    }
}

module.exports = new TokenStorage();
