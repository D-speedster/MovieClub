import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute - مسیرهایی که فقط کاربران لاگین‌کرده می‌توانند ببینند
 * adminOnly: فقط کاربران با role Admin یا Owner می‌توانند وارد شوند
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

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


    return children;
};

export default ProtectedRoute;
