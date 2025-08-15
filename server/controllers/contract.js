const { getPaginatedContractData, createContract } = require('../services/contract');

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

/**
 * Create a new contract
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createNewContract = async (req, res, next) => {
    try {
        // Contract data is already validated by the validation middleware
        const contractData = req.body;

        // Create the contract in the database
        const contract = await createContract(contractData);

        // Return the created contract with a 201 status code
        res.status(201).json({
            success: true,
            message: 'Contract created successfully',
            data: contract
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getContractData,
    createNewContract,
};