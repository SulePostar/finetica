const express = require('express');
const router = express.Router();
const {
    getInvoiceData,
    getInvoice,
    approveInvoice,
} = require('../controllers/kuf');
const { getInvalidKufs, getKufLog } = require('../controllers/kufProcessingLog');
const { upload } = require('../services/aiService');
const isAuthenticated = require('../middleware/isAuthenticated');

// Base routes (matching contract pattern)
router.get('/logs/invalid', isAuthenticated, getInvalidKufs);
router.get('/logs/:id', isAuthenticated, getKufLog);
router.get('/', getInvoiceData);
router.get('/:id', isAuthenticated, getInvoice);
router.put('/:id/approve', isAuthenticated, approveInvoice);

module.exports = router;