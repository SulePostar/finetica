const fs = require('fs');
const path = require('path');
const mime = require('mime');
const supabaseService = require('./supabase/supabaseService');
const { SOURCES } = require('./constants');

/**
 * Fetch file from either local folder or supabase bucket
 * @param {string} category - one of 'kif', 'kuf', 'transactions', 'contracts'
 * @param {string} fileName - name of file to fetch
 * @param {string} source - 'local' or 'supabase'
 */

async function getFileSource(category, fileName, source = 'local') {
    const config = SOURCES[category];   // goes inside of local folder (./googleDriveDownloads) or supabase bucket (e.g. 'transactions' )
    if (!config) {
        throw new Error(`Unknown category: ${category}`);
    }

    if (source === 'local') {
        const filePath = path.join(config.localFolder, fileName);
        const buffer = fs.readFileSync(filePath);
        const mimeType = mime.getType(filePath) || 'application/pdf';
        return { buffer, mimeType, fileName, category };
    }

    if (source === 'supabase') {
        const { buffer, mimeType } = await supabaseService.getFile(
            config.supabaseBucket,
            fileName
        );
        return { buffer, mimeType, fileName, category };
    }

    throw new Error(`Unknown file source: ${source}`);
}

module.exports = { getFileSource };
