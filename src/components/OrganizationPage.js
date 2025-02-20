import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handleDeleteAccount } from '../utils/deleteAccountUtil';
import OrganizationProfileDetails from './OrganizationProfileDetails';
import ProjectManagement from './ProjectManagement';
import ConfirmDialog from './ConfirmDialog';

function OrganizationPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [organizationData, setOrganizationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchOrganizationData();
    fetchProjects();
  }, []);

  const fetchOrganizationData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URI}/organization/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch organization data');
      }

      const data = await response.json();
      setOrganizationData(data.organization);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URI}/organization/projects`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
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
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
  
          {organizationData && (
            <OrganizationProfileDetails
              organizationData={organizationData}
              onUpdate={(updatedData) => setOrganizationData(updatedData)}
            />
          )}
  
          <ProjectManagement
            projects={projects}
            onProjectsUpdate={(updatedProjects) => setProjects(updatedProjects)}
          />
  
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
              // First delete organization profile
              try {
                const response = await fetch(`${process.env.REACT_APP_URI}/organization/profile`, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                });
  
                if (!response.ok) {
                  throw new Error('Failed to delete organization profile');
                }
  
                // Then delete user account
                await handleDeleteAccount(logout, navigate);
              } catch (error) {
                console.error('Delete error:', error);
                alert('Failed to delete account: ' + error.message);
              }
              setShowDeleteDialog(false);
            }}
            title="Delete Account"
            message="Are you sure you want to delete your account? This action cannot be undone."
            confirmText="Delete Account"
          />
        </div>
      </div>
    );
  }
  
  export default OrganizationPage;