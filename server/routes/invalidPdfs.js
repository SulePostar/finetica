const express = require('express');
const router = express.Router();
const invalidPdfsController = require('../controllers/invalidPdfs');
const isAuthenticated = require('../middleware/isAuthenticated');


router.get('/count', isAuthenticated, invalidPdfsController.getInvalidPdfCount);

module.exports = router;