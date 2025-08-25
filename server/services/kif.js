const { SalesInvoice, SalesInvoiceItem, BusinessPartner } = require('../models');
const { processDocument } = require('./aiService');
const { sequelize } = require('../config/db');
const KIF_PROMPT = require('../prompts/Kif.js');
const salesInvoiceSchema = require('../schemas/kifSchema');
const AppError = require('../utils/errorHandler');

const createKifFromAI = async (extractedData) => {
    const transaction = await sequelize.transaction();

    try {
        const { items, ...invoiceData } = extractedData;

        const documentData = {
            ...invoiceData,
            approvedAt: null,
            approvedBy: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Create the sales invoice within transaction
        const document = await SalesInvoice.create(documentData, { transaction });

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

        const responseData = {
            ...document.toJSON(),
            items: items || []
        };

        return responseData;
    } catch (error) {
        await transaction.rollback();
        console.error("Database Error:", error);
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
                    required: false
                },
                {
                    model: BusinessPartner,
                    required: false
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
                    model: SalesInvoiceItem,
                    required: false
                },
                {
                    model: BusinessPartner,
                    required: false,
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

const getKifs = async ({ page = 1, perPage = 10, sortField, sortOrder = 'asc' }) => {
    try {
        const offset = (page - 1) * perPage;
        const limit = parseInt(perPage);

        let orderOptions = [];
        if (sortField) {
            orderOptions = [[sortField, sortOrder.toUpperCase()]];
        } else {
            orderOptions = [['id', 'ASC']];
        }

        // Get total count
        const total = await SalesInvoice.count();

        // Get paginated data with associated items and business partner
        const salesInvoices = await SalesInvoice.findAll({
            include: [
                {
                    model: SalesInvoiceItem,
                    required: false
                },
                {
                    model: BusinessPartner,
                    required: false,
                    attributes: ['id', 'name', 'vatNumber']
                }
            ],
            order: orderOptions,
            limit,
            offset
        });

        const transformedData = salesInvoices.map(invoice => {
            const invoiceData = invoice.toJSON();
            return {
                ...invoiceData,
                customerName: invoiceData.BusinessPartner?.name || null
            };
        });

        return { data: transformedData, total };
    } catch (error) {
        throw new AppError('Failed to fetch KIF data', 500);
    }
};

const getKifById = async (id) => {
    try {
        const salesInvoice = await SalesInvoice.findByPk(id, {
            include: [
                {
                    model: SalesInvoiceItem,
                    required: false
                },
                {
                    model: BusinessPartner,
                    required: false,
                    attributes: ['id', 'name', 'vatNumber']
                }
            ]
        });

        if (!salesInvoice) {
            throw new AppError('Sales invoice not found', 404);
        }

        const invoiceData = salesInvoice.toJSON();
        return {
            ...invoiceData,
            customerName: invoiceData.BusinessPartner?.name || null
        };
    } catch (error) {
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

module.exports = {
    getKifs,
    getKifById,
    createKif,
    processKif,
    createKifFromAI,
    approveKif,
};
