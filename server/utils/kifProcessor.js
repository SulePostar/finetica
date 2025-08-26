const { createClient } = require('@supabase/supabase-js');
const Logger = require('./logger');
const { processDocument } = require('../services/aiService');
const { createKifFromAI } = require('../services/kif');
const { UploadedFile } = require('../models');
const KIF_PROMPT = require('../prompts/Kif.js');
const salesInvoiceSchema = require('../schemas/kifSchema');
const { SUPABASE_CONFIG, FILE_CONFIG } = require('./constants');

/**
 * Core KIF file processing utilities
 */
class KifProcessor {
    constructor(config) {
        this.config = config;
        this.supabaseClient = this.createSupabaseClient(config);
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
     * Process a single PDF file with AI and create invoice
     */
    async processFile(file, options = {}) {
        const startTime = Date.now();

        try {
            Logger.info(`Processing file: ${file.name}`);

            // Download and process file
            const fileBuffer = await this.downloadFile(file.name);
            const extractedData = await processDocument(
                fileBuffer,
                FILE_CONFIG.MIME_TYPE,
                salesInvoiceSchema,
                this.config.aiModel,
                KIF_PROMPT
            );

            // Create invoice and file record in parallel
            const [invoice, uploadedFile] = await Promise.all([
                createKifFromAI(extractedData),
                this.createUploadedFileRecord(file, extractedData, options)
            ]);

            const processingTime = this.calculateProcessingTime(startTime);
            Logger.success(`Successfully processed ${file.name} -> Invoice ID: ${invoice.id} (${processingTime}s)`);

            return this.buildSuccessResult(file, invoice, extractedData, uploadedFile, processingTime, options);

        } catch (error) {
            const processingTime = this.calculateProcessingTime(startTime);
            Logger.error(`Error processing file ${file.name} (${processingTime}s): ${error.message}`);

            return this.buildErrorResult(file, error, processingTime);
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

        // Test Supabase bucket access
        try {
            await this.supabaseClient.storage
                .from(this.config.bucketName)
                .list('', { limit: 1 });
            checks.supabaseConnection = true;
            checks.bucketAccess = true;
        } catch (error) {
            Logger.warn(`Supabase connection check failed: ${error.message}`);
        }

        // AI service check - verify API key exists
        checks.aiService = !!process.env.GEMINI_API_KEY;

        const isHealthy = Object.values(checks).every(check => check === true);

        return {
            healthy: isHealthy,
            checks
        };
    }
}

module.exports = KifProcessor;
