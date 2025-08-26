const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const Logger = require('../logger');
const FileUtils = require('../fileUtils');

/**
 * Supabase Storage service class for handling file storage operations
 */
class SupabaseStorageService {
    constructor(config) {
        this.config = config;
        this.supabase = createClient(config.supabase.url, config.supabase.serviceKey);
    }

    /**
     * Get all files from a Supabase storage bucket
     */
    async getSupabaseFiles(bucketName, limit = 1000) {
        try {
            const { data, error } = await this.supabase.storage
                .from(bucketName)
                .list('', { limit });

            if (error) {
                Logger.error(`Error fetching files from Supabase bucket ${bucketName}: ${error.message}`);
                return [];
            }
            return data || [];
        } catch (error) {
            Logger.error(`Error accessing Supabase bucket ${bucketName}: ${error.message}`);
            return [];
        }
    }

    /**
     * Upload a file to Supabase storage
     */
    async uploadToSupabase(filePath, fileName, bucketName, options = {}) {
        const fileSizeMB = FileUtils.getFileSizeMB(filePath);

        // Check file size limit
        const sizeLimit = options.sizeLimitMB || this.config.sync?.fileSizeLimitMB || 50;
        if (FileUtils.exceedsSizeLimit(filePath, sizeLimit)) {
            throw new Error(`File ${fileName} (${fileSizeMB}MB) exceeds ${sizeLimit}MB limit`);
        }

        Logger.info(`📤 Uploading ${fileName} (${fileSizeMB}MB)...`);

        const fileBuffer = fs.readFileSync(filePath);
        const uploadOptions = {
            upsert: true,
            contentType: FileUtils.getContentType(fileName),
            ...options
        };

        const { data, error } = await this.supabase.storage
            .from(bucketName)
            .upload(fileName, fileBuffer, uploadOptions);

        if (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }

        Logger.success(`Uploaded ${fileName} to ${bucketName} (${fileSizeMB}MB)`);
        return data;
    }
}

module.exports = SupabaseStorageService;
