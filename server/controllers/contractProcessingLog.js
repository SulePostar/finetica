const { findAllInvalid, findById } = require('../services/contractProcessingLog');

const getInvalidContracts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const contracts = await findAllInvalid(Number(page), Number(limit));
        res.json(contracts);
    } catch (err) {
        next(err);
    }
};

const getContractLog = async (req, res, next) => {
    try {
        const contract = await findById(Number(req.params.id));
        res.json(contract);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getInvalidContracts,
    getContractLog
};