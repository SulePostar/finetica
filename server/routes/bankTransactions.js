const express = require('express');
const router = express.Router();
const { getPaginatedBankTransactions, getBankTransactionById } = require('../controllers/bankTransaction');
const {
    upload,
    analyzeDocument,
    createDocumentFromAI,
    approveDocument,
    updateDocumentData,
    getDocumentWithApprovalStatus
} = require('../services/aiService');
const BANK_TRANSACTION_PROMPT = require('../prompts/BankTransactions.js');
const bankTransactionSchema = require('../schemas/bankTransactionSchema');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/bank-transactions', getPaginatedBankTransactions);
router.get('/bank-transactions/:id', getBankTransactionById);

router.post('/analyze', isAuthenticated, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Missing 'file' in form-data." });
        }

        // Get model and schema from request body or use defaults
        const { model = "gemini-2.5-flash-lite" } = req.body;

        const extractedData = await analyzeDocument(
            req.file.buffer,
            req.file.mimetype,
            bankTransactionSchema,
            model,
            BANK_TRANSACTION_PROMPT
        );

        // Create bank transaction in database (not approved by default)
        const transaction = await createDocumentFromAI(extractedData, 'bank_transaction');

        res.json({
            success: true,
            data: {
                ...transaction.toJSON(),
                isApproved: false,
                approvalStatus: 'pending'
            }
        });
    } catch (error) {
        console.error('Bank Transaction Analysis Error:', error);
        res.status(500).json({
            error: error.message || 'Failed to analyze bank transaction',
            success: false
        });
    }
});

router.put('/:id/approve', isAuthenticated, async (req, res) => {
    try {
        const transactionId = req.params.id;
        const updatedTransaction = await approveDocument(transactionId, req.user.id, 'bank_transaction');

        res.json({
            success: true,
            data: {
                ...updatedTransaction.toJSON(),
                isApproved: true,
                approvalStatus: 'approved'
            }
        });
    } catch (error) {
        console.error('Bank Transaction Approval Error:', error);
        res.status(500).json({
            error: error.message || 'Failed to approve bank transaction',
            success: false
        });
    }
});

router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const transactionId = req.params.id;
        const transaction = await getDocumentWithApprovalStatus(transactionId, 'bank_transaction');

        res.json({
            success: true,
            data: transaction
        });
    } catch (error) {
        console.error('Bank Transaction Fetch Error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch bank transaction',
            success: false
        });
    }
});

module.exports = router;