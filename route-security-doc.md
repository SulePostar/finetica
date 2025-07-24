JWT Authentication System 

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
        const token = localStorage.getItem('token');
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

