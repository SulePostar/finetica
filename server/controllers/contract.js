const {
  listContracts,
  approveContractById,
  findById,
  createContract,
  getActiveContractsCount
} = require('../services/contract');

const getContractData = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortField,
      sortOrder = 'asc',
      timeRange
    } = req.query;

    let parsedTimeRange = 'all';

    if (timeRange) {
      if (typeof timeRange === 'string' && timeRange.trim().startsWith('{')) {
        try {
          parsedTimeRange = JSON.parse(timeRange);
        } catch (err) {
          console.warn(`Invalid JSON in timeRange: ${timeRange} - Error: ${err.message}`);
          parsedTimeRange = 'all';
        }
      } else {
        parsedTimeRange = timeRange;
      }
    }

    const { data, total } = await listContracts({
      page: Number(page) || 1,
      perPage: Number(perPage) || 10,
      sortField,
      sortOrder,
      timeRange: parsedTimeRange,
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

const getActiveCount = async (req, res, next) => {
  try {
    const count = await getActiveContractsCount();
    res.json({count});
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getContractData,
  getContract,
  approveContract,
  create,
  getActiveCount
};