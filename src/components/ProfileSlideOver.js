import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Building2, Phone, Users, Trash2, LogOut } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import { handleDeleteAccount } from '../utils/deleteAccountUtil';
import { useNavigate } from 'react-router-dom';

function ProfileSlideOver({ isOpen, onClose, organizationData, onUpdate, onLogout }) {
  const [editMode, setEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: organizationData?.name || '',
    contactNumber: organizationData?.contactNumber || '',
    numberOfEmployees: organizationData?.numberOfEmployees || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URI}/organization/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const data = await response.json();
      onUpdate(data.organization);
      setEditMode(false);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="translate-y-full"
                  enterTo="translate-y-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveFrom="translate-y-0"
                  leaveTo="translate-y-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      {/* Header with gradient background */}
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-2xl font-semibold text-white">
                            Organization Profile
                          </Dialog.Title>
                          <button
                            type="button"
                            className="rounded-md text-white hover:text-gray-200"
                            onClick={onClose}
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                      </div>

                      {/* Profile Content */}
                      <div className="px-4 py-6 sm:px-6 flex-1">
                        {editMode ? (
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                              <input
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Number of Employees</label>
                              <input
                                type="number"
                                name="numberOfEmployees"
                                value={formData.numberOfEmployees}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                              <Building2 className="h-6 w-6 text-indigo-600" />
                              <div>
                                <p className="text-sm text-gray-500">Organization Name</p>
                                <p className="text-lg font-medium text-gray-900">{organizationData.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Phone className="h-6 w-6 text-indigo-600" />
                              <div>
                                <p className="text-sm text-gray-500">Contact Number</p>
                                <p className="text-lg font-medium text-gray-900">{organizationData.contactNumber}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Users className="h-6 w-6 text-indigo-600" />
                              <div>
                                <p className="text-sm text-gray-500">Number of Employees</p>
                                <p className="text-lg font-medium text-gray-900">{organizationData.numberOfEmployees}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions Footer */}
                      <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                        <div className="flex flex-col space-y-3">
                          {editMode ? (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => setEditMode(false)}
                                className="flex-1 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleUpdateProfile}
                                className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                              >
                                Save Changes
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditMode(true)}
                              className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                            >
                              Edit Profile
                            </button>
                          )}
                          
                          <button
                            onClick={() => setShowLogoutDialog(true)}
                            className="w-full flex items-center justify-center space-x-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </button>
                          
                          <button
                            onClick={() => setShowDeleteDialog(true)}
                            className="w-full flex items-center justify-center space-x-2 rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Account</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={() => {
          onLogout();
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
          try {
            const response = await fetch(`${process.env.REACT_APP_URI}/organization/profile`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });

            if (!response.ok) throw new Error('Failed to delete organization profile');
            await handleDeleteAccount(onLogout, navigate);
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
    </>
  );
}

export default ProfileSlideOver;