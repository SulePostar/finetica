const { BusinessPartner, TransactionCategory, Users, BankTransaction } = require('../models');
const { processDocument } = require('./aiService');
const AppError = require('../utils/errorHandler');
const BANK_TRANSACTIONS_PROMPT = require('../prompts/BankTransactions');
const bankTransactionSchema = require('../schemas/bankTransactionSchema');
const { sequelize } = require('../models');

const getTransactions = async (query = {}) => {
    try {
        const {
            page = 1,
            perPage = 10,
            sortField = 'created_at',
            sortOrder = 'asc'
        } = query;

        const pageNum = parseInt(page, 10);
        const perPageNum = parseInt(perPage, 10);

        const offset = !isNaN(pageNum) && pageNum > 0 ? (pageNum - 1) * perPageNum : 0;
        const limit = !isNaN(perPageNum) && perPageNum > 0 ? perPageNum : 10;

        const total = await BankTransaction.count();

        const data = await BankTransaction.findAll({
            include: [
                { model: BusinessPartner, required: false },
                { model: TransactionCategory, required: false }
            ],
            order: [[sortField, sortOrder.toUpperCase()]],
            offset,
            limit
        });

        console.log('Fetched rows:', data.length);
        return { data, total };
    } catch (error) {
        console.error("Fetch Paginated Data Error:", error);
        throw new AppError('Failed to fetch bank transactions', 500);
    }
};

const getBankTransactionById = async (id) => {
    try {
        const document = await BankTransaction.findByPk(id, {
            include: [
                { model: TransactionCategory, required: false },
                { model: BusinessPartner, required: false }
                // add Users here if the association exists
            ]
        });

        return document || null;
    } catch (error) {
        console.error("Fetch Document Error:", error);
        throw new AppError('Failed to fetch bank transaction document', 500);
    }
};


const createBankTransactionFromAI = async (extractedData) => {
    const t = await sequelize.transaction();
    try {
        const { items, ...bankTransactionData } = extractedData;

        const documentData = {
            ...bankTransactionData,
            approvedAt: null,
            approvedBy: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const document = await BankTransaction.create(documentData, { transaction: t });

        if (items && Array.isArray(items) && items.length > 0) {
            const itemsToCreate = items.map(item => ({
                ...item,
                transactionId: document.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await BankTransaction.bulkCreate(itemsToCreate, { transaction: t });
        }

        await t.commit();

        const responseData = {
            ...document.toJSON(),
            items: items || []
        };

        return responseData;
    } catch (error) {
        await t.rollback();
        console.error("Database Error:", error);
        throw new AppError('Failed to save bank transaction to database', 500);
    }
};

const createBankTransactionManually = async (bankTransactionData, userId) => {
    const t = await sequelize.transaction();
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
        const document = await BankTransaction.create(finalDocumentData, { transaction: t });

        if (items && Array.isArray(items) && items.length > 0) {
            const itemsToCreate = items.map(item => ({
                ...item,
                transactionId: document.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await BankTransaction.bulkCreate(itemsToCreate, { transaction: t });
        }

        // Fetch the full document including relations
        const createdData = await BankTransaction.findByPk(document.id, {
            include: [
                { model: TransactionCategory, required: false },
                { model: BusinessPartner, required: false }
            ],
            transaction: t,
        });

        await t.commit();

        return createdData;
    } catch (error) {
        await t.rollback();
        console.error("Manual Creation Error:", error);
        throw new AppError('Failed to create bank transaction', 500);
    }
};

const approveBankTransaction = async (id, userId) => {
    try {
        const document = await BankTransaction.findByPk(id);
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

const editBankTransaction = async (id, updatedData) => {
    try {
        const document = await BankTransaction.findByPk(id);

        if (!document) {
            throw new AppError('Bank transaction not found', 404);
        }

        // Exclude unrelated fields
        const { items, ...updateData } = updatedData;

        const dataToUpdate = {
            ...updateData,
            approvedAt: null,
            approvedBy: null,
        };

        // Update transaction
        await document.update(dataToUpdate);

        // Return updated transaction with associations
        return await BankTransaction.findByPk(id, {
            include: [
                { model: TransactionCategory, required: false },
                { model: BusinessPartner, required: false },
                { model: Users, required: false } // only works if association exists
            ]
        });
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
    getTransactions,
    getBankTransactionById,
    createBankTransactionFromAI,
    createBankTransactionManually,
    approveBankTransaction,
    editBankTransaction,
    processBankTransaction
};
