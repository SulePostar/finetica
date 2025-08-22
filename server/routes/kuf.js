const express = require('express');
const router = express.Router();
const {
    getKuf,
    getKufById,
    createKuf,
    processKuf,
    approveKuf,
    updateKuf
} = require('../controllers/kuf');
const { upload } = require('../services/aiService');
const isAuthenticated = require('../middleware/isAuthenticated');
const validate = require('../middleware/validation');
const {
    kufInvoiceCreateSchema,
    kufInvoiceUpdateSchema,
} = require('../schemas/kufJoiSchema');

router.get('/', getKuf);
router.get('/:id', getKufById);
router.post('/',
    isAuthenticated,
    validate(kufInvoiceCreateSchema),
    createKuf
);

router.post('/process',
    isAuthenticated,
    upload.single('file'),
    processKuf
);

router.patch('/:id/approve',
    isAuthenticated,
    approveKuf
);
router.patch('/:id/edit',
    isAuthenticated,
    validate(kufInvoiceUpdateSchema),
    updateKuf
);

module.exports = router;
