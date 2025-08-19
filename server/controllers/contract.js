const { getPaginatedContractData, approveContractById } = require('../services/contract');
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

module.exports = {
  getContractData,
  approveContract,
  addContract,
};
