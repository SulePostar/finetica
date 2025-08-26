const express = require('express');
const router = express.Router();
const {
    getKufData,
    getKufDataById,
    createKufDocument,
    processKufInvoice,
    approveKufInvoice,
    updateKufInvoice,
} = require('../controllers/kuf');
const { upload } = require('../services/aiService');
const isAuthenticated = require('../middleware/isAuthenticated');
const validate = require('../middleware/validation');
const {
    kufInvoiceCreateSchema,
    kufInvoiceUpdateSchema,
} = require('../schemas/kufJoiSchema');

router.get('/', getKufData);
router.get('/:id', getKufDataById);
router.post('/',
    isAuthenticated,
    validate(kufInvoiceCreateSchema),
    createKufDocument
);

router.post('/process',
    isAuthenticated,
    upload.single('file'),
    processKufInvoice
);

router.patch('/:id/approve',
    isAuthenticated,
    approveKufInvoice
);
router.patch('/:id/edit',
    isAuthenticated,
    validate(kufInvoiceUpdateSchema),
    updateKufInvoice
);

module.exports = router;
