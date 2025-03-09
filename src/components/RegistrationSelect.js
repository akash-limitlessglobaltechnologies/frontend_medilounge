import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Building2, 
    Stethoscope,
    ChevronRight,
    Activity,
    Calendar,
    ClipboardList,
    Shield,
    ArrowLeft,
    Loader
} from 'lucide-react';

function RegistrationSelect() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        if (user?.role === 'doctor') {
            navigate('/doctor');
        } else if (user?.role === 'organization') {
            navigate('/organization');
        }
    }, [user, navigate]);

    const handleRoleSelection = (role) => {
        console.log('Selected role:', role);
        if (role === 'doctor') {
            navigate('/register/doctor');
        } else if (role === 'organization') {
            navigate('/register/organization');
        }
    };

    const handleBack = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (user?.role) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Navigation Bar */}
            <nav className="bg-white/80 backdrop-blur-md shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Back Button */}
                       

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

                        <button
                            onClick={handleBack}
                            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Login
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-12">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                            Choose Registration Type
                        </h1>
                        <p className="text-gray-600">Select how you would like to register with Medworks</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Doctor Card */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <button
                                onClick={() => handleRoleSelection('doctor')}
                                className="relative w-full bg-white rounded-2xl p-6 shadow-xl transition-all duration-200 hover:shadow-2xl"
                            >
                                <div className="absolute top-6 right-6 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="h-6 w-6" />
                                </div>
                                
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-6">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30"></div>
                                        <div className="relative bg-white rounded-full p-4 shadow-lg">
                                            <Stethoscope className="h-12 w-12 text-indigo-600" />
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Register as Doctor</h2>
                                    <p className="text-gray-600 mb-6">Join our network of healthcare professionals</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-left">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Flexible Schedule</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <ClipboardList className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Patient Management</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Activity className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Practice Growth</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Shield className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Secure Platform</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Organization Card */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <button
                                onClick={() => handleRoleSelection('organization')}
                                className="relative w-full bg-white rounded-2xl p-6 shadow-xl transition-all duration-200 hover:shadow-2xl"
                            >
                                <div className="absolute top-6 right-6 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="h-6 w-6" />
                                </div>
                                
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-6">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30"></div>
                                        <div className="relative bg-white rounded-full p-4 shadow-lg">
                                            <Building2 className="h-12 w-12 text-indigo-600" />
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Register as Organization</h2>
                                    <p className="text-gray-600 mb-6">Establish your healthcare facility presence</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-left">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Staff Management</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <ClipboardList className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Resource Planning</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Activity className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Analytics</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Shield className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm text-gray-600">Compliance</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegistrationSelect;