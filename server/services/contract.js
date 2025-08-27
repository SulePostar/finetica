const { Contract, BusinessPartner, ContractProcessingLog, sequelize } = require('../models');
const AppError = require('../utils/errorHandler');
const { processDocument } = require('./aiService');
const contractSchema = require('../schemas/contract');
const contractsPrompt = require('../prompts/contract');
const supabaseService = require('../utils/supabase/supabaseService');
const MODEL_NAME = 'gemini-2.5-flash-lite';
const BUCKET_NAME = 'contracts';

const listContracts = async ({ page = 1, perPage = 10, sortField, sortOrder = 'asc' }) => {
  const limit = Math.max(1, Number(perPage) || 10);
  const offset = Math.max(0, ((Number(page) || 1) - 1) * limit);

  let order = [['createdAt', 'DESC']];
  if (sortField && SORT_FIELD_MAP[sortField]) {
    order = [
      [SORT_FIELD_MAP[sortField], (sortOrder || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC'],
    ];
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
      },
    ],
  });

  return { data: rows, total: count };
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

const extractData = async (fileBuffer, mimeType) => {
  const businessPartners = await BusinessPartner.findAll({
    attributes: ['id', 'name'],
  });

  const promptWithPartners = `${contractsPrompt}\nAvailable partners: ${JSON.stringify(businessPartners)}`;

  const data = await processDocument(
    fileBuffer,
    mimeType,
    contractSchema,
    MODEL_NAME,
    promptWithPartners
  );

  return data;
};

const processSingleUnprocessedFile = async (unprocessedFileLog) => {
  try {
    const { buffer, mimeType } = await supabaseService.getFile(
      BUCKET_NAME,
      unprocessedFileLog.filename
    );
    const extractedData = await extractData(buffer, mimeType);

    await sequelize.transaction(async (t) => {
      await Contract.create(extractedData, { transaction: t });
      await unprocessedFileLog.update(
        {
          isProcessed: true,
          processedAt: new Date(),
        },
        { transaction: t }
      );
    });
  } catch (error) {
    console.error(`Failed to process log ID ${unprocessedFileLog.id}:`, error);
  }
};

const processUnprocessedFiles = async () => {
  const unprocessedFileLogs = await ContractProcessingLog.findAll({
    where: { isProcessed: false },
  });

  for (const fileLog of unprocessedFileLogs) {
    await processSingleUnprocessedFile(fileLog);
  }
};



module.exports = {
  listContracts,
  findById,
  approveContractById,
  createContract,
  extractData,
  processUnprocessedFiles,
};
