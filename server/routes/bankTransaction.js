const express = require('express');
const router = express.Router();
const {
    getBankTransactions,
    getTransactionById,
    createBankTransaction,
    approveTransaction
} = require('../controllers/bankTransaction');
const isAuthenticated = require('../middleware/isAuthenticated');
const validate = require('../middleware/validation');
const { bankTransactionCreateSchema, bankTransactionUpdateSchema } = require('../schemas/bankTransactionJoi');

router.get('/bank-transaction-data', getBankTransactions);
router.get('/bank-transaction-data/:id', getTransactionById);
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