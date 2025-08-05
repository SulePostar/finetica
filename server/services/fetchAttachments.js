const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Paths
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
const UID_TRACK_FILE = path.join(__dirname, 'downloaded_uids.json');

// Create download directory if it doesn't exist
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR);
}

// Load previously downloaded UIDs
function loadDownloadedUIDs() {
    if (!fs.existsSync(UID_TRACK_FILE)) return {};
    try {
        return JSON.parse(fs.readFileSync(UID_TRACK_FILE, 'utf8'));
    } catch (err) {
        console.error('Failed to read UID tracking file, starting fresh.');
        return {};
    }
}

// Save UIDs to prevent reprocessing
function saveDownloadedUIDs(uids) {
    fs.writeFileSync(UID_TRACK_FILE, JSON.stringify(uids, null, 2));
}

// Helper to sanitize filenames
function sanitizeFilename(name) {
    return name.replace(/[^a-z0-9_.-]/gi, '_');
}

// Check if file exists
function isFileExists(filename) {
    return fs.existsSync(path.join(DOWNLOAD_DIR, filename));
}

(async () => {
    const client = new ImapFlow({
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
        logger: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await client.connect();
        const lock = await client.getMailboxLock('[Gmail]/All Mail');

        const downloadedUIDs = loadDownloadedUIDs();
        const since = new Date();
        since.setDate(since.getDate() - 2); // Only last 2 days

        // Search for unread emails from the last 2 days
        let messages = await client.search({
            seen: false,
            since,
        });

        messages = messages.reverse(); // newest first

        if (!messages.length) {
            console.log('No new unread emails.');
            return;
        }

        let emailsWithAttachments = [];

        for await (let message of client.fetch(messages, { source: true, envelope: true })) {
            const parsed = await simpleParser(message.source);
            if (parsed.attachments && parsed.attachments.length > 0) {
                emailsWithAttachments.push({ message, parsed });
            }
        }

        if (!emailsWithAttachments.length) {
            console.log('No unread emails with attachments found.');
            return;
        }

        console.log(`Found ${emailsWithAttachments.length} unread emails with attachments from the last 2 days.\n`);

        for (const { message, parsed } of emailsWithAttachments) {
            const uid = message.uid;

            // Skip if UID already processed
            if (downloadedUIDs[uid]) {
                console.log(`Skipping UID ${uid} (already processed)`);
                continue;
            }

            console.log(`Processing email from: ${message.envelope.from[0].address} | Subject: ${message.envelope.subject || '[No subject]'}`);

            // Mark as read before processing to avoid race conditions
            await client.messageFlagsAdd(uid, ['\\Seen']);
            console.log(`Marked as read (UID: ${uid}). Now processing attachments...`);

            let savedCount = 0;

            for (const attachment of parsed.attachments) {
                // Skip .p7s (signature) files
                if (attachment.filename?.toLowerCase().endsWith('.p7s')) {
                    console.log(`Skipped signature file: ${attachment.filename}`);
                    continue;
                }

                let baseName = attachment.filename || (attachment.contentId ? `${attachment.contentId}.bin` : 'unnamed_attachment.bin');
                baseName = sanitizeFilename(baseName);

                const fileName = `${uid}_${Date.now()}_${baseName}`;
                const filePath = path.join(DOWNLOAD_DIR, fileName);

                if (isFileExists(fileName)) {
                    console.log(`File already exists, skipping: ${fileName}`);
                    continue;
                }

                fs.writeFileSync(filePath, attachment.content);
                console.log(`Saved attachment: ${fileName} (${attachment.contentType}, ${attachment.size} bytes)`);
                savedCount++;
            }

            if (savedCount > 0) {
                downloadedUIDs[uid] = true;
                saveDownloadedUIDs(downloadedUIDs);
            } else {
                console.log('No valid attachments saved.');
            }

            console.log('');
        }

        lock.release();
        await client.logout();
        console.log('IMAP session closed.');
    } catch (err) {
        console.error('Script error:', err);
    }
})();
