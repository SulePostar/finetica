const { processUnprocessedKifFiles } = require('../services/kif');
const { KifProcessingLog } = require('../models');
const Logger = require('../utils/logger');

(async () => {
    try {
        const { processed } = await processUnprocessedKifFiles();
        const remaining = await KifProcessingLog.count({ where: { isProcessed: false } });

        if (processed === 0) {
            Logger.info('No unprocessed KIF files found.');
            process.exit(0);
        }

        Logger.success(`Attempted processing of ${processed} KIF file${processed === 1 ? '' : 's'}.`);

        Logger.info('Note: Non-invoice documents are marked as processed but not saved to database.');

        if (remaining > 0) {
            Logger.warn(`${remaining} KIF file${remaining === 1 ? '' : 's'} remain unprocessed.`);
        } else {
            Logger.success('All KIF files have been processed.');
        }
        process.exit(0);

    } catch (error) {
        Logger.error('Processing failed:', error);
        process.exit(1);
    }
})();