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
            dryRun: args.includes('--dry-run') || args.includes('-d'),
            maxFiles: args.find(arg => arg.startsWith('--max='))?.split('=')[1],
            verbose: args.includes('--verbose') || args.includes('-v'),
            help: args.includes('--help') || args.includes('-h'),
            healthCheck: args.includes('--health'),
            includeData: args.includes('--include-data'),
            resetProcessing: args.includes('--reset-processing'),
            forceReprocess: args.includes('--force')
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
        console.log(`📊 Total files in bucket: ${result.totalFiles}`);
        console.log(`✅ Successfully processed: ${result.processed}`);
        console.log(`❌ Errors: ${result.errors}`);
        console.log(`⏭️  Already processed (skipped): ${result.skipped}`);
        console.log(`⏱️  Duration: ${result.duration}`);
        console.log(`📈 Average processing time: ${result.averageProcessingTime}s per file`);

        if (result.message) {
            console.log(`💬 Status: ${result.message}`);
        }

        if (result.errors > 0) {
            console.log('\n=== ERRORS ===');
            result.failedFiles.forEach(r => {
                console.log(`❌ ${r.fileName}: ${r.error}`);
            });
        }

        if (result.processed > 0) {
            console.log('\n=== SUCCESSFULLY PROCESSED ===');
            result.successfulFiles.forEach(r => {
                const amount = r.totalAmount ? ` (${r.totalAmount} ${r.currency || ''})` : '';
                console.log(`✅ ${r.fileName} -> Invoice #${r.invoiceNumber}${amount} (ID: ${r.invoiceId})`);
            });
        }

        if (result.isDryRun && result.results.length > 0) {
            console.log('\n=== FILES THAT WOULD BE PROCESSED ===');
            result.results.forEach(r => {
                const sizeInfo = r.fileSize ? ` (${(r.fileSize / 1024 / 1024).toFixed(2)} MB)` : '';
                console.log(`📄 ${r.fileName}${sizeInfo}`);
            });
            console.log(`\n💡 To actually process these files, run without --dry-run flag`);
        }
    }

    /**
     * Display health check results
     */
    static displayHealthCheck(health) {
        console.log('\n=== HEALTH CHECK ===');
        console.log(`🏥 Overall Status: ${health.healthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
        console.log(`🕐 Timestamp: ${health.timestamp}`);

        if (health.config) {
            console.log(`📦 Bucket: ${health.config.bucketName}`);
            console.log(`🤖 AI Model: ${health.config.aiModel}`);
        }

        if (health.checks) {
            console.log('\n📋 Component Checks:');
            Object.entries(health.checks).forEach(([component, status]) => {
                const icon = status ? '✅' : '❌';
                console.log(`  ${icon} ${component}: ${status ? 'OK' : 'FAILED'}`);
            });
        }

        if (health.error) {
            console.log(`\n❌ Error: ${health.error}`);
        }
    }

    /**
     * Create progress callback for verbose mode
     */
    static createProgressCallback(Logger, verbose) {
        return verbose ? (progress) => {
            Logger.info(`📈 Progress: ${progress.current}/${progress.total} - Processing ${progress.fileName}`);
        } : null;
    }

    /**
     * Create file processed callback for verbose mode
     */
    static createFileProcessedCallback(Logger, verbose) {
        return verbose ? (result) => {
            if (result.success) {
                Logger.success(`✅ Completed: ${result.fileName} (${result.processingTimeSeconds}s)`);
            } else {
                Logger.error(`❌ Failed: ${result.fileName} - ${result.error}`);
            }
        } : null;
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
