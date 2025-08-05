const express = require('express');
const router = express.Router();
const googleDriveAutoSync = require('../services/googleDriveAutoSync');
const tokenStorage = require('../services/tokenStorage');

// Simple drive connection status for frontend
router.get('/drive-connection', (req, res) => {
    try {
        const hasToken = tokenStorage.hasValidRefreshToken();
        const status = googleDriveAutoSync.getStatus();

        res.json({
            connected: hasToken && status.isRunning,
            isRunning: status.isRunning,
            hasToken: hasToken
        });
    } catch (error) {
        res.json({
            connected: false,
            isRunning: false,
            hasToken: false
        });
    }
});

// Get auto sync status
router.get('/drive-status', (req, res) => {
    try {
        const status = googleDriveAutoSync.getStatus();
        res.json({
            success: true,
            ...status
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Manual sync trigger
router.post('/drive-sync', async (req, res) => {
    try {
        await googleDriveAutoSync.manualSync();
        res.json({
            success: true,
            message: 'Manual sync completed'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Clear tokens (for testing)
router.delete('/drive-tokens', (req, res) => {
    try {
        tokenStorage.clearTokens();
        res.json({
            success: true,
            message: 'Tokens cleared'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
