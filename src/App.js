import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import Login from './components/Login';
import GoogleCallback from './components/GoogleCallback';
import DoctorPage from './components/DoctorPage';
import OrganizationPage from './components/OrganizationPage';
import AdminPage from './components/AdminPage';
import RegistrationSelect from './components/RegistrationSelect';
import DoctorRegistration from './components/DoctorRegistration';
import OrganizationRegistration from './components/OrganizationRegistration';
import PrivateRoute from './components/PrivateRoute';

function App() {
    useEffect(() => {
        const handleUnload = () => {
            if (!localStorage.getItem('token')) return;
            
            try {
                const token = localStorage.getItem('token');
                const decoded = jwtDecode(token);
                if (!decoded.role) {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                localStorage.removeItem('token');
            }
        };

        window.addEventListener('beforeunload', handleUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, []);

    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/google-callback" element={<GoogleCallback />} />
                        
                        {/* Registration Routes */}
                        <Route 
                            path="/register" 
                            element={
                                <PrivateRoute allowedRoles={[null]}>
                                    <RegistrationSelect />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/register/doctor" 
                            element={
                                <PrivateRoute allowedRoles={[null]}>
                                    <DoctorRegistration />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/register/organization" 
                            element={
                                <PrivateRoute allowedRoles={[null]}>
                                    <OrganizationRegistration />
                                </PrivateRoute>
                            } 
                        />
                        
                        {/* Role-Protected Routes */}
                        <Route 
                            path="/doctor" 
                            element={
                                <PrivateRoute allowedRoles={['doctor']}>
                                    <DoctorPage />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/organization" 
                            element={
                                <PrivateRoute allowedRoles={['organization']}>
                                    <OrganizationPage />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/admin" 
                            element={
                                <PrivateRoute allowedRoles={['admin']}>
                                    <AdminPage />
                                </PrivateRoute>
                            } 
                        />
                        
                        {/* Default Route */}
                        <Route 
                            path="/" 
                            element={
                                <PrivateRoute>
                                    {({ user }) => {
                                        if (!user) return <Navigate to="/login" />;
                                        if (!user.role) return <Navigate to="/register" />;
                                        if (user.role === 'admin') return <Navigate to="/admin" />;
                                        if (user.role === 'doctor') return <Navigate to="/doctor" />;
                                        if (user.role === 'organization') return <Navigate to="/organization" />;
                                        return <Navigate to="/login" />;
                                    }}
                                </PrivateRoute>
                            } 
                        />
                        
                        {/* Catch all route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;