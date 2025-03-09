import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.REACT_APP_URI}/auth/google`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Navigation Bar */}
            <nav className="bg-white/80 backdrop-blur-md shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        {/* Logo and Title */}
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30"></div>
                                <div className="relative bg-white rounded-full p-2">
                                    <svg className="h-10 w-10" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M25 10C25 7.23858 27.2386 5 30 5H35C37.7614 5 40 7.23858 40 10V15C40 17.7614 37.7614 20 35 20H30C27.2386 20 25 17.7614 25 15V10Z" fill="#4F46E5"/>
                                        <path d="M32.5 20V35C32.5 41.6274 27.1274 47 20.5 47C13.8726 47 8.5 41.6274 8.5 35C8.5 28.3726 13.8726 23 20.5 23" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round"/>
                                        <circle cx="32.5" cy="12.5" r="2.5" fill="white"/>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Medworks
                                </span>
                                <span className="block text-xs text-gray-500">Healthcare Excellence</span>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex items-center space-x-8">
                            <button className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center space-x-2">
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>About Us</span>
                            </button>
                            <button className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center space-x-2">
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>Services</span>
                            </button>
                            <button className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center space-x-2">
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Contact</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="relative bg-white rounded-2xl shadow-xl p-8">
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30"></div>
                                <div className="relative bg-white rounded-full p-4 shadow-lg">
                                    <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11h-4V7a2 2 0 00-2-2H7a2 2 0 00-2 2v4H1a1 1 0 000 2h4v4a2 2 0 002 2h6a2 2 0 002-2v-4h4a1 1 0 000-2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-8 mb-8">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                Welcome Back
                            </h2>
                            <p className="text-gray-600">Access your healthcare dashboard</p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="flex items-center gap-2 text-gray-600">
                                <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Secure Platform
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                24/7 Care
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Easy Scheduling
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Expert Doctors
                            </div>
                        </div>

                        <div className="text-center text-sm text-gray-500 mb-6">
                            Sign in with
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-indigo-600 hover:shadow-md transition-all duration-200"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </button>

                        <div className="mt-8 text-center text-sm">
                            <p className="text-gray-600 mb-2">
                                By continuing, you agree to our{' '}
                                <button className="text-indigo-600 hover:underline">Terms</button>{' '}
                                and{' '}
                                <button className="text-indigo-600 hover:underline">Privacy Policy</button>
                            </p>
                            <p className="text-gray-500">
                                Need assistance?{' '}
                                <button className="text-indigo-600 hover:underline">Contact Support</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;