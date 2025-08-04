const { getPaginatedVatData } = require('../services/vat');

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

module.exports = {
    getVatData,
};
