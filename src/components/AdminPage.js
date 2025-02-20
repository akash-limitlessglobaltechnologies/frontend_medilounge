import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handleDeleteAccount } from '../utils/deleteAccountUtil';
import axios from 'axios';

// Import admin components
import DoctorList from './admin/DoctorList';
import OrganizationList from './admin/OrganizationList';
import DoctorDetails from './admin/DoctorDetails';
import OrganizationDetails from './admin/OrganizationDetails';
import ConfirmDialog from './admin/ConfirmDialog';

function AdminPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Data states
  const [doctors, setDoctors] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [activeTab, setActiveTab] = useState('doctors');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const [doctorsRes, orgsRes] = await Promise.all([
            axios.get(`${process.env.REACT_APP_URI}/api/admin/doctors`, config),
          axios.get(`${process.env.REACT_APP_URI}/api/admin/organizations`, config)
        ]);
        
        setDoctors(doctorsRes.data);
        setOrganizations(orgsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('doctors')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'doctors'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Doctors ({doctors.length})
              </button>
              <button
                onClick={() => setActiveTab('organizations')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'organizations'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Organizations ({organizations.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'doctors' ? (
              <DoctorList
                doctors={doctors}
                onDoctorClick={setSelectedDoctor}
              />
            ) : (
              <OrganizationList
                organizations={organizations}
                onOrganizationClick={setSelectedOrganization}
              />
            )}
          </div>
        </div>

        {/* Confirmation Dialogs */}
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
          onConfirm={async () => {
            await handleDeleteAccount(logout, navigate);
            setShowDeleteDialog(false);
          }}
          title="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone."
          confirmText="Delete Account"
        />

        {/* Details Modals */}
        {selectedDoctor && (
          <DoctorDetails
            doctor={selectedDoctor}
            onClose={() => setSelectedDoctor(null)}
          />
        )}

        {selectedOrganization && (
          <OrganizationDetails
            organization={selectedOrganization}
            onClose={() => setSelectedOrganization(null)}
          />
        )}
      </div>
    </div>
  );
}

export default AdminPage;