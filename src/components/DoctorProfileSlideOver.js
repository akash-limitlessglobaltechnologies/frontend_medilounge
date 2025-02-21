import React, { useState } from 'react';
import { X, UserCircle, Calendar, Award, Globe, Phone, MapPin, CreditCard, Stethoscope, AlignLeft, LogOut, Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import { handleDeleteAccount } from '../utils/deleteAccountUtil';
import { useNavigate } from 'react-router-dom';

function DoctorProfileSlideOver({ isOpen, onClose, doctorData, onUpdate, onLogout }) {
  const [editMode, setEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: doctorData?.info?.fullName || '',
    dateOfBirth: doctorData?.info?.dateOfBirth?.split('T')[0] || '',
    gender: doctorData?.info?.gender || '',
    contactNumber: doctorData?.info?.contactNumber || '',
    address: doctorData?.info?.address || '',
    specialization: doctorData?.info?.specialization || '',
    licenseNumber: doctorData?.info?.licenseNumber || '',
    experience: doctorData?.info?.experience || '',
    consultationFee: doctorData?.info?.consultationFee || '',
    professionalBio: doctorData?.info?.professionalBio || '',
    languages: doctorData?.info?.languages || [],
    qualifications: doctorData?.info?.qualifications || [],
    expertise: doctorData?.info?.expertise || [],
    availableDays: doctorData?.info?.availableDays || [],
    timeSlots: doctorData?.info?.timeSlots || []
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInput = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim())
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URI}/doctor/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ info: formData })
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const data = await response.json();
      onUpdate(data.doctor);
      setEditMode(false);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md">
            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-white">Doctor Profile</h2>
                  <button onClick={onClose} className="text-white hover:text-gray-200">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Profile Content */}
              <div className="flex-1 px-4 py-6 sm:px-6">
                {editMode ? (
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Full Name</label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <input
                              type="date"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                          <input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Address</label>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows="3"
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Specialization</label>
                          <input
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">License Number</label>
                          <input
                            type="text"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                            <input
                              type="number"
                              name="experience"
                              value={formData.experience}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
                            <input
                              type="number"
                              name="consultationFee"
                              value={formData.consultationFee}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Professional Bio</label>
                          <textarea
                            name="professionalBio"
                            value={formData.professionalBio}
                            onChange={handleInputChange}
                            rows="4"
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Languages (comma-separated)</label>
                          <input
                            type="text"
                            value={formData.languages.join(', ')}
                            onChange={(e) => handleArrayInput('languages', e.target.value)}
                            className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Personal Information Display */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <UserCircle className="h-6 w-6 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="text-lg font-medium text-gray-900">{doctorData.info.fullName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-6 w-6 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-500">Date of Birth</p>
                          <p className="text-lg font-medium text-gray-900">
                            {new Date(doctorData.info.dateOfBirth).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-6 w-6 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-500">Contact Number</p>
                          <p className="text-lg font-medium text-gray-900">{doctorData.info.contactNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-6 w-6 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-lg font-medium text-gray-900">{doctorData.info.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Professional Information Display */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Stethoscope className="h-6 w-6 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-500">Specialization</p>
                          <p className="text-lg font-medium text-gray-900">{doctorData.info.specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Award className="h-6 w-6 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-500">Experience</p>
                          <p className="text-lg font-medium text-gray-900">{doctorData.info.experience} years</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-6 w-6 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-500">Consultation Fee</p>
                          <p className="text-lg font-medium text-gray-900">₹{doctorData.info.consultationFee}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="h-6 w-6 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-500">Languages</p>
                          <p className="text-lg font-medium text-gray-900">
                            {doctorData.info.languages.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <AlignLeft className="h-6 w-6 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-500">Professional Bio</p>
                          <p className="text-lg font-medium text-gray-900">{doctorData.info.professionalBio}</p>
                        </div>
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
                        className="flex-1 rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdate}
                        className="flex-1 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="w-full rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowLogoutDialog(true)}
                    className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteDialog(true)}
                    className="w-full flex items-center justify-center space-x-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            // First delete doctor profile
            const response = await fetch(`${process.env.REACT_APP_URI}/doctor/profile`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });

            if (!response.ok) {
              throw new Error('Failed to delete doctor profile');
            }

            // Then delete user account
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
    </div>
  );
}

export default DoctorProfileSlideOver;