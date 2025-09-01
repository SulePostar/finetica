
const path = require('path');
const dotenv = require('dotenv');
const Logger = require('../utils/logger');
const ConfigManager = require('../config/configManagerSync');
const { KifProcessingLog, KufProcessingLog, BankTransactionProcessingLog, ContractProcessingLog } = require('../models');
const { google } = require('googleapis');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const categoryModelMap = {
    kif: KifProcessingLog,
    kuf: KufProcessingLog,
    bank_transactions: BankTransactionProcessingLog,
    contracts: ContractProcessingLog
};

(async function googleDriveSync() {
    const startTime = Date.now();
    Logger.info('Starting Google Drive to Supabase sync...');

    try {
        // Initialize configuration
        const configManager = new ConfigManager();
        configManager.validateConfig();
        const config = configManager.getConfig();

        // Supabase client
        const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

        // Google Drive client
        const oAuth2Client = new google.auth.OAuth2(
            config.google.clientId,
            config.google.clientSecret,
            config.google.redirectUri
        );
        oAuth2Client.setCredentials({ refresh_token: config.google.refreshToken });
        const drive = google.drive({ version: 'v3', auth: oAuth2Client });

        // Map folderId to category
        const folderIdToCategory = Object.entries(config.folders).reduce((acc, [category, folderId]) => {
            if (folderId) acc[folderId] = category;
            return acc;
        }, {});

        // List files in each configured folder
        for (const [category, folderId] of Object.entries(config.folders)) {
            if (!folderId) continue;
            Logger.info(`Syncing files for category '${category}' from Google Drive folder ${folderId}`);
            const res = await drive.files.list({
                q: `'${folderId}' in parents and trashed = false`,
                fields: 'files(id, name, mimeType, parents)'
            });
            const files = res.data.files;
            if (!files || files.length === 0) {
                Logger.info(`No files found in folder for category '${category}'.`);
                continue;
            }
            for (const file of files) {
                try {
                    // Download file from Google Drive
                    const destDir = path.join(__dirname, 'temp', category);
                    fs.mkdirSync(destDir, { recursive: true });
                    const destPath = path.join(destDir, file.name);
                    const dest = fs.createWriteStream(destPath);
                    await new Promise((resolve, reject) => {
                        drive.files.get({ fileId: file.id, alt: 'media' }, { responseType: 'stream' }, (err, res) => {
                            if (err) return reject(err);
                            res.data
                                .on('end', resolve)
                                .on('error', reject)
                                .pipe(dest);
                        });
                    });

                    // Upload to Supabase
                    // Map 'bank_transactions' category to 'transactions' bucket
                    const bucketName = category === 'bank_transactions' ? 'transactions' : category;
                    const supabasePath = `${category}/${file.name}`;
                    const fileBuffer = fs.readFileSync(destPath);
                    const { error: uploadError } = await supabase.storage.from(bucketName).upload(supabasePath, fileBuffer, { upsert: true });
                    if (uploadError) {
                        Logger.error(`Failed to upload ${file.name} to Supabase: ${uploadError.message}`);
                        continue;
                    }

                    // Log to processing table
                    const Model = categoryModelMap[category];
                    if (Model) {
                        await Model.create({
                            fileName: file.name,
                            isProcessed: false,
                            processedAt: null,
                            errorMessage: null
                        });
                        Logger.success(`Logged ${file.name} to ${category} processing log.`);
                    } else {
                        Logger.error(`No model found for category '${category}'.`);
                    }

                    // Cleanup temp file
                    fs.unlinkSync(destPath);
                } catch (err) {
                    Logger.error(`Error processing file ${file.name}: ${err.message}`);
                }
            }
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        Logger.success(`Sync completed in ${duration} seconds`);
    } catch (error) {
        Logger.error(`Sync failed: ${error.message}`);
        process.exit(1);
    } finally {
        // Final cleanup
        const tempDir = path.join(__dirname, 'temp');
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
        Logger.debug('Cleaned up temporary files');
    }
})();
