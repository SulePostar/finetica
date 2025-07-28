import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { loginSuccess, logout, setLoading } from './../redux/auth/authSlice';

export default function AuthWrapper({ children }) {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);

    useEffect(() => {
        const checkAuth = async () => {
            dispatch(setLoading(true));
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                dispatch(logout());
                dispatch(setLoading(false));
                return;
            }

            try {
                const res = await axios.get('/api/auth/verify-token', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                dispatch(loginSuccess({ token }));
            } catch (err) {
                dispatch(logout());
            } finally {
                dispatch(setLoading(false));
            }
        };

        checkAuth();
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return children;
}
