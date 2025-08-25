const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import utilities and services
const Logger = require('../utils/logger');
const SupabaseStorageService = require('../utils/supabase/supabaseStorage');
const KifProcessor = require('../utils/kifProcessor');
const FileTracker = require('../utils/fileTracker');
const CliHelpers = require('../utils/cliHelpers');

/**
 * Command line interface for KIF bucket processing
 * Orchestrates file processing using utility classes
 */
class KifBucketProcessingCLI {
    constructor() {
        this.config = {
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
            bucketName: 'kif',
            aiModel: 'gemini-2.5-flash-lite',
            processingDelay: 1000
        };

        if (!this.config.supabaseUrl || !this.config.supabaseServiceKey) {
            throw new Error('Supabase configuration missing');
        }

        // Initialize services
        this.storageService = new SupabaseStorageService({
            supabase: {
                url: this.config.supabaseUrl,
                serviceKey: this.config.supabaseServiceKey
            }
        });

        this.kifProcessor = new KifProcessor(this.config);

        this.stats = {
            totalFiles: 0,
            processed: 0,
            errors: 0,
            skipped: 0,
            startTime: null,
            results: []
        };
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
                file.name.toLowerCase().endsWith('.pdf') &&
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

                try {
                    // Progress callback
                    if (onProgress) {
                        onProgress({
                            current: i + 1,
                            total: filesToProcess.length,
                            fileName: file.name
                        });
                    }

                    const result = await this.processKifFile(file, {
                        userId,
                        includeExtractedData,
                        forceReprocess
                    });

                    this.stats.results.push(result);

                    if (result.success) {
                        this.stats.processed++;
                    } else {
                        this.stats.errors++;
                    }

                    // File processed callback
                    if (onFileProcessed) {
                        onFileProcessed(result);
                    }

                    // Delay between files
                    if (i < filesToProcess.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, this.config.processingDelay));
                    }

                } catch (error) {
                    Logger.error(`Unexpected error processing file ${file.name}: ${error.message}`);
                    this.stats.errors++;
                    this.stats.results.push({
                        success: false,
                        fileName: file.name,
                        error: error.message
                    });
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
     * Check service health
     */
    async healthCheck() {
        try {
            const checks = {
                supabaseConnection: false,
                bucketAccess: false,
                databaseConnection: false,
                aiService: false
            };

            // Test storage and processing services
            const processorChecks = await this.kifProcessor.healthCheck();
            checks.supabaseConnection = processorChecks.supabaseConnection;
            checks.bucketAccess = processorChecks.bucketAccess;
            checks.aiService = processorChecks.aiService;

            // Test database connection
            checks.databaseConnection = await FileTracker.healthCheck();

            const isHealthy = Object.values(checks).every(check => check === true);

            return {
                healthy: isHealthy,
                checks,
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
     * Parse command line arguments
     */
    parseArguments() {
        return CliHelpers.parseArguments();
    }

    /**
     * Display help information
     */
    showHelp() {
        CliHelpers.showHelp();
    }

    /**
     * Display processing summary
     */
    displaySummary(result) {
        CliHelpers.displaySummary(result);
    }

    /**
     * Display health check results
     */
    displayHealthCheck(health) {
        CliHelpers.displayHealthCheck(health);
    }

    /**
     * Run the CLI application
     */
    async run() {
        try {
            const args = this.parseArguments();

            if (args.help) {
                this.showHelp();
                return process.exit(0);
            }

            // Health check only
            if (args.healthCheck) {
                Logger.info('Running health check...');
                const health = await this.healthCheck();
                this.displayHealthCheck(health);
                return process.exit(health.healthy ? 0 : 1);
            }

            // Reset processing status
            if (args.resetProcessing) {
                Logger.info('Resetting processing status for all files...');
                const result = await this.resetAllProcessing();
                console.log(`✅ ${result.message}`);
                return process.exit(0);
            }

            // Log configuration
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
            this.displaySummary(result);

            // Exit with appropriate code
            process.exit(result.errors > 0 ? 1 : 0);

        } catch (error) {
            Logger.error(`💥 Fatal error: ${error.message}`);
            console.error(error);
            process.exit(1);
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
