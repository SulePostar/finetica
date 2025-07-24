import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {  //children su sve komponente koje će biti prikazane ako je korisnik prijavljen, npr <AdminDashboard />
    const { isAuthenticated, loading } = useSelector((state) => state.auth);  // pristupamo do auth state-a iz Redux store-a koji smo postavili u authSlice.js (features/auth/authSlice.js)

    if (loading) return <p>Loading...</p>; // čekamo provjeru da li je korisnik prijavljen, tada se prikazuje loading poruka
    if (!isAuthenticated) return <Navigate to="/home" replace />; // ako korisnik nije prijavljen, preusmjeravamo ga na login stranicu

    return children; // ako je korisnik prijavljen, prikazujemo children komponente (npr. AdminDashboard komponentu itd.)
}
