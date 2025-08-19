const { TransactionCategory, BusinessPartner, BankTransaction } = require('../models');

const transformTransactionData = (transaction) => ({
    id: transaction.id,
    date: transaction.date ? transaction.date.toISOString().split('T')[0] : null,
    amount: parseFloat(transaction.amount || 0),
    direction: transaction.direction,
    accountNumber: transaction.accountNumber || null,
    description: transaction.description || null,
    invoiceId: transaction.invoiceId || null,
    partnerId: transaction.partnerId || null,
    categoryId: transaction.categoryId || null,
    approvedAt: transaction.approvedAt ? transaction.approvedAt.toISOString().split('T')[0] : null,
    approvedBy: transaction.approvedBy || null,
    partnerName: transaction.BusinessPartner ? transaction.BusinessPartner.name : null,
    categoryName: transaction.TransactionCategory ? transaction.TransactionCategory.name : null,
    createdAt: transaction.created_at,
    updatedAt: transaction.updated_at
});

const getPaginatedBankTransactions = async ({ page = 1, perPage = 10, sortField, sortOrder = 'asc' }) => {
    try {
        const offset = (page - 1) * perPage;
        const limit = parseInt(perPage);

        let orderOptions = [];
        if (sortField) {
            orderOptions = [[sortField, sortOrder.toUpperCase()]];
        } else {
            orderOptions = [['created_at', 'DESC']];
        }

        // Get total count
        const total = await BankTransaction.count();

        // Get paginated data with associated items and business partner
        const bankTransactions = await BankTransaction.findAll({
            include: [
                {
                    model: BusinessPartner,
                    required: false
                },
                {
                    model: TransactionCategory,
                    required: false
                }
            ],
            order: orderOptions,
            limit,
            offset
        });

        // Transform data to match the expected format
        const transformedData = bankTransactions.map(transformTransactionData);

        return { data: transformedData, total };
    } catch (error) {
        console.error('Error fetching paginated bank transactions:', error);
        throw error;
    }
}

const getBankTransactionById = async (id) => {
    try {
        const bankTransaction = await BankTransaction.findByPk(id, {
            include: [
                {
                    model: BusinessPartner,
                    required: false
                },
                {
                    model: TransactionCategory,
                    required: false
                }
            ]
        });

        if (!bankTransaction) {
            throw new Error('Bank transaction not found');
        }

        return transformTransactionData(bankTransaction);
    } catch (error) {
        console.error('Error fetching bank transaction by ID:', error);
        throw error;
    }
};

module.exports = {
    getPaginatedBankTransactions,
    getBankTransactionById,
    transformTransactionData
};