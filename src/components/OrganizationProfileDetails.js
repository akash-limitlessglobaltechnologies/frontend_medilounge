import React, { useState } from 'react';

function OrganizationProfileDetails({ organizationData, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: organizationData.name,
    contactNumber: organizationData.contactNumber,
    numberOfEmployees: organizationData.numberOfEmployees
  });
  const [error, setError] = useState(null);

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

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      onUpdate(data.organization);
      setEditMode(false);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organization Profile</h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {editMode ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Organization Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Employees</label>
            <input
              type="number"
              name="numberOfEmployees"
              value={formData.numberOfEmployees}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <button
            onClick={handleUpdateProfile}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Organization Name</h3>
            <p className="mt-1 text-lg text-gray-900">{organizationData.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
            <p className="mt-1 text-lg text-gray-900">{organizationData.contactNumber}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Number of Employees</h3>
            <p className="mt-1 text-lg text-gray-900">{organizationData.numberOfEmployees}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizationProfileDetails;