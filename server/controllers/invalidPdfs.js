const invalidPdfsService = require('../services/invalidPdfs');


const getInvalidPdfCount = async (req, res, next) => {
    try {
        const counts = await invalidPdfsService.getInvalidCounts();
        res.json(counts);
    } catch (error) {
        next(error);
    }
};


module.exports = { getInvalidPdfCount };