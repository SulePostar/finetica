const express = require('express');
const router = express.Router();
const {
    getBankTransactions,
    getBankTransactionItemsById,
    getTransactionById,
    createBankTransaction,
    approveTransaction,
    updateBankTransactionItem
} = require('../controllers/bankTransaction');
const { getInvalidBankTransactions, getBankTransactionLog } = require('../controllers/bankTransactionProcessingLog');
const isAuthenticated = require('../middleware/isAuthenticated');
const validate = require('../middleware/validation');
const { bankTransactionCreateSchema, bankTransactionUpdateSchema } = require('../schemas/bankTransactionJoi');

router.get('/logs/invalid', isAuthenticated, getInvalidBankTransactions);
router.get('/logs/:id', isAuthenticated, getBankTransactionLog);

router.get('/bank-transaction-data', getBankTransactions);
router.get('/bank-transaction-data/:id', getTransactionById);
router.get('/bank-transaction-data/:id/items', getBankTransactionItemsById);
router.post('/',
    isAuthenticated,
    validate(bankTransactionCreateSchema),
    createBankTransaction
);
router.patch('/:id/approve',
    isAuthenticated,
    validate(bankTransactionUpdateSchema),
    approveTransaction
);

module.exports = router;