const { BusinessPartner, TransactionCategory, BankTransaction, BankTransactionProcessingLog } = require('../models');
const { processDocument } = require('./aiService');
const AppError = require('../utils/errorHandler');
const BANK_TRANSACTIONS_PROMPT = require('../prompts/BankTransactions');
const bankTransactionSchema = require('../schemas/bankTransactionSchema');
const { sequelize } = require('../models');
const MODEL_NAME = 'gemini-2.5-flash-lite';


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
                { model: BusinessPartner },
                { model: TransactionCategory }
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
        console.log("Fetching BankTransaction with id:", id);

        const document = await BankTransaction.findByPk(id, {
            include: [
                { model: TransactionCategory },
                { model: BusinessPartner }
            ]
        });

        if (!document) {
            console.warn(`No BankTransaction found with id: ${id}`);
            return null;
        }
        return document.toJSON();
    } catch (error) {
        console.error("Fetch Document Error:", error);
        throw new AppError('Failed to fetch bank transaction document', 500);
    }
};

const createBankTransactionFromAI = async (extractedData, options = {}) => {
    const t = options.transaction || await sequelize.transaction();
    const shouldCommit = !options.transaction; // Only commit if we created the transaction

    try {
        const { items, filename, ...bankTransactionData } = extractedData.data || extractedData;

        const dataToSave = {
            date: bankTransactionData.date,
            amount: parseFloat(bankTransactionData.amount),
            direction: bankTransactionData.direction,
            accountNumber: bankTransactionData.accountNumber,
            description: bankTransactionData.description,
            invoiceId: bankTransactionData.invoiceId ? String(bankTransactionData.invoiceId) : null,
            partnerId: bankTransactionData.partnerId,
            categoryId: bankTransactionData.categoryId,
            approvedAt: bankTransactionData.approvedAt,
            approvedBy: bankTransactionData.approvedBy,
            fileName: filename
        };
        const document = await BankTransaction.create(dataToSave, { transaction: t });

        if (items && Array.isArray(items) && items.length > 0) {
            const itemsToCreate = items.map(item => ({
                ...item,
                transactionId: document.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await BankTransaction.bulkCreate(itemsToCreate, { transaction: t });
        }

        if (shouldCommit) {
            await t.commit();
        }

        return {
            ...document.toJSON(),
            items: items || []
        };
    } catch (error) {
        if (shouldCommit) {
            await t.rollback();
        }
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
                { model: TransactionCategory },
                { model: BusinessPartner }
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

const approveBankTransactionById = async (id, userId, updatedData = {}) => {
    try {
        const document = await BankTransaction.findByPk(id);

        if (!document) {
            throw new AppError('Bank transaction not found', 404);
        }
        const { items, ...dataToUpdate } = updatedData;

        dataToUpdate.approvedAt = new Date();
        dataToUpdate.approvedBy = userId;

        await document.update(dataToUpdate);

        return await BankTransaction.findByPk(id, {
            include: [
                { model: TransactionCategory, required: false },
                { model: BusinessPartner, required: false },
            ]
        });

    } catch (error) {
        console.error("Approval and Edit Error:", error);
        throw new AppError('Failed to approve and update bank transaction', 500);
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
                { model: TransactionCategory },
                { model: BusinessPartner }
            ]
        });
    } catch (error) {
        console.error("Update Error:", error);
        throw new AppError('Failed to update bank transaction', 500);
    }
};

const processBankTransaction = async (fileBuffer, mimeType, fileName, model = "gemini-2.5-flash-lite") => {
    try {
        const extractedData = await extractData(fileBuffer, mimeType);

        const bankTransaction = await createBankTransactionFromAI(extractedData);
        await processUnprocessedFiles(fileName);
        return {
            success: true,
            data: bankTransaction
        };
    } catch (error) {
        console.error('Error: ', error);
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

const processUnprocessedFiles = async (name) => {
    console.log(`Marking file ${name} as processed in logs.`);
    try {
        await BankTransactionProcessingLog.update(
            {
                isProcessed: true,
                processedAt: new Date(),
            },
            {
                where: { filename: name }
            }
        );
        return { success: true, filename: name };
    } catch (error) {
        console.error(`Failed to process file with name ${name}:`, error);
        return { success: false, error: error.message };
    }
};

const getUnprocessedFiles = async () => {
    try {
        const files = await BankTransactionProcessingLog.findAll({
            where: { isProcessed: false },
            attributes: ['filename'], // only select the filename column
        });

        return files.map(f => f.filename);
    } catch (error) {
        console.error('Failed to fetch unprocessed files:', error);
        throw new Error('Could not fetch unprocessed files');
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
    processUnprocessedFiles,
    getUnprocessedFiles,
    extractData
};
