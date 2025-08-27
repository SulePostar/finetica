const express = require('express');
const router = express.Router();
const {
    getBankTransactions,
    getTransactionById,
    createBankTransaction,
    processUnprocessed,
    approveTransaction
} = require('../controllers/bankTransaction');
const { upload } = require('../services/aiService');
const isAuthenticated = require('../middleware/isAuthenticated');
const validate = require('../middleware/validation');
const { bankTransactionCreateSchema } = require('../schemas/bankTransactionJoi');
router.get('/bank-transaction-data', getBankTransactions);
router.get('/bank-transaction-data/:id', getTransactionById);
router.post('/',
    isAuthenticated,
    validate(bankTransactionCreateSchema),
    createBankTransaction
);
router.post('/process',
    isAuthenticated,
    upload.single('file'),
    processUnprocessed
);
router.patch('/:id/approve',
    isAuthenticated,
    validate(bankTransactionCreateSchema),
    approveTransaction
);
module.exports = router;