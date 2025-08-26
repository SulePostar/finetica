const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import utilities and services
const Logger = require('../utils/logger');
const SupabaseStorageService = require('../utils/supabase/supabaseStorage');
const BankTransactionProcessor = require('../utils/bankTransactionProcessor');
const FileTracker = require('../utils/fileTracker');
const CliHelpers = require('../utils/cliHelpers');
const { BANK_TRANSACTION_PROCESSING, EXIT_CODES } = require('../utils/constants');
const { BankTransactionProcessedFile } = require('../models');


/**
 * Command line interface for Bank Transaction bucket processing
 * Orchestrates file processing using utility classes
 */
class BankTransactionBucketProcessingCLI {
    constructor() {
        this.config = this.buildConfig();
        this.validateConfig();

        // Initialize services lazily
        this._storageService = null;
        this._processor = null;

        this.fileTracker = new FileTracker(BankTransactionProcessedFile, 'bank transaction file');

        this.stats = this.initializeStats();
    }

    /**
     * Build configuration from environment variables
     */
    buildConfig() {
        return {
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
            bucketName: BANK_TRANSACTION_PROCESSING.BUCKET_NAME,
            aiModel: BANK_TRANSACTION_PROCESSING.AI_MODEL,
            processingDelay: BANK_TRANSACTION_PROCESSING.PROCESSING_DELAY
        };
    }

    validateConfig() {
        if (!this.config.supabaseUrl || !this.config.supabaseServiceKey) {
            throw new Error(
                'Required Supabase configuration missing: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set'
            );
        }
    }

    initializeStats() {
        return {
            totalFiles: 0,
            processed: 0,
            errors: 0,
            skipped: 0,
            startTime: null,
            results: []
        };
    }

    get storageService() {
        if (!this._storageService) {
            this._storageService = new SupabaseStorageService({
                supabase: {
                    url: this.config.supabaseUrl,
                    serviceKey: this.config.supabaseServiceKey
                }
            });
        }
        return this._storageService;
    }

    get transactionProcessor() {
        if (!this._transactionProcessor) {
            this._transactionProcessor = new BankTransactionProcessor(this.config);
        }
        return this._transactionProcessor;
    }

    /**
     * List all files in the bucket
     */
    async listBucketFiles() {
        try {
            Logger.info(`Listing files in ${this.config.bucketName} bucket...`);

            const files = await this.storageService.getSupabaseFiles(this.config.bucketName, 1000);

            // Only PDF > 0 size
            const pdfFiles = files.filter(
                file =>
                    file.name &&
                    file.name.toLowerCase().endsWith(BANK_TRANSACTION_PROCESSING.PDF_EXTENSION) &&
                    file.metadata &&
                    file.metadata.size > 0
            );

            Logger.info(`Found ${pdfFiles.length} PDF files in bucket`);
            return pdfFiles;
        } catch (error) {
            Logger.error(`Error listing bucket files: ${error.message}`);
            throw error;
        }
    }

    async processTransactionFile(file, options = {}) {
        try {
            const tracking = await this.fileTracker.trackFileProcessing(file.name, options.forceReprocess);

            if (tracking.shouldSkip) {
                return {
                    success: true,
                    fileName: file.name,
                    skipped: true,
                    reason: tracking.reason
                };
            }

            const result = await this.processor.processFile(file, options);

            if (result.success) {
                await this.fileTracker.markAsProcessed(tracking.record);
                result.processedId = tracking.record.id;
            } else {
                await this.fileTracker.markAsFailed(tracking.record, result.error);
            }

            return result;
        } catch (error) {
            Logger.error(`Error in transaction file processing pipeline: ${error.message}`);
            return {
                success: false,
                fileName: file.name,
                error: error.message
            };
        }
    }

