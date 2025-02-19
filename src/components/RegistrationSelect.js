import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegistrationSelect() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Check if user already has a role and redirect accordingly
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Don't render if user has a role
  if (user?.role) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        {/* Logout Button Container */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Choose Registration Type</h1>
          
          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelection('doctor')}
              className="w-full px-6 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Register as Doctor
            </button>
            
            <button
              onClick={() => handleRoleSelection('organization')}
              className="w-full px-6 py-4 text-lg font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Register as Organization
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationSelect;