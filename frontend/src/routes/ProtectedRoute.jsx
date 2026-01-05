
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { toast } from 'sonner';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { user, isAuthenticated, loading } = useAuth();

    useEffect(() => {
      // Show restricted message when user tries to access admin-only routes
      if (!loading && isAuthenticated && allowedRoles.length > 0 && !allowedRoles.includes(user?.roleName)) {
        toast.error("Access Restricted", {
          description: "You do not have permission to access this page.",
        });
      }
    }, [loading, isAuthenticated, allowedRoles, user?.roleName, location.pathname]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-background">
                <img
                    src="/symphonylogo.png"
                    alt="Finetica Logo"
                    className="w-32 h-auto mb-4 animate-pulse"
                />
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.roleName)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

