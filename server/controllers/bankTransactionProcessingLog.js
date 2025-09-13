const { findAllInvalid, findById } = require('../services/bankTransactionProcessingLog');

const getInvalidBankTransactions = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const data = await findAllInvalid(Number(page), Number(limit));
        res.json(data);
    } catch (err) {
        next(err);
    }
};

const getBankTransactionLog = async (req, res, next) => {
    try {
        const log = await findById(Number(req.params.id));
        if (!log) return res.status(404).json({ message: 'Bank transaction log not found' });
        res.json(log);
    } catch (err) {
        next(err);
    }
};

module.exports = { getInvalidBankTransactions, getBankTransactionLog };
