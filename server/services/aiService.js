const { GoogleGenAI } = require("@google/genai");
const multer = require("multer");
const { SalesInvoice, PurchaseInvoice, Contract, BankTransaction, User } = require("../models");
const { default: KIF_PROMPT } = require("../prompts/Kif.js");

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
        const documentData = {
            ...extractedData,
            approvedAt: null,
            approvedBy: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        let document;
        switch (modelType.toLowerCase()) {
            case 'kif':
            case 'salesinvoice':
                document = await SalesInvoice.create(documentData);
                break;
            case 'kuf':
            case 'purchaseinvoice':
                document = await PurchaseInvoice.create(documentData);
                break;
            case 'contract':
                document = await Contract.create(documentData);
                break;
            case 'bank_transaction':
                document = await BankTransaction.create(documentData);
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

        // Ensure approval fields are reset when editing
        const dataToUpdate = {
            ...updatedData,
            approvedAt: null,
            approvedBy: null,
            updatedAt: new Date(),
        };

        const updatedDocument = await document.update(dataToUpdate);
        return updatedDocument;
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

        let approverInfo = null;
        if (document.approvedBy) {
            const approver = await User.findByPk(document.approvedBy, {
                attributes: ['id', 'firstName', 'lastName', 'email'],
            });
            approverInfo = approver ? approver.toJSON() : null;
        }

        return {
            ...document.toJSON(),
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
    KIF_PROMPT,
};
