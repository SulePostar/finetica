import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            setShouldRedirect(true);
        } else if (isAuthenticated) {
            setShouldRedirect(false);
        }
    }, [isAuthenticated, loading]);

    if (loading) return <p>Loading...</p>;
    if (shouldRedirect) return <Navigate to="/login" replace />;

    return children;
}