    async processAllFiles(options = {}) {
        const {
            dryRun = false,
            maxFiles = null,
            userId = null,
            includeExtractedData = false,
            onProgress = null,
            onFileProcessed = null,
            forceReprocess = false
        } = options;

        this.stats.startTime = Date.now();

        try {
            Logger.info('Starting Bank Transaction bucket file processing...');

            const bucketFiles = await this.listBucketFiles();
            this.stats.totalFiles = bucketFiles.length;

            if (bucketFiles.length === 0) {
                Logger.info('No PDF files found in bucket');
                return this.getProcessingSummary('No files found');
            }

            const { unprocessedFiles, processedFiles } = await FileTracker.getUnprocessedFiles(
                bucketFiles,
                forceReprocess
            );
            this.stats.skipped = processedFiles.length;

            if (unprocessedFiles.length === 0) {
                Logger.info('All files already processed');
                return this.getProcessingSummary('All files already processed');
            }

            const filesToProcess = maxFiles ? unprocessedFiles.slice(0, maxFiles) : unprocessedFiles;

            if (dryRun) {
                Logger.info(`DRY RUN: Would process ${filesToProcess.length} files`);
                const dryRunResults = filesToProcess.map(file => ({
                    success: true,
                    fileName: file.name,
                    fileSize: file.metadata?.size,
                    dryRun: true
                }));

                this.stats.results = dryRunResults;
                return this.getProcessingSummary('Dry run completed', true);
            }

            Logger.info(`Processing ${filesToProcess.length} unprocessed files...`);

            for (let i = 0; i < filesToProcess.length; i++) {
                const file = filesToProcess[i];
                let result;

                try {
                    onProgress?.({
                        current: i + 1,
                        total: filesToProcess.length,
                        fileName: file.name
                    });

                    result = await this.processTransactionFile(file, {
                        userId,
                        includeExtractedData,
                        forceReprocess
                    });
                } catch (error) {
                    Logger.error(`Unexpected error processing file ${file.name}: ${error.message}`);
                    result = {
                        success: false,
                        fileName: file.name,
                        error: error.message
                    };
                }

                this.stats.results.push(result);
                if (result.success) {
                    this.stats.processed++;
                } else {
                    this.stats.errors++;
                }

                onFileProcessed?.(result);

                if (i < filesToProcess.length - 1) {
                    await new Promise(resolve =>
                        setTimeout(resolve, this.config.processingDelay)
                    );
                }
            }

            const summary = this.getProcessingSummary('Processing completed');
            Logger.success(
                `Bank Transaction processing completed: ${summary.processed} processed, ${summary.errors} errors, ${summary.skipped} skipped in ${summary.duration}`
            );

            return summary;
        } catch (error) {
            Logger.error(`Bank Transaction processing failed: ${error.message}`);
            throw error;
        }
    }

    async healthCheck() {
        try {
            const [processorChecks, databaseHealth] = await Promise.all([
                this.transactionProcessor.healthCheck(),
                FileTracker.healthCheck()
            ]);

            const isHealthy = processorChecks.healthy && databaseHealth;

            return {
                healthy: isHealthy,
                checks: {
                    ...processorChecks.checks,
                    databaseConnection: databaseHealth
                },
                timestamp: new Date().toISOString(),
                config: {
                    bucketName: this.config.bucketName,
                    aiModel: this.config.aiModel
                }
            };
        } catch (error) {
            return {
                healthy: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    getProcessingSummary(message = '', isDryRun = false) {
        return CliHelpers.calculateSummary(this.stats, message, isDryRun);
    }

    async resetAllProcessing() {
        return await FileTracker.resetAllProcessing();
    }

    async getProcessingStatus() {
        return await FileTracker.getProcessingStatus();
    }

    async run() {
        try {
            const args = CliHelpers.parseArguments();

            if (args.help) {
                CliHelpers.showHelp();
                return process.exit(EXIT_CODES.SUCCESS);
            }

            if (args.healthCheck) {
                Logger.info('Running health check...');
                const health = await this.healthCheck();
                CliHelpers.displayHealthCheck(health);
                return process.exit(health.healthy ? EXIT_CODES.SUCCESS : EXIT_CODES.ERROR);
            }

            if (args.resetProcessing) {
                Logger.info('Resetting processing status for all files...');
                const result = await this.resetAllProcessing();
                console.log(`✅ ${result.message}`);
                return process.exit(EXIT_CODES.SUCCESS);
            }

            this.logConfiguration(args);

            const onProgress = CliHelpers.createProgressCallback(Logger, args.verbose);
            const onFileProcessed = CliHelpers.createFileProcessedCallback(Logger, args.verbose);

            const result = await this.processAllFiles({
                dryRun: args.dryRun,
                maxFiles: args.maxFiles ? parseInt(args.maxFiles) : null,
                includeExtractedData: args.includeData,
                forceReprocess: args.forceReprocess,
                onProgress,
                onFileProcessed
            });

            CliHelpers.displaySummary(result);

            process.exit(result.errors > 0 ? EXIT_CODES.ERROR : EXIT_CODES.SUCCESS);
        } catch (error) {
            Logger.error(`💥 Fatal error: ${error.message}`);
            console.error(error);
            process.exit(EXIT_CODES.ERROR);
        }
    }

    logConfiguration(args) {
        if (args.dryRun) {
            Logger.info('🔍 DRY RUN MODE: Will only list unprocessed files without processing them');
        }

        if (args.maxFiles) {
            Logger.info(`📋 Processing limited to ${args.maxFiles} files`);
        }

        if (args.verbose) {
            Logger.info('📢 Verbose mode enabled');
        }

        if (args.forceReprocess) {
            Logger.info(
                '🔄 Force reprocess mode enabled - will reprocess already processed files'
            );
        }
    }
}

module.exports = BankTransactionBucketProcessingCLI;

if (require.main === module) {
    const cli = new BankTransactionCLI();
    cli.processAllFiles().then(stats => console.log('Processing stats:', stats));
}
