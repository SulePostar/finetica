const fs = require('fs');
const path = require('path');
const { processDocument, createBankTransactionFromAI, processUnprocessedFiles } = require('./services/bankTransaction');
const bankTransactionSchema = require('../schemas/bankTransactionSchema');
const BANK_TRANSACTIONS_PROMPT = require('../prompts/bankTransactionsPrompt');
const AppError = require('./utils/errorHandler');

const MODEL_NAME = 'gemini-2.5-flash-lite';
const filePath = process.argv[2]; // pass file path as command line arg
const model = process.argv[3] || MODEL_NAME;

(async () => {
    try {
        const buffer = fs.readFileSync(path.resolve(filePath));
        const mimeType = 'application/octet-stream'; // or set proper MIME if known
        const fileName = path.basename(filePath);

        console.log(`Processing file: ${fileName} with model: ${model}`);

        const extractedData = await processDocument(buffer, mimeType, bankTransactionSchema, model, BANK_TRANSACTIONS_PROMPT);
        const bankTransaction = await createBankTransactionFromAI(extractedData);

        console.log('Bank transaction created:', bankTransaction);

        await processUnprocessedFiles(fileName);

        console.log(`File ${fileName} processed successfully`);
        process.exit(0);
    } catch (error) {
        console.error('Failed to process bank transaction file:', error);
        process.exit(1);
    }
})();
