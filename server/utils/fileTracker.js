const Logger = require('./logger');
const { KifProcessedFile } = require('../models');

/**
 * File tracking and status management utilities
 */
class FileTracker {

    /**
     * Check which files are already processed
     */
    static async getUnprocessedFiles(bucketFiles, forceReprocess = false) {
        try {
            Logger.info('Checking for already processed files...');

            const fileNames = bucketFiles.map(file => file.name);

            if (forceReprocess) {
                Logger.info('Force reprocess mode enabled - all files will be processed');
                return {
                    unprocessedFiles: bucketFiles,
                    processedFiles: []
                };
            }

            // Use the KifProcessedFile model to find processed files
            const processedFiles = await KifProcessedFile.findAll({
                where: {
                    fileName: fileNames,
                    processed: true
                },
                attributes: ['fileName', 'id', 'processedAt', 'errorMessage']
            });

            const processedFileNames = new Set(processedFiles.map(file => file.fileName));

            // Filter out already processed files
            const unprocessedFiles = bucketFiles.filter(file =>
                !processedFileNames.has(file.name)
            );

            Logger.info(`Found ${unprocessedFiles.length} unprocessed files out of ${bucketFiles.length} total files`);
            return {
                unprocessedFiles,
                processedFiles: processedFiles.map(f => ({
                    fileName: f.fileName,
                    id: f.id,
                    processedAt: f.processedAt,
                    errorMessage: f.errorMessage
                }))
            };

        } catch (error) {
            Logger.error(`Error checking processed files: ${error.message}`);
            throw error;
        }
    }

    /**
     * Track file processing status
     */
    static async trackFileProcessing(fileName, forceReprocess = false) {
        try {
            // Create or find the KIF processed file record
            const [record, created] = await KifProcessedFile.findOrCreate({
                where: { fileName },
                defaults: {
                    fileName,
                    processed: false
                }
            });

            if (!created && record.processed && !forceReprocess) {
                Logger.warn(`File ${fileName} already marked as processed, skipping...`);
                return {
                    record,
                    shouldSkip: true,
                    reason: 'Already processed'
                };
            }

            if (forceReprocess && record.processed) {
                Logger.info(`Force reprocessing ${fileName}...`);
                await record.resetProcessing();
            }

            return {
                record,
                shouldSkip: false
            };

        } catch (error) {
            Logger.error(`Error tracking file ${fileName}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Mark file as successfully processed
     */
    static async markAsProcessed(record) {
        try {
            await record.markAsProcessed();
        } catch (error) {
            Logger.error(`Failed to mark file as processed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Mark file as failed
     */
    static async markAsFailed(record, errorMessage) {
        try {
            await record.markAsFailed(errorMessage);
        } catch (error) {
            Logger.error(`Failed to mark file as failed: ${error.message}`);
        }
    }

    /**
     * Reset all processing status
     */
    static async resetAllProcessing() {
        try {
            Logger.info('Resetting processing status for all KIF files...');

            const result = await KifProcessedFile.update(
                {
                    processed: false,
                    processedAt: null,
                    errorMessage: null
                },
                {
                    where: {},
                    returning: true
                }
            );

            const resetCount = Array.isArray(result) ? result[0] : result;
            Logger.success(`Reset processing status for ${resetCount} files`);

            return {
                success: true,
                resetCount: resetCount,
                message: `Processing status reset for ${resetCount} files`
            };

        } catch (error) {
            Logger.error(`Error resetting processing status: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get processing status summary
     */
    static async getProcessingStatus() {
        try {
            const totalFiles = await KifProcessedFile.count();
            const processedFiles = await KifProcessedFile.count({ where: { processed: true } });
            const failedFiles = await KifProcessedFile.count({
                where: {
                    processed: false,
                    errorMessage: { [require('sequelize').Op.ne]: null }
                }
            });

            return {
                totalFiles,
                processedFiles,
                failedFiles,
                unprocessedFiles: totalFiles - processedFiles - failedFiles
            };

        } catch (error) {
            Logger.error(`Error getting processing status: ${error.message}`);
            throw error;
        }
    }

    /**
     * Database health check
     */
    static async healthCheck() {
        try {
            await KifProcessedFile.findOne({ limit: 1 });
            return true;
        } catch (error) {
            Logger.warn(`Database connection check failed: ${error.message}`);
            return false;
        }
    }
}

module.exports = FileTracker;
