import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './authSlice';
import { useNavigate } from 'react-router-dom';
const useAuthRedirect = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { authUser, loading } = useSelector((state) => state.auth);
    useEffect(() => {
        if (!loading && !authUser) {
            dispatch(logout());
            navigate('/home');
        }
    }, [authUser, loading, dispatch, navigate]);
};
export default useAuthRedirect;
