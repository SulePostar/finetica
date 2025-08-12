const { oauth2Client } = require('../../config/googleClient');
const fs = require('fs');
const path = require('path');

class DriveAutoDownloader {
    constructor() {
        this.isRunning = false;
        this.interval = null;
        this.tokens = null;
        this.downloadPath = path.join(__dirname, 'googleDriveDownloads');

        // Ensure downloads directory exists
        if (!fs.existsSync(this.downloadPath)) {
            fs.mkdirSync(this.downloadPath, { recursive: true });
        }
    }

    // Load stored tokens from file
    loadTokens() {
        try {
            const tokenPath = path.join(__dirname, 'stored-tokens.json');
            // pokušava da učita token iz fajla
            // ako postoji i nije istekao, postavlja ih u oauth2Client
            if (fs.existsSync(tokenPath)) {
                const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
                if (tokenData.tokens && tokenData.expiresAt > Date.now()) {
                    this.tokens = tokenData.tokens;
                    oauth2Client.setCredentials(this.tokens);
                    return true;
                }
            }
        } catch (err) {
            console.error('Error loading tokens:', err.message);
        }
        return false;
    }

    // Save tokens to file
    saveTokens(tokens) {
        try {
            const tokenPath = path.join(__dirname, 'stored-tokens.json'); // spasavamo token lokalno radi lakseg citanja 
            const tokenData = {
                tokens: tokens,
                expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 dana vrijedi token kada se korisnik jednom prijavi
                savedAt: new Date().toISOString()
            };
            fs.writeFileSync(tokenPath, JSON.stringify(tokenData, null, 2));
            this.tokens = tokens;
            console.log('💾 Tokens saved to file');
        } catch (err) {
            console.error('❌ Error saving tokens:', err.message);
        }
    }

}

module.exports = DriveAutoDownloader;
