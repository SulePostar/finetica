const { BusinessPartner, TransactionCategory, Users, BankTransaction, BankTransactionProcessedFile } = require('../models');
const { processDocument } = require('./aiService');
const AppError = require('../utils/errorHandler');
const BANK_TRANSACTIONS_PROMPT = require('../prompts/BankTransactions');
const bankTransactionSchema = require('../schemas/bankTransactionSchema');
const { sequelize } = require('../models');
const MODEL_NAME = 'gemini-2.5-flash-lite';
const BUCKET_NAME = 'transactions';
const supabaseService = require('../utils/supabase/supabaseService');


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
                { model: BusinessPartner, required: false },
                { model: Users, required: false }
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


const approveBankTransactionById = async (id, body, userId) => {
    try {
        const document = await BankTransaction.findByPk(id);
        if (!document) {
            throw new AppError('Bank transaction not found', 404);
        }

        await document.update({ ...body, approvedAt: new Date(), approvedBy: userId });

        return document.get({ plain: true });

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
        const updatedWithRelations = await BankTransaction.findByPk(id, {
            include: [
                { model: TransactionCategory, required: false },
                { model: BusinessPartner, required: false },
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

const extractData = async (fileBuffer, mimeType) => {
    const businessPartners = await BusinessPartner.findAll({
        attributes: ['id', 'name'],
    });
    const promptWithPartners = `${BANK_TRANSACTIONS_PROMPT}\nAvailable partners: ${JSON.stringify(businessPartners)}`;
    const data = await processDocument(
        fileBuffer,
        mimeType,
        bankTransactionSchema,
        MODEL_NAME,
        promptWithPartners
    );
    return data;
};

const processSingleUnprocessedFile = async (unprocessedFileLog) => {
    try {
        const { buffer, mimeType } = await supabaseService.getFile(
            BUCKET_NAME,
            unprocessedFileLog.filename
        );
        const extractedData = await extractData(buffer, mimeType);
        await sequelize.transaction(async (t) => {
            await BankTransaction.create(extractedData, { transaction: t });
            await unprocessedFileLog.update(
                {
                    isProcessed: true,
                    processedAt: new Date(),
                },
                { transaction: t }
            );
        });
    } catch (error) {
        console.error(`Failed to process log ID ${unprocessedFileLog.id}:`, error);
    }
};

const processUnprocessedFiles = async () => {
    const unprocessedFileLogs = await BankTransactionProcessedFile.findAll({
        where: { isProcessed: false },
    });
    for (const fileLog of unprocessedFileLogs) {
        await processSingleUnprocessedFile(fileLog);
    }
};



module.exports = {
    getTransactions,
    getBankTransactionById,
    createBankTransactionFromAI,
    createBankTransactionManually,
    approveBankTransactionById,
    editBankTransaction,
    processBankTransaction,
    processSingleUnprocessedFile,
    processUnprocessedFiles
};
