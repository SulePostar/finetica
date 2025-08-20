const { BusinessPartners, TransactionCategories, Users, BankTransactions } = require('../models');
const { processDocument } = require('./aiService');
const AppError = require('../utils/errorHandler');
const BANK_TRANSACTIONS_PROMPT = require('../prompts/BankTransactions');
const bankTransactionSchema = require('../schemas/bankTransactionSchema');


const generateMockData = (total = 25) => {
    return Array.from({ length: total }, (_, i) => ({
        id: i + 1,
        name: `Article ${i + 1}`,
        amount: Math.floor(Math.random() * 10),
        price: parseFloat((Math.random() * 10).toFixed(2)),
        date: `2025-01-${((i % 30) + 1).toString().padStart(2, '0')}`,
        vatNumber: `VAT-${1000 + i + 1}`,
        taxableAmount: parseFloat((Math.random() * 1000).toFixed(2)),
        vatAmount: parseFloat((Math.random() * 200).toFixed(2)),
        totalAmount: parseFloat((Math.random() * 1200).toFixed(2)),
        currency: "EUR",
    }));
};

const getPaginatedBankTransactionData = ({ page = 1, perPage = 10, sortField, sortOrder = 'asc' }) => {
    const total = 25;
    const fullData = generateMockData(total);

    if (sortField) {
        fullData.sort((a, b) =>
            sortOrder === 'asc'
                ? a[sortField] > b[sortField] ? 1 : -1
                : a[sortField] < b[sortField] ? 1 : -1
        );
    }

    const start = (page - 1) * perPage;
    const pagedData = fullData.slice(start, start + parseInt(perPage));

    return { data: pagedData, total };
};

const getBankTransactionDocumentById = (id) => {
    const fullData = generateMockData(25);
    return fullData.find((doc) => doc.id === parseInt(id)) || null;
};

const createBankTransactionFromAI = async (extractedData) => {
    try {
        const { items, ...bankTransactionData } = extractedData;

        const documentData = {
            ...bankTransactionData,
            approvedAt: null,
            approvedBy: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Create the bank transaction
        const document = await BankTransactions.create(documentData);

        if (items && Array.isArray(items) && items.length > 0) {
            const itemsToCreate = items.map(item => ({
                ...item,
                transactionId: document.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await BankTransactions.bulkCreate(itemsToCreate);
        }

        const responseData = {
            ...document.toJSON(),
            items: items || []
        };

        return responseData;
    } catch (error) {
        console.error("Database Error:", error);
        throw new AppError('Failed to save bank transaction to database', 500);
    }
};

const createBankTransactionManually = async (bankTransactionData, userId) => {
    try {
        const { items, ...documentData } = bankTransactionData;
        const finalDocumentData = {
            ...documentData,
            approvedAt: null,
            approvedBy: null,
            createdBy: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Create the bank transaction
        const document = await BankTransactions.create(finalDocumentData);
        if (items && Array.isArray(items) && items.length > 0) {
            const itemsToCreate = items.map(item => ({
                ...item,
                transactionId: document.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await BankTransactions.bulkCreate(itemsToCreate);
        }
        const createdData = await BankTransactions.findByPk(document.id, {
            include: [
                {
                    model: TransactionCategories,
                    required: false
                },
                {
                    model: BusinessPartners,
                    required: false
                }
            ]
        });

        return createdData;
    } catch (error) {
        console.error("Manual Creation Error:", error);
        throw new AppError('Failed to create bank transaction', 500);
    }
};

const approveBankTransactionDocument = async (id, userId) => {
    try {
        const document = await BankTransactions.findByPk(id);
        if (!document) {
            throw new AppError('Bank transaction not found', 404);
        }

        document.approvedAt = new Date();
        document.approvedBy = userId;

        await document.save();

        return document;
    } catch (error) {
        console.error("Approval Error:", error);
        throw new AppError('Failed to approve bank transaction', 500);
    }
};

// BankTransaction-specific function to update document data
const editBankTransactionDocumentData = async (id, updatedData) => {
    try {
        const document = await BankTransactions.findByPk(id);

        if (!document) {
            throw new AppError('Bank transaction not found', 404);
        }

        // Reset approval fields when editing
        const dataToUpdate = {
            ...updatedData,
            approvedAt: null,
            approvedBy: null,
            updatedAt: new Date(),
        };

        // Update the transaction
        const updatedDocument = await document.update(dataToUpdate);

        // Fetch with associations (TransactionCategories, BusinessPartners, Users)
        const updatedWithRelations = await BankTransactions.findByPk(id, {
            include: [
                { model: TransactionCategories, required: false },
                { model: BusinessPartners, required: false },
                { model: Users, required: false }
            ]
        });

        return updatedWithRelations;
    } catch (error) {
        console.error("Update Error:", error);
        throw new AppError('Failed to update bank transaction', 500);
    }
};
const processBankTransaction = async (fileBuffer, mimeType, model = "gemini-2.5-flash-lite") => {
    try {
        const extractedData = await processDocument(
            fileBuffer,
            mimeType,
            bankTransactionSchema,
            model,
            BANK_TRANSACTIONS_PROMPT
        );

        const bankTransaction = await createBankTransactionFromAI(extractedData);

        return {
            success: true,
            data: bankTransaction
        };
    } catch (error) {
        throw new AppError('Failed to process Bank Transaction document', 500);
    }
};


module.exports = {
    getPaginatedBankTransactionData,
    getBankTransactionDocumentById,
    createBankTransactionFromAI,
    createBankTransactionManually,
    approveBankTransactionDocument,
    editBankTransactionDocumentData,
    processBankTransaction
};
