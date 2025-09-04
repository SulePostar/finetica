const {
  PurchaseInvoice,
  PurchaseInvoiceItem,
  BusinessPartner,
  KufProcessingLog,
  sequelize
} = require('../models');
const { processDocument } = require('./aiService');
const KUF_PROMPT = require('../prompts/Kuf');
const purchaseInvoiceSchema = require('../schemas/kufSchema');
const AppError = require('../utils/errorHandler');
const supabaseService = require('../utils/supabase/supabaseService');

const MODEL_NAME = 'gemini-2.5-flash';
const BUCKET_NAME = 'kuf';

const SORT_FIELD_MAP = {
  createdAt: 'created_at',
  invoiceNumber: 'invoice_number',
  invoiceDate: 'invoice_date',
  netTotal: 'net_total',
  vatAmount: 'vat_amount'
};

const listInvoices = async ({ page = 1, perPage = 10, sortField, sortOrder = 'asc' }) => {
  try {
    const limit = Math.max(1, Number(perPage) || 10);
    const offset = Math.max(0, ((Number(page) || 1) - 1) * limit);

    let order = [['created_at', 'DESC']];
    if (sortField && SORT_FIELD_MAP[sortField]) {
      order = [[SORT_FIELD_MAP[sortField], (sortOrder || 'asc').toUpperCase()]];
    }

    const { rows, count } = await PurchaseInvoice.findAndCountAll({
      offset,
      limit,
      order,
      include: [
        {
          model: BusinessPartner,
          required: false
        },
        {
          model: PurchaseInvoiceItem,
          required: false
        }
      ],
    });

    const data = rows.map(row => row.get({ plain: true }));
    return { data, total: count };
  } catch (error) {
    console.error('Error in listInvoices:', error);
    throw new AppError('Failed to list invoices', 500);
  }
};

const findById = async (id) => {
  try {
    const invoice = await PurchaseInvoice.findByPk(id, {
      include: [
        {
          model: BusinessPartner,
          required: false
        },
        {
          model: PurchaseInvoiceItem,
          required: false
        }
      ],
    });

    if (!invoice) throw new AppError('Purchase invoice not found', 404);
    const pdfUrl = await supabaseService.getSignedUrl(BUCKET_NAME, PurchaseInvoice.filename);
    return { ...invoice.toJSON(), pdfUrl };
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Error in findById:', error);
    throw new AppError('Failed to fetch invoice', 500);
  }
};

const approveInvoiceById = async (id, body, userId) => {
  try {
    const invoice = await PurchaseInvoice.findByPk(id);
    if (!invoice) throw new AppError('Purchase invoice not found', 404);
    if (invoice.approvedAt) throw new AppError('Invoice already approved', 400);

    await invoice.update({
      ...body,
      approvedAt: new Date(),
      approvedBy: userId,
    });

    return invoice.get({ plain: true });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Error in approveInvoiceById:', error);
    throw new AppError('Failed to approve invoice', 500);
  }
};

const extractData = async (fileBuffer, mimeType) => {
  try {
    const businessPartners = await BusinessPartner.findAll({
      attributes: ['id', 'name'],
      where: {
        type: ['supplier', 'both']
      }
    });

    const promptWithPartners = `${KUF_PROMPT}\nAvailable partners: ${JSON.stringify(businessPartners)}`;

    const data = await processDocument(
      fileBuffer,
      mimeType,
      purchaseInvoiceSchema,
      MODEL_NAME,
      promptWithPartners
    );

    return data;
  } catch (error) {
    console.error('Error in extractData:', error);
    throw new AppError('Failed to extract data from document', 500);
  }
};

const createInvoice = async (payload) => {
  const transaction = await sequelize.transaction();
  try {
    const { items, ...invoiceData } = payload;

    const invoice = await PurchaseInvoice.create(invoiceData, { transaction });

    if (items?.length) {
      const itemsToCreate = items.map(item => ({
        ...item,
        invoiceId: invoice.id,
      }));
      await PurchaseInvoiceItem.bulkCreate(itemsToCreate, { transaction });
    }

    await transaction.commit();
    return findById(invoice.id);
  } catch (error) {
    await transaction.rollback();
    console.error('Error in createInvoice:', error);
    throw new AppError('Failed to create invoice', 500);
  }
};

