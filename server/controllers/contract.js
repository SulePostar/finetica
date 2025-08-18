const { getPaginatedContractData } = require('../services/contract');
const { saveContract } = require('../services/contract');

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

const addContract = async (req, res) => {
  try {
    const contract = await saveContract(req.body);
    res.json({ message: 'Contract saved successfully', data: contract });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save contract' });
  }
};

module.exports = {
  getContractData,
  addContract,
};
