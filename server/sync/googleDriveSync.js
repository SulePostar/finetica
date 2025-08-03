const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Simple logger with timestamps
const log = {
    info: (msg) => console.log(`[${new Date().toISOString()}] ℹ️  ${msg}`),
    success: (msg) => console.log(`[${new Date().toISOString()}] ✅ ${msg}`),
    warn: (msg) => console.log(`[${new Date().toISOString()}] ⚠️  ${msg}`),
    error: (msg) => console.log(`[${new Date().toISOString()}] ❌ ${msg}`),
    debug: (msg) => process.env.DEBUG && console.log(`[${new Date().toISOString()}] 🐛 ${msg}`)
};

// Validate refresh token
if (!process.env.GOOGLE_REFRESH_TOKEN) {
    log.error('Missing GOOGLE_REFRESH_TOKEN in .env file');
    process.exit(1);
}

(async function googleDriveSync() {
    const startTime = Date.now();
    log.info('Starting Google Drive to Supabase sync...');

    const config = {
        supabase: {
            url: process.env.VITE_SUPABASE_URL,
            serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for backend operations
        },
        google: {
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            apiKey: process.env.API_KEY,
            redirectUri: process.env.REDIRECT_URI
        },
        folders: {
            kif: process.env.GOOGLE_DRIVE_KIF_FOLDER_ID,
            kuf: process.env.GOOGLE_DRIVE_KUF_FOLDER_ID,
            transactions: process.env.GOOGLE_DRIVE_TRANSACTIONS_FOLDER_ID
        }
    };

    if (!config.supabase.url || !config.supabase.serviceKey) {
        console.error('❌ Missing Supabase configuration');
        process.exit(1);
    }

    if (!config.google.clientId || !config.google.clientSecret) {
        console.error('❌ Missing Google Drive configuration');
        process.exit(1);
    }

    const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

    const oauth2Client = new google.auth.OAuth2(
        config.google.clientId,
        config.google.clientSecret,
        config.google.redirectUri
    );
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    async function getDriveFiles(folderId) {
        try {
            const response = await drive.files.list({
                q: `'${folderId}' in parents and trashed=false`,
                fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink)',
                pageSize: 1000
            });
            return response.data.files || [];
        } catch (error) {
            console.error(`❌ Error fetching files from Drive folder ${folderId}:`, error.message);
            return [];
        }
    }

    async function getSupabaseFiles(bucketName) {
        try {
            const { data, error } = await supabase.storage.from(bucketName).list('', { limit: 1000 });
            if (error) {
                console.error(`❌ Error fetching files from Supabase bucket ${bucketName}:`, error);
                return [];
            }
            return data || [];
        } catch (error) {
            console.error(`❌ Error accessing Supabase bucket ${bucketName}:`, error.message);
            return [];
        }
    }

    async function downloadDriveFile(fileId, fileName, mimeType, retries = 3) {
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        const tempPath = path.join(tempDir, fileName);

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                if (mimeType.startsWith('application/vnd.google-apps.')) {
                    const exportFormat = getExportFormat(mimeType);
                    const response = await drive.files.export({ fileId, mimeType: exportFormat }, { responseType: 'stream' });
                    return await streamToFile(response.data, tempPath);
                } else {
                    const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
                    return await streamToFile(response.data, tempPath);
                }
            } catch (error) {
                console.warn(`⚠️  Download attempt ${attempt}/${retries} failed for ${fileName}: ${error.message}`);

                if (attempt === retries) {
                    console.error(`❌ All download attempts failed for ${fileName}`);
                    throw error;
                }

                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
    }

    function streamToFile(stream, filePath) {
        return new Promise((resolve, reject) => {
            const dest = fs.createWriteStream(filePath);
            stream.pipe(dest);
            dest.on('finish', () => resolve(filePath));
            dest.on('error', reject);
        });
    }

    function getExportFormat(mimeType) {
        const formats = {
            'application/vnd.google-apps.spreadsheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.google-apps.document': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.google-apps.presentation': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        };
        return formats[mimeType] || 'application/pdf';
    }

    function getContentType(fileName) {
        const ext = path.extname(fileName).toLowerCase();
        const types = {
            '.pdf': 'application/pdf',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.txt': 'text/plain',
            '.csv': 'text/csv'
        };
        return types[ext] || 'application/octet-stream';
    }

    function getExtensionForGoogleAppsFile(mimeType) {
        const extensions = {
            'application/vnd.google-apps.spreadsheet': '.xlsx',
            'application/vnd.google-apps.document': '.docx',
            'application/vnd.google-apps.presentation': '.pptx'
        };
        return extensions[mimeType] || '.pdf';
    }

    async function uploadToSupabase(filePath, fileName, bucketName) {
        const stats = fs.statSync(filePath);
        const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);

        // Check file size limit (50MB for Supabase free tier)
        if (stats.size > 50 * 1024 * 1024) {
            throw new Error(`File ${fileName} (${fileSizeMB}MB) exceeds 50MB limit`);
        }

        console.log(`📤 Uploading ${fileName} (${fileSizeMB}MB)...`);

        const fileBuffer = fs.readFileSync(filePath);
        const { data, error } = await supabase.storage.from(bucketName).upload(fileName, fileBuffer, {
            upsert: true,
            contentType: getContentType(fileName)
        });

        if (error) throw error;
        console.log(`✅ Uploaded ${fileName} to ${bucketName} (${fileSizeMB}MB)`);
        return data;
    }

    async function syncFolder(folderId, bucketName, folderName) {
        console.log(`\n📁 Syncing ${folderName}...`);
        const driveFiles = await getDriveFiles(folderId);
        const supabaseFiles = await getSupabaseFiles(bucketName);

        const driveMap = new Map();
        const supaMap = new Map();

        driveFiles.forEach(file => {
            let name = file.name;
            if (file.mimeType.startsWith('application/vnd.google-apps.')) {
                name += getExtensionForGoogleAppsFile(file.mimeType);
            }
            driveMap.set(name, file);
        });

        supabaseFiles.forEach(file => {
            supaMap.set(file.name, file);
        });

        const toUpload = [];

        for (const [name, file] of driveMap) {
            if (!supaMap.has(name)) toUpload.push({ name, file });
        }

        console.log(`📊 Found ${toUpload.length} files to upload in ${folderName}`);

        // Process files in batches to avoid memory issues
        const BATCH_SIZE = 5;
        let uploaded = 0;
        let failed = 0;

        for (let i = 0; i < toUpload.length; i += BATCH_SIZE) {
            const batch = toUpload.slice(i, i + BATCH_SIZE);

            // Process batch in parallel
            const uploadPromises = batch.map(async ({ name, file }) => {
                try {
                    const tempPath = await downloadDriveFile(file.id, name, file.mimeType);
                    await uploadToSupabase(tempPath, name, bucketName);

                    // Clean up temp file immediately
                    if (fs.existsSync(tempPath)) {
                        fs.unlinkSync(tempPath);
                    }

                    uploaded++;
                    console.log(`📤 [${uploaded}/${toUpload.length}] Uploaded: ${name}`);
                    return { success: true, name };
                } catch (err) {
                    failed++;
                    console.error(`❌ Failed to upload ${name}:`, err.message);
                    return { success: false, name, error: err.message };
                }
            });

            await Promise.allSettled(uploadPromises);
        }

        return { uploaded, failed, total: toUpload.length };
    }

    async function performSync() {
        const results = {};

        if (config.folders.kif) {
            results.kif = await syncFolder(config.folders.kif, 'kif', 'KIF');
        }

        if (config.folders.kuf) {
            results.kuf = await syncFolder(config.folders.kuf, 'kuf', 'KUF');
        }

        if (config.folders.transactions) {
            results.transactions = await syncFolder(config.folders.transactions, 'transactions', 'Transactions');
        }

        console.log('\n📋 Sync Summary:\n================');
        let totalUploaded = 0;
        let totalFailed = 0;
        let totalFiles = 0;

        for (const [folder, res] of Object.entries(results)) {
            console.log(`📁 ${folder.toUpperCase()}: ${res.uploaded}/${res.total} uploaded${res.failed > 0 ? `, ${res.failed} failed` : ''}`);
            totalUploaded += res.uploaded;
            totalFailed += res.failed;
            totalFiles += res.total;
        }

        console.log(`\n🎯 Overall: ${totalUploaded}/${totalFiles} files synced successfully`);
        if (totalFailed > 0) {
            console.log(`⚠️  ${totalFailed} files failed to sync`);
        }

        const successRate = totalFiles > 0 ? ((totalUploaded / totalFiles) * 100).toFixed(1) : 100;
        console.log(`📊 Success rate: ${successRate}%`);

        if (totalUploaded > 0) {
            console.log(`✅ Sync completed! ${totalUploaded} new files added to Supabase storage.`);
        } else {
            console.log(`ℹ️  All files are already in sync. No new uploads needed.`);
        }

        const tempDir = path.join(__dirname, 'temp');
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    }

    try {
        await performSync();

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        log.success(`Sync completed in ${duration} seconds`);
    } catch (error) {
        log.error(`Sync failed: ${error.message}`);
        process.exit(1);
    } finally {
        // Cleanup temp directory
        const tempDir = path.join(__dirname, 'temp');
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
            log.debug('Cleaned up temporary files');
        }
    }
})();
