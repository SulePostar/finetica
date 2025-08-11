const { tr } = require('zod/v4/locales');
const { getPaginatedKifData } = require('../services/kif');
const { fetchKifById } = require('../services/kif');

const getKifById = async (req, res) => {
    try {
        const id = req.params.id;
        const item = fetchKifById(id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        console.error('Error fetching item:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

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
    getKifById
};
