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
const { getInvalidKifs, getKifLog, deleteKifLog } = require('../controllers/kifProcessingLog');
const { updateKifItem } = require('../controllers/kif');

router.get('/logs/invalid', isAuthenticated, getInvalidKifs);
router.get('/logs/:id', isAuthenticated, getKifLog);
router.delete('/logs/:id', isAuthenticated, deleteKifLog); 

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
