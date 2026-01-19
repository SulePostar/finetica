const { SalesInvoice, SalesInvoiceItem, BusinessPartner, KifProcessingLog } = require('../models');
const { processDocument } = require('./aiService');
const { sequelize } = require('../config/db');
const KIF_PROMPT = require('../prompts/Kif.js');
const salesInvoiceSchema = require('../schemas/kifSchema');
const AppError = require('../utils/errorHandler');
const supabaseService = require('../utils/supabase/supabaseService');
const { Op } = require('sequelize');
const MODEL_NAME = 'gemini-2.5-flash-lite';
const KIF_BUCKET_NAME = 'kif';
const extractKifData = async (fileBuffer, mimeType) => {
    const businessPartners = await BusinessPartner.findAll({
        attributes: ['id', 'name'],
    });
    const promptWithPartners = `${KIF_PROMPT}\nAvailable partners: ${JSON.stringify(businessPartners.map(bp => bp.get({ plain: true })))}`;
    const data = await processDocument(
        fileBuffer,
        mimeType,
        salesInvoiceSchema,
        MODEL_NAME,
        promptWithPartners
    );
    return data;
};

const processSingleUnprocessedKifFile = async (fileLog) => {
    try {
        const { buffer, mimeType } = await supabaseService.getFile(
            KIF_BUCKET_NAME,
            fileLog.filename
        );

        const extractedData = await extractKifData(buffer, mimeType);
        const { isInvoice, ...invoiceData } = extractedData || {};

        if (isInvoice === false) {
            await fileLog.update({
                isValid: false,
                isProcessed: true,
                processedAt: new Date(),
                message: 'File is not a valid sales invoice (KIF)',
            });
            return;
        }

        await sequelize.transaction(async (t) => {
            await createKifFromAI({ ...invoiceData, isInvoice: true, filename: fileLog.filename }, { transaction: t });

            await fileLog.update(
                {
                    isProcessed: true,
                    processedAt: new Date(),
                    message: 'Processed successfully',
                },
                { transaction: t }
            );
        });
    } catch (error) {
        console.error(`Failed to process KIF file log ID ${fileLog.id}:`, error);
        try {
            await fileLog.update({
                isProcessed: false,
                processedAt: new Date(),
                message: `Error: ${error.message}`.slice(0, 1000),
            });
        } catch (innerErr) {
            console.error('Also failed to update KifProcessingLog after error:', innerErr);
        }
    }
};

const processUnprocessedKifFiles = async () => {
    const unprocessed = await KifProcessingLog.findAll({
        where: { isProcessed: false, isValid: true },
    });

    for (const log of unprocessed) {
        await processSingleUnprocessedKifFile(log);
    }
    return { processed: unprocessed.length };
};

