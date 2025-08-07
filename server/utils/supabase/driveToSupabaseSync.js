const fs = require('fs');
const Logger = require('../loggerSync');
const FileUtils = require('../fileUtils');
const GoogleDriveService = require('../../services/googleDriveService');
const SupabaseStorageService = require('./supabaseStorage');

/**
 * Sync orchestrator class for managing the synchronization process
 */
class SyncOrchestrator {
    constructor(config) {
        this.config = config;
        this.googleDriveService = new GoogleDriveService(config);
        this.supabaseService = new SupabaseStorageService(config);
        this.BATCH_SIZE = config.sync?.batchSize || 5;
    }

    /**
     * Sync a specific folder from Google Drive to Supabase
     */
    async syncFolder(folderId, bucketName, folderName) {
        Logger.info(`\n📁 Syncing ${folderName}...`);

        const driveFiles = await this.googleDriveService.getDriveFiles(folderId);
        const supabaseFiles = await this.supabaseService.getSupabaseFiles(bucketName);

        const { toUpload } = this.identifyFilesToSync(driveFiles, supabaseFiles);
        Logger.info(`📊 Found ${toUpload.length} files to upload in ${folderName}`);

        if (toUpload.length === 0) {
            Logger.info(`✅ ${folderName} is already in sync`);
            return { uploaded: 0, failed: 0, total: 0 };
        }

        return await this.processBatchUploads(toUpload, bucketName);
    }

    /**
     * Identify files that need to be synced
     */
    identifyFilesToSync(driveFiles, supabaseFiles) {
        const driveMap = new Map();
        const supaMap = new Map();

        // Map Google Drive files (handle Google Apps files)
        driveFiles.forEach(file => {
            let name = file.name;
            if (file.mimeType.startsWith('application/vnd.google-apps.')) {
                name += FileUtils.getExtensionForGoogleAppsFile(file.mimeType);
            }
            driveMap.set(name, file);
        });

        // Map Supabase files
        supabaseFiles.forEach(file => {
            supaMap.set(file.name, file);
        });

        // Find files to upload
        const toUpload = [];
        for (const [name, file] of driveMap) {
            if (!supaMap.has(name)) {
                toUpload.push({ name, file });
            }
        }

        return { toUpload, driveMap, supaMap };
    }

    /**
     * Process file uploads in batches
     */
    async processBatchUploads(toUpload, bucketName) {
        let uploaded = 0;
        let failed = 0;
        const failedFiles = [];

        // Process files in batches to avoid memory issues
        for (let i = 0; i < toUpload.length; i += this.BATCH_SIZE) {
            const batch = toUpload.slice(i, i + this.BATCH_SIZE);
            Logger.info(`📦 Processing batch ${Math.floor(i / this.BATCH_SIZE) + 1}/${Math.ceil(toUpload.length / this.BATCH_SIZE)}`);

            // Process batch in parallel
            const uploadPromises = batch.map(async ({ name, file }) => {
                try {
                    const tempPath = await this.googleDriveService.downloadDriveFile(
                        file.id,
                        name,
                        file.mimeType,
                        this.config.sync?.retryAttempts || 3
                    );

                    await this.supabaseService.uploadToSupabase(tempPath, name, bucketName);

                    // Clean up temp file immediately
                    if (fs.existsSync(tempPath)) {
                        fs.unlinkSync(tempPath);
                    }

                    uploaded++;
                    Logger.info(`📤 [${uploaded}/${toUpload.length}] Uploaded: ${name}`);
                    return { success: true, name };
                } catch (err) {
                    failed++;
                    failedFiles.push({ name, error: err.message });
                    Logger.error(`Failed to upload ${name}: ${err.message}`);
                    return { success: false, name, error: err.message };
                }
            });

            await Promise.allSettled(uploadPromises);
        }

        return { uploaded, failed, total: toUpload.length, failedFiles };
    }

    /**
     * Perform synchronization for all configured folders
     */
    async performSync() {
        const results = {};

        // Get configured folders dynamically
        const configuredFolders = [
            { name: 'kif', folderId: this.config.folders.kif, bucketName: 'kif' },
            { name: 'kuf', folderId: this.config.folders.kuf, bucketName: 'kuf' },
            { name: 'transactions', folderId: this.config.folders.transactions, bucketName: 'transactions' }
        ].filter(folder => folder.folderId);

        if (configuredFolders.length === 0) {
            Logger.warn('No folders configured for sync');
            return {};
        }

        // Sync each configured folder
        for (const { name, folderId, bucketName } of configuredFolders) {
            try {
                results[name] = await this.syncFolder(folderId, bucketName, name.toUpperCase());
            } catch (error) {
                Logger.error(`Failed to sync ${name}: ${error.message}`);
                results[name] = { uploaded: 0, failed: 1, total: 1, error: error.message };
            }
        }

        this.generateSyncReport(results);
        return results;
    }

    /**
     * Generate a comprehensive sync report
     */
    generateSyncReport(results) {
        Logger.info('\n📋 Sync Summary:\n================');
        let totalUploaded = 0;
        let totalFailed = 0;
        let totalFiles = 0;

        for (const [folder, res] of Object.entries(results)) {
            const status = res.error ? `❌ Error: ${res.error}` :
                res.failed > 0 ? `, ${res.failed} failed` : '';

            Logger.info(`📁 ${folder.toUpperCase()}: ${res.uploaded}/${res.total} uploaded${status}`);

            // Show failed files if any
            if (res.failedFiles && res.failedFiles.length > 0) {
                res.failedFiles.forEach(({ name, error }) => {
                    Logger.warn(`  ⚠️  ${name}: ${error}`);
                });
            }

            totalUploaded += res.uploaded;
            totalFailed += res.failed;
            totalFiles += res.total;
        }

        Logger.info(`\n🎯 Overall: ${totalUploaded}/${totalFiles} files synced successfully`);

        if (totalFailed > 0) {
            Logger.warn(`${totalFailed} files failed to sync`);
        }

        const successRate = totalFiles > 0 ? ((totalUploaded / totalFiles) * 100).toFixed(1) : 100;
        Logger.info(`📊 Success rate: ${successRate}%`);

        if (totalUploaded > 0) {
            Logger.success(`Sync completed! ${totalUploaded} new files added to Supabase storage.`);
        } else if (totalFiles === 0) {
            Logger.info(`All files are already in sync. No new uploads needed.`);
        }
    }

    /**
     * Sync a single file by name from a specific folder
     */
    async syncSingleFile(fileName, folderId, bucketName) {
        try {
            const driveFiles = await this.googleDriveService.getDriveFiles(folderId);
            const targetFile = driveFiles.find(file => file.name === fileName);

            if (!targetFile) {
                throw new Error(`File ${fileName} not found in Google Drive folder`);
            }

            const tempPath = await this.googleDriveService.downloadDriveFile(
                targetFile.id,
                fileName,
                targetFile.mimeType
            );

            await this.supabaseService.uploadToSupabase(tempPath, fileName, bucketName);

            // Clean up
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }

            Logger.success(`Successfully synced ${fileName}`);
            return true;
        } catch (error) {
            Logger.error(`Failed to sync ${fileName}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Clean up resources
     */
    cleanup() {
        this.googleDriveService.cleanup();
        Logger.debug('Cleanup completed');
    }
}

module.exports = SyncOrchestrator;
