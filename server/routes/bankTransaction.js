const express = require('express');
const router = express.Router();
const {
    getBankTransactionData,
    getBankTransactionDocument,
    processTransaction,
    createBankTransaction,
    approveTransaction
} = require('../controllers/bankTransaction');
const { upload } = require('../services/aiService');
const isAuthenticated = require('../middleware/isAuthenticated');
const validate = require('../middleware/validation');
const { bankTransactionCreateSchema, bankTransactionUpdateSchema } = require('../schemas/bankTransactionJoi');

router.get('/bank-transaction-data', getBankTransactionData);
router.get('/bank-transaction-data/:id', getBankTransactionDocument);

router.post('/',
    isAuthenticated,
    validate(bankTransactionCreateSchema),
    createBankTransaction
);

router.post('/process',
    isAuthenticated,
    upload.single('file'),
    processTransaction
);

router.patch('/:id/approve',
    isAuthenticated,
    approveTransaction
);

module.exports = router;
