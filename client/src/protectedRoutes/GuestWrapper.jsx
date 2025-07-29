import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const GuestWrapper = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // pristupamo redux state-u da provjerimo da li je korisnik prijavljen

    return isAuthenticated ? <Navigate to="/" /> : children; // ako je korisnik prijavljen, preusmjeravamo ga na početnu stranicu
};

export default GuestWrapper;
