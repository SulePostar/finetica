const express = require('express');
const driveSessionService = require('./../../services/driveSessionService');

const router = express.Router();

router.post('/drive/files/download-new', async (req, res) => {
    try {
        // Validate session and refresh tokens if needed
        const sessionResult = await driveSessionService.validateAndRefreshSession(req);

        if (!sessionResult.isValid) {
            return res.status(401).json({
                error: 'Not authenticated or session expired',
                message: sessionResult.message
            });
        }
        const downloadResult = await driveSessionService.downloadFineticaFiles(sessionResult.tokens, 10);

        res.status(200).json({
            message: `✅ Obradjeno ${downloadResult.totalFiles} fajlova iz "finetica" foldera. Preuzeto: ${downloadResult.downloadedCount}, Preskočeno: ${downloadResult.skippedCount}`,
            summary: {
                totalChecked: downloadResult.totalFiles,
                newFiles: downloadResult.downloadedCount,
                skipped: downloadResult.skippedCount,
                folderName: downloadResult.folderName
            },
            details: downloadResult.processedFiles
        });

    } catch (error) {
        console.error('❌ Download error:', error.message);

        if (error.message.includes('Finetica folder not found')) {
            return res.status(404).json({
                error: 'Finetica folder not found',
                message: 'Please create a folder named "finetica" in your Google Drive and put files there.'
            });
        }

        res.status(500).json({
            error: 'Failed to fetch or download files',
            message: error.message
        });
    }
});

router.get('/drive/files/download-new', async (req, res) => {
    try {
        // Validate session and refresh tokens if needed
        const sessionResult = await driveSessionService.validateAndRefreshSession(req);

        if (!sessionResult.isValid) {
            return res.status(401).json({
                error: 'Not authenticated or session expired',
                message: sessionResult.message
            });
        }
        const downloadResult = await driveSessionService.downloadFineticaFiles(sessionResult.tokens, 10);

        res.status(200).json({
            message: `✅ Obradno ${downloadResult.totalFiles} fajlova iz "finetica" foldera. Preuzeto: ${downloadResult.downloadedCount}, Preskočeno: ${downloadResult.skippedCount}`,
            summary: {
                totalChecked: downloadResult.totalFiles,
                newFiles: downloadResult.downloadedCount,
                skipped: downloadResult.skippedCount,
                folderName: downloadResult.folderName
            },
            details: downloadResult.processedFiles
        });

    } catch (error) {
        console.error('❌ Download error:', error.message);

        if (error.message.includes('Finetica folder not found')) {
            return res.status(404).json({
                error: 'Finetica folder not found',
                message: 'Please create a folder named "finetica" in your Google Drive and put files there.'
            });
        }

        res.status(500).json({
            error: 'Failed to fetch or download files',
            message: error.message
        });
    }
});

module.exports = router;
