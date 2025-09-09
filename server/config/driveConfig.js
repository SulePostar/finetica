const { google } = require('googleapis');
const path = require('path');

const keyFile = path.join(__dirname, '../googleDriveAccess.json');

const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'], // or full access
});

function createDriveClient() {
    return google.drive({
        version: 'v3',
        auth,
    });
}

module.exports = { createDriveClient };
