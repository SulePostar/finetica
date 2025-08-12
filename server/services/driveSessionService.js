const { createDriveClient, oauth2Client } = require('../config/driveConfig');
const { findFineticaFolderId, downloadOrExportFile } = require('../utils/driveDownloader/driveHelper');

const googleDriveAutoSync = require('../utils/driveDownloader/googleDriveAutoSync');
const tokenStorage = require('./tokenStorage');
const path = require('path');
const mkdirp = require('mkdirp');

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
    async validateAndRefreshSession(req) {
        const tokens = req.session.tokens;
        const sessionCreated = req.session.createdAt;
        const now = Date.now();

        // Check if session exists and is within 1 month (30 days)
        const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
        let isSessionValid = tokens && sessionCreated && (now - sessionCreated < oneMonthInMs);

        // If session is expired but we have a refresh token, try to refresh
        if (tokens && !isSessionValid && tokens.refresh_token) {
            try {
                console.log('🔄 Attempting to refresh expired access token...');
                oauth2Client.setCredentials(tokens);
                const { credentials } = await oauth2Client.refreshAccessToken();

                // Update session with new tokens
                req.session.tokens = credentials;
                req.session.createdAt = Date.now();
                isSessionValid = true;

                console.log('✅ Access token refreshed successfully');
                return { isValid: true, tokens: credentials, message: 'Token refreshed successfully' };
            } catch (refreshError) {
                console.error('❌ Failed to refresh token:', refreshError.message);
                // Clear invalid session
                if (req.session.tokens) {
                    delete req.session.tokens;
                    delete req.session.createdAt;
                }
                return {
                    isValid: false,
                    tokens: null,
                    message: 'Failed to refresh token: ' + refreshError.message
                };
            }
        }

        if (!isSessionValid) {
            console.log('❌ Session invalid or expired');
            // Clear invalid session
            if (req.session.tokens) {
                delete req.session.tokens;
                delete req.session.createdAt;
            }
            return {
                isValid: false,
                tokens: null,
                message: 'Session invalid or expired'
            };
        }

        return { isValid: true, tokens: tokens, message: 'Session valid' };
    }
    async downloadFineticaFiles(tokens, pageSize = 10) {
        try {
            oauth2Client.setCredentials(tokens);
            const drive = createDriveClient();

            // First, find the "finetica" folder
            const fineticaFolderId = await findFineticaFolderId(drive);

            if (!fineticaFolderId) {
                throw new Error('Finetica folder not found. Please create a folder named "finetica" in your Google Drive and put files there.');
            }

            // List recent files from the "finetica" folder only
            const response = await drive.files.list({
                pageSize,
                fields: 'files(id, name, modifiedTime, mimeType, size)',
                q: `'${fineticaFolderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
                orderBy: 'modifiedTime desc'
            });

            console.log(`📁 Found ${response.data.files.length} files in "finetica" folder`);
            const files = response.data.files;
            const downloadPath = path.join(__dirname, '../googleDriveDownloads');
            mkdirp.sync(downloadPath); // Create folder if not exists

            let downloadedCount = 0;
            let skippedCount = 0;
            const processedFiles = [];

            for (const file of files) {
                try {
                    const result = await downloadOrExportFile(drive, file, downloadPath);
                    if (result.downloaded) {
                        downloadedCount++;
                    } else {
                        skippedCount++;
                    }
                    processedFiles.push({
                        name: file.name,
                        status: result.downloaded ? 'downloaded' : 'skipped',
                        reason: result.reason || result.type || 'processed'
                    });
                } catch (err) {
                    console.error(`❌ Failed to process ${file.name}:`, err.message);
                    processedFiles.push({
                        name: file.name,
                        status: 'error',
                        reason: err.message
                    });
                }
            }

            return {
                success: true,
                totalFiles: files.length,
                downloadedCount,
                skippedCount,
                processedFiles,
                folderName: 'finetica',
                downloadPath
            };

        } catch (error) {
            console.error('❌ Download service error:', error);
            throw error;
        }
    }
    async getFineticaFolderInfo(tokens) {
        try {
            oauth2Client.setCredentials(tokens);
            const drive = createDriveClient();

            const fineticaFolderId = await findFineticaFolderId(drive);
            if (!fineticaFolderId) {
                return { found: false, message: 'Finetica folder not found' };
            }

            // Get file count
            const response = await drive.files.list({
                pageSize: 1000, // Get more files for count
                fields: 'files(id, name)',
                q: `'${fineticaFolderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed=false`
            });

            return {
                found: true,
                folderId: fineticaFolderId,
                fileCount: response.data.files.length,
                message: `Found ${response.data.files.length} files in finetica folder`
            };

        } catch (error) {
            throw new Error('Failed to get folder info: ' + error.message);
        }
    }
}

module.exports = new DriveSessionService();
