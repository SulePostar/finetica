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
const { get } = require('../routes/kif');

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

    const rows = await PurchaseInvoice.findAll({
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

    const count = await PurchaseInvoice.count();

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
    const invoiceData = invoice.toJSON();
    const pdfUrl = await supabaseService.getSignedUrl(BUCKET_NAME, invoice.filename);
    // Normalize items array
    return {
      ...invoiceData,
      items: invoiceData.PurchaseInvoiceItems || [],
      pdfUrl
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('Error in findById:', error);
    throw new AppError('Failed to fetch invoice' + error, 500);
  }
};


const getKufItemsById = async (id) => {
  try {
    const items = await PurchaseInvoiceItem.findAll({
      where: { invoiceId: id },
      order: [['orderNumber', 'ASC']]
    });
    return items.map(item => item.toJSON());
  } catch (error) {
    console.error('Error in getKufItemsById:', error);
    throw new AppError('Failed to fetch KUF items by ID', 500);
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
    throw new AppError('Failed to approve invoice' + error, 500);
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
    throw new AppError('Failed to extract data from document' + error, 500);
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
    throw new AppError('Failed to create invoice' + error, 500);
  }
};

const createInvoiceFromAI = async (extractedData, options = {}) => {
  const externalTx = options.transaction;
  const tx = externalTx || await sequelize.transaction();
  try {
    const { items, ...invoiceData } = extractedData;
    const document = await PurchaseInvoice.create({
      ...invoiceData,
      approvedAt: null,
      approvedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { transaction: tx });
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
    return {
      ...document.toJSON(),
      items: items || [],
    };
  } catch (error) {
    if (!externalTx) await tx.rollback();
    throw new AppError('Failed to save KUF purchase invoice to database ' + error, 500);
  }
};

const processSingleUnprocessedFile = async (unprocessedFileLog) => {
  try {
    const { buffer, mimeType } = await supabaseService.getFile(
      BUCKET_NAME,
      unprocessedFileLog.filename
    );
    const extractedData = await extractData(buffer, mimeType);

    await sequelize.transaction(async (t) => {
      await unprocessedFileLog.update(
        {
          isProcessed: true,
          processedAt: new Date(),
          message: extractedData.isPurchaseInvoice ? 'KUF processed successfully' : 'Not a purchase invoice',
          isValid: extractedData.isPurchaseInvoice
        },
        { transaction: t }
      );

      if (extractedData.isPurchaseInvoice) {
        await createInvoice({ ...extractedData, filename: unprocessedFileLog.filename }, { transaction: t });
      }
    });
  } catch (error) {
    console.error(`Failed to process log ID ${unprocessedFileLog.id}:`, error);
    try {
      await unprocessedFileLog.update({
        isProcessed: false,
        message: error.message
      });
    }
    catch (updateError) {
      console.error(`Also failed to update log ID ${unprocessedFileLog.id}:`, updateError);
    }
  }
};

const processUnprocessedFiles = async () => {
  try {
    const unprocessedFileLogs = await KufProcessingLog.findAll({
      where: { isProcessed: false, isValid: true },
    });

    let processed = 0;
    let failed = 0;

    for (const fileLog of unprocessedFileLogs) {
      try {
        await processSingleUnprocessedFile(fileLog);
        processed++;
      } catch (err) {
        failed++;
        console.error(`❌ Failed processing fileLog ID ${fileLog.id}:`, err);
      }
    }

    return { processed, failed };
  } catch (error) {
    console.error('Error in processUnprocessedFiles:', error);
    throw new AppError('Failed to process unprocessed files' + error, 500);
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
    throw new AppError('Failed to update invoice' + error, 500);
  }
};

/**
 * Update a single KUF item by ID
 */
async function updateKufItem(itemId, updateData) {
  const item = await PurchaseInvoiceItem.findByPk(itemId);
  if (!item) throw new AppError('KUF item not found', 404);
  await item.update(updateData);
  return item;
}

const getKufInvoiceTypes = async () => {
  try {
    const types = await PurchaseInvoice.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('invoice_type')), 'invoiceType']
      ],
      where: {
        invoiceType: { [sequelize.Op.ne]: null }
      },
      raw: true
    });
    return types.map(t => t.invoiceType);
  }
  catch (error) {
    throw new AppError('Failed to fetch KUF invoice types', 500);
  }
}

module.exports = {
  listInvoices,
  findById,
  approveInvoiceById,
  createInvoice,
  createInvoiceFromAI,
  extractData,
  processUnprocessedFiles,
  updateInvoice,
  getKufItemsById,
  updateKufItem,
  getKufInvoiceTypes,
};