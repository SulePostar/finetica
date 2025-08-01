const { oauth2Client, createDriveClient } = require('../../config/googleClient');
const fs = require('fs');
const path = require('path');

class DriveAutoDownloader {
    constructor() {
        this.isRunning = false;
        this.interval = null;
        this.tokens = null;
        this.downloadPath = path.join(__dirname, 'downloads');

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
                    console.log('✅ Loaded stored Google tokens');
                    return true;
                }
            }
        } catch (err) {
            console.error('❌ Error loading tokens:', err.message);
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

    // Get expected file name with extension
    getExpectedFileName(file) {
        if (file.mimeType.startsWith('application/vnd.google-apps.')) {
            switch (file.mimeType) {
                case 'application/vnd.google-apps.spreadsheet':
                    return file.name + '.xlsx';
                case 'application/vnd.google-apps.document':
                    return file.name + '.docx';
                case 'application/vnd.google-apps.presentation':
                    return file.name + '.pptx';
                default:
                    return file.name + '.pdf';
            }
        }
        return file.name;
    }

    // Get file type description
    getFileTypeDescription(mimeType) { // funkcija koja vraca opis tipa fajla na osnovu njegovog mimeType-a (jasnije definisani opis fajla)
        const typeMap = {
            'application/pdf': 'PDF Document',
            'application/msword': 'Word Document',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
            'application/vnd.ms-excel': 'Excel Spreadsheet',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
            'text/plain': 'Text File',
            'image/jpeg': 'JPEG Image',
            'image/png': 'PNG Image',
            'video/mp4': 'MP4 Video',
            'audio/mpeg': 'MP3 Audio'
        };
        return typeMap[mimeType] || 'File';
    }

    // Download regular files
    async downloadRegularFile(drive, file) {
        return new Promise((resolve, reject) => {
            const filePath = path.join(this.downloadPath, file.name);
            const dest = fs.createWriteStream(filePath);

            dest.on('finish', () => {
                console.log(`✅ Downloaded: ${file.name} (${this.getFileTypeDescription(file.mimeType)})`);

                // Set file modification time to match Google Drive
                if (file.modifiedTime) {
                    const modTime = new Date(file.modifiedTime);
                    fs.utimesSync(filePath, modTime, modTime);
                }

                resolve();
            });

            dest.on('error', (err) => {
                console.error('❌ Download error:', err);
                reject(err);
            });

            console.log(`📥 Downloading ${file.name} (${this.getFileTypeDescription(file.mimeType)})...`);

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

    // Export Google Apps files
    async exportGoogleAppsFile(drive, file) {
        return new Promise((resolve, reject) => {
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
                default:
                    exportFormat = 'application/pdf';
            }

            const fileName = this.getExpectedFileName(file);
            const filePath = path.join(this.downloadPath, fileName);
            const dest = fs.createWriteStream(filePath);

            dest.on('finish', () => {
                console.log(`✅ Exported: ${fileName}`);
                resolve();
            });

            dest.on('error', reject);

            console.log(`📤 Exporting ${file.name}...`);

            drive.files.export({
                fileId: file.id,
                mimeType: exportFormat
            }, {
                responseType: 'stream'
            })
                .then(response => {
                    response.data.pipe(dest);
                })
                .catch(err => {
                    // Fallback to CSV for spreadsheets
                    if (file.mimeType === 'application/vnd.google-apps.spreadsheet') {
                        console.log('⚠️ XLSX export failed, trying CSV...');

                        const csvFileName = file.name + '.csv';
                        const csvPath = path.join(this.downloadPath, csvFileName);
                        const csvDest = fs.createWriteStream(csvPath);

                        csvDest.on('finish', () => {
                            console.log(`✅ Exported as CSV: ${csvFileName}`);
                            resolve();
                        });

                        csvDest.on('error', reject);

                        drive.files.export({
                            fileId: file.id,
                            mimeType: 'text/csv'
                        }, {
                            responseType: 'stream'
                        })
                            .then(response => {
                                response.data.pipe(csvDest);
                            })
                            .catch(reject);
                    } else {
                        reject(err);
                    }
                });
        });
    }

    // Check for and download latest files
    async checkAndDownload() {
        if (!this.tokens) {
            console.log('⚠️ No authentication tokens available');
            return;
        }

        try {
            oauth2Client.setCredentials(this.tokens);
            const drive = createDriveClient();

            // Get latest files (not just one, but several recent ones)
            const response = await drive.files.list({
                pageSize: 10, // Check last 10 files
                orderBy: 'modifiedTime desc',
                fields: 'files(id, name, mimeType, size, modifiedTime)',
                q: "trashed=false" // Only non-trashed files
            });

            if (response.data.files.length === 0) {
                console.log('📂 No files found in Google Drive');
                return;
            }

            console.log(`🔍 Checking ${response.data.files.length} recent files...`);

            for (const file of response.data.files) {
                const expectedFileName = this.getExpectedFileName(file);
                const filePath = path.join(this.downloadPath, expectedFileName);

                // Check if file needs to be downloaded/updated
                let needsDownload = true;

                if (fs.existsSync(filePath)) {
                    const fileStats = fs.statSync(filePath);
                    const lastModified = new Date(file.modifiedTime);

                    if (fileStats.mtime >= lastModified) {
                        needsDownload = false;
                    }
                }

                if (needsDownload) {
                    console.log(`📥 New/updated file detected: ${file.name}`);

                    if (file.mimeType.startsWith('application/vnd.google-apps.')) {
                        await this.exportGoogleAppsFile(drive, file);
                    } else {
                        await this.downloadRegularFile(drive, file);
                    }
                } else {
                    console.log(`⏭️ File up-to-date: ${expectedFileName}`);
                }
            }

        } catch (err) {
            console.error('❌ Auto-download error:', err.message);

            // If token is invalid, clear it
            if (err.message.includes('invalid_grant') || err.message.includes('unauthorized')) {
                console.log('🔑 Token expired, clearing stored tokens');
                this.tokens = null;
                const tokenPath = path.join(__dirname, 'stored-tokens.json');
                if (fs.existsSync(tokenPath)) {
                    fs.unlinkSync(tokenPath);
                }
            }
        }
    }

    // Start the auto-download service
    start(intervalMinutes = 1) {
        if (this.isRunning) {
            console.log('⚠️ Auto-downloader is already running');
            return;
        }

        // Try to load existing tokens
        if (!this.loadTokens()) {
            console.log('⚠️ No valid tokens found. Please authenticate via web interface first.');
            return;
        }

        this.isRunning = true;
        console.log(`🚀 Auto-downloader started (checking every ${intervalMinutes} minute(s))`);

        // Initial check
        this.checkAndDownload();

        // Set up interval
        this.interval = setInterval(() => {
            this.checkAndDownload();
        }, intervalMinutes * 60 * 1000);
    }

    // Stop the auto-download service
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
        console.log('⏹️ Auto-downloader stopped');
    }

    // Get status
    getStatus() {
        return {
            isRunning: this.isRunning,
            hasTokens: !!this.tokens,
            downloadPath: this.downloadPath
        };
    }
}

module.exports = DriveAutoDownloader;
