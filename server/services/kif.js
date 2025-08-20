const { SalesInvoice, SalesInvoiceItem, BusinessPartner } = require('../models');
const { processDocument } = require('./aiService');
const KIF_PROMPT = require('../prompts/Kif.js');
const salesInvoiceSchema = require('../schemas/kifSchema');
const AppError = require('../utils/errorHandler');

const createKifFromAI = async (extractedData) => {
    try {
        const { items, ...invoiceData } = extractedData;

        const documentData = {
            ...invoiceData,
            approvedAt: null,
            approvedBy: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Create the sales invoice
        const document = await SalesInvoice.create(documentData);

        // Create sales invoice items if they exist
        if (items && Array.isArray(items) && items.length > 0) {
            const itemsToCreate = items.map(item => ({
                ...item,
                invoiceId: document.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await SalesInvoiceItem.bulkCreate(itemsToCreate);
        }

        const responseData = {
            ...document.toJSON(),
            items: items || []
        };

        return responseData;
    } catch (error) {
        console.error("Database Error:", error);
        throw new AppError('Failed to save KIF sales invoice to database', 500);
    }
};

// KIF-specific function to create sales invoice from manual data
const createKifManually = async (invoiceData, userId) => {
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

        // Create the sales invoice
        const document = await SalesInvoice.create(finalDocumentData);

        // Create sales invoice items if they exist
        if (items && Array.isArray(items) && items.length > 0) {
            const itemsToCreate = items.map(item => ({
                ...item,
                invoiceId: document.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await SalesInvoiceItem.bulkCreate(itemsToCreate);
        }

        // Fetch the created invoice with its items
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
        console.error("Manual Creation Error:", error);
        throw new AppError('Failed to create KIF sales invoice', 500);
    }
};

// KIF-specific function to approve a sales invoice
const approveKifDocument = async (documentId, userId) => {
    try {
        const document = await SalesInvoice.findByPk(documentId);

        if (!document) {
            throw new AppError('KIF sales invoice not found', 404);
        }

        if (document.approvedAt) {
            throw new AppError('Invoice is already approved', 400);
        }

        const updatedDocument = await document.update({
            approvedAt: new Date(),
            approvedBy: userId,
        });

        return updatedDocument;
    } catch (error) {
        console.error("Approval Error:", error);
        throw new AppError('Failed to approve KIF sales invoice', 500);
    }
};

// KIF-specific function to update sales invoice data
const updateKifDocumentData = async (documentId, updatedData) => {
    try {
        const document = await SalesInvoice.findByPk(documentId);

        if (!document) {
            throw new AppError('KIF sales invoice not found', 404);
        }

        // Extract items from the updated data
        const { items, ...invoiceUpdateData } = updatedData;

        // Ensure approval fields are reset when editing
        const dataToUpdate = {
            ...invoiceUpdateData,
            approvedAt: null,
            approvedBy: null,
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

        return {
            ...updatedDocument.toJSON(),
            items: updatedItems
        };
    } catch (error) {
        console.error("Update Error:", error);
        throw new AppError('Failed to update KIF sales invoice', 500);
    }
};

const getPaginatedKifData = async ({ page = 1, perPage = 10, sortField, sortOrder = 'asc' }) => {
    try {
        const offset = (page - 1) * perPage;
        const limit = parseInt(perPage);

        let orderOptions = [];
        if (sortField) {
            orderOptions = [[sortField, sortOrder.toUpperCase()]];
        } else {
            orderOptions = [['created_at', 'DESC']];
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
                    required: false
                }
            ],
            order: orderOptions,
            limit,
            offset
        });

        return { data: salesInvoices, total };
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
                    required: false
                }
            ]
        });

        if (!salesInvoice) {
            throw new AppError('Sales invoice not found', 404);
        }

        return salesInvoice
    } catch (error) {
        throw new AppError('Failed to fetch KIF by ID', 500);
    }
};

// AI Document Process Service for KIF
const processKifDocument = async (fileBuffer, mimeType, model = "gemini-2.5-flash-lite") => {
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
    getPaginatedKifData,
    getKifById,
    createKifFromManualData,
    processKifDocument,
    createKifFromAI,
    approveKifDocument,
    updateKifDocumentData,
};
