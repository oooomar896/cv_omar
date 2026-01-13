import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation(); // We need to switch logic based on path

    useEffect(() => {
        const checkAuth = async () => {
            // 1. Check if it's an Admin Route
            if (location.pathname.startsWith('/admin')) {
                const adminToken = localStorage.getItem('admin_token');
                // Simple verify for now (could be enhanced)
                if (adminToken === 'supabase_admin_session_active') {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
                setLoading(false);
                return;
            }

            // 2. Otherwise, check Supabase User (Client Portal)
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error checking user:', error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [location.pathname]);

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400">جاري التحقق...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect based on intended destination
        if (location.pathname.startsWith('/admin')) {
            return <Navigate to="/admin/login" replace />;
        } else {
            return <Navigate to="/portal/login" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
