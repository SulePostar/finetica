import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({
    children,
    requiredRole = null,
}) => {
    const location = useLocation();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated || !user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        );

    }

    if (requiredRole && user.roleName !== requiredRole) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default ProtectedRoute;
