const {
    getPaginatedBankTransactionData,
    getBankTransactionDocumentById,
    createBankTransactionFromAI,
    createBankTransactionManually,
    approveBankTransactionDocument,
    editBankTransactionDocumentData,
    processBankTransaction
} = require('../services/bankTransaction');

const getBankTransactionData = (req, res) => {
    const { page, perPage, sortField, sortOrder } = req.query;

    const result = getPaginatedBankTransactionData({
        page: parseInt(page),
        perPage: parseInt(perPage),
        sortField,
        sortOrder,
    });

    res.json(result);
};

const getBankTransactionDocument = (req, res) => {
    const { id } = req.params;
    const document = getBankTransactionDocumentById(id);

    if (!document) {
        return res.status(404).json({ error: 'Bank Transaction document not found' });
    }

    res.json(document);
};

const getTransactionDocumentById = async (req, res) => {
    const { id } = req.params;
    try {
        const document = await getBankTransactionDocumentById(id);
        if (!document) {
            return res.status(404).json({ error: 'Bank Transaction document not found' });
        }
        res.json(document);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve Bank Transaction document' });
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

const processTransaction = async (req, res) => {
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
    const result = await approveBankTransactionDocument(transactionId, userId);
    res.json(result);

};

const updatedDocument = async (req, res) => {
    const { id: transactionId } = req.params;
    const updatedData = req.body;

    try {
        const result = await editBankTransactionDocumentData(transactionId, updatedData);
        res.json(result);
    } catch (error) {
        console.error("Update Bank Transaction Error:", error);
        res.status(500).json({ error: 'Failed to update bank transaction' });
    }
}
module.exports = {
    getBankTransactionData,
    getBankTransactionDocument,
    getTransactionDocumentById,
    processTransaction,
    createBankTransaction,
    approveTransaction,
    updatedDocument
};
