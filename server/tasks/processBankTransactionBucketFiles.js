const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Logger = require('../utils/logger');
const BankTransactionProcessor = require('../utils/bankTransactionProcessor');
const FileTracker = require('../utils/fileTracker');
const CliHelpers = require('../utils/cliHelpers');
const { BANK_TRANSACTION_PROCESSING, EXIT_CODES } = require('../utils/constants');
const { BankTransactionProcessedFile } = require('../models');
const ProcessBucketFilesCLI = require('./processBucketFiles');

class BankTransactionBucketProcessingCLI extends ProcessBucketFilesCLI {
    constructor() {
        const fileTrackerInstance = new FileTracker(BankTransactionProcessedFile, 'bank transaction file');
        super({
            processorClass: BankTransactionProcessor,
            processorName: 'Bank Transaction',
            fileTracker: fileTrackerInstance,
            config: {
                supabaseUrl: process.env.SUPABASE_URL,
                supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
                bucketName: BANK_TRANSACTION_PROCESSING.BUCKET_NAME,
                aiModel: BANK_TRANSACTION_PROCESSING.AI_MODEL,
                processingDelay: BANK_TRANSACTION_PROCESSING.PROCESSING_DELAY
            },
            constants: { ...BANK_TRANSACTION_PROCESSING, EXIT_CODES },
            logger: Logger,
            cliHelpers: CliHelpers
        });
        this.validateConfig();
    }
}

module.exports = BankTransactionBucketProcessingCLI;

if (require.main === module) {
    const cli = new BankTransactionBucketProcessingCLI();
    cli.run();
}
