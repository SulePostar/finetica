import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { loginSuccess, logout, setLoading } from '../features/auth/authSlice';

export default function AuthWrapper({ children }) {
    const dispatch = useDispatch(); //koristimo za pokretanje Redux akcija npr loginSuccess, logout, setLoading koje smo importali u authSlice.js

    useEffect(() => {
        const checkAuth = async () => {
            dispatch(setLoading(true)); //postavljamo loading na true dok provjeravamo da li je korisnik prijavljen
            const token = localStorage.getItem('token'); //pokušavamo dohvatiti token iz localStorage
            if (!token) {
                dispatch(logout()); // ako token ne postoji, korisnik nije prijavljen
                dispatch(setLoading(false)); // postavljamo loading na false jer je provjera završena
                return;
            }

            try {
                const res = await axios.get('/api/auth/verify-token', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                dispatch(loginSuccess({ token })); // ako je token valjan, dekodiramo ga i postavljamo korisnika kao prijavljenog
            } catch (err) {
                dispatch(logout());
            } finally {
                dispatch(setLoading(false));
            }
        };

        checkAuth();
    }, [dispatch]);

    return children;
}
