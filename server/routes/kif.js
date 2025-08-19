const express = require('express');
const router = express.Router();
const {
    getKifData,
    getKifDataById,
    processKifInvoice,
    approveKifInvoice,
    updateKifInvoice
} = require('../controllers/kif');
const { upload } = require('../services/aiService');
const isAuthenticated = require('../middleware/isAuthenticated');

// Basic CRUD routes
router.get('/', getKifData);
router.get('/:id', getKifDataById);

// Sales Invoice Processing Routes
router.post('/process', isAuthenticated, upload.single('file'), processKifInvoice);
router.put('/:id/approve', isAuthenticated, approveKifInvoice);
router.put('/:id/edit', isAuthenticated, updateKifInvoice);

module.exports = router;
