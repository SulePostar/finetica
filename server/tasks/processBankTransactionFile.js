const { processBankTransaction, processUnprocessedFiles, getUnprocessedFiles, setFileInvalid } = require('../services/bankTransaction');
const { getFileSource } = require('../utils/fileFetcher');
const Logger = require('../utils/logger');

(async () => {
    try {
        const unprocessedFiles = await getUnprocessedFiles();
        Logger.info('Unprocessed files from DB: ' + JSON.stringify(unprocessedFiles));

        if (unprocessedFiles.length === 0) {
            Logger.info('No unprocessed files found.');
            process.exit(0);
        }

        for (const fileName of unprocessedFiles) {
            try {
                let category = 'transactions';
                Logger.info(`Processing file: ${fileName} (category: ${category})`);

                let buffer, mimeType;
                try {
                    ({ buffer, mimeType } = await getFileSource(category, fileName, 'supabase'));
                } catch (supabaseErr) {
                    throw new Error(`Failed to fetch file from supabase: ${supabaseErr.message}`);
                }

                await processBankTransaction(buffer, mimeType, fileName);
                await processUnprocessedFiles(fileName);

                Logger.success(`File ${fileName} processed successfully`);
            } catch (err) {
                // If not a valid bank transaction, set isValid to false
                Logger.error(`No file found: ${fileName}:`, err);
                await setFileInvalid(fileName);
            }
        }

        process.exit(0);
    } catch (error) {
        Logger.error('Error fetching unprocessed files:', error);
        process.exit(1);
    }
})();