import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCircle } from 'lucide-react';
import ProfileSlideOver from './DoctorProfileSlideOver';

function DoctorPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                  MediConnect
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DoctorDashboard doctorData={doctorData} />
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

// Doctor Dashboard Component
function DoctorDashboard({ doctorData }) {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Welcome, Dr. {doctorData.info.fullName}
        </h2>
        <p className="text-gray-600 mt-2">{doctorData.info.specialization} • {doctorData.info.experience} years of experience</p>
      </div>

      {/* Professional Details */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Bio</h3>
        <p className="text-gray-600">{doctorData.info.professionalBio}</p>
      </div>

      {/* Qualifications */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Qualifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctorData.info.qualifications.map((qual, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900">{qual.degree}</h4>
              <p className="text-gray-600">{qual.institution}</p>
              <p className="text-sm text-gray-500">{qual.year}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Expertise */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Areas of Expertise</h3>
        <div className="flex flex-wrap gap-2">
          {doctorData.info.expertise.map((exp, index) => (
            <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
              {exp.title}
            </span>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {doctorData.info.availableDays.map((day, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900">{day}</h4>
              <div className="mt-2 space-y-1">
                {doctorData.info.timeSlots.map((slot, slotIndex) => (
                  <p key={slotIndex} className="text-sm text-gray-600">
                    {slot.startTime} - {slot.endTime}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DoctorPage;