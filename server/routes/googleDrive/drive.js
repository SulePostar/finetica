const express = require('express');
const fs = require('fs'); // biblioteka za rad sa fajlovima i putanjama  
const path = require('path'); // biblioteka za rad sa fajlovima i putanjama  
const mkdirp = require('mkdirp'); // omogućava kreiranje direktorija, uključujući i sve naddirektorije ako ne postoje
const { createDriveClient, oauth2Client } = require('./../../config/driveConfig');
const {
    findFineticaFolderId,
    downloadOrExportFile
} = require('./../../utils/driveDownloader/driveHelper');

const router = express.Router();

router.post('/drive/files/download-new', async (req, res) => {
    console.log('🔍 POST /drive/files/download-new called');

    const tokens = req.session.tokens;
    const sessionCreated = req.session.createdAt;
    const now = Date.now();

    // Check if session exists and is within 1 month (30 days)
    const oneMonthInMs = 30 * 24 * 60 * 60 * 1000; // 1 month in milliseconds
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
        } catch (refreshError) {
            console.error('❌ Failed to refresh token:', refreshError.message);
            isSessionValid = false;
        }
    }

    if (!isSessionValid) {
        console.log('❌ Session invalid or expired');
        // Clear invalid session
        if (req.session.tokens) {
            delete req.session.tokens;
            delete req.session.createdAt;
        }
        return res.status(401).json({
            error: 'Not authenticated or session expired',
            message: 'Please authenticate with Google Drive again'
        });
    }

    console.log('✅ Session valid, setting up Google Drive client');
    oauth2Client.setCredentials(tokens);
    const drive = createDriveClient();

    try {
        // First, find the "finetica" folder
        const fineticaFolderId = await findFineticaFolderId(drive);

        if (!fineticaFolderId) {
            return res.status(404).json({
                error: 'Finetica folder not found',
                message: 'Please create a folder named "finetica" in your Google Drive and put files there.'
            });
        }

        // List recent files from the "finetica" folder only
        const response = await drive.files.list({
            pageSize: 10,
            fields: 'files(id, name, modifiedTime, mimeType, size)',
            q: `'${fineticaFolderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
            orderBy: 'modifiedTime desc'
        });

        console.log(`📁 Found ${response.data.files.length} files in "finetica" folder`);
        const files = response.data.files;
        const downloadPath = path.join(__dirname, '../../googleDriveDownloads');
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
            message: `✅ Obradjeno ${files.length} fajlova iz "finetica" foldera. Preuzeto: ${downloadedCount}, Preskočeno: ${skippedCount}`,
            summary: {
                totalChecked: files.length,
                newFiles: downloadedCount,
                skipped: skippedCount,
                folderName: 'finetica'
            }
        });

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to fetch or download files.' });
    }
});

// GET version for compatibility with older calls
router.get('/drive/files/download-new', async (req, res) => {
    const tokens = req.session.tokens;
    const sessionCreated = req.session.createdAt;
    const now = Date.now();

    // Check if session exists and is within 1 month (30 days)
    const oneMonthInMs = 30 * 24 * 60 * 60 * 1000; // 1 month in milliseconds
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
        } catch (refreshError) {
            console.error('❌ Failed to refresh token:', refreshError.message);
            isSessionValid = false;
        }
    }

    if (!isSessionValid) {
        console.log('❌ Session invalid or expired');
        // Clear invalid session
        if (req.session.tokens) {
            delete req.session.tokens;
            delete req.session.createdAt;
        }
        return res.status(401).json({
            error: 'Not authenticated or session expired',
            message: 'Please authenticate with Google Drive again'
        });
    }

    console.log('✅ Session valid, setting up Google Drive client');
    oauth2Client.setCredentials(tokens);
    const drive = createDriveClient();

    try {
        // First, find the "finetica" folder
        const fineticaFolderId = await findFineticaFolderId(drive);

        if (!fineticaFolderId) {
            return res.status(404).json({
                error: 'Finetica folder not found',
                message: 'Please create a folder named "finetica" in your Google Drive and put files there.'
            });
        }

        // List recent files from the "finetica" folder only
        const response = await drive.files.list({
            pageSize: 10,
            fields: 'files(id, name, modifiedTime, mimeType, size)',
            q: `'${fineticaFolderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
            orderBy: 'modifiedTime desc'
        });

        console.log(`📁 Found ${response.data.files.length} files in "finetica" folder`);
        const files = response.data.files;
        const downloadPath = path.join(__dirname, '../../googleDriveDownloads');
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
            message: `✅ Obradno ${files.length} fajlova iz "finetica" foldera. Preuzeto: ${downloadedCount}, Preskočeno: ${skippedCount}`,
            summary: {
                totalChecked: files.length,
                newFiles: downloadedCount,
                skipped: skippedCount,
                folderName: 'finetica'
            }
        });

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to fetch or download files.' });
    }
});

module.exports = router;
