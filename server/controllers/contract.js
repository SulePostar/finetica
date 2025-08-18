const { getPaginatedContractData } = require('../services/contract');

const getContractData = (req, res) => {
    const { page, perPage, sortField, sortOrder } = req.query;

    const result = getPaginatedContractData({
        page: parseInt(page),
        perPage: parseInt(perPage),
        sortField,
        sortOrder,
    });

    res.json(result);
};

module.exports = {
    getContractData,
};