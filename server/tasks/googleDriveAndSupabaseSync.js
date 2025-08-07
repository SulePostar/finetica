const path = require('path');
const dotenv = require('dotenv');

// Import modular services
const Logger = require('../utils/loggerSync');
const ConfigManager = require('../config/configManagerSync');
const SyncOrchestrator = require('../services/driveToSupabaseSync');
const FileUtils = require('../utils/fileUtils');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

(async function googleDriveSync() {
    const startTime = Date.now();
    Logger.info('Starting Google Drive to Supabase sync...');

    try {
        // Initialize configuration
        const configManager = new ConfigManager();
        configManager.validateConfig();
        const config = configManager.getConfig();

        // Initialize and run sync orchestrator
        const syncOrchestrator = new SyncOrchestrator(config);
        await syncOrchestrator.performSync();

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        Logger.success(`Sync completed in ${duration} seconds`);

        // Cleanup
        syncOrchestrator.cleanup();
    } catch (error) {
        Logger.error(`Sync failed: ${error.message}`);
        process.exit(1);
    } finally {
        // Final cleanup
        const tempDir = path.join(__dirname, 'temp');
        FileUtils.cleanupTempDir(tempDir);
        Logger.debug('Cleaned up temporary files');
    }
})();
