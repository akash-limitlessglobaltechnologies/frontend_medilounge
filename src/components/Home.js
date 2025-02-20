import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_URI}/api/logout`, {
        credentials: 'include'
      });
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {user?.profilePhoto && (
                <img 
                  src={user.profilePhoto} 
                  alt="Profile" 
                  className="h-12 w-12 rounded-full"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">Welcome, {user?.displayName}</h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
          
          {/* Navigation Buttons */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <button
              onClick={() => navigate('/doctor')}
              className="w-full px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Doctor Page
            </button>
            <button
              onClick={() => navigate('/organization')}
              className="w-full px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Organization Page
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full px-6 py-3 text-lg font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;