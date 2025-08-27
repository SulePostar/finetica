const {
    getTransactions,
    getBankTransactionById,
    createBankTransactionManually,
    approveBankTransactionById,
    editBankTransaction,
    processBankTransaction,
    processUnprocessedFiles
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
    const result = await approveBankTransaction(transactionId, userId, req.body);
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

const processUnprocessed = async (req, res, next) => {
    await processUnprocessedFiles();
    res.status(200).json({ message: 'Processed' });
};

module.exports = {
    getBankTransactions,
    getTransactionById,
    processTransaction,
    createBankTransaction,
    approveTransaction,
    updatedDocument,
    processUnprocessed
};
