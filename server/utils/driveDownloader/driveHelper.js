const fs = require('fs');
const path = require('path');

async function findFineticaFolderId(drive) {
    try {
        const response = await drive.files.list({ // drive.files.list vraća listu fajlova u Google Drive-u (MORA SE KORISTITI await)
            q: "name='finetica' and mimeType='application/vnd.google-apps.folder' and trashed=false", // q -> query string, trazi folder sa imenom 'finetica' koji nije obrisan, i koristeci 'mimeType' ogranicava pretragu na foldere
            fields: 'files(id, name)', // definisemo polja koja nam trebaju, samo id i ime fajla
            pageSize: 1 // ako ima vise foldera sa istim imenom, uzet ce samo prvi 
        });

        if (response.data.files.length > 0) {
            const folderId = response.data.files[0].id;
            console.log(`✅ Found "finetica" folder with ID: ${folderId}`);
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

module.exports = {
    findFineticaFolderId,
    downloadOrExportFile,
    getExtensionForGoogleAppsFile,
    exportGoogleAppsFile,
    downloadRegularFile
};
