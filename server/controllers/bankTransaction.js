const { getPaginatedBankTransactionData, getBankTransactionDocumentById } = require('../services/bankTransaction');

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

module.exports = {
    getBankTransactionData,
    getBankTransactionDocument,
};
