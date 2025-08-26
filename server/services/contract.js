const { Contract, BusinessPartner, Sequelize } = require('../models');
const AppError = require('../utils/errorHandler');
const { processDocument } = require('./aiService');
const contractSchema = require('../schemas/contract');
const contractsPrompt = require('../prompts/contract');
const MODEL_NAME = "gemini-2.5-flash-lite";

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

  const data = rows.map((r) => r.get({ plain: true }));
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
  return contract.get({ plain: true });
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

  return contract.get({ plain: true });
};

const createContract = async (payload) => {
  const created = await Contract.create(payload);
  return created.get({ plain: true });
};

const extractData = async (fileBuffer, mimeType) => {
  const businessPartners = await BusinessPartner.findAll({
    attributes: ['id', 'name']
  });

  const promptWithPartners = `${contractsPrompt}\nAvailable partners: ${JSON.stringify(businessPartners)}`;

  const data = await processDocument(fileBuffer, mimeType, contractSchema, MODEL_NAME, promptWithPartners);

  return data;
};

module.exports = {
  listContracts,
  findById,
  approveContractById,
  createContract,
  extractData
};
