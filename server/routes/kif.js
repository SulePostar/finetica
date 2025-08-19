const express = require('express');
const router = express.Router();
const {
    getKifData,
    getKifDataById,
    analyzeKifDocument,
    approveKifInvoice,
    updateKifInvoice,
    getKifWithApprovalStatus
} = require('../controllers/kif');
const { upload } = require('../services/aiService');
const isAuthenticated = require('../middleware/isAuthenticated');

// Basic CRUD routes
router.get('/kif-data', getKifData);
router.get('/kif-data/:id', getKifDataById);

// AI Sales Invoice Processing Routes
router.post('/analyze', isAuthenticated, upload.single('file'), analyzeKifDocument);
router.put('/:id/approve', isAuthenticated, approveKifInvoice);
router.put('/:id/edit', isAuthenticated, updateKifInvoice);
router.get('/:id', isAuthenticated, getKifWithApprovalStatus);

module.exports = router;
