// src/components/AdminPage.js
import React, { useState } from 'react';
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
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4 space-x-4">
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
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <div className="mt-4">
            <p className="text-gray-600">Welcome, {user?.displayName}</p>
            <p className="text-gray-600">Email: {user?.email}</p>
          </div>
          {/* Add admin-specific content here */}
        </div>

        {/* Logout Confirmation Dialog */}
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

        {/* Delete Account Confirmation Dialog */}
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
      </div>
    </div>
  );
}

export default AdminPage;