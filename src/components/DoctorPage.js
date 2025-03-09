import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCircle, Clipboard, User } from 'lucide-react';
import ProfileSlideOver from './DoctorProfileSlideOver';
import DoctorDashboard from './DoctorDashboard';
import DoctorTasks from './DoctorTasks';

function DoctorPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('profile'); // 'profile' or 'tasks'

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URI}/doctor/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch doctor profile');
      const data = await response.json();
      setDoctorData(data.doctor);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-xl text-indigo-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
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

            {/* Profile Button */}
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <UserCircle className="h-8 w-8" />
              <span className="font-medium">{doctorData?.info?.fullName}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white shadow-md rounded-lg p-1 inline-flex space-x-1">
          <button
            onClick={() => setCurrentView('profile')}
            className={`px-6 py-3 rounded-md flex items-center space-x-2 transition ${
              currentView === 'profile' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setCurrentView('tasks')}
            className={`px-6 py-3 rounded-md flex items-center space-x-2 transition ${
              currentView === 'tasks' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Clipboard className="h-5 w-5" />
            <span>Assigned Cases</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'profile' ? (
          <DoctorDashboard doctorData={doctorData} />
        ) : (
          <DoctorTasks doctorEmail={doctorData?.userId?.email} />
        )}
      </div>

      {/* Profile Slide Over */}
      <ProfileSlideOver
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        doctorData={doctorData}
        onUpdate={(updatedData) => setDoctorData(updatedData)}
        onLogout={handleLogout}
      />
    </div>
  );
}
export default DoctorPage;