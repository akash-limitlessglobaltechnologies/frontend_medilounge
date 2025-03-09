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

// Import Cornerstone libraries
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';

// Initialize Cornerstone once at the app level
const initCornerstone = () => {
    try {
        // Set external dependencies
        cornerstoneTools.external.cornerstone = cornerstone;
        cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

        // Configure webworkers
        cornerstoneWADOImageLoader.webWorkerManager.initialize({
            maxWebWorkers: navigator.hardwareConcurrency || 1,
            startWebWorkersOnDemand: true,
        });

        // Register image loaders
        cornerstone.registerImageLoader('http', cornerstoneWADOImageLoader.loadImage);
        cornerstone.registerImageLoader('https', cornerstoneWADOImageLoader.loadImage);
        cornerstone.registerImageLoader('wadouri', cornerstoneWADOImageLoader.wadouri.loadImage);
        cornerstone.registerImageLoader('dicomweb', cornerstoneWADOImageLoader.wadors.loadImage);

        // Configure WADO image loader
        cornerstoneWADOImageLoader.configure({
            useWebWorkers: true,
            decodeConfig: {
                convertFloatPixelDataToInt: false,
                use16Bits: true
            }
        });

        console.log('Cornerstone initialized successfully');
    } catch (error) {
        console.error('Error initializing Cornerstone:', error);
    }
};

function App() {
    useEffect(() => {
        // Initialize Cornerstone libraries
        initCornerstone();
        
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