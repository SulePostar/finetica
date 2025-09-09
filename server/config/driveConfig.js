const { google } = require('googleapis');

const dotenv = require('dotenv');
dotenv.config();

const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
const credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_KEY);

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'], // adjust scope if needed
});

function createDriveClient() {
    return google.drive({
        version: 'v3',
        auth,
    });
}

module.exports = { createDriveClient };
