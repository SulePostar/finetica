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

    /**
     * Check if a file exists in Supabase bucket
     */
    async fileExists(bucketName, fileName) {
        try {
            const { data, error } = await this.supabase.storage
                .from(bucketName)
                .list('', {
                    limit: 1,
                    search: fileName
                });

            if (error) return false;
            return data.some(file => file.name === fileName);
        } catch (error) {
            Logger.error(`Error checking file existence in ${bucketName}: ${error.message}`);
            return false;
        }
    }

    /**
     * Delete a file from Supabase bucket
     */
    async deleteFile(bucketName, fileName) {
        try {
            const { error } = await this.supabase.storage
                .from(bucketName)
                .remove([fileName]);

            if (error) {
                throw new Error(`Delete failed: ${error.message}`);
            }

            Logger.success(`Deleted ${fileName} from ${bucketName}`);
            return true;
        } catch (error) {
            Logger.error(`Error deleting file ${fileName}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get file URL from Supabase bucket
     */
    async getFileUrl(bucketName, fileName, expiresIn = 3600) {
        try {
            const { data, error } = await this.supabase.storage
                .from(bucketName)
                .createSignedUrl(fileName, expiresIn);

            if (error) {
                throw new Error(`URL generation failed: ${error.message}`);
            }

            return data.signedUrl;
        } catch (error) {
            Logger.error(`Error generating URL for ${fileName}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Create a bucket if it doesn't exist
     */
    async createBucketIfNotExists(bucketName, options = {}) {
        try {
            const { data, error } = await this.supabase.storage.createBucket(bucketName, {
                public: false,
                ...options
            });

            if (error && !error.message.includes('already exists')) {
                throw error;
            }

            Logger.info(`Bucket ${bucketName} is ready`);
            return true;
        } catch (error) {
            Logger.error(`Error creating bucket ${bucketName}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get bucket info
     */
    async getBucketInfo(bucketName) {
        try {
            const { data, error } = await this.supabase.storage.getBucket(bucketName);

            if (error) {
                throw new Error(`Bucket info failed: ${error.message}`);
            }

            return data;
        } catch (error) {
            Logger.error(`Error getting bucket info for ${bucketName}: ${error.message}`);
            throw error;
        }
    }

    async getFile(bucketName, filePath) {
        try {
            const { data, error } = await this.supabase.storage
                .from(bucketName)
                .download(filePath);

            if (error) {
                throw new Error(`File download failed: ${error.message}`);
            }

            const buffer = await data.arrayBuffer();
            return {
                buffer,
                mimeType: data.type,
            }
        } catch (error) {
            Logger.error(`Error getting file ${filePath} from ${bucketName}: ${error.message}`);
            throw error;
        }
    }
}

module.exports = SupabaseStorageService;
