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

        // Save tokens in session with timestamp
        req.session.tokens = tokens;
        req.session.createdAt = Date.now(); // Track when session was created

        oauth2Client.setCredentials(tokens);

        console.log('✅ Google authentication successful - session will last 24 hours');
        res.redirect('http://localhost:3000/'); // Fixed: Client runs on port 3000

    } catch (error) {
        console.error('Error authenticating:', error);
        res.status(500).send('❌ Authentication failed.');
    }
});

// Add a route to check authentication status with session expiry
router.get('/auth/google/status', (req, res) => {
    const tokens = req.session.tokens;
    const sessionCreated = req.session.createdAt;
    const now = Date.now();

    // Check if session exists and is within 24 hours (1 day)
    const isValid = tokens && sessionCreated && (now - sessionCreated < 24 * 60 * 60 * 1000);

    if (isValid) {
        oauth2Client.setCredentials(tokens);
        res.json({
            authenticated: true,
            message: 'User is authenticated with Google',
            sessionValid: true,
            expiresAt: new Date(sessionCreated + 24 * 60 * 60 * 1000).toISOString()
        });
    } else {
        // Clear invalid session
        if (req.session.tokens) {
            delete req.session.tokens;
            delete req.session.createdAt;
        }
        res.json({
            authenticated: false,
            message: 'User is not authenticated or session expired',
            sessionValid: false
        });
    }
});


module.exports = router;