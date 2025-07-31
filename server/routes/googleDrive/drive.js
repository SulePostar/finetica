const express = require('express');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { createDriveClient, oauth2Client } = require('./../../config/gooogleDrive');

const router = express.Router();

router.get('/drive/files/download-new', async (req, res) => {
    const tokens = req.session.tokens;

    if (!tokens) return res.status(401).json({ error: 'Not authenticated' });

    oauth2Client.setCredentials(tokens);
    const drive = createDriveClient();

    try {
        // List recent files from Drive
        const response = await drive.files.list({
            pageSize: 10,
            fields: 'files(id, name, modifiedTime, mimeType, size)',
            q: "mimeType != 'application/vnd.google-apps.folder' and trashed=false",
            orderBy: 'modifiedTime desc'
        });

        const files = response.data.files;
        const downloadPath = path.join(__dirname, '../../downloads');
        mkdirp.sync(downloadPath); // Create folder if not exists

        let downloadedCount = 0;
        let skippedCount = 0;

        for (const file of files) {
            try {
                const result = await downloadOrExportFile(drive, file, downloadPath);
                if (result.downloaded) {
                    downloadedCount++;
                } else {
                    skippedCount++;
                }
            } catch (err) {
                console.error(`❌ Failed to process ${file.name}:`, err.message);
            }
        }

        res.status(200).json({
            message: `✅ Obradno ${files.length} fajlova. Preuzeto: ${downloadedCount}, Preskočeno: ${skippedCount}`,
            summary: {
                totalChecked: files.length,
                newFiles: downloadedCount,
                skipped: skippedCount
            }
        });

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to fetch or download files.' });
    }
});

// Helper function to download or export files based on their type
async function downloadOrExportFile(drive, file, downloadPath) {
    const isGoogleAppsFile = file.mimeType.startsWith('application/vnd.google-apps.');

    let fileName = file.name;
    let destPath;

    if (isGoogleAppsFile) {
        // For Google Apps files, add appropriate extension and export
        const extension = getExtensionForGoogleAppsFile(file.mimeType);
        fileName = `${file.name}${extension}`;
        destPath = path.join(downloadPath, fileName);

        // Check if file already exists
        if (fs.existsSync(destPath)) {
            console.log(`⏭️ File already exists: ${fileName}`);
            return { downloaded: false, reason: 'Already exists' };
        }

        await exportGoogleAppsFile(drive, file, destPath);
        console.log(`✅ Exported: ${fileName}`);
        return { downloaded: true, type: 'exported' };
    } else {
        // For regular files, download directly
        destPath = path.join(downloadPath, fileName);

        // Check if file already exists
        if (fs.existsSync(destPath)) {
            console.log(`⏭️ File already exists: ${fileName}`);
            return { downloaded: false, reason: 'Already exists' };
        }

        await downloadRegularFile(drive, file, destPath);
        console.log(`✅ Downloaded: ${fileName}`);
        return { downloaded: true, type: 'downloaded' };
    }
}

// Helper function to get file extension for Google Apps files
function getExtensionForGoogleAppsFile(mimeType) {
    switch (mimeType) {
        case 'application/vnd.google-apps.spreadsheet':
            return '.xlsx';
        case 'application/vnd.google-apps.document':
            return '.docx';
        case 'application/vnd.google-apps.presentation':
            return '.pptx';
        case 'application/vnd.google-apps.drawing':
            return '.pdf';
        case 'application/vnd.google-apps.form':
            return '.pdf';
        default:
            return '.pdf'; // Fallback to PDF
    }
}

// Helper function to export Google Apps files
async function exportGoogleAppsFile(drive, file, destPath) {
    let exportFormat = '';

    // Determine export format based on file type
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
        case 'application/vnd.google-apps.drawing':
        case 'application/vnd.google-apps.form':
        default:
            exportFormat = 'application/pdf';
            break;
    }

    return new Promise((resolve, reject) => {
        const dest = fs.createWriteStream(destPath);

        dest.on('finish', resolve);
        dest.on('error', reject);

        drive.files.export({
            fileId: file.id,
            mimeType: exportFormat
        }, {
            responseType: 'stream'
        })
            .then(response => {
                response.data.pipe(dest);
            })
            .catch(reject);
    });
}

// Helper function to download regular files
async function downloadRegularFile(drive, file, destPath) {
    return new Promise((resolve, reject) => {
        const dest = fs.createWriteStream(destPath);

        dest.on('finish', resolve);
        dest.on('error', reject);

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

module.exports = router;
