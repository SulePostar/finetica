const { google } = require('googleapis'); // oficijelna biblioteka za Google API
const dotenv = require('dotenv');
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

function createDriveClient() {
    return google.drive({
        version: 'v3', // najnovija verzija Google Drive API-ja 
        auth: oauth2Client, // koristi se prethodno definisani OAuth2 klijent za autentifikovane pozive
    });
}

module.exports = {
    oauth2Client,
    createDriveClient,
};