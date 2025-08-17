const { getPaginatedVatData, getVatDocumentById } = require('../services/vat');

const getVatData = (req, res) => {
    const { page, perPage, sortField, sortOrder } = req.query;

    const result = getPaginatedVatData({
        page: parseInt(page),
        perPage: parseInt(perPage),
        sortField,
        sortOrder,
    });

    res.json(result);
};

const getVatDocument = (req, res) => {
    const { id } = req.params;
    const document = getVatDocumentById(id);

    if (!document) {
        return res.status(404).json({ error: 'VAT document not found' });
    }

    res.json(document);
};

module.exports = {
    getVatData,
    getVatDocument,
};
