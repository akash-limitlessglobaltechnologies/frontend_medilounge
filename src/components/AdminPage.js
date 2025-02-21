import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handleDeleteAccount } from '../utils/deleteAccountUtil';
import axios from 'axios';
import { Search, Filter, UserCircle, Building2, LogOut } from 'lucide-react';

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

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    doctors: {
      specialization: '',
      experience: ''
    },
    organizations: {
      employeeCount: ''
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout: ' + error.message);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.info.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.info.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !filters.doctors.specialization || 
                                doctor.info.specialization === filters.doctors.specialization;
    const matchesExperience = !filters.doctors.experience ||
                             doctor.info.experience >= parseInt(filters.doctors.experience);
    return matchesSearch && matchesSpecialization && matchesExperience;
  });

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmployeeCount = !filters.organizations.employeeCount ||
                                org.numberOfEmployees >= parseInt(filters.organizations.employeeCount);
    return matchesSearch && matchesEmployeeCount;
  });

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
        <div className="text-xl text-red-600">{error}</div>
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
                  Admin Dashboard
                </span>
                <span className="block text-xs text-gray-500">MediConnect Management</span>
              </div>
            </div>

            {/* Profile and Logout */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs and Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Tabs */}
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('doctors')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                  activeTab === 'doctors'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <UserCircle className="h-5 w-5" />
                <span>Doctors ({doctors.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('organizations')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                  activeTab === 'organizations'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Building2 className="h-5 w-5" />
                <span>Organizations ({organizations.length})</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            {activeTab === 'doctors' ? (
              <div className="flex flex-wrap gap-4">
                <select
                  value={filters.doctors.specialization}
                  onChange={(e) => setFilters({
                    ...filters,
                    doctors: { ...filters.doctors, specialization: e.target.value }
                  })}
                  className="px-4 py-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">All Specializations</option>
                  {/* Add unique specializations from doctors array */}
                  {[...new Set(doctors.map(d => d.info.specialization))].map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <select
                  value={filters.doctors.experience}
                  onChange={(e) => setFilters({
                    ...filters,
                    doctors: { ...filters.doctors, experience: e.target.value }
                  })}
                  className="px-4 py-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">All Experience Levels</option>
                  <option value="5">5+ Years</option>
                  <option value="10">10+ Years</option>
                  <option value="15">15+ Years</option>
                </select>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                <select
                  value={filters.organizations.employeeCount}
                  onChange={(e) => setFilters({
                    ...filters,
                    organizations: { ...filters.organizations, employeeCount: e.target.value }
                  })}
                  className="px-4 py-2 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">All Sizes</option>
                  <option value="50">50+ Employees</option>
                  <option value="100">100+ Employees</option>
                  <option value="500">500+ Employees</option>
                </select>
              </div>
            )}
          </div>

          {/* Lists */}
          <div className="bg-gray-50 rounded-xl p-6">
            {activeTab === 'doctors' ? (
              <DoctorList
                doctors={filteredDoctors}
                onDoctorClick={setSelectedDoctor}
              />
            ) : (
              <OrganizationList
                organizations={filteredOrganizations}
                onOrganizationClick={setSelectedOrganization}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
      />

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
  );
}

export default AdminPage;