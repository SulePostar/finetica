require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const Imap = require('node-imap');
const { simpleParser } = require('mailparser');

// Setup Gmail IMAP
const imap = new Imap({
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
});

// Create downloads folder
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR);
}

imap.once('ready', function () {
    imap.openBox('INBOX', false, function (err, box) {
        if (err) throw err;

        // Fetch unread emails
        imap.search(['UNSEEN'], function (err, results) {
            if (err || !results.length) {
                console.log('No new emails.');
                imap.end();
                return;
            }

            const f = imap.fetch(results, { bodies: '', struct: true });

            f.on('message', function (msg, seqno) {
                msg.on('body', function (stream) {
                    simpleParser(stream, async (err, parsed) => {
                        if (err) {
                            console.error('Parser error:', err);
                            return;
                        }

                        const attachments = parsed.attachments || [];

                        for (const attachment of attachments) {
                            const filePath = path.join(DOWNLOAD_DIR, `${Date.now()}_${attachment.filename}`);
                            fs.writeFileSync(filePath, attachment.content);
                            console.log(`Saved: ${filePath}`);
                        }
                    });
                });
            });

            f.once('end', function () {
                console.log('All messages processed.');
                imap.end();
            });
        });
    });
});

imap.once('error', function (err) {
    console.error('IMAP error:', err);
});

imap.once('end', function () {
    console.log('IMAP connection closed.');
});

imap.connect();
