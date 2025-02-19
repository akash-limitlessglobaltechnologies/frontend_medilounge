// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const initializeAuth = () => {
            const token = localStorage.getItem('token');

            // Skip token check on login and callback pages
            if (location.pathname === '/login' || location.pathname === '/google-callback') {
                setLoading(false);
                return;
            }

            if (!token) {
                setUser(null);
                setLoading(false);
                if (location.pathname !== '/login') {
                    navigate('/login');
                }
                return;
            }

            try {
                const decoded = jwtDecode(token);
                setUser(decoded);

                // Handle routing based on role
                if (decoded.role === 'admin') {
                    navigate('/admin');
                } else if (decoded.role === 'doctor') {
                    navigate('/doctor');
                } else if (decoded.role === 'organization') {
                    navigate('/organization');
                } else if (!decoded.role && !location.pathname.startsWith('/register')) {
                    navigate('/register');
                }
            } catch (error) {
                console.error('Token decode error:', error);
                localStorage.removeItem('token');
                setUser(null);
                navigate('/login');
            }
            setLoading(false);
        };

        initializeAuth();
    }, [navigate, location.pathname]);

    const login = (token) => {
        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
            localStorage.setItem('token', token);

            if (decoded.role === 'admin') {
                navigate('/admin');
            } else if (!decoded.role) {
                navigate('/register');
            } else if (decoded.role === 'doctor') {
                navigate('/doctor');
            } else if (decoded.role === 'organization') {
                navigate('/organization');
            }
        } catch (error) {
            console.error('Login error:', error);
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        }
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:5001/api/logout', {
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated: !!user,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};