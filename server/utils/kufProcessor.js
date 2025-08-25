const { createClient } = require('@supabase/supabase-js');
const Logger = require('./logger');
const { processDocument } = require('../services/aiService');
const { createKufFromAI } = require('../services/kuf');
const { UploadedFile } = require('../models');
const KUF_PROMPT = require('../prompts/kufPrompt.js');
const purchaseInvoiceSchema = require('../schemas/kufSchema.js');

/**
 * Core KUF file processing utilities
 */
class KufProcessor {
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
     * Process a single PDF file with AI and create invoice
     */
    async processFile(file, options = {}) {
        const startTime = Date.now();

        try {
            Logger.info(`Processing file: ${file.name}`);

            // Download the file
            const fileBuffer = await this.downloadFile(file.name);

            // Process with AI using existing service
            const extractedData = await processDocument(
                fileBuffer,
                'application/pdf',
                purchaseInvoiceSchema,
                this.config.aiModel,
                KUF_PROMPT
            );

            // Create invoice using existing service
            const invoice = await createKufFromAI(extractedData);

            // Create uploaded file record using existing model
            const fileUrl = `${this.config.supabaseUrl}/storage/v1/object/public/${this.config.bucketName}/${encodeURIComponent(file.name)}`;

            Logger.debug(`Generated file URL: ${fileUrl}`);

            const uploadedFile = await UploadedFile.create({
                fileName: file.name,
                fileUrl: fileUrl,
                fileSize: file.metadata?.size || null,
                mimeType: 'application/pdf',
                bucketName: this.config.bucketName,
                uploadedBy: options.userId || null,
                description: `Auto-processed KUF invoice: ${extractedData.invoiceNumber || 'Unknown'}`,
                isActive: true
            });

            const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
            Logger.success(`Successfully processed ${file.name} -> Invoice ID: ${invoice.id} (${processingTime}s)`);

            return {
                success: true,
                fileName: file.name,
                invoiceId: invoice.id,
                invoiceNumber: extractedData.invoiceNumber,
                totalAmount: extractedData.totalAmount,
                currency: extractedData.currency,
                uploadedFileId: uploadedFile.id,
                processingTimeSeconds: parseFloat(processingTime),
                extractedData: options.includeExtractedData ? extractedData : undefined
            };

        } catch (error) {
            const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
            Logger.error(`Error processing file ${file.name} (${processingTime}s): ${error.message}`);

            return {
                success: false,
                fileName: file.name,
                error: error.message,
                processingTimeSeconds: parseFloat(processingTime)
            };
        }
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

        // AI service check
        checks.aiService = !!process.env.GEMINI_API_KEY;

        return checks;
    }
}

module.exports = KufProcessor;