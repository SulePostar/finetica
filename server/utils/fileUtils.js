const fs = require('fs');
const path = require('path');

/**
 * File utility class for handling file operations and type detection
 */
class FileUtils {
    static getContentType(fileName) {
        const ext = path.extname(fileName).toLowerCase();
        const types = {
            '.pdf': 'application/pdf',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.txt': 'text/plain',
            '.csv': 'text/csv'
        };
        return types[ext] || 'application/octet-stream';
    }

    static getExportFormat(mimeType) {
        const formats = {
            'application/vnd.google-apps.spreadsheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.google-apps.document': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.google-apps.presentation': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        };
        return formats[mimeType] || 'application/pdf';
    }

    static getExtensionForGoogleAppsFile(mimeType) {
        const extensions = {
            'application/vnd.google-apps.spreadsheet': '.xlsx',
            'application/vnd.google-apps.document': '.docx',
            'application/vnd.google-apps.presentation': '.pptx'
        };
        return extensions[mimeType] || '.pdf';
    }

    static streamToFile(stream, filePath) {
        return new Promise((resolve, reject) => {
            const dest = fs.createWriteStream(filePath);
            stream.pipe(dest);
            dest.on('finish', () => resolve(filePath));
            dest.on('error', reject);
        });
    }

    static ensureTempDir(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        return dirPath;
    }

    static cleanupTempDir(dirPath) {
        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
        }
    }

    /**
     * Get file size in MB
     */
    static getFileSizeMB(filePath) {
        const stats = fs.statSync(filePath);
        return (stats.size / 1024 / 1024).toFixed(2);
    }

    /**
     * Check if file exceeds size limit
     */
    static exceedsSizeLimit(filePath, limitMB = 50) {
        const stats = fs.statSync(filePath);
        return stats.size > limitMB * 1024 * 1024;
    }
}

module.exports = FileUtils;
