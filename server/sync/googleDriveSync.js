const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Validate refresh token
if (!process.env.GOOGLE_REFRESH_TOKEN) {
    console.error('❌ Missing GOOGLE_REFRESH_TOKEN in .env file');
    process.exit(1);
}

(async function googleDriveSync() {
    console.log('🚀 Starting Google Drive to Supabase sync...');

    const config = {
        supabase: {
            url: process.env.VITE_SUPABASE_URL,
            anonKey: process.env.VITE_SUPABASE_ANON_KEY
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

    if (!config.supabase.url || !config.supabase.anonKey) {
        console.error('❌ Missing Supabase configuration');
        process.exit(1);
    }

    if (!config.google.clientId || !config.google.clientSecret) {
        console.error('❌ Missing Google Drive configuration');
        process.exit(1);
    }

    const supabase = createClient(config.supabase.url, config.supabase.anonKey);

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

    async function downloadDriveFile(fileId, fileName, mimeType) {
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        const tempPath = path.join(tempDir, fileName);

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
            console.error(`❌ Error downloading file ${fileName}:`, error.message);
            throw error;
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
        const fileBuffer = fs.readFileSync(filePath);
        const { data, error } = await supabase.storage.from(bucketName).upload(fileName, fileBuffer, {
            upsert: true,
            contentType: getContentType(fileName)
        });
        if (error) throw error;
        console.log(`✅ Uploaded ${fileName} to ${bucketName}`);
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

        for (const { name, file } of toUpload) {
            try {
                const tempPath = await downloadDriveFile(file.id, name, file.mimeType);
                await uploadToSupabase(tempPath, name, bucketName);
                fs.unlinkSync(tempPath);
            } catch (err) {
                console.error(`❌ Failed to upload ${name}:`, err.message);
            }
        }

        return { uploaded: toUpload.length, deleted: 0 };
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

        for (const [folder, res] of Object.entries(results)) {
            console.log(`📁 ${folder}: Uploaded ${res.uploaded}`);
            totalUploaded += res.uploaded;
        }

        console.log(`\n✅ Done. Total uploaded: ${totalUploaded}`);

        const tempDir = path.join(__dirname, 'temp');
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    }

    try {
        await performSync();
    } catch (error) {
        console.error('❌ Sync failed:', error.message);
        process.exit(1);
    }
})();
