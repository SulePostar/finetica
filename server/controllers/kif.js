const { getPaginatedKifData, getKifById } = require('../services/kif');

const getKifData = async (req, res) => {
    try {
        const { page, perPage, sortField, sortOrder } = req.query;

        const result = await getPaginatedKifData({
            page: parseInt(page) || 1,
            perPage: parseInt(perPage) || 10,
            sortField,
            sortOrder,
        });

        res.json(result);
    } catch (error) {
        console.error('Error in getKifData controller:', error);
        res.status(500).json({
            error: 'Failed to fetch KIF data',
            message: error.message
        });
    }
};

const getKifDataById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: 'ID parameter is required'
            });
        }

        const result = await getKifById(parseInt(id));
        res.json(result);
    } catch (error) {
        console.error('Error in getKifDataById controller:', error);
        if (error.message === 'Sales invoice not found') {
            res.status(404).json({
                error: 'KIF record not found',
                message: error.message
            });
        } else {
            res.status(500).json({
                error: 'Failed to fetch KIF data',
                message: error.message
            });
        }
    }
};

module.exports = {
    getKifData,
    getKifDataById,
};
