import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAdminAuthenticated = localStorage.getItem('admin_token') === 'supabase_admin_session_active';

    if (!isAdminAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
