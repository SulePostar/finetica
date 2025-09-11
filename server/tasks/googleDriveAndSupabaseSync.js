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

        // Parse service account key
        const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

        // Google Drive client using service account
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: serviceAccount.client_email,
                private_key: serviceAccount.private_key,
            },
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });

        const drive = google.drive({ version: 'v3', auth });

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

            // Parallelize file processing with concurrency limit
            const CONCURRENCY = 5;
            const fileChunks = [];
            for (let i = 0; i < files.length; i += CONCURRENCY) {
                fileChunks.push(files.slice(i, i + CONCURRENCY));
            }

            for (const chunk of fileChunks) {
                await Promise.all(chunk.map(async (file) => {
                    try {
                        // Map 'bank_transactions' category to 'transactions' bucket
                        const bucketName = category === 'bank_transactions' ? 'transactions' : category;
                        const supabasePath = file.name; // Upload to root of bucket

                        // Check if file already exists in Supabase
                        const { data: existingFiles, error: listError } = await supabase.storage.from(bucketName).list('', { search: file.name });
                        if (listError) {
                            Logger.error(`Failed to list files in Supabase: ${listError.message}`);
                            return;
                        }
                        const fileExists = existingFiles && existingFiles.some(f => f.name === file.name);
                        if (fileExists) {
                            Logger.info(`${file.name} already exists in Supabase, skipping upload.`);
                        } else {
                            // Download file from Google Drive to temp
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
                            const fileBuffer = fs.readFileSync(destPath);
                            const { error: uploadError } = await supabase.storage.from(bucketName).upload(supabasePath, fileBuffer, { upsert: false });
                            if (uploadError) {
                                Logger.error(`Failed to upload ${file.name} to Supabase: ${uploadError.message}`);
                                fs.unlinkSync(destPath);
                                return;
                            }
                            fs.unlinkSync(destPath);
                            Logger.success(`Uploaded ${file.name} to Supabase bucket ${bucketName}.`);
                        }

                        // Log to processing table (skip if already exists)
                        const Model = categoryModelMap[category];
                        if (Model) {
                            const logExists = await Model.findOne({ where: { filename: file.name } });
                            if (!logExists) {
                                await Model.create({
                                    filename: file.name,
                                    isProcessed: false,
                                    processedAt: null,
                                    errorMessage: null
                                });
                                Logger.success(`Logged ${file.name} to ${category} processing log.`);
                            } else {
                                Logger.info(`Log for ${file.name} already exists, skipping log insert.`);
                            }
                        } else {
                            Logger.error(`No model found for category '${category}'.`);
                        }
                    } catch (err) {
                        Logger.error(`Error processing file ${file.name}: ${err.message}`);
                    }
                }));
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
