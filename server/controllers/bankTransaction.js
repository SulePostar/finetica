const bankTransactionsService = require('../services/bankTransactions');
const {
    analyzeDocument,
    createDocumentFromAI,
    approveDocument,
    getDocumentWithApprovalStatus
} = require('../services/aiService');
const bankTransactionSchema = require('../schemas/bankTransactionSchema');
const BANK_TRANSACTION_PROMPT = require('../prompts/BankTransactions.js');

const getPaginatedBankTransactions = async (req, res) => {
    try {
        const { page, perPage, sortField, sortOrder } = req.query;

        const result = await bankTransactionsService.getPaginatedBankTransactions({
            page: parseInt(page) || 1,
            perPage: parseInt(perPage) || 10,
            sortField,
            sortOrder,
        });

        res.json(result);
    } catch (error) {
        console.error('Error in getPaginatedBankTransactions controller:', error);
        res.status(500).json({
            error: 'Failed to fetch bank transactions',
            message: error.message
        });
    }
};

const getBankTransactionById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: 'ID parameter is required'
            });
        }

        const result = await bankTransactionsService.getBankTransactionById(parseInt(id));
        res.json(result);
    } catch (error) {
        console.error('Error in getBankTransactionById controller:', error);
        if (error.message === 'Bank transaction not found') {
            res.status(404).json({
                error: 'Bank transaction record not found',
                message: error.message
            });
        } else {
            res.status(500).json({
                error: 'Failed to fetch bank transaction data',
                message: error.message
            });
        }
    }
};


const analyzeBankTransaction = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "Missing 'file' in form-data." });

        const { model = "gemini-2.5-flash-lite" } = req.body;

        const extractedData = await analyzeDocument(
            req.file.buffer,
            req.file.mimetype,
            bankTransactionSchema,
            model,
            BANK_TRANSACTION_PROMPT
        );

        const transaction = await createDocumentFromAI(extractedData, 'bank_transaction');

        res.json({
            success: true,
            data: { ...transaction.toJSON(), isApproved: false, approvalStatus: 'pending' }
        });
    } catch (error) {
        console.error('Bank Transaction Analysis Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const approveBankTransaction = async (req, res) => {
    try {
        const updatedTransaction = await approveDocument(req.params.id, req.user.id, 'bank_transaction');
        res.json({
            success: true,
            data: { ...updatedTransaction.toJSON(), isApproved: true, approvalStatus: 'approved' }
        });
    } catch (error) {
        console.error('Bank Transaction Approval Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getBankTransactionWithApprovalStatus = async (req, res) => {
    try {
        const transaction = await getDocumentWithApprovalStatus(req.params.id, 'bank_transaction');
        res.json({ success: true, data: transaction });
    } catch (error) {
        console.error('Bank Transaction Fetch Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getPaginatedBankTransactions,
    getBankTransactionById,
    analyzeBankTransaction,
    approveBankTransaction,
    getBankTransactionWithApprovalStatus
};
