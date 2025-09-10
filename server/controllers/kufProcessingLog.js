const { findAllInvalid, findById } = require('../services/kufProcessingLog');

const getInvalidKufs = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const data = await findAllInvalid(Number(page), Number(limit));
        res.json(data);
    } catch (err) {
        next(err);
    }
};

const getKufLog = async (req, res, next) => {
    try {
        const log = await findById(Number(req.params.id));
        if (!log) return res.status(404).json({ message: 'KUF log not found' });
        res.json(log);
    } catch (err) {
        next(err);
    }
};

module.exports = { getInvalidKufs, getKufLog };