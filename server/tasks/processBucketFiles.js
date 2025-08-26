const path = require('path');
const dotenv = require('dotenv');

// Shared generic CLI for processing bucket files (KIF, KUF, BankTransaction, etc.)
class ProcessBucketFilesCLI {
    constructor({
        processorClass,
        processorName,
        fileTracker,
        config,
        constants,
        logger,
        cliHelpers
    }) {
        this.config = config;
        this.constants = constants;
        this.logger = logger;
        this.cliHelpers = cliHelpers;
        this.processorClass = processorClass;
        this.processorName = processorName;
        this.fileTracker = fileTracker; // always an instance
        this._storageService = null;
        this._processor = null;
        this.stats = this.initializeStats();
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
            const SupabaseStorageService = require('../utils/supabase/supabaseStorage');
            this._storageService = new SupabaseStorageService({
                supabase: {
                    url: this.config.supabaseUrl,
                    serviceKey: this.config.supabaseServiceKey
                }
            });
        }
        return this._storageService;
    }

    get processor() {
        if (!this._processor) {
            this._processor = new this.processorClass(this.config);
        }
        return this._processor;
    }

    async listBucketFiles() {
        try {
            this.logger.info(`Listing files in ${this.config.bucketName} bucket...`);
            const files = await this.storageService.getSupabaseFiles(this.config.bucketName, 1000);
            // Only PDF > 0 size
            const pdfFiles = files.filter(
                file =>
                    file.name &&
                    file.name.toLowerCase().endsWith(this.constants.PDF_EXTENSION) &&
                    file.metadata &&
                    file.metadata.size > 0
            );
            this.logger.info(`Found ${pdfFiles.length} PDF files in bucket`);
            return pdfFiles;
        } catch (error) {
            this.logger.error(`Error listing bucket files: ${error.message}`);
            throw error;
        }
    }

    async processFileWithTracking(file, options = {}) {
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
            this.logger.error(`Error in ${this.processorName} file processing pipeline: ${error.message}`);
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
            this.logger.info(`Starting ${this.processorName} bucket file processing...`);
            const bucketFiles = await this.listBucketFiles();
            this.stats.totalFiles = bucketFiles.length;
            if (bucketFiles.length === 0) {
                this.logger.info('No PDF files found in bucket');
                return this.getProcessingSummary('No files found');
            }
            // Use instance method for unprocessed files
            const { unprocessedFiles, processedFiles } = await this.fileTracker.getUnprocessedFiles(
                bucketFiles,
                forceReprocess
            );
            this.stats.skipped = processedFiles.length;
            if (unprocessedFiles.length === 0) {
                this.logger.info('All files already processed');
                return this.getProcessingSummary('All files already processed');
            }
            const filesToProcess = maxFiles ? unprocessedFiles.slice(0, maxFiles) : unprocessedFiles;
            if (dryRun) {
                this.logger.info(`DRY RUN: Would process ${filesToProcess.length} files`);
                const dryRunResults = filesToProcess.map(file => ({
                    success: true,
                    fileName: file.name,
                    fileSize: file.metadata?.size,
                    dryRun: true
                }));
                this.stats.results = dryRunResults;
                return this.getProcessingSummary('Dry run completed', true);
            }
            this.logger.info(`Processing ${filesToProcess.length} unprocessed files...`);
            for (let i = 0; i < filesToProcess.length; i++) {
                const file = filesToProcess[i];
                let result;
                try {
                    onProgress?.({
                        current: i + 1,
                        total: filesToProcess.length,
                        fileName: file.name
                    });
                    result = await this.processFileWithTracking(file, {
                        userId,
                        includeExtractedData,
                        forceReprocess
                    });
                } catch (error) {
                    this.logger.error(`Unexpected error processing file ${file.name}: ${error.message}`);
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
                    await new Promise(resolve => setTimeout(resolve, this.config.processingDelay));
                }
            }
            const summary = this.getProcessingSummary('Processing completed');
            this.logger.success(
                `${this.processorName} processing completed: ${summary.processed} processed, ${summary.errors} errors, ${summary.skipped} skipped in ${summary.duration}`
            );
            return summary;
        } catch (error) {
            this.logger.error(`${this.processorName} processing failed: ${error.message}`);
            throw error;
        }
    }

    async healthCheck() {
        try {
            const [processorChecks, databaseHealth] = await Promise.all([
                this.processor.healthCheck(),
                this.fileTracker.healthCheck()
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
        return this.cliHelpers.calculateSummary(this.stats, message, isDryRun);
    }

    async resetAllProcessing() {
        return await this.fileTracker.resetAllProcessing();
    }

    async getProcessingStatus() {
        return await this.fileTracker.getProcessingStatus();
    }

    async run() {
        try {
            const args = this.cliHelpers.parseArguments();
            if (args.help) {
                this.cliHelpers.showHelp();
                return process.exit(this.constants.EXIT_CODES.SUCCESS);
            }
            if (args.healthCheck) {
                this.logger.info('Running health check...');
                const health = await this.healthCheck();
                this.cliHelpers.displayHealthCheck(health);
                return process.exit(health.healthy ? this.constants.EXIT_CODES.SUCCESS : this.constants.EXIT_CODES.ERROR);
            }
            if (args.resetProcessing) {
                this.logger.info('Resetting processing status for all files...');
                const result = await this.resetAllProcessing();
                console.log(`✅ ${result.message}`);
                return process.exit(this.constants.EXIT_CODES.SUCCESS);
            }
            this.logConfiguration(args);
            const onProgress = this.cliHelpers.createProgressCallback(this.logger, args.verbose);
            const onFileProcessed = this.cliHelpers.createFileProcessedCallback(this.logger, args.verbose);
            const result = await this.processAllFiles({
                dryRun: args.dryRun,
                maxFiles: args.maxFiles ? parseInt(args.maxFiles) : null,
                includeExtractedData: args.includeData,
                forceReprocess: args.forceReprocess,
                onProgress,
                onFileProcessed
            });
            this.cliHelpers.displaySummary(result);
            process.exit(result.errors > 0 ? this.constants.EXIT_CODES.ERROR : this.constants.EXIT_CODES.SUCCESS);
        } catch (error) {
            this.logger.error(`💥 Fatal error: ${error.message}`);
            console.error(error);
            process.exit(this.constants.EXIT_CODES.ERROR);
        }
    }

    logConfiguration(args) {
        if (args.dryRun) {
            this.logger.info('🔍 DRY RUN MODE: Will only list unprocessed files without processing them');
        }
        if (args.maxFiles) {
            this.logger.info(`📋 Processing limited to ${args.maxFiles} files`);
        }
        if (args.verbose) {
            this.logger.info('📢 Verbose mode enabled');
        }
        if (args.forceReprocess) {
            this.logger.info('🔄 Force reprocess mode enabled - will reprocess already processed files');
        }
    }
}

module.exports = ProcessBucketFilesCLI;
