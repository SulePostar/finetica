const express = require('express');
const router = express.Router();
const {
    getKufData,
    getKufDataById,
    createKufDocument,
    processKufDocument,
    approveKufDocument,
    updateKufDocument,
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
    processKufDocument
);

router.patch('/:id/approve',
    isAuthenticated,
    approveKufDocument
);
router.patch('/:id/edit',
    isAuthenticated,
    validate(kufInvoiceUpdateSchema),
    updateKufDocument
);

module.exports = router;