const createKifFromAI = async (extractedData, options = {}) => {
    const externalTx = options.transaction;
    const { filename } = options;
    const tx = externalTx || await sequelize.transaction();
    try {
        const { items, isInvoice, filename: dataFilename, ...invoiceData } = extractedData;
        // Use filename from options first, then from extractedData
        const file_name = filename || dataFilename;

        // If it's not an invoice, don't create a database record
        if (!isInvoice) {
            if (!externalTx) await tx.commit();
            return { isInvoice: false, message: 'Document is not an invoice' };
        }

        const document = await SalesInvoice.create({
            ...invoiceData,
            fileName: file_name,
            approvedAt: null,
            approvedBy: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, { transaction: tx });
        if (Array.isArray(items) && items.length) {
            await SalesInvoiceItem.bulkCreate(
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
            isInvoice: true,
        };
    } catch (error) {
        if (!externalTx) await tx.rollback();
        throw new AppError('Failed to save KIF sales invoice to database', 500);
    }
};
// KIF-specific function to create sales invoice from manual data
const createKif = async (invoiceData, userId) => {
    const transaction = await sequelize.transaction();
    try {
        const { items, ...documentData } = invoiceData;
        const finalDocumentData = {
            ...documentData,
            approvedAt: null,
            approvedBy: null,
            createdBy: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        // Create the sales invoice within transaction
        const document = await SalesInvoice.create(finalDocumentData, { transaction });
        // Create sales invoice items if they exist
        if (items && Array.isArray(items) && items.length > 0) {
            const itemsToCreate = items.map(item => ({
                ...item,
                invoiceId: document.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));
            await SalesInvoiceItem.bulkCreate(itemsToCreate, { transaction });
        }
        await transaction.commit();
        // Fetch the created invoice with its items (outside transaction since it's committed)
        const createdInvoice = await SalesInvoice.findByPk(document.id, {
            include: [
                {
                    model: SalesInvoiceItem,
                },
                {
                    model: BusinessPartner,
                }
            ]
        });
        return createdInvoice;
    } catch (error) {
        await transaction.rollback();
        console.error("Manual Creation Error:", error);
        throw new AppError('Failed to create KIF sales invoice', 500);
    }
};
// KIF-specific function to approve a sales invoice
const approveKif = async (documentId, updatedData = {}, userId) => {
    try {
        const document = await SalesInvoice.findByPk(documentId);
        if (!document) {
            throw new AppError('KIF sales invoice not found', 404);
        }
        if (document.approvedAt) {
            throw new AppError('Invoice is already approved', 400);
        }
        // Extract items from the updated data if provided
        const { items, ...invoiceUpdateData } = updatedData;
        // Prepare data to update (including approval fields)
        const dataToUpdate = {
            ...invoiceUpdateData,
            approvedAt: new Date(),
            approvedBy: userId,
            updatedAt: new Date(),
        };
        // Update the sales invoice
        const updatedDocument = await document.update(dataToUpdate);
        // Update sales invoice items if they exist
        if (items && Array.isArray(items)) {
            // Get existing items
            const existingItems = await SalesInvoiceItem.findAll({
                where: { invoiceId: documentId }
            });
            const existingItemsMap = new Map(existingItems.map(item => [item.id, item]));
            const updatedItemIds = new Set();
            // Process each item in the update
            for (const item of items) {
                if (item.id && existingItemsMap.has(item.id)) {
                    // Update existing item
                    await SalesInvoiceItem.update(
                        {
                            ...item,
                            updatedAt: new Date(),
                        },
                        {
                            where: { id: item.id, invoiceId: documentId }
                        }
                    );
                    updatedItemIds.add(item.id);
                } else {
                    // Create new item
                    await SalesInvoiceItem.create({
                        ...item,
                        invoiceId: documentId,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                }
            }
        }
        // Fetch updated items to return
        const updatedItems = await SalesInvoiceItem.findAll({
            where: { invoiceId: documentId }
        });
        // Fetch the complete document with BusinessPartner relationship
        const completeDocument = await SalesInvoice.findByPk(documentId, {
            include: [
                {
                    model: SalesInvoiceItem
                },
                {
                    model: BusinessPartner,
                    attributes: ['id', 'name', 'vatNumber']
                }
            ]
        });
        const documentData = completeDocument.toJSON();
        return {
            ...documentData,
            customerName: documentData.BusinessPartner?.name || null
        };
    } catch (error) {
        console.error("Approval Error:", error);
        throw new AppError('Failed to approve KIF sales invoice', 500);
    }
};

const getKifs = async ({ page = 1, perPage = 10, sortField, sortOrder = 'asc', invoiceType, timeRange = 'all' }) => {
    try {
        const offset = (page - 1) * perPage;
        const limit = parseInt(perPage);

        const sortMapping = {
            createdAt: 'created_at',
            invoiceDate: 'invoice_date',
            dueDate: 'due_date',
            totalAmount: 'total_amount',
            invoiceNumber: 'invoice_number',
            invoiceType: 'invoice_type'
        };

        let orderOptions = [];
        if (sortField) {
            const dbField = sortMapping[sortField] || sortField;
            orderOptions = [[dbField, sortOrder.toUpperCase()]];
        } else {
            orderOptions = [['created_at', 'DESC']];
        }

        const where = {};
        if (invoiceType && invoiceType !== 'all') where.invoiceType = invoiceType;

        if (timeRange && timeRange !== 'all') {
            let filterStart = null;
            let filterEnd = null;

            if (typeof timeRange === 'string') {
                const now = new Date();
                const normalizedRange = timeRange.replace(/ /g, '_');

                switch (normalizedRange) {
                    case 'last_7_days':
                        filterStart = new Date(now);
                        filterStart.setDate(now.getDate() - 7);
                        break;
                    case 'last_30_days':
                        filterStart = new Date(now);
                        filterStart.setDate(now.getDate() - 30);
                        break;
                    case 'last_60_days':
                        filterStart = new Date(now);
                        filterStart.setDate(now.getDate() - 60);
                        break;
                }
            }

            else if (typeof timeRange === 'object') {
                const start = timeRange.start || timeRange.from;
                const end = timeRange.end || timeRange.to;

                if (start) {
                    filterStart = new Date(start);
                    filterEnd = end ? new Date(end) : new Date(start);
                    filterEnd.setHours(23, 59, 59, 999);
                }
            }

            if (filterStart) {
                if (filterEnd) {
                    where.invoice_date = { [Op.between]: [filterStart, filterEnd] };
                } else {
                    where.invoice_date = { [Op.gte]: filterStart };
                }
            }
        }

        const { count, rows } = await SalesInvoice.findAndCountAll({
            where,
            include: [
                { model: SalesInvoiceItem },
                { model: BusinessPartner, attributes: ['id', 'name', 'vatNumber'] }
            ],
            order: orderOptions,
            limit,
            offset,
            distinct: true
        });

        const transformedData = rows.map(invoice => {
            const json = invoice.toJSON();
            return {
                ...json,
                customerName: json.BusinessPartner?.name || null
            };
        });

        return { data: transformedData, total: count };

    } catch (error) {
        console.error("Service Error:", error);
        throw new AppError('Failed to fetch KIF data', 500);
    }
};

const getKifById = async (id) => {
    try {
        const salesInvoice = await SalesInvoice.findByPk(id, {
            include: [
                {
                    model: SalesInvoiceItem,
                },
                {
                    model: BusinessPartner,
                    attributes: ['id', 'name', 'vatNumber']
                }
            ]
        });
        if (!salesInvoice) {
            throw new AppError('Sales invoice not found', 404);
        }
        const invoiceData = salesInvoice.toJSON();
        const pdfUrl = invoiceData.fileName ? await supabaseService.getSignedUrl(KIF_BUCKET_NAME, invoiceData.fileName) : null;
        return {
            ...invoiceData,
            customerName: invoiceData.BusinessPartner?.name || null,
            pdfUrl,
            items: Array.isArray(invoiceData.SalesInvoiceItems)
                ? invoiceData.SalesInvoiceItems
                : []
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to fetch KIF by ID', 500);
    }
};
// AI Document Process Service for KIF
const processKif = async (fileBuffer, mimeType, model = "gemini-2.5-flash-lite") => {
    try {
        const extractedData = await processDocument(
            fileBuffer,
            mimeType,
            salesInvoiceSchema,
            model,
            KIF_PROMPT
        );
        const invoice = await createKifFromAI(extractedData);
        return {
            success: true,
            data: invoice
        };
    } catch (error) {
        throw new AppError('Failed to process KIF document', 500);
    }
};

const getKifItemsById = async (id) => {
    try {
        const items = await SalesInvoiceItem.findAll({
            where: { invoiceId: id },
            order: [['orderNumber', 'ASC']]
        });
        return items.map(item => item.toJSON());
    } catch (error) {
        throw new AppError('Failed to fetch KIF items by ID', 500);
    }
};

const getKifInvoiceTypes = async () => {
    try {
        const rows = await SalesInvoice.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('invoice_type')), 'invoiceType']],
            where: {
                invoiceType: {
                    [require('sequelize').Op.ne]: null
                }
            },
            raw: true
        });
        const types = rows.map(r => r.invoiceType).filter(Boolean);
        return { invoiceTypes: types }
    } catch (error) {
        throw new AppError('Failed to fetch invoice types', 500);
    }
};

/**
 * Update a single KIF item by ID
 */
async function updateKifItem(itemId, updateData) {
    const item = await SalesInvoiceItem.findByPk(itemId);
    if (!item) throw new AppError('KIF item not found', 404);
    await item.update(updateData);
    return item;
}

module.exports = {
    getKifs,
    getKifById,
    createKif,
    processKif,
    getKifItemsById,
    createKifFromAI,
    approveKif,
    extractKifData,
    processSingleUnprocessedKifFile,
    processUnprocessedKifFiles,
    getKifInvoiceTypes,
    updateKifItem,
};