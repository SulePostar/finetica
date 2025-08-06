/**
 * Main exports for Google Drive and Supabase sync modules
 * This file provides easy access to all sync-related services and utilities
 */

// Utilities
const Logger = require('../utils/loggerSync');
const FileUtils = require('../utils/fileUtils');

// Configuration
const ConfigManager = require('../config/configManagerSync');

// Services
const GoogleDriveService = require('../services/googleDriveService');
const SupabaseStorageService = require('../services/supabaseStorage');
const SyncOrchestrator = require('../services/driveToSupabaseSync');

module.exports = {
    // Utilities
    Logger,
    FileUtils,

    // Configuration
    ConfigManager,

    // Services
    GoogleDriveService,
    SupabaseStorageService,
    SyncOrchestrator
};
