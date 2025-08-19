const bankTransactionsService = require('../services/bankTransactions');
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
}
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
}

module.exports = {
    getPaginatedBankTransactions,
    getBankTransactionById,
};