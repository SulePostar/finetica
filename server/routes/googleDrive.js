const express = require('express');
const router = express.Router();
const driveSessionService = require('../services/driveSessionService');

router.get('/drive-connection', (_, res) => {
    const connectionStatus = driveSessionService.getDriveConnectionStatus();
    res.json(connectionStatus);
});

module.exports = router;
