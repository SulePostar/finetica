const express = require('express');
const router = express.Router();
const { oauth2Client } = require('./../../config/driveConfig');
const backgroundSyncService = require('../../services/backgroundSyncService');

const scopes = ['https://www.googleapis.com/auth/drive']; // Traži se puna dozvola za pristup korisničkom Google Drive-u (čitanje, pisanje, brisanje)

const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // omogućava dobijanje refresh tokena da možemo obnoviti pristup
    scope: scopes,
    include_granted_scopes: true, // zadržava prethodno dobijene dozvole
});

router.get('/auth/google', (req, res) => {
    res.redirect(authUrl); // kada posaljemo ovu rutu, korisnik bude preusmjeren na google login page 
});

router.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code; // ako ovaj 'code' vrati tačnu vrijednost nju ćemo kasnije razmijeniti za tokene (linija ispod try-catch petlje)

    try {
        const { tokens } = await oauth2Client.getToken(code); // moglo je i bez 'await' jer on nema uticaja na ovaj tip expression-a, ali je sigurnije ovkao

        // spasavamo tokene u sesiju sa vremenom kreiranja
        req.session.tokens = tokens; // tokene spasavamo u express session 
        req.session.createdAt = Date.now(); // spasavamo vrijeme kreiranja sesije

        oauth2Client.setCredentials(tokens); // 

        // Register user for background sync
        const userId = req.sessionID; // Use session ID as user identifier
        backgroundSyncService.registerUserSession(userId, tokens, req.session.createdAt);

        console.log('✅ Google authentication successful - session will last 1 month');
        console.log('🔄 Refresh token available:', !!tokens.refresh_token);
        console.log('📝 User registered for background file sync');
        res.redirect('http://localhost:3000/'); // NACI BOLJI NAČIN ZA REDIRECT 

    } catch (error) {
        console.error('Error authenticating:', error);
        res.status(500).send('❌ Authentication failed.');
    }
});

// Add a route to check authentication status with session expiry and refresh token handling
router.get('/auth/google/status', async (req, res) => {
    const tokens = req.session.tokens; // uzimamo tokene koje smo spasili u express sesiju 
    const sessionCreated = req.session.createdAt; // uzimamo i vrijeme u koje se token spasio 
    const now = Date.now();

    // provjeravamo da li je vrijeme spasavanja uredno (postavili smo ga na 1 mjesec da je spojen sa google računom)
    const oneMonthInMs = 30 * 24 * 60 * 60 * 1000; // 1 month in milliseconds
    const isSessionValid = tokens && sessionCreated && (now - sessionCreated < oneMonthInMs);

    if (tokens && !isSessionValid) {
        // Session expired, try to refresh tokens if refresh token is available
        if (tokens.refresh_token) {
            try {
                oauth2Client.setCredentials(tokens);
                const { credentials } = await oauth2Client.refreshAccessToken();

                // Update session with new tokens
                req.session.tokens = credentials;
                req.session.createdAt = Date.now();

                console.log('🔄 Access token refreshed successfully');

                oauth2Client.setCredentials(credentials);
                return res.json({
                    authenticated: true,
                    message: 'User is authenticated with Google (token refreshed)',
                    sessionValid: true,
                    expiresAt: new Date(Date.now() + oneMonthInMs).toISOString()
                });
            } catch (refreshError) {
                console.error('❌ Failed to refresh token:', refreshError.message);
                // Clear invalid session
                delete req.session.tokens;
                delete req.session.createdAt;
                return res.json({
                    authenticated: false,
                    message: 'Session expired and refresh failed',
                    sessionValid: false
                });
            }
        }
    }

    if (isSessionValid) {
        oauth2Client.setCredentials(tokens);
        res.json({
            authenticated: true,
            message: 'User is authenticated with Google',
            sessionValid: true,
            expiresAt: new Date(sessionCreated + oneMonthInMs).toISOString()
        });
    } else {
        // Clear invalid session
        if (req.session.tokens) {
            // Unregister from background sync
            const userId = req.sessionID;
            backgroundSyncService.unregisterUserSession(userId);

            delete req.session.tokens;
            delete req.session.createdAt; // ako sesija nije validna, brisemo sve podatke i korisnik se smatra neautentikovnim 
        }
        res.json({
            authenticated: false,
            message: 'User is not authenticated or session expired',
            sessionValid: false
        });
    }
});

// Add endpoint to get background sync status
router.get('/auth/google/background-status', (req, res) => {
    const status = backgroundSyncService.getStatus();
    res.json({
        ...status,
        message: status.isRunning ? 'Background sync is active' : 'Background sync is stopped'
    });
});

// Add endpoint to manually trigger background sync
router.post('/auth/google/sync-now', async (req, res) => {
    try {
        const status = backgroundSyncService.getStatus();
        if (!status.isRunning) {
            return res.status(503).json({
                error: 'Background sync service is not running'
            });
        }

        // Trigger immediate sync
        await backgroundSyncService.performSync();

        res.json({
            message: 'Background sync completed successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Manual sync error:', error);
        res.status(500).json({
            error: 'Failed to perform background sync',
            message: error.message
        });
    }
});

module.exports = router;