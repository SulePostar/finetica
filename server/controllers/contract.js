const {
  listContracts,
  approveContractById,
  findById,
  createContract,
} = require('../services/contract');

const getContractData = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortField,
      sortOrder = 'asc',
      startDate,
      endDate
    } = req.query;

    const { data, total } = await listContracts({
      page: Number(page) || 1,
      perPage: Number(perPage) || 10,
      sortField,
      sortOrder,
      startDate,
      endDate,
    });

    res.json({ data, total });
  } catch (err) {
    next(err);
  }
};

const getContract = async (req, res, next) => {
  try {
    const contract = await findById(Number(req.params.id));
    res.json(contract);
  } catch (err) {
    next(err);
  }
};

const approveContract = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const result = await approveContractById(Number(req.params.id), req.body, userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const created = await createContract(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getContractData,
  getContract,
  approveContract,
  create,
};