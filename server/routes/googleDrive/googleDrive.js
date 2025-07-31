const express = require('express');
const router = express.Router();
const { oauth2Client } = require('./../../config/gooogleDrive');

const scopes = ['https://www.googleapis.com/auth/drive'];

const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
});

router.get('/auth/google', (req, res) => {
    res.redirect(authUrl); // Redirect to Google consent screen
});

router.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const { tokens } = await oauth2Client.getToken(code);

        // Save tokens in session
        req.session.tokens = tokens;

        // res.send('✅ Authentication successful! Now you can access /drive/files or /upload');
        res.redirect('http://localhost:3000/drive'); // Updated to Vite default port

    } catch (error) {
        console.error('Error authenticating:', error);
        res.status(500).send('❌ Authentication failed.');
    }
});

// Add a route to check authentication status
router.get('/auth/google/status', (req, res) => {
    if (req.session.tokens) {
        res.json({ authenticated: true, message: 'User is authenticated with Google' });
    } else {
        res.json({ authenticated: false, message: 'User is not authenticated' });
    }
});


module.exports = router;