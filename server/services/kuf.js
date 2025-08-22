const { PurchaseInvoice, PurchaseInvoiceItem, BusinessPartner } = require('../models');
const { processDocument } = require('./aiService');
const KUF_PROMPT = require('../prompts/kufPrompt.js');
const purchaseInvoiceSchema = require('../schemas/kufSchema');
const AppError = require('../utils/errorHandler');
const { sequelize } = require('../config/db');


const createKufFromAI = async (extractedData) => {
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

        // Create the sales invoice
        const document = await PurchaseInvoice.create(documentData, { transaction });

        // Create sales invoice items if they exist
        if (items && Array.isArray(items) && items.length > 0) {
            const itemsToCreate = items.map(item => ({
                ...item,
                invoiceId: document.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await PurchaseInvoiceItem.bulkCreate(itemsToCreate, { transaction });
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
        throw new AppError('Failed to save KUF sales invoice to database', 500);
    }
};

// KUF-specific function to create sales invoice from manual data
const createKufManually = async (invoiceData, userId) => {
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

        // Create the sales invoice
        const document = await PurchaseInvoice.create(finalDocumentData, { transaction });

        // Create sales invoice items if they exist
        if (items && Array.isArray(items) && items.length > 0) {
            const itemsToCreate = items.map(item => ({
                ...item,
                invoiceId: document.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await PurchaseInvoiceItem.bulkCreate(itemsToCreate, { transaction });
        }
        await transaction.commit();

        // Fetch the created invoice with its items
        const createdInvoice = await PurchaseInvoice.findByPk(document.id, {
            include: [
                {
                    model: PurchaseInvoiceItem,
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
        throw new AppError('Failed to create KUF sales invoice', 500);
    }
};

// KUF-specific function to approve a sales invoice
const approveKufDocument = async (documentId, userId) => {
    try {
        const document = await PurchaseInvoice.findByPk(documentId);

        if (!document) {
            throw new AppError('KUF sales invoice not found', 404);
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
        throw new AppError('Failed to approve KUF sales invoice', 500);
    }
};

// KUF-specific function to update sales invoice data
const updateKufDocument = async (documentId, updatedData) => {
    try {
        const document = await PurchaseInvoice.findByPk(documentId);

        if (!document) {
            throw new AppError('KUF sales invoice not found', 404);
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
            const existingItems = await PurchaseInvoiceItem.findAll({
                where: { invoiceId: documentId }
            });

            const existingItemsMap = new Map(existingItems.map(item => [item.id, item]));
            const updatedItemIds = new Set();

            // Process each item in the update
            for (const item of items) {
                if (item.id && existingItemsMap.has(item.id)) {
                    // Update existing item
                    await PurchaseInvoiceItem.update(
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
                    await PurchaseInvoiceItem.create({
                        ...item,
                        invoiceId: documentId,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                }
            }
        }

        // Fetch updated items to return
        const updatedItems = await PurchaseInvoiceItem.findAll({
            where: { invoiceId: documentId }
        });

        return {
            ...updatedDocument.toJSON(),
            items: updatedItems
        };
    } catch (error) {
        console.error("Update Error:", error);
        throw new AppError('Failed to update KUF sales invoice', 500);
    }
};

const getKufData = async ({ page = 1, perPage = 10, sortField, sortOrder = 'asc' }) => {
    try {
        // Ensure numbers with fallbacks
        const safePage = Number(page) > 0 ? Number(page) : 1;
        const safePerPage = Number(perPage) > 0 ? Number(perPage) : 10;

        const offset = (safePage - 1) * safePerPage;
        const limit = safePerPage;

        let orderOptions = [];
        if (sortField) {
            orderOptions = [[sortField, sortOrder.toUpperCase()]];
        } else {
            orderOptions = [['id', 'ASC']];
        }

        const total = await PurchaseInvoice.count();

        const purchaseInvoices = await PurchaseInvoice.findAll({
            include: [
                { model: PurchaseInvoiceItem, required: false },
                { model: BusinessPartner, required: false }
            ],
            order: orderOptions,
            limit,
            offset,
        });

        return { data: purchaseInvoices, total };
    } catch (error) {
        console.error("🔥 Sequelize error:", error);
        throw new AppError('Failed to fetch KUF data', 500);
    }
};


const getKufDataById = async (id) => {
    try {
        const purchaseInvoice = await PurchaseInvoice.findByPk(id, {
            include: [
                {
                    model: PurchaseInvoiceItem,
                    required: false
                },
                {
                    model: BusinessPartner,
                    required: false
                }
            ]
        });

        if (!purchaseInvoice) {
            throw new AppError('Sales invoice not found', 404);
        }

        return purchaseInvoice
    } catch (error) {
        throw new AppError('Failed to fetch KUF by ID', 500);
    }
};

// AI Document Process Service for KUF
const processKufDocument = async (fileBuffer, mimeType, model = "gemini-2.5-flash-lite") => {
    try {
        const extractedData = await processDocument(
            fileBuffer,
            mimeType,
            purchaseInvoiceSchema,
            model,
            KUF_PROMPT
        );

        const invoice = await createKufFromAI(extractedData);

        return {
            success: true,
            data: invoice
        };
    } catch (error) {
        throw new AppError('Failed to process KUF document', 500);
    }
};

module.exports = {
    getKufData,
    getKufDataById,
    createKufManually,
    processKufDocument,
    createKufFromAI,
    approveKufDocument,
    updateKufDocument,
};
