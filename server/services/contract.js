const { Contract, BusinessPartner, Sequelize } = require('../models');
const AppError = require('../utils/errorHandler');



const normalize = (row) => {
  const r = { ...row };
  if (r.amount != null) r.amount = Number(r.amount);
  return r;
};

const listContracts = async ({ page = 1, perPage = 10, sortField, sortOrder = 'asc' }) => {
  const limit = Math.max(1, Number(perPage) || 10);
  const offset = Math.max(0, ((Number(page) || 1) - 1) * limit);

  let order = [['createdAt', 'DESC']];
  if (sortField && SORT_FIELD_MAP[sortField]) {
    order = [[SORT_FIELD_MAP[sortField], (sortOrder || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC']];
  }

  const { rows, count } = await Contract.findAndCountAll({
    offset,
    limit,
    order,
    include: [
      {
        model: BusinessPartner,
        as: 'businessPartner',
        attributes: ['id', 'name', 'shortName'],
        required: false,
      },
    ],
  });

  const data = rows.map((r) => normalize(r.get({ plain: true })));
  return { data, total: count };
};

const findById = async (id) => {
  const contract = await Contract.findByPk(id, {
    include: [
      {
        model: BusinessPartner,
        as: 'businessPartner',
        attributes: ['id', 'name', 'shortName'],
      },
    ],
  });
  if (!contract) throw new AppError('Contract not found', 404);
  return contract;
};

const approveContractById = async (id, body, userId) => {
  const contract = await Contract.findByPk(id);
  if (!contract) throw new AppError('Contract not found', 404);
  if (contract.approvedAt) throw new AppError('Contract already approved', 400);

  await contract.update({
    ...body,
    approvedAt: new Date(),
    approvedBy: userId,
  });

  return contract;
};

const createContract = async (payload) => {
  const created = await Contract.create(payload);
  return created;
};

module.exports = {
  listContracts,
  findById,
  approveContractById,
  createContract,
};
