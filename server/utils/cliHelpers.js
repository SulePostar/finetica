const { CLI_OPTIONS, DISPLAY_ICONS } = require('./constants');

/**
 * CLI helper utilities for argument parsing and output formatting
 */
class CliHelpers {

    /**
     * Parse command line arguments
     */
    static parseArguments() {
        const args = process.argv.slice(2);
        return {
            dryRun: CLI_OPTIONS.DRY_RUN.some(opt => args.includes(opt)),
            maxFiles: args.find(arg => arg.startsWith(CLI_OPTIONS.MAX_PREFIX))?.split('=')[1],
            verbose: CLI_OPTIONS.VERBOSE.some(opt => args.includes(opt)),
            help: CLI_OPTIONS.HELP.some(opt => args.includes(opt)),
            healthCheck: args.includes(CLI_OPTIONS.HEALTH_CHECK[0]),
            includeData: args.includes(CLI_OPTIONS.INCLUDE_DATA[0]),
            resetProcessing: args.includes(CLI_OPTIONS.RESET_PROCESSING[0]),
            forceReprocess: args.includes(CLI_OPTIONS.FORCE[0])
        };
    }

    /**
     * Display help information
     */
    static showHelp() {
        console.log(`
KIF Bucket Processing Tool

USAGE:
  node tasks/processKifBucketFiles.js [OPTIONS]

OPTIONS:
  --dry-run, -d          List files that would be processed without processing them
  --max=N               Limit processing to N files
  --verbose, -v         Enable verbose logging
  --include-data        Include extracted AI data in results
  --force               Force reprocessing of already processed files
  --reset-processing    Reset all processing status to allow reprocessing
  --health              Run health check only
  --help, -h            Show this help message

EXAMPLES:
  node tasks/processKifBucketFiles.js --dry-run
  node tasks/processKifBucketFiles.js --max=5
  node tasks/processKifBucketFiles.js --verbose --include-data
  node tasks/processKifBucketFiles.js --force --max=3
  node tasks/processKifBucketFiles.js --reset-processing
  node tasks/processKifBucketFiles.js --health

ENVIRONMENT VARIABLES:
  GEMINI_API_KEY        Google Gemini AI API key (required)
  SUPABASE_URL          Supabase project URL (required)
  SUPABASE_SERVICE_ROLE_KEY  Supabase service role key (required)
        `);
    }

    /**
     * Display processing summary
     */
    static displaySummary(result) {
        console.log('\n=== PROCESSING SUMMARY ===');
        console.log(`${DISPLAY_ICONS.INFO} Total files in bucket: ${result.totalFiles}`);
        console.log(`${DISPLAY_ICONS.SUCCESS} Successfully processed: ${result.processed}`);
        console.log(`${DISPLAY_ICONS.ERROR} Errors: ${result.errors}`);
        console.log(`${DISPLAY_ICONS.SKIP} Already processed (skipped): ${result.skipped}`);
        console.log(`${DISPLAY_ICONS.TIME} Duration: ${result.duration}`);
        console.log(`${DISPLAY_ICONS.PROGRESS} Average processing time: ${result.averageProcessingTime}s per file`);

        if (result.message) {
            console.log(`💬 Status: ${result.message}`);
        }

        this.displayErrors(result);
        this.displaySuccessful(result);
        this.displayDryRun(result);
    }

    /**
     * Display error details
     */
    static displayErrors(result) {
        if (result.errors > 0 && result.failedFiles?.length > 0) {
            console.log('\n=== ERRORS ===');
            result.failedFiles.forEach(r => {
                console.log(`${DISPLAY_ICONS.ERROR} ${r.fileName}: ${r.error}`);
            });
        }
    }

    /**
     * Display successful processing details
     */
    static displaySuccessful(result) {
        if (result.processed > 0 && result.successfulFiles?.length > 0) {
            console.log('\n=== SUCCESSFULLY PROCESSED ===');
            result.successfulFiles.forEach(r => {
                const amount = r.totalAmount ? ` (${r.totalAmount} ${r.currency || ''})` : '';
                console.log(`${DISPLAY_ICONS.SUCCESS} ${r.fileName} -> Invoice #${r.invoiceNumber}${amount} (ID: ${r.invoiceId})`);
            });
        }
    }

    /**
     * Display dry run results
     */
    static displayDryRun(result) {
        if (result.isDryRun && result.results?.length > 0) {
            console.log('\n=== FILES THAT WOULD BE PROCESSED ===');
            result.results.forEach(r => {
                const sizeInfo = r.fileSize ? ` (${(r.fileSize / 1024 / 1024).toFixed(2)} MB)` : '';
                console.log(`${DISPLAY_ICONS.DOCUMENT} ${r.fileName}${sizeInfo}`);
            });
            console.log(`\n💡 To actually process these files, run without --dry-run flag`);
        }
    }

    /**
     * Display health check results
     */
    static displayHealthCheck(health) {
        console.log('\n=== HEALTH CHECK ===');
        console.log(`${DISPLAY_ICONS.HEALTH} Overall Status: ${health.healthy ? `${DISPLAY_ICONS.SUCCESS} HEALTHY` : `${DISPLAY_ICONS.ERROR} UNHEALTHY`}`);
        console.log(`🕐 Timestamp: ${health.timestamp}`);

        if (health.config) {
            console.log(`${DISPLAY_ICONS.CONFIG} Bucket: ${health.config.bucketName}`);
            console.log(`${DISPLAY_ICONS.ROBOT} AI Model: ${health.config.aiModel}`);
        }

        if (health.checks) {
            console.log('\n📋 Component Checks:');
            Object.entries(health.checks).forEach(([component, status]) => {
                const icon = status ? DISPLAY_ICONS.SUCCESS : DISPLAY_ICONS.ERROR;
                console.log(`  ${icon} ${component}: ${status ? 'OK' : 'FAILED'}`);
            });
        }

        if (health.error) {
            console.log(`\n${DISPLAY_ICONS.ERROR} Error: ${health.error}`);
        }
    }

    /**
     * Create progress callback for verbose mode
     */
    static createProgressCallback(Logger, verbose) {
        if (!verbose) return null;

        return (progress) => {
            Logger.info(`${DISPLAY_ICONS.PROGRESS} Progress: ${progress.current}/${progress.total} - Processing ${progress.fileName}`);
        };
    }

    /**
     * Create file processed callback for verbose mode
     */
    static createFileProcessedCallback(Logger, verbose) {
        if (!verbose) return null;

        return (result) => {
            if (result.success) {
                Logger.success(`${DISPLAY_ICONS.SUCCESS} Completed: ${result.fileName} (${result.processingTimeSeconds}s)`);
            } else {
                Logger.error(`${DISPLAY_ICONS.ERROR} Failed: ${result.fileName} - ${result.error}`);
            }
        };
    }

    /**
     * Calculate processing summary statistics
     */
    static calculateSummary(stats, message = '', isDryRun = false) {
        const duration = ((Date.now() - stats.startTime) / 1000).toFixed(2);

        return {
            message,
            isDryRun,
            totalFiles: stats.totalFiles,
            processed: stats.processed,
            errors: stats.errors,
            skipped: stats.skipped,
            duration: `${duration}s`,
            results: stats.results,
            averageProcessingTime: stats.results.length > 0 ?
                (stats.results.reduce((sum, r) => sum + (r.processingTimeSeconds || 0), 0) / stats.results.length).toFixed(2) :
                0,
            successfulFiles: stats.results.filter(r => r.success),
            failedFiles: stats.results.filter(r => !r.success)
        };
    }
}

module.exports = CliHelpers;
