const express = require('express');
const router = express.Router();
const { oauth2Client } = require('./../../config/driveConfig');

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

        console.log('✅ Google authentication successful - session will last 24 hours');
        res.redirect('http://localhost:3000/'); // NACI BOLJI NAČIN ZA REDIRECT 

    } catch (error) {
        console.error('Error authenticating:', error);
        res.status(500).send('❌ Authentication failed.');
    }
});

// Add a route to check authentication status with session expiry
router.get('/auth/google/status', (req, res) => {
    const tokens = req.session.tokens; // uzimamo tokene koje smo spasili u express sesiju 
    const sessionCreated = req.session.createdAt; // uzimamo i vrijeme u koje se token spasio 
    const now = Date.now();

    // provjeravamo da li je vrijeme spasavanja uredno (postavili smo ga na 24 sata da je spojen sa google računom, MIJENJA SE PO POTREBI)
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
            delete req.session.createdAt; // ako sesija nije validna, brisemo sve podatke i korisnik se smatra neautentikovnim 
        }
        res.json({
            authenticated: false,
            message: 'User is not authenticated or session expired',
            sessionValid: false
        });
    }
});


module.exports = router;