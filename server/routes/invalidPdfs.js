const express = require('express');
const router = express.Router();
const invalidPdfsController = require('../controllers/invalidPdfs');

router.get('/count', invalidPdfsController.getInvalidPdfCount);

module.exports = router;