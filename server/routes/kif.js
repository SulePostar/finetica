const express = require('express');
const router = express.Router();
const {
    getKifData,
    getKif,
    getKifItems,
    createKifInvoice,
    processKifInvoice,
    approveKifInvoice,
} = require('../controllers/kif');
const { upload } = require('../services/aiService');
const isAuthenticated = require('../middleware/isAuthenticated');
const validate = require('../middleware/validation');
const {
    kifInvoiceCreateSchema,
    kifInvoiceUpdateSchema,
} = require('../schemas/kifJoiSchema');

router.get('/', getKifData);
router.get('/:id', getKif);
router.get('/:id/items', getKifItems);
router.post('/',
    isAuthenticated,
    validate(kifInvoiceCreateSchema),
    createKifInvoice
);

router.post('/process',
    isAuthenticated,
    upload.single('file'),
    processKifInvoice
);

router.patch('/:id/approve',
    isAuthenticated,
    validate(kifInvoiceUpdateSchema),
    approveKifInvoice
);

module.exports = router;
