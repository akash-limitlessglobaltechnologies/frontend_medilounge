import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handleDeleteAccount } from '../utils/deleteAccountUtil';

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              confirmText === 'Delete Account' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function DoctorPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

      if (!response.ok) {
        throw new Error('Failed to fetch doctor profile');
      }

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

  const handleDeleteProfile = async () => {
    try {
      // First delete doctor profile
      const profileResponse = await fetch(`${process.env.REACT_APP_URI}/doctor/profile`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to delete doctor profile');
      }

      // Then delete account
      await handleDeleteAccount(logout, navigate);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete account: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4 space-x-4">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Logout
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Account
          </button>
        </div>

        {doctorData && (
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Doctor Profile</h1>
              <button
                onClick={() => navigate('/doctor/edit')}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
  <div>
    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
    <p className="mt-1 text-lg text-gray-900">{doctorData.info.fullName || 'Not specified'}</p>
  </div>
  <div>
    <h3 className="text-sm font-medium text-gray-500">Specialization</h3>
    <p className="mt-1 text-lg text-gray-900">{doctorData.info.specialization || 'Not specified'}</p>
  </div>
  <div>
    <h3 className="text-sm font-medium text-gray-500">Qualifications</h3>
    <p className="mt-1 text-lg text-gray-900">
      {Array.isArray(doctorData.info.qualifications) 
        ? doctorData.info.qualifications.join(', ') 
        : 'Not specified'}
    </p>
  </div>
  <div>
    <h3 className="text-sm font-medium text-gray-500">License Number</h3>
    <p className="mt-1 text-lg text-gray-900">{doctorData.info.licenseNumber || 'Not specified'}</p>
  </div>
  <div>
    <h3 className="text-sm font-medium text-gray-500">Experience (Years)</h3>
    <p className="mt-1 text-lg text-gray-900">{doctorData.info.experience || 'Not specified'}</p>
  </div>
  <div>
    <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
    <p className="mt-1 text-lg text-gray-900">{doctorData.info.contactNumber || 'Not specified'}</p>
  </div>
  <div>
    <h3 className="text-sm font-medium text-gray-500">Consultation Fees</h3>
    <p className="mt-1 text-lg text-gray-900">
      {doctorData.info.consultationFees ? `₹${doctorData.info.consultationFees}` : 'Not specified'}
    </p>
  </div>
  <div className="col-span-2">
    <h3 className="text-sm font-medium text-gray-500">Clinic Address</h3>
    <p className="mt-1 text-lg text-gray-900">{doctorData.info.clinicAddress || 'Not specified'}</p>
  </div>
</div>

            <div>
  <h3 className="text-lg font-medium text-gray-900 mb-4">Available Time Slots</h3>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {doctorData.info.availableTimeSlots && Object.entries(doctorData.info.availableTimeSlots).map(([day, slots]) => (
      slots && slots.length > 0 && (
        <div key={day} className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 capitalize mb-2">{day}</h4>
          <div className="space-y-1">
            {slots.map((slot, index) => (
              <p key={index} className="text-sm text-gray-600">{slot}</p>
            ))}
          </div>
        </div>
      )
    ))}
  </div>
</div>
          </div>
        )}

        <ConfirmDialog
          isOpen={showLogoutDialog}
          onClose={() => setShowLogoutDialog(false)}
          onConfirm={() => {
            handleLogout();
            setShowLogoutDialog(false);
          }}
          title="Confirm Logout"
          message="Are you sure you want to logout?"
          confirmText="Logout"
        />

        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteProfile}
          title="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone."
          confirmText="Delete Account"
        />
      </div>
    </div>
  );
}

export default DoctorPage;