const fs = require('fs');
const path = require('path');
const { processBankTransaction, processUnprocessedFiles, getUnprocessedFiles } = require('../services/bankTransaction');
const mime = require('mime');

const MODEL_NAME = 'gemini-2.5-flash-lite';
const folderPath = "./googleDriveDownloads/";
const model = process.argv[2] || MODEL_NAME;
const Logger = require('../utils/logger');

(async () => {
    try {
        const allFiles = fs.readdirSync(folderPath); // all files in folder
        const unprocessedFiles = await getUnprocessedFiles();
        Logger.info('Unprocessed files from DB: ' + JSON.stringify(unprocessedFiles));

        // Filter folder files to only unprocessed ones
        const filesToProcess = allFiles.filter(f => unprocessedFiles.includes(f));

        if (filesToProcess.length === 0) {
            Logger.info('No unprocessed files found.');
            process.exit(0);
        }

        for (const file of filesToProcess) {
            const filePath = path.join(folderPath, file);
            const buffer = fs.readFileSync(filePath);
            const mimeType = mime.getType(filePath) || 'application/pdf';
            const fileName = path.basename(filePath);

            Logger.info(`Processing file: ${fileName}`);

            try {
                await processBankTransaction(buffer, mimeType, fileName, model);
                await processUnprocessedFiles(fileName);
                Logger.info(`File ${fileName} processed successfully`);
            } catch (err) {
                Logger.error(`Failed to process file ${fileName}:`, err);
            }
        }

        process.exit(0);
    } catch (error) {
        Logger.error('Error reading folder or processing files:', error);
        process.exit(1);
    }
})();