const createInvoiceFromAI = async (extractedData, options = {}) => {
  const externalTx = options.transaction;
  const tx = externalTx || await sequelize.transaction();
  console.log('5555555555555555');
  try {
    const { items, ...invoiceData } = extractedData;
    console.log('invoiceData', invoiceData);
    console.log('6666666666666666');
    const document = await PurchaseInvoice.create({
      ...invoiceData,
      approvedAt: null,
      approvedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { transaction: tx });
    console.log('document', document);
    console.log('7777777777777777');
    if (Array.isArray(items) && items.length) {
      await PurchaseInvoiceItem.bulkCreate(
        items.map(it => ({
          ...it,
          invoiceId: document.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        { transaction: tx }
      );
    }
    if (!externalTx) await tx.commit();
    console.log('8888888888888888');
    return {
      ...document.toJSON(),
      items: items || [],
    };
  } catch (error) {
    console.error("❌ Sequelize error:", error);
    console.log('9999999999999999');
    if (!externalTx) await tx.rollback();
    throw new AppError('Failed to save KUF purchase invoice to database', 500);
  }
};

const processSingleUnprocessedFile = async (unprocessedFileLog) => {
  try {
    console.log('1111111111111111', unprocessedFileLog.fileName);
    const { buffer, mimeType } = await supabaseService.getFile(
      BUCKET_NAME,
      unprocessedFileLog.fileName
    );
    const extractedData = await extractData(buffer, mimeType);

    await sequelize.transaction(async (t) => {
      console.log('2222222222222222');
      if (extractedData.isPurchaseInvoice) {
        console.log(`Creating invoice from ${unprocessedFileLog.fileName}`);
        await createInvoice({ ...extractedData, fileName: unprocessedFileLog.fileName }, { transaction: t });
      } else {
        console.log(`File ${unprocessedFileLog.fileName} is not a purchase invoice, skipping invoice creation.`);
      }

      console.log('3333333333333333');
      await unprocessedFileLog.update(
        {
          isProcessed: true,
          processedAt: new Date(),
          message: extractedData.isPurchaseInvoice ? 'KUF processed successfully' : 'Not a purchase invoice'
        },
        { transaction: t }
      );
      console.log('4444444444444444');
    });
  } catch (error) {
    console.error(`Failed to process log ID ${unprocessedFileLog.id}:`, error);
    await unprocessedFileLog.update({
      isProcessed: false,
      message: error.message
    });
  }
};

const processUnprocessedFiles = async () => {
  try {
    const unprocessedFileLogs = await KufProcessingLog.findAll({
      where: { isProcessed: false },
    });

    for (const fileLog of unprocessedFileLogs) {
      await processSingleUnprocessedFile(fileLog);
    }
  } catch (error) {
    console.error('Error in processUnprocessedFiles:', error);
    throw new AppError('Failed to process unprocessed files', 500);
  }
};

const updateInvoice = async (id, updatedData) => {
  const transaction = await sequelize.transaction();
  try {
    const invoice = await PurchaseInvoice.findByPk(id);
    if (!invoice) throw new AppError('Purchase invoice not found', 404);
    if (invoice.approvedAt) throw new AppError('Cannot update approved invoice', 400);

    const { items, ...invoiceData } = updatedData;

    await invoice.update(invoiceData, { transaction });

    if (items?.length) {
      await PurchaseInvoiceItem.destroy({
        where: { invoiceId: id },
        transaction
      });

      await PurchaseInvoiceItem.bulkCreate(
        items.map(item => ({ ...item, invoiceId: id })),
        { transaction }
      );
    }

    await transaction.commit();
    return findById(id);
  } catch (error) {
    await transaction.rollback();
    if (error instanceof AppError) throw error;
    console.error('Error in updateInvoice:', error);
    throw new AppError('Failed to update invoice', 500);
  }
};

module.exports = {
  listInvoices,
  findById,
  approveInvoiceById,
  createInvoice,
  createInvoiceFromAI,
  extractData,
  processUnprocessedFiles,
  updateInvoice,
};