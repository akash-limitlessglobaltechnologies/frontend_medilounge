import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // If children is a function, call it with user
    if (typeof children === 'function') {
        return children({ user });
    }

    // If no roles specified, allow access
    if (allowedRoles.length === 0) {
        return children;
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(user.role)) {
        // Redirect based on role
        if (user.role === 'doctor') {
            return <Navigate to="/doctor" />;
        }
        if (user.role === 'organization') {
            return <Navigate to="/organization" />;
        }
        if (!user.role) {
            return <Navigate to="/register" />;
        }
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;