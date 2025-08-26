const { createClient } = require('@supabase/supabase-js');
const Logger = require('./logger');
const { processDocument } = require('../services/aiService');
const { createBankTransactionFromAI } = require('../services/bankTransaction');
const { UploadedFile } = require('../models');
const BANK_TRANSACTIONS_PROMPT = require('../prompts/BankTransactions');
const bankTransactionSchema = require('../schemas/bankTransactionSchema');

/**
 * Core Bank Transaction file processing utilities
 */
class BankTransactionProcessor {
    constructor(config) {
        this.config = config;
        this.supabaseClient = createClient(config.supabaseUrl, config.supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });
    }
    /**
     * Create Supabase client with optimized configuration
     */
    createSupabaseClient(config) {
        return createClient(config.supabaseUrl, config.supabaseServiceKey, {
            auth: SUPABASE_CONFIG.AUTH
        });
    }

    /**
     * Generate file URL for public access
     */
    generateFileUrl(fileName) {
        return `${this.config.supabaseUrl}/storage/v1/object/public/${this.config.bucketName}/${encodeURIComponent(fileName)}`;
    }
    /**
         * Create uploaded file record
         */
    async createUploadedFileRecord(file, extractedData, options) {
        const fileUrl = this.generateFileUrl(file.name);
        Logger.debug(`Generated file URL: ${fileUrl}`);

        const description = extractedData.invoiceNumber
            ? `${FILE_CONFIG.DEFAULT_DESCRIPTION}: ${extractedData.invoiceNumber}`
            : FILE_CONFIG.DEFAULT_DESCRIPTION;

        return await UploadedFile.create({
            fileName: file.name,
            fileUrl: fileUrl,
            fileSize: file.metadata?.size || null,
            mimeType: FILE_CONFIG.MIME_TYPE,
            bucketName: this.config.bucketName,
            uploadedBy: options.userId || null,
            description: description,
            isActive: true
        });
    }
    /**
     * Download file from Supabase bucket
     */

    async downloadFile(fileName) {
        try {
            const { data, error } = await this.supabaseClient.storage
                .from(this.config.bucketName)
                .download(fileName);

            if (error) {
                throw new Error(`Failed to download file ${fileName}: ${error.message}`);
            }

            return Buffer.from(await data.arrayBuffer());
        } catch (error) {
            Logger.error(`Error downloading file ${fileName}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Process a single PDF file with AI and create BankTransaction
     */
    async processFile(file, options = {}) {
        const startTime = Date.now();

        try {
            Logger.info(`Processing bank transaction file: ${file.name}`);

            // Download file
            const fileBuffer = await this.downloadFile(file.name);

            // Extract data with AI
            const extractedData = await processDocument(
                fileBuffer,
                'application/pdf',
                bankTransactionSchema,
                this.config.aiModel,
                BANK_TRANSACTIONS_PROMPT
            );

            // Save to DB
            const transaction = await createBankTransactionFromAI(extractedData);

            // Create uploaded file record
            const fileUrl = `${this.config.supabaseUrl}/storage/v1/object/public/${this.config.bucketName}/${encodeURIComponent(file.name)}`;
            Logger.debug(`Generated file URL: ${fileUrl}`);

            const uploadedFile = await UploadedFile.create({
                fileName: file.name,
                fileUrl: fileUrl,
                fileSize: file.metadata?.size || null,
                mimeType: 'application/pdf',
                bucketName: this.config.bucketName,
                uploadedBy: options.userId || null,
                description: `Auto-processed bank transaction: ${extractedData.description || 'Unknown'}`,
                isActive: true
            });

            const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
            Logger.success(`Successfully processed ${file.name} -> Transaction ID: ${transaction.id} (${processingTime}s)`);

            return {
                success: true,
                fileName: file.name,
                transactionId: transaction.id,
                date: extractedData.date,
                amount: extractedData.amount,
                direction: extractedData.direction,
                accountNumber: extractedData.accountNumber,
                partnerId: extractedData.partnerId || null,
                categoryId: extractedData.categoryId || null,
                uploadedFileId: uploadedFile.id,
                processingTimeSeconds: parseFloat(processingTime),
                extractedData: options.includeExtractedData ? extractedData : undefined
            };

        } catch (error) {
            const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
            Logger.error(`Error processing bank transaction file ${file.name} (${processingTime}s): ${error.message}`);

            return {
                success: false,
                fileName: file.name,
                error: error.message,
                processingTimeSeconds: parseFloat(processingTime)
            };
        }
    }
    /**
     * Calculate processing time in seconds
     */
    calculateProcessingTime(startTime) {
        return parseFloat(((Date.now() - startTime) / 1000).toFixed(2));
    }
    /**
     * Build success result object
     */
    buildSuccessResult(file, invoice, extractedData, uploadedFile, processingTime, options) {
        return {
            success: true,
            fileName: file.name,
            invoiceId: invoice.id,
            invoiceNumber: extractedData.invoiceNumber,
            totalAmount: extractedData.totalAmount,
            currency: extractedData.currency,
            uploadedFileId: uploadedFile.id,
            processingTimeSeconds: processingTime,
            extractedData: options.includeExtractedData ? extractedData : undefined
        };
    }

    /**
     * Build error result object
     */
    buildErrorResult(file, error, processingTime) {
        return {
            success: false,
            fileName: file.name,
            error: error.message,
            processingTimeSeconds: processingTime
        };
    }


    /**
     * Health check for processing dependencies
     */
    async healthCheck() {
        const checks = {
            supabaseConnection: false,
            bucketAccess: false,
            aiService: false
        };

        try {
            await this.supabaseClient.storage
                .from(this.config.bucketName)
                .list('', { limit: 1 });
            checks.supabaseConnection = true;
            checks.bucketAccess = true;
        } catch (error) {
            Logger.warn(`Supabase connection check failed: ${error.message}`);
        }

        checks.aiService = !!process.env.GEMINI_API_KEY;

        return checks;
    }
}

module.exports = BankTransactionProcessor;
