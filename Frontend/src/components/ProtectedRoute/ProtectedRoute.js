import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute - مسیرهایی که فقط کاربران لاگین‌کرده می‌توانند ببینند
 * adminOnly: فقط کاربران با role Admin یا Owner می‌توانند وارد شوند
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    // Admin only routes: allow only users with role 'Admin' or 'Owner' (case‑insensitive)
    if (adminOnly) {
        const normalizedRole = (role || '').toLowerCase();
        if (normalizedRole !== 'admin' && normalizedRole !== 'owner') {
            return <Navigate to="/" replace />;
        }
    }

    // Redirect regular users to their dashboard
    if (role && role.toLowerCase() === 'user' && !location.pathname.startsWith('/user/dashboard')) {
        return <Navigate to="/user/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
