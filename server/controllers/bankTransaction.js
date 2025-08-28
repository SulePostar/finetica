const {
    getTransactions,
    getBankTransactionById,
    createBankTransactionManually,
    approveBankTransactionById,
    editBankTransaction,
    processBankTransaction,
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
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { buffer, mimetype, originalname } = req.file;
        const { model } = req.body;

        const result = await processBankTransaction(buffer, mimetype, originalname, model);

        res.json(result);
    } catch (error) {
        next(error);
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


module.exports = {
    getBankTransactions,
    getTransactionById,
    processTransaction,
    createBankTransaction,
    approveTransaction,
    updatedDocument
};
