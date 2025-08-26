const Logger = require('./logger');
const { Op } = require('sequelize');
class FileTracker {
    constructor(model, label = 'file') {
        if (!model) throw new Error("FileTracker requires a Sequelize model");
        this.model = model;
        this.label = label; // just for logging clarity
    }
    /**
     * Check which files are already processed
     */
    async getUnprocessedFiles(bucketFiles, forceReprocess = false) {
        try {
            Logger.info(`Checking for unprocessed ${this.label}s in tracking table...`);
            const fileNames = bucketFiles.map(file => file.name);
            // Get all tracked files for these names
            const allTrackedFiles = await this.model.findAll({
                where: { fileName: fileNames },
                attributes: ['fileName', 'id', 'processedAt', 'errorMessage', 'processed']
            });
            if (forceReprocess) {
                Logger.info('Force reprocess mode enabled - will include all tracked files');
                const trackedFileNames = new Set(allTrackedFiles.map(f => f.fileName));
                return {
                    unprocessedFiles: bucketFiles.filter(f => trackedFileNames.has(f.name)),
                    processedFiles: []
                };
            }
            // Split into processed / unprocessed
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
            const unprocessedFiles = bucketFiles.filter(f => unprocessedFileNames.has(f.name));
            Logger.info(`Found ${unprocessedFiles.length} unprocessed out of ${bucketFiles.length} bucket files`);
            return { unprocessedFiles, processedFiles };
        } catch (error) {
            Logger.error(`Error checking processed ${this.label}s: ${error.message}`);
            throw error;
        }
    }
    /**
     * Track file processing status
     */
    async trackFileProcessing(fileName, forceReprocess = false) {
        try {
            const record = await this.model.findOne({ where: { fileName } });
            if (!record) {
                Logger.warn(`${this.label} ${fileName} not found in tracking table, skipping...`);
                return { record: null, shouldSkip: true, reason: 'Not found in tracking table' };
            }
            if (record.processed && !forceReprocess) {
                Logger.warn(`${this.label} ${fileName} already marked as processed, skipping...`);
                return { record, shouldSkip: true, reason: 'Already processed' };
            }
            if (forceReprocess && record.processed) {
                Logger.info(`Force reprocessing ${this.label} ${fileName}...`);
                await record.update({ processed: false, processedAt: null, errorMessage: null });
            }
            return { record, shouldSkip: false };
        } catch (error) {
            Logger.error(`Error tracking ${this.label} ${fileName}: ${error.message}`);
            throw error;
        }
    }
    async markAsProcessed(record) {
        try {
            await record.update({ processed: true, processedAt: new Date(), errorMessage: null });
        } catch (error) {
            Logger.error(`Failed to mark ${this.label} as processed: ${error.message}`);
            throw error;
        }
    }
    async markAsFailed(record, errorMessage) {
        try {
            await record.update({ processed: false, errorMessage, processedAt: new Date() });
        } catch (error) {
            Logger.error(`Failed to mark ${this.label} as failed: ${error.message}`);
        }
    }
    async resetAllProcessing() {
        try {
            Logger.info(`Resetting processing status for all ${this.label}s...`);
            const [resetCount] = await this.model.update(
                { processed: false, processedAt: null, errorMessage: null },
                { where: {} }
            );
            Logger.success(`Reset ${resetCount} ${this.label} records`);
            return { success: true, resetCount, message: `Reset ${resetCount} ${this.label} records` };
        } catch (error) {
            Logger.error(`Error resetting ${this.label}s: ${error.message}`);
            throw error;
        }
    }
    async getProcessingStatus() {
        try {
            const [totalFiles, processedFiles, failedFiles] = await Promise.all([
                this.model.count(),
                this.model.count({ where: { processed: true } }),
                this.model.count({ where: { processed: false, errorMessage: { [Op.ne]: null } } })
            ]);
            return {
                totalFiles,
                processedFiles,
                failedFiles,
                unprocessedFiles: totalFiles - processedFiles - failedFiles
            };
        } catch (error) {
            Logger.error(`Error getting ${this.label} status: ${error.message}`);
            throw error;
        }
    }
    async healthCheck() {
        try {
            await this.model.findOne({ limit: 1 });
            return true;
        } catch (error) {
            Logger.warn(`Database check failed for ${this.label}: ${error.message}`);
            return false;
        }
    }
}
module.exports = FileTracker;