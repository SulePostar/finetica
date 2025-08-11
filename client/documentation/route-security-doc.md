1. JWT Authentication System 

Tehnologije: React (Vite), Redux Toolkit, jwt-decode, react-router-dom, Express.js, jsonwebtoken

Auth tokene čuvamo u localStorage


Arhitektura:
    1. Korisnik se loguje preko forme
    2. Backend generiše JWT token
    3. Token se čuva u localStorage
    4. Pri startu aplikacije, frontend šalje zahtjev backendu da provjeri validnost tokena
    5. Ako je token ispravan, korisnik ostaje prijavljen
    6. Rute su zaštićene koristeći komponentu ProtectedRoute

Redux - authSlice:
    Definiše stanje autentifikacije:
    token
    user (dekodiran iz tokena)
    loading
    isAuthenticated

    loginSuccess: čuva token i dekodira usera
    logout: briše token i usera iz state-a i localStorage-a
    setLoading: označava kada se auth provjera izvodi

        /*const initialState = {
        isAuthenticated: !!token && !!user,
        user,
        token,
        loading: false,
        };*/
    
AuthWrapper komponenta:
    Omotava cijelu aplikaciju. Kada se aplikacija pokrene:
    Čita token iz localStorage
    Ako postoji, šalje ga backendu (/auth/verify-token)
    Ako je validan, korisnik ostaje prijavljen
    Inače se poziva logout

        /*useEffect(() => {
        const checkAuth = async () => {
        dispatch(setLoading(true));
        const token = localStorage.getItem('jwt_token');
        if (!token) return dispatch(logout());

        try {
        await axios.get('/auth/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
         });
         dispatch(loginSuccess({ token }));
        } catch {
          dispatch(logout());
        } finally {
         dispatch(setLoading(false));
        }
        };
        checkAuth();
        }, []);*/

ProtectedRoute komponenta:
    Omotava stranice koje želimo zaštititi. Ako korisnik nije prijavljen, preusmjerava ga na login

        /*if (loading) return <p>Loading...</p>;
        if (!isAuthenticated) return <Navigate to="/login" replace />;
        return children;*/

Backend route: /auth/verify-token:
    Express route koja provjerava da li je token validan

        /*router.get('/verify-token', (req, res) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) return res.sendStatus(401);

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        res.json({ valid: true, user });
        });
        });*/



TL;DR / Ukratko:

    localStorage: Čuva JWT token lokalno

    jwt-decode: Dekodira token kako bismo znali ko je user

    Redux authSlice: Centralno upravlja auth stanjima

    AuthWrapper: Provjerava token na startu aplikacije

    ProtectedRoute: Štiti privatne rute

    /verify-token: Backend endpoint za provjeru validnosti tokena



2. Email Attachment Downloader + Supabase Uploader

Tehnologije: Node.js, ImapFlow, mailparser, dotenv, Supabase JS client, mime-types

Opis: Sistem automatski preuzima attachmente iz mailova, filtrira datoteke po ekstenziji i sprema prihvatljive datoteke u folder downloads, te ih nakon toga šalje u Supabase Storage bucket.

Arhitektura:

    1. Skripta se povezuje na Gmail putem IMAP protokola koristeći ImapFlow
    2. Parsira poruke korištenjem mailparser
    3. Preuzima i filtrira attachmente (isključuju se male slike i .p7s potpisi)
    4. Attachmenti se spašavaju lokalno u services/downloads folder
    5. Skripta za upload (supabaseUploader.js) učitava sve fajlove iz downloads foldera
    6. Svaki fajl se provjerava da li već postoji u bucketu
    6. Ako ne postoji, fajl se šalje u Supabase bucket invoices
    7. Već obrađeni UIDovi se čuvaju u downloaded_uids.json da se spriječi ponavljanje

Email skripta (IMAP downloader)

    1. ImapFlow konekcija koristi EMAIL_USER i EMAIL_PASS koji se nalaze u .env fajlu
    2. simpleParser: parsira e-mail i izvlači attachmente
    3. Filteri za attachmente:
        Preskaču se .p7s fajlovi
        Preskaču se inline slike manje od 50KB
    4. Fajl se spašava ako ne postoji u tom trenutku i nije duplikat
    5. UID tracking: UIDovi se pamte da se ne preuzima isti fajl više puta
    6. Odvajanje pročitanih i nepročitanih mailova:
        Nepročitani se procesiraju i označavaju kao pročitani
        Pročitani se također obrađuju, ali bez promjene statusa jer su već označeni kao pročitani

Supabase uploader:

    1. @supabase/supabase-js koristi SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY iz .env
    2. MIME type svakog fajla se određuje uz pomoć mime-types biblioteke
    3. Upoređivanje fajlova:
        Provjerava se da li fajl već postoji pomoću .list(search: fileName)
        Ako postoji onda se preskače, a u suprotnom se uploaduje sa odgovarajućim contentTypeom i uspert: false
    4. Svi uploadi se vrše u bucket pod nazivom invoices


