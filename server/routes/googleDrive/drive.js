const express = require('express');
const fs = require('fs'); // biblioteka za rad sa fajlovima i putanjama  
const path = require('path'); // biblioteka za rad sa fajlovima i putanjama  
const mkdirp = require('mkdirp'); // omogućava kreiranje direktorija, uključujući i sve naddirektorije ako ne postoje
const { createDriveClient, oauth2Client } = require('./../../config/driveConfig');

const router = express.Router();

// Function to find the "finetica" folder ID
async function findFineticaFolderId(drive) {
    try {
        const response = await drive.files.list({ // drive.files.list vraća listu fajlova u Google Drive-u (MORA SE KORISTITI await)
            q: "name='finetica' and mimeType='application/vnd.google-apps.folder' and trashed=false", // q -> query string, trazi folder sa imenom 'finetica' koji nije obrisan, i koristeci 'mimeType' ogranicava pretragu na foldere
            fields: 'files(id, name)', // definisemo polja koja nam trebaju, samo id i ime fajla
            pageSize: 1 // ako ima vise foldera sa istim imenom, uzet ce samo prvi 
        });

        if (response.data.files.length > 0) {
            const folderId = response.data.files[0].id;
            console.log(`✅ Found "finetica" folder ID: ${folderId}`);
            return folderId; // ako se pronadje fajl, ispise se u konzoli njegov id, obrisati conosle.log po potrebi 
        } else {
            console.log('⚠️ "finetica" folder not found in Google Drive');
            return null;
        }
    } catch (err) {
        console.error('❌ Error finding finetica folder:', err.message);
        return null;
    }
}

router.post('/drive/files/download-new', async (req, res) => {
    const tokens = req.session.tokens;
    const sessionCreated = req.session.createdAt;
    const now = Date.now();

    // Check if session exists and is within 24 hours (1 day)
    const isSessionValid = tokens && sessionCreated && (now - sessionCreated < 24 * 60 * 60 * 1000);

    if (!isSessionValid) {
        // Clear invalid session
        if (req.session.tokens) {
            delete req.session.tokens;
            delete req.session.createdAt;
        }
        return res.status(401).json({
            error: 'Not authenticated or session expired',
            message: 'Please authenticate with Google Drive again'
        });
    }

    oauth2Client.setCredentials(tokens);
    const drive = createDriveClient();

    try {
        // First, find the "finetica" folder
        const fineticaFolderId = await findFineticaFolderId(drive);

        if (!fineticaFolderId) {
            return res.status(404).json({
                error: 'Finetica folder not found',
                message: 'Please create a folder named "finetica" in your Google Drive and put files there.'
            });
        }

        // List recent files from the "finetica" folder only
        const response = await drive.files.list({
            pageSize: 10,
            fields: 'files(id, name, modifiedTime, mimeType, size)',
            q: `'${fineticaFolderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
            orderBy: 'modifiedTime desc'
        });

        console.log(`📁 Found ${response.data.files.length} files in "finetica" folder`);
        const files = response.data.files;
        const downloadPath = path.join(__dirname, '../../googleDriveDownloads');
        mkdirp.sync(downloadPath); // Create folder if not exists

        let downloadedCount = 0;
        let skippedCount = 0;

        for (const file of files) {
            try {
                const result = await downloadOrExportFile(drive, file, downloadPath);
                if (result.downloaded) {
                    downloadedCount++;
                } else {
                    skippedCount++;
                }
            } catch (err) {
                console.error(`❌ Failed to process ${file.name}:`, err.message);
            }
        }

        res.status(200).json({
            message: `✅ Obradjeno ${files.length} fajlova iz "finetica" foldera. Preuzeto: ${downloadedCount}, Preskočeno: ${skippedCount}`,
            summary: {
                totalChecked: files.length,
                newFiles: downloadedCount,
                skipped: skippedCount,
                folderName: 'finetica'
            }
        });

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to fetch or download files.' });
    }
});

// GET version for compatibility with older calls
router.get('/drive/files/download-new', async (req, res) => {
    const tokens = req.session.tokens;
    const sessionCreated = req.session.createdAt;
    const now = Date.now();

    // Check if session exists and is within 24 hours (1 day)
    const isSessionValid = tokens && sessionCreated && (now - sessionCreated < 24 * 60 * 60 * 1000);

    if (!isSessionValid) {
        // Clear invalid session
        if (req.session.tokens) {
            delete req.session.tokens;
            delete req.session.createdAt;
        }
        return res.status(401).json({
            error: 'Not authenticated or session expired',
            message: 'Please authenticate with Google Drive again'
        });
    }

    oauth2Client.setCredentials(tokens);
    const drive = createDriveClient();

    try {
        // First, find the "finetica" folder
        const fineticaFolderId = await findFineticaFolderId(drive);

        if (!fineticaFolderId) {
            return res.status(404).json({
                error: 'Finetica folder not found',
                message: 'Please create a folder named "finetica" in your Google Drive and put files there.'
            });
        }

        // List recent files from the "finetica" folder only
        const response = await drive.files.list({
            pageSize: 10,
            fields: 'files(id, name, modifiedTime, mimeType, size)',
            q: `'${fineticaFolderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
            orderBy: 'modifiedTime desc'
        });

        console.log(`📁 Found ${response.data.files.length} files in "finetica" folder`);
        const files = response.data.files;
        const downloadPath = path.join(__dirname, '../../googleDriveDownloads');
        mkdirp.sync(downloadPath); // Create folder if not exists

        let downloadedCount = 0;
        let skippedCount = 0;

        for (const file of files) {
            try {
                const result = await downloadOrExportFile(drive, file, downloadPath);
                if (result.downloaded) {
                    downloadedCount++;
                } else {
                    skippedCount++;
                }
            } catch (err) {
                console.error(`❌ Failed to process ${file.name}:`, err.message);
            }
        }

        res.status(200).json({
            message: `✅ Obradjeno ${files.length} fajlova iz "finetica" foldera. Preuzeto: ${downloadedCount}, Preskočeno: ${skippedCount}`,
            summary: {
                totalChecked: files.length,
                newFiles: downloadedCount,
                skipped: skippedCount,
                folderName: 'finetica'
            }
        });

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to fetch or download files.' });
    }
});

