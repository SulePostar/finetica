const { getPaginatedKufData } = require('../services/kuf');

const getKufData = (req, res) => {
    const { page, perPage, sortField, sortOrder } = req.query;

    const result = getPaginatedKufData({
        page: parseInt(page),
        perPage: parseInt(perPage),
        sortField,
        sortOrder,
    });

    res.json(result);
};

module.exports = {
    getKufData,
};
