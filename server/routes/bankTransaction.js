const express = require('express');
const router = express.Router();
const {
    getBankTransactions,
    getBankTransactionItemsById,
    getTransactionById,
    createBankTransaction,
    approveTransaction,
    updateBankTransactionItem,
    updatedDocument,
} = require('../controllers/bankTransaction');
const { getInvalidBankTransactions, getBankTransactionLog } = require('../controllers/bankTransactionProcessingLog');
const isAuthenticated = require('../middleware/isAuthenticated');
const validate = require('../middleware/validation');
const { bankTransactionCreateSchema, bankTransactionUpdateSchema } = require('../schemas/bankTransactionJoi');

router.get('/logs/invalid', isAuthenticated, getInvalidBankTransactions);
router.get('/logs/:id', isAuthenticated, getBankTransactionLog);

router.get('/', getBankTransactions);
router.get('/:id', getTransactionById);
router.put('/:id', isAuthenticated, validate(bankTransactionUpdateSchema), updatedDocument);
router.get('/:id/items', getBankTransactionItemsById);
router.put('/items/:itemId', updateBankTransactionItem);
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