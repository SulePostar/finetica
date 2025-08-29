const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const Logger = require('../utils/logger');
const kufService = require('../services/kuf');
const SupabaseStorageService = require('../utils/supabase/supabaseStorage');
const { KufProcessingLog } = require('../models');

class KufScript {
    constructor() {
        this.config = {
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
            bucketName: 'kuf',
            processingDelay: 1000
        };

        if (!this.config.supabaseUrl || !this.config.supabaseServiceKey) {
            throw new Error('Supabase configuration missing. Please check your .env file.');
        }

        this.storageService = new SupabaseStorageService({
            supabase: {
                url: this.config.supabaseUrl,
                serviceKey: this.config.supabaseServiceKey
            }
        });

        this.stats = {
            startTime: null,
            endTime: null,
            totalFiles: 0,
            processedFiles: 0,
            errors: 0
        };
    }

    async getUnprocessedFileCount() {
        try {
            const unprocessedCount = await KufProcessingLog.count({
                where: { isProcessed: false }
            });
            return unprocessedCount;
        } catch (error) {
            Logger.warn(`⚠️ Could not get unprocessed file count: ${error.message}`);
            return 0;
        }
    }

    async processKufFiles() {
        try {
            Logger.info('🔄 Processing unprocessed KUF files...');

            const unprocessedCount = await this.getUnprocessedFileCount();
            Logger.info(`📋 Found ${unprocessedCount} unprocessed files in database`);

            if (unprocessedCount === 0) {
                Logger.info('ℹ️  No unprocessed files to process');
                return 0;
            }

            await kufService.processUnprocessedFiles();

            const remainingUnprocessed = await this.getUnprocessedFileCount();
            const actuallyProcessed = unprocessedCount - remainingUnprocessed;

            Logger.success(`✅ KUF files processed: ${actuallyProcessed} out of ${unprocessedCount}`);
            this.stats.processedFiles = actuallyProcessed;

            return actuallyProcessed;

        } catch (error) {
            Logger.error(`❌ Error processing KUF files: ${error.message}`);
            this.stats.errors++;
            throw error;
        }
    }

    async getBucketFileCount() {
        try {
            const files = await this.storageService.getSupabaseFiles(this.config.bucketName, 1000);
            const pdfFiles = files.filter(file =>
                file.name &&
                file.name.toLowerCase().endsWith('.pdf') &&
                file.metadata &&
                file.metadata.size > 0
            );

            this.stats.totalFiles = pdfFiles.length;
            Logger.info(`📁 Found ${pdfFiles.length} PDF files in KUF bucket`);
            return pdfFiles.length;
        } catch (error) {
            Logger.warn(`⚠️ Could not get file count for KUF bucket: ${error.message}`);
            return 0;
        }
    }

    displaySummary() {
        const duration = this.stats.endTime - this.stats.startTime;
        const durationSeconds = Math.round(duration / 1000);

        Logger.info('📊 Daily KUF File Processing Summary');
        Logger.info('===================================');
        Logger.info(`⏱️  Total Duration: ${durationSeconds} seconds`);
        Logger.info(`📁 Total Files in Bucket: ${this.stats.totalFiles}`);
        Logger.info(`✅ Files Processed: ${this.stats.processedFiles}`);
        Logger.info(`❌ Total Errors: ${this.stats.errors}`);
        Logger.info('');

        if (this.stats.errors === 0) {
            Logger.success('🎉 All KUF files processed successfully!');
        } else {
            Logger.warn(`⚠️  ${this.stats.errors} errors occurred during processing`);
        }
    }

    async processAllFiles() {
        this.stats.startTime = Date.now();

        Logger.info('🚀 Starting Daily KUF File Processing Task');
        Logger.info('=========================================');
        Logger.info(`📅 Started at: ${new Date().toISOString()}`);
        Logger.info(`📦 Processing KUF bucket: ${this.config.bucketName}`);
        Logger.info('');

        try {
            await this.getBucketFileCount();

            Logger.info('🔄 Starting KUF file processing...');
            Logger.info('');

            await this.processKufFiles();

            this.stats.endTime = Date.now();

            Logger.info('');
            Logger.success('✅ Daily KUF file processing completed successfully!');

        } catch (error) {
            this.stats.endTime = Date.now();
            Logger.error(`💥 Fatal error during processing: ${error.message}`);
            throw error;
        } finally {
            this.displaySummary();
        }
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async run() {
        try {
            await this.processAllFiles();
            Logger.info('🎯 Daily KUF file processor task completed successfully');
            process.exit(0);
        } catch (error) {
            Logger.error('💥 Daily KUF file processor task failed');
            process.exit(1);
        }
    }
}

module.exports = KufScript;

if (require.main === module) {
    const processor = new KufScript();
    processor.run();
}