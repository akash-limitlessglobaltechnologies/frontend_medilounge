import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import { 
    AlertCircle, 
    ArrowLeft, 
    Check, 
    Building, 
    Globe,                     
    Cpu,
    Loader
} from 'lucide-react';
import axios from 'axios';

function AICompanyRegistration() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        website: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        if (user?.role === 'aicompany') {
            navigate('/aicompany');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = 'Company name is required';
        if (!formData.website.trim()) newErrors.website = 'Website is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // In AICompanyRegistration.jsx
const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_URI}/aicompany/profile`,
            formData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        
        // Save the new token if returned
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        
        setSubmitSuccess(true);
        setTimeout(() => {
            navigate('/aicompany');
        }, 1500);
    } catch (error) {
        console.error('Registration error:', error);
        setSubmitError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
};

    const handleBack = () => {
        navigate('/register');
    };

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                    <div className="flex flex-col items-center">
                        <div className="bg-green-100 p-3 rounded-full mb-4">
                            <Check className="text-green-600 w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
                        <p className="text-gray-600 mb-4 text-center">Your AI company registration has been completed. Redirecting...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Navigation Bar */}
            <nav className="bg-white/80 backdrop-blur-md shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
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
                            Back to Selection
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex justify-center py-10 px-4">
                <div className="w-full max-w-3xl">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                            <h1 className="text-2xl font-bold text-white flex items-center">
                                <Cpu className="mr-3 h-6 w-6" />
                                AI Company Registration
                            </h1>
                            <p className="text-indigo-100 mt-2">Complete your profile to join our healthcare AI ecosystem</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {submitError && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start">
                                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>{submitError}</span>
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Company Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`block w-full pl-10 pr-3 py-2 rounded-md border ${errors.name ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                                            placeholder="AI Health Solutions Inc."
                                        />
                                    </div>
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                {/* Website */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Website
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Globe className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            className={`block w-full pl-10 pr-3 py-2 rounded-md border ${errors.website ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                                            placeholder="https://www.aihealthtech.com"
                                        />
                                    </div>
                                    {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader className="animate-spin h-5 w-5 mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Complete Registration'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AICompanyRegistration;