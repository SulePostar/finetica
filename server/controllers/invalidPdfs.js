const invalidPdfsService = require('../services/invalidPdfs');

const getInvalidPdfCount = async (req, res, next) => {
    try {
        const result = await invalidPdfsService.getInvalidCounts();
        res.status(result.statusCode).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = { getInvalidPdfCount };