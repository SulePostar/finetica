const { BusinessPartner, TransactionCategory, BankTransaction, BankTransactionProcessingLog, BankTransactionItem } = require('../models');
const { processDocument } = require('./aiService');
const AppError = require('../utils/errorHandler');
const BANK_TRANSACTIONS_PROMPT = require('../prompts/BankTransactions');
const bankTransactionSchema = require('../schemas/bankTransactionSchema');
const { sequelize } = require('../models');
const supabaseService = require('../utils/supabase/supabaseService');
const { get } = require('../routes/kif');
const { or } = require('sequelize');

const MODEL_NAME = 'gemini-2.5-flash-lite';
const BUCKET_NAME = 'transactions';


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
            throw new AppError('Bank Transaction not found', 404);
        }

        const transactionData = document.toJSON();
        let pdfUrl = transactionData.fileName ? await supabaseService.getSignedUrl(BUCKET_NAME, transactionData.fileName) : null;
        // Sanitize pdfUrl: if falsy, empty, or 'null', set to null
        if (!pdfUrl || typeof pdfUrl !== 'string' || pdfUrl.trim() === '' || pdfUrl === 'null') {
            pdfUrl = null;
        }

        // Fetch items for this transaction
        const items = await BankTransactionItem.findAll({
            where: { transaction_id: id }
        });

        return {
            ...transactionData,
            pdfUrl,
            items: items.map(item => item.toJSON())
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error("Fetch Document Error:", error);
        throw new AppError('Failed to fetch bank transaction document', 500);
    }
};

const getBankTransactionItems = async (id) => {
    try {
        const items = await BankTransactionItem.findAll({
            where: { transaction_id: id }
        });
        return items.map(item => item.toJSON());
    } catch (error) {
        throw new AppError('Failed to fetch bank transaction items', 500);
    }
};

async function editBankTransactionItem(itemId, updatedData) {
    try {
        const item = await BankTransactionItem.findByPk(itemId);
        if (!item) throw new AppError('Bank transaction item not found', 404);
        await item.update(updatedData);
        return item;
    } catch (error) {
        console.error("Update Item Error:", error);
        throw new AppError('Failed to update bank transaction item', 500);
    }
};

const createBankTransactionFromAI = async (extractedData, options = {}) => {
    const externalTx = options.transaction;
    const { filename } = options;
    const tx = externalTx || await sequelize.transaction();

    try {
        const { items, isBankTransaction, filename: dataFilename, ...bankTransactionData } =
            extractedData.data || extractedData;

        const file_name = filename || dataFilename;

        if (!isBankTransaction) {
            if (!externalTx) await tx.commit();
            return { isBankTransaction: false, message: 'Document is not a bank transaction' };
        }

        const document = await BankTransaction.create(
            {
                date: bankTransactionData.date,
                totalAmount: parseFloat(bankTransactionData.totalAmount || 0),
                totalBaseAmount: bankTransactionData.totalBaseAmount ? parseFloat(bankTransactionData.totalBaseAmount) : null,
                totalVatAmount: bankTransactionData.totalVatAmount ? parseFloat(bankTransactionData.totalVatAmount) : null,
                convertedTotalAmount: bankTransactionData.convertedTotalAmount ? parseFloat(bankTransactionData.convertedTotalAmount) : 0,
                direction: bankTransactionData.direction || null,
                accountNumber: bankTransactionData.accountNumber,
                description: bankTransactionData.description,
                invoiceId: bankTransactionData.invoiceId ? String(bankTransactionData.invoiceId) : null,
                partnerId: bankTransactionData.partnerId,
                categoryId: bankTransactionData.categoryId,
                approvedAt: bankTransactionData.approvedAt,
                approvedBy: bankTransactionData.approvedBy,
                fileName: file_name,
                createdAt: new Date(),
                updatedAt: new Date(),
                currency: bankTransactionData.currency,
            },
            { transaction: tx }
        );

        if (Array.isArray(items) && items.length) {
            await BankTransactionItem.bulkCreate(
                items.map((item) => ({
                    ...item,
                    transactionId: document.id,
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
            isBankTransaction: true,
        };
    } catch (error) {
        if (!externalTx) await tx.rollback();
        console.error('Database Error:', error);
        throw new AppError('Failed to save bank transaction to database', 500);
    }
};


const createBankTransactionManually = async (bankTransactionData, userId) => {
    const transaction = await sequelize.transaction();
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

        // Create the main bank transaction
        const document = await BankTransaction.create(finalDocumentData, { transaction });

        // Create bank transaction items if they exist
        if (items && Array.isArray(items) && items.length > 0) {
            const itemsToCreate = items.map(item => ({
                ...item,
                transactionId: document.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));
            await BankTransactionItem.bulkCreate(itemsToCreate, { transaction });
        }

        // Commit first, then fetch fresh data including relations & items
        await transaction.commit();

        const createdTransaction = await BankTransaction.findByPk(document.id, {
            include: [
                {
                    model: BankTransactionItem, // ✅ include items
                },
                {
                    model: TransactionCategory,
                },
                {
                    model: BusinessPartner,
                }
            ]
        });

        return createdTransaction;
    } catch (error) {
        await transaction.rollback();
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
        const document = await BankTransaction.findByPk(id, {
            include: [{ model: TransactionCategory }, { model: BusinessPartner }],
        });

        if (!document) {
            throw new AppError("Bank transaction not found", 404);
        }

        const { items, ...updateData } = updatedData;

        await document.update(updateData);

        await document.reload({
            include: [{ model: TransactionCategory }, { model: BusinessPartner }],
        });

        return document;
    } catch (error) {
        throw new AppError("Failed to update bank transaction");
    }
};


const processBankTransaction = async (fileBuffer, mimeType, filename, model = "gemini-2.5-flash-lite") => {
    try {
        const extractedData = await extractData(fileBuffer, mimeType);
        // Ensure filename is present for DB save
        if (extractedData) {
            if (extractedData.data) {
                extractedData.data.filename = filename;
            } else {
                extractedData.filename = filename;
            }
        }
        // Validate that the document is actually a bank transaction
        const { isBankTransaction, ...bankTransactionData } = extractedData?.data || extractedData;
        console.log(`File: ${filename}, isBankTransaction: ${isBankTransaction}`);
        if (isBankTransaction === false) {
            throw new AppError('Uploaded file is not a valid bank transaction document. Please upload a bank statement or transaction record.', 400);
        }
        const bankTransaction = await createBankTransactionFromAI(extractedData);
        await processUnprocessedFiles(filename);
        return {
            success: true,
            data: bankTransaction
        };
    } catch (error) {
        console.error('Error: ', error);
        if (error instanceof AppError) {
            throw error; // Re-throw AppError with original message and status
        }
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

const setFileInvalid = async (filename) => {
    try {
        await BankTransactionProcessingLog.update(
            { isValid: false, isProcessed: true, processedAt: new Date() },
            { where: { filename } }
        );
        return { success: true, filename };
    } catch (error) {
        console.error(`Failed to set file as invalid: ${filename}`, error);
        return { success: false, error: error.message };
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
    extractData,
    setFileInvalid,
    editBankTransactionItem,
    getBankTransactionItems
};

