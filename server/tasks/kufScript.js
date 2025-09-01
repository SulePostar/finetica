const Logger = require('../utils/logger');
const kufService = require('../services/kuf');
const { KufProcessingLog } = require('../models');

(async () => {
    try {
        const { processed } = await kufService.processUnprocessedFiles();
        const remaining = await KufProcessingLog.count({ where: { isProcessed: false } });

        if (processed === 0) {
            Logger.info('No unprocessed KUF files found.');
            process.exit(0);
        }
        Logger.success(`Processed ${processed} unprocessed KUF file${processed === 1 ? '' : 's'} successfully.`);
        Logger.info('Note: Non-invoice documents are marked as processed but not saved to database.');

        if (remaining > 0) {
            Logger.warn(`${remaining} KUF file${remaining === 1 ? '' : 's'} remain unprocessed.`);
        }
        process.exit(0);
    } catch (error) {
        Logger.error('Processing failed:', error);
        process.exit(1);
    }
})();