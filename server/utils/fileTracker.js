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
            Logger.info('Checking for unprocessed files in kif_processed_files table...');

            const fileNames = bucketFiles.map(file => file.name);

            if (forceReprocess) {
                Logger.info('Force reprocess mode enabled - will include all files found in tracking table');

                // In force mode, get all files from tracking table regardless of processed status
                const allTrackedFiles = await KifProcessedFile.findAll({
                    where: { fileName: fileNames },
                    attributes: ['fileName', 'id', 'processedAt', 'errorMessage', 'processed']
                });

                const trackedFileNames = new Set(allTrackedFiles.map(file => file.fileName));

                // Only include bucket files that exist in tracking table
                const trackedBucketFiles = bucketFiles.filter(file =>
                    trackedFileNames.has(file.name)
                );

                return {
                    unprocessedFiles: trackedBucketFiles,
                    processedFiles: []
                };
            }

            // Single query to get all tracked files with their status
            const allTrackedFiles = await KifProcessedFile.findAll({
                where: { fileName: fileNames },
                attributes: ['fileName', 'id', 'processedAt', 'errorMessage', 'processed']
            });

            // Separate files by processing status
            const processedFiles = [];
            const unprocessedFileNames = new Set();

            allTrackedFiles.forEach(file => {
                if (file.processed) {
                    processedFiles.push({
                        fileName: file.fileName,
                        id: file.id,
                        processedAt: file.processedAt,
                        errorMessage: file.errorMessage
                    });
                } else {
                    unprocessedFileNames.add(file.fileName);
                }
            });

            // Filter bucket files to only include unprocessed ones
            const unprocessedFiles = bucketFiles.filter(file =>
                unprocessedFileNames.has(file.name)
            );

            Logger.info(`Found ${unprocessedFiles.length} unprocessed files out of ${bucketFiles.length} bucket files (${allTrackedFiles.length} in tracking table)`);

            return { unprocessedFiles, processedFiles };

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
            // Find existing KIF processed file record (don't create new ones)
            const record = await KifProcessedFile.findOne({
                where: { fileName }
            });

            // If no record exists, skip this file (someone else should have created it)
            if (!record) {
                Logger.warn(`File ${fileName} not found in kif_processed_files table, skipping...`);
                return {
                    record: null,
                    shouldSkip: true,
                    reason: 'Not found in tracking table'
                };
            }

            // If already processed and not forcing reprocess, skip
            if (record.processed && !forceReprocess) {
                Logger.warn(`File ${fileName} already marked as processed, skipping...`);
                return {
                    record,
                    shouldSkip: true,
                    reason: 'Already processed'
                };
            }

            // If forcing reprocess on already processed file
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
            const { Op } = require('sequelize');

            const [totalFiles, processedFiles, failedFiles] = await Promise.all([
                KifProcessedFile.count(),
                KifProcessedFile.count({ where: { processed: true } }),
                KifProcessedFile.count({
                    where: {
                        processed: false,
                        errorMessage: { [Op.ne]: null }
                    }
                })
            ]);

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
