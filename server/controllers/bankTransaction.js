const {
    getTransactions,
    getBankTransactionById,
    createBankTransactionManually,
    approveBankTransactionById,
    editBankTransaction,
    editBankTransactionItem,
    getBankTransactionItems
} = require('../services/bankTransaction');

const getBankTransactions = async (req, res, next) => {
    try {
        const result = await getTransactions(req.query);
        res.json(result);
    } catch (error) {
        console.error("Get Bank Transaction Data Error:", error);
        next(error);
    }
};

const getTransactionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const document = await getBankTransactionById(id);
        res.json(document);
    } catch (error) {
        next(error);
    }
};

const getBankTransactionItemsById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const items = await getBankTransactionItems(id);
        const result = { data: items, total: items.length };
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bank transaction items' });
    }
};

const createBankTransaction = async (req, res) => {
    try {
        const transactionData = req.body;
        const userId = req.user.userId;
        const result = await createBankTransactionManually(transactionData, userId);
        res.status(201).json(result);
    } catch (error) {
        console.error("Create Bank Transaction Error:", error);
        res.status(500).json({ error: 'Failed to create bank transaction' });
    }
};

const approveTransaction = async (req, res) => {
    const { id: transactionId } = req.params;
    const { userId } = req.user;
    const result = await approveBankTransactionById(transactionId, userId, req.body);
    res.json(result);
};

const updatedDocument = async (req, res) => {
    const { id: transactionId } = req.params;
    const updatedData = req.body;

    try {
        const result = await editBankTransaction(transactionId, updatedData);
        res.json(result);
    } catch (error) {
        console.error("Update Bank Transaction Error:", error);
        res.status(500).json({ error: 'Failed to update bank transaction' });
    }
}

const updateBankTransactionItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const updatedData = req.body;

        const result = await editBankTransactionItem(itemId, updatedData);
        res.json(result);
    } catch (error) {
        console.error("Update Bank Transaction Item Error:", error);
        res.status(500).json({ error: 'Failed to update bank transaction item' });
    }
};

module.exports = {
    getBankTransactions,
    getTransactionById,
    createBankTransaction,
    approveTransaction,
    getBankTransactionItemsById,
    updateBankTransactionItem,
    updatedDocument
};
