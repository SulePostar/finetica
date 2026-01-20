const express = require('express');
const router = express.Router();
const {
    getInvoiceData,
    getInvoice,
    approveInvoice,
    getKufItems,
    getKufInvoiceTypes,
    getNetTotalSum,
    getKufDailyCounts
} = require('../controllers/kuf');
const { getInvalidKufs, getKufLog } = require('../controllers/kufProcessingLog');
const { updateKufItem } = require('../controllers/kuf');
const { upload } = require('../services/aiService');
const isAuthenticated = require('../middleware/isAuthenticated');

// Base routes (matching contract pattern)
router.get('/logs/invalid', isAuthenticated, getInvalidKufs);
router.get('/logs/:id', isAuthenticated, getKufLog);
router.get('/', getInvoiceData);
router.get('/invoice-types', getKufInvoiceTypes);
router.get('/net-total', isAuthenticated, getNetTotalSum);
router.get('/stats/daily', isAuthenticated, getKufDailyCounts);
router.get('/:id',
    //  isAuthenticated,
    getInvoice);
router.get('/:id/items', getKufItems);
// Update a single KUF item
router.put('/items/:itemId', updateKufItem);
router.put('/:id/approve', isAuthenticated, approveInvoice);

module.exports = router;