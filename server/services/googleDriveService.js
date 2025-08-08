const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const Logger = require('../utils/loggerSync');
const FileUtils = require('../utils/fileUtils');

/**
 * Google Drive service class for handling drive operations
 */
class GoogleDriveService {
    constructor(config) {
        this.config = config;
        this.oauth2Client = new google.auth.OAuth2(
            config.google.clientId,
            config.google.clientSecret,
            config.google.redirectUri
        );
        this.oauth2Client.setCredentials({ refresh_token: config.google.refreshToken });
        this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
        this.tempDir = path.join(__dirname, '../temp');
    }

    /**
     * Get all files from a Google Drive folder
     */
    async getDriveFiles(folderId, pageSize = 1000) {
        try {
            const response = await this.drive.files.list({
                q: `'${folderId}' in parents and trashed=false`,
                fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink)',
                pageSize
            });
            return response.data.files || [];
        } catch (error) {
            Logger.error(`Error fetching files from Drive folder ${folderId}: ${error.message}`);
            return [];
        }
    }

    /**
     * Download a file from Google Drive with retry logic
     */
    async downloadDriveFile(fileId, fileName, mimeType, retries = 3) {
        FileUtils.ensureTempDir(this.tempDir);
        const tempPath = path.join(this.tempDir, fileName);

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                if (mimeType.startsWith('application/vnd.google-apps.')) {
                    const exportFormat = FileUtils.getExportFormat(mimeType);
                    const response = await this.drive.files.export(
                        { fileId, mimeType: exportFormat },
                        { responseType: 'stream' }
                    );
                    return await FileUtils.streamToFile(response.data, tempPath);
                } else {
                    const response = await this.drive.files.get(
                        { fileId, alt: 'media' },
                        { responseType: 'stream' }
                    );
                    return await FileUtils.streamToFile(response.data, tempPath);
                }
            } catch (error) {
                Logger.warn(`Download attempt ${attempt}/${retries} failed for ${fileName}: ${error.message}`);

                if (attempt === retries) {
                    Logger.error(`All download attempts failed for ${fileName}`);
                    throw error;
                }

                // Wait before retry (exponential backoff)
                await this.waitForRetry(attempt);
            }
        }
    }

    /**
     * Get file metadata from Google Drive
     */
    async getFileMetadata(fileId) {
        try {
            const response = await this.drive.files.get({
                fileId,
                fields: 'id, name, mimeType, size, modifiedTime, webViewLink, parents'
            });
            return response.data;
        } catch (error) {
            Logger.error(`Error fetching metadata for file ${fileId}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Check if a file exists in Google Drive folder
     */
    async fileExistsInFolder(fileName, folderId) {
        try {
            const response = await this.drive.files.list({
                q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
                fields: 'files(id, name)'
            });
            return response.data.files.length > 0;
        } catch (error) {
            Logger.error(`Error checking file existence: ${error.message}`);
            return false;
        }
    }

    /**
     * Wait with exponential backoff
     */
    async waitForRetry(attempt) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    /**
     * Clean up temporary files
     */
    cleanup() {
        FileUtils.cleanupTempDir(this.tempDir);
    }

    /**
     * Get the temp directory path
     */
    getTempDir() {
        return this.tempDir;
    }
}

module.exports = GoogleDriveService;