// Helper function to download or export files based on their type
async function downloadOrExportFile(drive, file, downloadPath) {
    const isGoogleAppsFile = file.mimeType.startsWith('application/vnd.google-apps.');

    let fileName = file.name;
    let destPath;

    if (isGoogleAppsFile) {
        // For Google Apps files, add appropriate extension and export
        const extension = getExtensionForGoogleAppsFile(file.mimeType);
        fileName = `${file.name}${extension}`;
        destPath = path.join(downloadPath, fileName);

        // Check if file already exists and compare modification times
        if (fs.existsSync(destPath)) {
            const localFileStats = fs.statSync(destPath);
            const remoteModifiedTime = new Date(file.modifiedTime);

            // If remote file is newer, download it; otherwise skip
            if (localFileStats.mtime >= remoteModifiedTime) {
                console.log(`⏭️ File is up to date: ${fileName}`);
                return { downloaded: false, reason: 'Already up to date' };
            } else {
                console.log(`🔄 File has been updated on Drive, re-downloading: ${fileName}`);
            }
        } else {
            console.log(`📥 New file found: ${fileName}`);
        }

        const fileExistedBefore = fs.existsSync(destPath);
        await exportGoogleAppsFile(drive, file, destPath);

        // Set the local file's modification time to match the remote file
        const remoteModifiedTime = new Date(file.modifiedTime);
        fs.utimesSync(destPath, remoteModifiedTime, remoteModifiedTime);

        console.log(`✅ Exported: ${fileName}`);
        return { downloaded: true, type: 'exported', reason: fileExistedBefore ? 'Updated' : 'New' };
    } else {
        // For regular files, download directly
        destPath = path.join(downloadPath, fileName);

        // Check if file already exists and compare modification times
        if (fs.existsSync(destPath)) {
            const localFileStats = fs.statSync(destPath);
            const remoteModifiedTime = new Date(file.modifiedTime);

            // If remote file is newer, download it; otherwise skip
            if (localFileStats.mtime >= remoteModifiedTime) {
                console.log(`⏭️ File is up to date: ${fileName}`);
                return { downloaded: false, reason: 'Already up to date' };
            } else {
                console.log(`🔄 File has been updated on Drive, re-downloading: ${fileName}`);
            }
        } else {
            console.log(`📥 New file found: ${fileName}`);
        }

        const fileExistedBefore = fs.existsSync(destPath);
        await downloadRegularFile(drive, file, destPath);

        // Set the local file's modification time to match the remote file
        const remoteModifiedTime = new Date(file.modifiedTime);
        fs.utimesSync(destPath, remoteModifiedTime, remoteModifiedTime);

        console.log(`✅ Downloaded: ${fileName}`);
        return { downloaded: true, type: 'downloaded', reason: fileExistedBefore ? 'Updated' : 'New' };
    }
}

// Helper function to get file extension for Google Apps files
function getExtensionForGoogleAppsFile(mimeType) {
    switch (mimeType) {
        case 'application/vnd.google-apps.spreadsheet':
            return '.xlsx';
        case 'application/vnd.google-apps.document':
            return '.docx';
        case 'application/vnd.google-apps.presentation':
            return '.pptx';
        case 'application/vnd.google-apps.drawing':
            return '.pdf';
        case 'application/vnd.google-apps.form':
            return '.pdf';
        default:
            return '.pdf'; // Fallback to PDF
    }
}

// Helper function to export Google Apps files
async function exportGoogleAppsFile(drive, file, destPath) {
    let exportFormat = '';

    // Determine export format based on file type
    switch (file.mimeType) {
        case 'application/vnd.google-apps.spreadsheet':
            exportFormat = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            break;
        case 'application/vnd.google-apps.document':
            exportFormat = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            break;
        case 'application/vnd.google-apps.presentation':
            exportFormat = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
            break;
        case 'application/vnd.google-apps.drawing':
        case 'application/vnd.google-apps.form':
        default:
            exportFormat = 'application/pdf';
            break;
    }

    return new Promise((resolve, reject) => {
        const dest = fs.createWriteStream(destPath);

        dest.on('finish', resolve);
        dest.on('error', reject);

        drive.files.export({
            fileId: file.id,
            mimeType: exportFormat
        }, {
            responseType: 'stream'
        })
            .then(response => {
                response.data.pipe(dest);
            })
            .catch(reject);
    });
}

// Helper function to download regular files
async function downloadRegularFile(drive, file, destPath) {
    return new Promise((resolve, reject) => {
        const dest = fs.createWriteStream(destPath);

        dest.on('finish', resolve);
        dest.on('error', reject);

        drive.files.get({
            fileId: file.id,
            alt: 'media'
        }, {
            responseType: 'stream'
        })
            .then(response => {
                response.data.pipe(dest);
            })
            .catch(reject);
    });
}

module.exports = router;
