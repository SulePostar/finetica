const { findAllInvalid, findById } = require('../services/kifProcessingLog');

const getInvalidKifs = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const data = await findAllInvalid(Number(page), Number(limit));
        res.json(data);
    } catch (err) {
        next(err);
    }
};

const getKifLog = async (req, res, next) => {
    try {
        const log = await findById(Number(req.params.id));
        if (!log) return res.status(404).json({ message: 'KIF log not found' });
        res.json(log);
    } catch (err) {
        next(err);
    }
};

module.exports = { getInvalidKifs, getKifLog };
