const { getPaginatedContractData, approveContractById, findById } = require('../services/contract');
const { createContract } = require('../services/contract');

const getContractData = (req, res) => {
    const { page, perPage, sortField, sortOrder } = req.query;

    const result = getPaginatedContractData({
        page: parseInt(page),
        perPage: parseInt(perPage),
        sortField,
        sortOrder,
    });

    res.json(result);
};

const approveContract = async (req, res) => {
    const { id } = req.params;
    console.log(req.user);
    const userId = req.user.userId;
    const contractData = req.body;
    const result = await approveContractById(id, contractData, userId);
    res.json(result);
};

const addContract = async (req, res, next) => {
    try {
        const contract = await createContract(req.body);
        return res.status(201).json({
            message: 'Contract created successfully',
            data: contract,
        });
    } catch (error) {
        next(error);
    }
};

const getContract = async (req, res) => {
    const { id } = req.params;
    const contract = await findById(id);
    res.json(contract);
};

module.exports = {
    getContractData,
    getContract,
    approveContract,
    addContract,
};