const express = require('express');
const router = express.Router();
const {
    getKifData,
    getKif,
    getKifItems,
    getKifInvoiceTypes,
    createKifInvoice,
    processKifInvoice,
    approveKifInvoice,
    getKifDailyCounts,
} = require('../controllers/kif');
const { upload } = require('../services/aiService');
const isAuthenticated = require('../middleware/isAuthenticated');
const validate = require('../middleware/validation');
const {
    kifInvoiceCreateSchema,
    kifInvoiceUpdateSchema,
} = require('../schemas/kifJoiSchema');
const { getInvalidKifs, getKifLog } = require('../controllers/kifProcessingLog');
const { updateKifItem } = require('../controllers/kif');

router.get('/invoice-types', isAuthenticated, getKifInvoiceTypes);
router.get('/logs/invalid', isAuthenticated, getInvalidKifs);
router.get('/logs/:id', isAuthenticated, getKifLog);
router.get('/stats/daily', isAuthenticated, getKifDailyCounts);

router.get('/', getKifData);
router.get('/:id', getKif);
router.get('/:id/items', getKifItems);
// Update a single KIF item
router.put('/items/:itemId', updateKifItem);
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
