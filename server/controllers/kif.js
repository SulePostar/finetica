const { getPaginatedKifData } = require('../services/kif');

const getKifData = (req, res) => {
    const { page, perPage, sortField, sortOrder } = req.query;

    const result = getPaginatedKifData({
        page: parseInt(page),
        perPage: parseInt(perPage),
        sortField,
        sortOrder,
    });

    res.json(result);
};

module.exports = {
    getKifData,
};
