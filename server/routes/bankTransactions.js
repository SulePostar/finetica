const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const { upload } = require('../services/aiService');
const {
    getPaginatedBankTransactions,
    getBankTransactionById,
    analyzeBankTransaction,
    approveBankTransaction,
    getBankTransactionWithApprovalStatus
} = require('../controllers/bankTransaction');

router.get('/bank-transactions', getPaginatedBankTransactions); // fixed name
router.get('/bank-transactions/:id', getBankTransactionById);

router.post('/analyze', isAuthenticated, upload.single('file'), analyzeBankTransaction);
router.put('/:id/approve', isAuthenticated, approveBankTransaction);
router.get('/:id', isAuthenticated, getBankTransactionWithApprovalStatus);

module.exports = router;
