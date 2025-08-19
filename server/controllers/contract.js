const { getPaginatedContractData } = require('../services/contract');
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
module.exports = {
  getContractData,
  addContract,
};
