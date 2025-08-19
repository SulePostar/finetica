const { GoogleGenAI } = require("@google/genai");
const multer = require("multer");
const { SalesInvoice, SalesInvoiceItem, PurchaseInvoice, Contract, BankTransaction, User } = require("../models");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
});

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Generic AI Document Analysis Service
const analyzeDocument = async (fileBuffer, mimeType, responseSchema, model, prompt) => {
    if (mimeType !== "application/pdf") {
        throw new Error("Invalid file type. Only PDF files are allowed.");
    }

    const contents = [
        {
            text: prompt,
        },
        {
            inlineData: {
                mimeType: "application/pdf",
                data: Buffer.from(fileBuffer).toString("base64"),
            },
        },
    ];

    try {
        const result = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const extractedData = JSON.parse(result.text);

        // Mark as not approved by default
        extractedData.approvedAt = null;
        extractedData.approvedBy = null;

        return extractedData;
    } catch (error) {
        console.error("AI Analysis Error:", error);
        throw new Error(`Failed to analyze document with AI`);
    }
};

// Generic function to create a document from AI extracted data
const createDocumentFromAI = async (extractedData, modelType) => {
    try {
        let document;
        switch (modelType.toLowerCase()) {
            case 'kif':
            case 'salesinvoice':
                // Extract items from the data
                const { items, ...invoiceData } = extractedData;

                const documentData = {
                    ...invoiceData,
                    approvedAt: null,
                    approvedBy: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                // Create the sales invoice first
                document = await SalesInvoice.create(documentData);

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
                break;
            case 'kuf':
            case 'purchaseinvoice':
                const documentDataPurchase = {
                    ...extractedData,
                    approvedAt: null,
                    approvedBy: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                document = await PurchaseInvoice.create(documentDataPurchase);
                break;
            case 'contract':
                const documentDataContract = {
                    ...extractedData,
                    approvedAt: null,
                    approvedBy: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                document = await Contract.create(documentDataContract);
                break;
            case 'bank_transaction':
                const documentDataBank = {
                    ...extractedData,
                    approvedAt: null,
                    approvedBy: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                document = await BankTransaction.create(documentDataBank);
                break;
            default:
                throw new Error(`Unsupported model type: ${modelType}`);
        }

        return document;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error(`Failed to save ${modelType} to database`);
    }
};

// Generic function to approve a document
const approveDocument = async (documentId, userId, modelType) => {
    try {
        let document;
        switch (modelType.toLowerCase()) {
            case 'kif':
            case 'salesinvoice':
                document = await SalesInvoice.findByPk(documentId);
                break;
            case 'kuf':
            case 'purchaseinvoice':
                document = await PurchaseInvoice.findByPk(documentId);
                break;
            case 'contract':
                document = await Contract.findByPk(documentId);
                break;
            case 'bank_transaction':
                document = await BankTransaction.findByPk(documentId);
                break;
            default:
                throw new Error(`Unsupported model type: ${modelType}`);
        }

        if (!document) {
            throw new Error(`${modelType} not found`);
        }

        const updatedDocument = await document.update({
            approvedAt: new Date(),
            approvedBy: userId,
        });

        return updatedDocument;
    } catch (error) {
        console.error("Approval Error:", error);
        throw new Error(`Failed to approve ${modelType}`);
    }
};

// Generic function to update document data (for editing before approval)
const updateDocumentData = async (documentId, updatedData, modelType) => {
    try {
        let document;
        switch (modelType.toLowerCase()) {
            case 'kif':
            case 'salesinvoice':
                document = await SalesInvoice.findByPk(documentId);

                if (!document) {
                    throw new Error(`${modelType} not found`);
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
                    // Delete existing items
                    await SalesInvoiceItem.destroy({
                        where: { invoiceId: documentId }
                    });

                    // Create new items
                    if (items.length > 0) {
                        const itemsToCreate = items.map(item => ({
                            ...item,
                            invoiceId: documentId,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }));

                        await SalesInvoiceItem.bulkCreate(itemsToCreate);
                    }
                }

                return updatedDocument;
            case 'kuf':
            case 'purchaseinvoice':
                document = await PurchaseInvoice.findByPk(documentId);

                if (!document) {
                    throw new Error(`${modelType} not found`);
                }

                // Ensure approval fields are reset when editing
                const dataToUpdatePurchase = {
                    ...updatedData,
                    approvedAt: null,
                    approvedBy: null,
                    updatedAt: new Date(),
                };

                const updatedDocumentPurchase = await document.update(dataToUpdatePurchase);
                return updatedDocumentPurchase;
            case 'contract':
                document = await Contract.findByPk(documentId);

                if (!document) {
                    throw new Error(`${modelType} not found`);
                }

                // Ensure approval fields are reset when editing
                const dataToUpdateContract = {
                    ...updatedData,
                    approvedAt: null,
                    approvedBy: null,
                    updatedAt: new Date(),
                };

                const updatedDocumentContract = await document.update(dataToUpdateContract);
                return updatedDocumentContract;
            case 'bank_transaction':
                document = await BankTransaction.findByPk(documentId);

                if (!document) {
                    throw new Error(`${modelType} not found`);
                }

                // Ensure approval fields are reset when editing
                const dataToUpdateBank = {
                    ...updatedData,
                    approvedAt: null,
                    approvedBy: null,
                    updatedAt: new Date(),
                };

                const updatedDocumentBank = await document.update(dataToUpdateBank);
                return updatedDocumentBank;
            default:
                throw new Error(`Unsupported model type: ${modelType}`);
        }
    } catch (error) {
        console.error("Update Error:", error);
        throw new Error(`Failed to update ${modelType}`);
    }
};

// Generic function to get document with approval status
const getDocumentWithApprovalStatus = async (documentId, modelType) => {
    try {
        let document;
        switch (modelType.toLowerCase()) {
            case 'kif':
            case 'salesinvoice':
                document = await SalesInvoice.findByPk(documentId, {
                    include: [{
                        model: SalesInvoiceItem,
                        as: 'SalesInvoiceItems'
                    }]
                });
                break;
            case 'kuf':
            case 'purchaseinvoice':
                document = await PurchaseInvoice.findByPk(documentId);
                break;
            case 'contract':
                document = await Contract.findByPk(documentId);
                break;
            case 'bank_transaction':
                document = await BankTransaction.findByPk(documentId);
                break;
            default:
                throw new Error(`Unsupported model type: ${modelType}`);
        }

        if (!document) {
            throw new Error(`${modelType} not found`);
        }

        let approverInfo = null;
        if (document.approvedBy) {
            const approver = await User.findByPk(document.approvedBy, {
                attributes: ['id', 'firstName', 'lastName', 'email'],
            });
            approverInfo = approver ? approver.toJSON() : null;
        }

        const documentData = document.toJSON();

        // For KIF/sales invoices, include items in the response
        if (modelType.toLowerCase() === 'kif' || modelType.toLowerCase() === 'salesinvoice') {
            documentData.items = documentData.SalesInvoiceItems || [];
            delete documentData.SalesInvoiceItems;
        }

        return {
            ...documentData,
            isApproved: !!document.approvedAt,
            approvalStatus: document.approvedAt ? 'approved' : 'pending',
            approver: approverInfo,
        };
    } catch (error) {
        console.error("Fetch Error:", error);
        throw new Error(`Failed to fetch ${modelType}`);
    }
};

module.exports = {
    upload,
    analyzeDocument,
    createDocumentFromAI,
    approveDocument,
    updateDocumentData,
    getDocumentWithApprovalStatus,
};
