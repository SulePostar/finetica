const path = require('path');
const dotenv = require('dotenv');
const Logger = require('../utils/logger');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Configuration manager for validating and managing environment variables
 */
class ConfigManager {
    constructor() {
        this.validateRequiredEnvVars();
        this.config = this.buildConfig();
    }

    validateRequiredEnvVars() {
        const requiredVars = [
            'GOOGLE_REFRESH_TOKEN',
            'SUPABASE_URL',
            'SUPABASE_SERVICE_ROLE_KEY',
            'CLIENT_ID',
            'CLIENT_SECRET'
        ];

        const missingVars = requiredVars.filter(varName => !process.env[varName]);

        if (missingVars.length > 0) {
            Logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
            process.exit(1);
        }
    }

    buildConfig() {
        return {
            supabase: {
                url: process.env.SUPABASE_URL,
                serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
            },
            google: {
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                apiKey: process.env.API_KEY,
                redirectUri: process.env.REDIRECT_URI,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN
            },
            folders: {
                kif: process.env.GOOGLE_DRIVE_KIF_FOLDER_ID,
                kuf: process.env.GOOGLE_DRIVE_KUF_FOLDER_ID,
                bank_transactions: process.env.GOOGLE_DRIVE_TRANSACTIONS_FOLDER_ID,
                contracts: process.env.GOOGLE_DRIVE_CONTRACTS_FOLDER_ID
            },
            sync: {
                batchSize: parseInt(process.env.SYNC_BATCH_SIZE) || 5,
                retryAttempts: parseInt(process.env.RETRY_ATTEMPTS) || 3,
                fileSizeLimitMB: parseInt(process.env.FILE_SIZE_LIMIT_MB) || 50,
                tableMappings: {
                    kif: 'kif_processing_logs',
                    kuf: 'KufLog',
                    bank_transactions: 'bank_transaction_processing_logs'
                }
            }
        };
    }

    validateConfig() {
        if (!this.config.supabase.url || !this.config.supabase.serviceKey) {
            throw new Error('Missing Supabase configuration');
        }

        if (!this.config.google.clientId || !this.config.google.clientSecret) {
            throw new Error('Missing Google Drive configuration');
        }

        return true;
    }

    getConfig() {
        return this.config;
    }

    /**
     * Get configuration for a specific service
     */
    getServiceConfig(serviceName) {
        return this.config[serviceName] || null;
    }

    /**
     * Check if a folder is configured for sync
     */
    isFolderConfigured(folderName) {
        return Boolean(this.config.folders[folderName]);
    }

    /**
     * Get all configured folder mappings
     */
    getConfiguredFolders() {
        return Object.entries(this.config.folders)
            .filter(([_, folderId]) => Boolean(folderId))
            .map(([name, folderId]) => ({ name, folderId, bucketName: name }));
    }
}

module.exports = ConfigManager;
