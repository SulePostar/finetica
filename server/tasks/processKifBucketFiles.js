const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });


const Logger = require('../utils/logger');
const KifProcessor = require('../utils/kifProcessor');
const FileTracker = require('../utils/fileTracker');
const CliHelpers = require('../utils/cliHelpers');
const { KIF_PROCESSING, EXIT_CODES } = require('../utils/constants');
const { KifProcessedFile } = require('../models');
const ProcessBucketFilesCLI = require('./processBucketFiles');

class KifBucketProcessingCLI extends ProcessBucketFilesCLI {
    constructor() {
        const fileTrackerInstance = new FileTracker(KifProcessedFile, 'kif file');
        super({
            processorClass: KifProcessor,
            processorName: 'KIF',
            fileTracker: fileTrackerInstance,
            config: {
                supabaseUrl: process.env.SUPABASE_URL,
                supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
                bucketName: KIF_PROCESSING.BUCKET_NAME,
                aiModel: KIF_PROCESSING.AI_MODEL,
                processingDelay: KIF_PROCESSING.PROCESSING_DELAY
            },
            constants: { ...KIF_PROCESSING, EXIT_CODES },
            logger: Logger,
            cliHelpers: CliHelpers
        });
        this.validateConfig();
    }
}

module.exports = KifBucketProcessingCLI;

if (require.main === module) {
    const cli = new KifBucketProcessingCLI();
    cli.run();
}
