const express = require('express');
const router = express.Router();
const googleDriveAutoSync = require('./../services/googleDriveAutoSync');
const tokenStorage = require('./../services/tokenStorage');

router.get('/drive-connection', (_, res) => {
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

module.exports = router;
