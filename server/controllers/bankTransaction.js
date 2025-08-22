const {
    getTransactions,
    getBankTransactionById,
    createBankTransactionManually,
    approveBankTransaction,
    editBankTransaction,
    processBankTransaction
} = require('../services/bankTransaction');

const getBankTransactions = async (req, res, next) => {
    try {
        // Pass the whole query object directly to the service
        const result = await getTransactions(req.query);
        res.json(result);
    } catch (error) {
        console.error("Get Bank Transaction Data Error:", error);
        next(error);
    }
};

const getTransactionById = (req, res) => {
    const { id } = req.params;
    const document = getBankTransactionById(id);

    if (!document) {
        return res.status(404).json({ error: 'Bank Transaction document not found' });
    }

    res.json(document);
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

const processTransaction = async (req, res, next) => {
    try {
        const { model } = req.body;
        const result = await processBankTransaction(req.file.buffer, req.file.mimetype, model);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const approveTransaction = async (req, res) => {
    const { id: transactionId } = req.params;
    const { userId } = req.user;
    const result = await approveBankTransaction(transactionId, userId);
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
module.exports = {
    getBankTransactions,
    getTransactionById,
    processTransaction,
    createBankTransaction,
    approveTransaction,
    updatedDocument
};
