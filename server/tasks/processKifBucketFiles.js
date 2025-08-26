const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import utilities and services
const Logger = require('../utils/logger');
const SupabaseStorageService = require('../utils/supabase/supabaseStorage');
const KifProcessor = require('../utils/kifProcessor');
const FileTracker = require('../utils/fileTracker');
const CliHelpers = require('../utils/cliHelpers');
const { KIF_PROCESSING, EXIT_CODES } = require('../utils/constants');

/**
 * Command line interface for KIF bucket processing
 * Orchestrates file processing using utility classes
 */
class KifBucketProcessingCLI {
    constructor() {
        this.config = this.buildConfig();
        this.validateConfig();

        // Initialize services lazily
        this._storageService = null;
        this._kifProcessor = null;

        this.stats = this.initializeStats();
    }

    /**
     * Build configuration from environment variables
     */
    buildConfig() {
        return {
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
            bucketName: KIF_PROCESSING.BUCKET_NAME,
            aiModel: KIF_PROCESSING.AI_MODEL,
            processingDelay: KIF_PROCESSING.PROCESSING_DELAY
        };
    }

    /**
     * Validate required configuration
     */
    validateConfig() {
        if (!this.config.supabaseUrl || !this.config.supabaseServiceKey) {
            throw new Error('Required Supabase configuration missing: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
        }
    }

    /**
     * Initialize statistics object
     */
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

    /**
     * Get storage service (lazy initialization)
     */
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

    /**
     * Get KIF processor (lazy initialization)
     */
    get kifProcessor() {
        if (!this._kifProcessor) {
            this._kifProcessor = new KifProcessor(this.config);
        }
        return this._kifProcessor;
    }

    /**
     * List all files in the KIF bucket
     */
    async listBucketFiles() {
        try {
            Logger.info(`Listing files in ${this.config.bucketName} bucket...`);

            const files = await this.storageService.getSupabaseFiles(this.config.bucketName, 1000);

            // Filter only PDF files with size > 0
            const pdfFiles = files.filter(file =>
                file.name &&
                file.name.toLowerCase().endsWith(KIF_PROCESSING.PDF_EXTENSION) &&
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

    /**
     * Process a single KIF file with tracking
     */
    async processKifFile(file, options = {}) {
        try {
            // Track file processing
            const tracking = await FileTracker.trackFileProcessing(file.name, options.forceReprocess);

            if (tracking.shouldSkip) {
                return {
                    success: true,
                    fileName: file.name,
                    skipped: true,
                    reason: tracking.reason
                };
            }

            // Process the file
            const result = await this.kifProcessor.processFile(file, options);

            // Update tracking based on result
            if (result.success) {
                await FileTracker.markAsProcessed(tracking.record);
                result.kifProcessedId = tracking.record.id;
            } else {
                await FileTracker.markAsFailed(tracking.record, result.error);
            }

            return result;

        } catch (error) {
            Logger.error(`Error in KIF file processing pipeline: ${error.message}`);
            return {
                success: false,
                fileName: file.name,
                error: error.message,
                processingTimeSeconds: 0
            };
        }
    }

    /**
     * Process all unprocessed KIF files
     */
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
            Logger.info('Starting KIF bucket file processing...');

            // Get all files from bucket using existing service
            const bucketFiles = await this.listBucketFiles();
            this.stats.totalFiles = bucketFiles.length;

            if (bucketFiles.length === 0) {
                Logger.info('No PDF files found in KIF bucket');
                return this.getProcessingSummary('No files found');
            }

            // Get unprocessed files
            const { unprocessedFiles, processedFiles } = await FileTracker.getUnprocessedFiles(bucketFiles, forceReprocess);
            this.stats.skipped = processedFiles.length;

            if (unprocessedFiles.length === 0) {
                Logger.info('All files in KIF bucket have already been processed');
                return this.getProcessingSummary('All files already processed');
            }

            // Limit files if specified
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

            // Process files sequentially
            for (let i = 0; i < filesToProcess.length; i++) {
                const file = filesToProcess[i];
                let result;

                try {
                    // Progress callback
                    onProgress?.({
                        current: i + 1,
                        total: filesToProcess.length,
                        fileName: file.name
                    });

                    result = await this.processKifFile(file, {
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

                // Update stats and store result
                this.stats.results.push(result);
                if (result.success) {
                    this.stats.processed++;
                } else {
                    this.stats.errors++;
                }

                // File processed callback
                onFileProcessed?.(result);

                // Delay between files (except for the last file)
                if (i < filesToProcess.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, this.config.processingDelay));
                }
            }

            const summary = this.getProcessingSummary('Processing completed');
            Logger.success(`KIF processing completed: ${summary.processed} processed, ${summary.errors} errors, ${summary.skipped} skipped in ${summary.duration}`);

            return summary;

        } catch (error) {
            Logger.error(`KIF processing failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Check service health by aggregating health checks from dependencies
     */
    async healthCheck() {
        try {
            const [processorChecks, databaseHealth] = await Promise.all([
                this.kifProcessor.healthCheck(),
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

    /**
     * Get processing summary with statistics
     */
    getProcessingSummary(message = '', isDryRun = false) {
        return CliHelpers.calculateSummary(this.stats, message, isDryRun);
    }

    /**
     * Reset processing status for all files
     */
    async resetAllProcessing() {
        return await FileTracker.resetAllProcessing();
    }

    /**
     * Get processing status summary
     */
    async getProcessingStatus() {
        return await FileTracker.getProcessingStatus();
    }

    /**
     * Run the CLI application
     */
    async run() {
        try {
            const args = CliHelpers.parseArguments();

            if (args.help) {
                CliHelpers.showHelp();
                return process.exit(EXIT_CODES.SUCCESS);
            }

            // Health check only
            if (args.healthCheck) {
                Logger.info('Running health check...');
                const health = await this.healthCheck();
                CliHelpers.displayHealthCheck(health);
                return process.exit(health.healthy ? EXIT_CODES.SUCCESS : EXIT_CODES.ERROR);
            }

            // Reset processing status
            if (args.resetProcessing) {
                Logger.info('Resetting processing status for all files...');
                const result = await this.resetAllProcessing();
                console.log(`✅ ${result.message}`);
                return process.exit(EXIT_CODES.SUCCESS);
            }

            // Log configuration
            this.logConfiguration(args);

            // Setup progress callbacks for verbose mode
            const onProgress = CliHelpers.createProgressCallback(Logger, args.verbose);
            const onFileProcessed = CliHelpers.createFileProcessedCallback(Logger, args.verbose);

            // Process files
            const result = await this.processAllFiles({
                dryRun: args.dryRun,
                maxFiles: args.maxFiles ? parseInt(args.maxFiles) : null,
                includeExtractedData: args.includeData,
                forceReprocess: args.forceReprocess,
                onProgress,
                onFileProcessed
            });

            // Display results
            CliHelpers.displaySummary(result);

            // Exit with appropriate code
            process.exit(result.errors > 0 ? EXIT_CODES.ERROR : EXIT_CODES.SUCCESS);

        } catch (error) {
            Logger.error(`💥 Fatal error: ${error.message}`);
            console.error(error);
            process.exit(EXIT_CODES.ERROR);
        }
    }

    /**
     * Log configuration based on arguments
     */
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
            Logger.info('🔄 Force reprocess mode enabled - will reprocess already processed files');
        }
    }
}

// Export the CLI class for use in other modules
module.exports = KifBucketProcessingCLI;

// Run CLI if this file is executed directly
if (require.main === module) {
    const cli = new KifBucketProcessingCLI();
    cli.run();
};
