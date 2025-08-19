const { Contract, BusinessPartner, Sequelize } = require('../models');
const AppError = require('../utils/errorHandler');

const SORT_FIELD_MAP = {
  id: 'id',
  partner_id: 'partnerId',
  contract_number: 'contractNumber',
  contract_type: 'contractType',
  description: 'description',
  start_date: 'startDate',
  end_date: 'endDate',
  is_active: 'isActive',
  payment_terms: 'paymentTerms',
  currency: 'currency',
  amount: 'amount',
  signed_at: 'signedAt',
  approved_at: 'approvedAt',
  approved_by: 'approvedBy',
  created_at: 'created_at',
  updated_at: 'updated_at',
};

const normalize = (row) => {
  const r = { ...row };
  if (r.amount != null) r.amount = Number(r.amount);
  return r;
};

const listContracts = async ({ page = 1, perPage = 10, sortField, sortOrder = 'asc' }) => {
  const limit = Math.max(1, Number(perPage) || 10);
  const offset = Math.max(0, ((Number(page) || 1) - 1) * limit);

  let order = [['created_at', 'DESC']];
  if (sortField && SORT_FIELD_MAP[sortField]) {
    order = [[SORT_FIELD_MAP[sortField], (sortOrder || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC']];
  }

  const { rows, count } = await Contract.findAndCountAll({
    offset,
    limit,
    order,
    attributes: [
      'id',
      'partnerId',
      'contractNumber',
      'contractType',
      'description',
      'startDate',
      'endDate',
      'isActive',
      'paymentTerms',
      'currency',
      'amount',
      'signedAt',
      'approvedAt',
      'approvedBy',
      'created_at',
      'updated_at',
    ],
    include: [
      {
        model: BusinessPartner,
        attributes: ['id', 'name', 'short_name'],
        required: false,
      },
    ],
  });

  const data = rows.map((r) => normalize(r.get({ plain: true })));
  return { data, total: count };
};

const findById = async (id) => {
  const contract = await Contract.findByPk(id, {
    attributes: [
      'id',
      'partnerId',
      'contractNumber',
      'contractType',
      'description',
      'startDate',
      'endDate',
      'isActive',
      'paymentTerms',
      'currency',
      'amount',
      'signedAt',
      'approvedAt',
      'approvedBy',
      'created_at',
      'updated_at',
    ],
    include: [
      {
        model: BusinessPartner,
        attributes: ['id', 'name', 'short_name'],
      },
    ],
  });
  if (!contract) throw new AppError('Contract not found', 404);
  return normalize(contract.get({ plain: true }));
};

const approveContractById = async (id, body, userId) => {
  const contract = await Contract.findByPk(id);
  if (!contract) throw new AppError('Contract not found', 404);
  if (contract.approvedAt) throw new AppError('Contract already approved', 400);

  await contract.update({
    ...body,
    approvedAt: new Date(),
    approvedBy: userId ?? null,
  });

  return normalize(contract.get({ plain: true }));
};

const createContract = async (payload) => {
  const created = await Contract.create(payload);
  return normalize(created.get({ plain: true }));
};

module.exports = {
  listContracts,
  findById,
  approveContractById,
  createContract,
};
