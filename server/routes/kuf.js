const express = require('express');
const router = express.Router();
const {
    getInvoiceData,
    getInvoice,
    create,
    processDocument,
    approveInvoice,
    update,
} = require('../controllers/kuf');
const { upload } = require('../services/aiService');
const isAuthenticated = require('../middleware/isAuthenticated');
const validate = require('../middleware/validation');
const {
    kufInvoiceCreateSchema,
    kufInvoiceUpdateSchema,
} = require('../schemas/kufJoiSchema');

// Base routes (matching contract pattern)
router.get('/', getInvoiceData);
router.get('/:id', isAuthenticated, getInvoice);
router.put('/:id/approve', isAuthenticated, approveInvoice);

router.post('/',
    isAuthenticated,
    validate(kufInvoiceCreateSchema),
    create
);

router.post('/process',
    isAuthenticated,
    upload.single('file'),
    processDocument
);

router.put('/:id',
    isAuthenticated,
    validate(kufInvoiceUpdateSchema),
    update
);

module.exports = router;