import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrganizationRegistration = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    numberOfEmployees: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'doctor') {
      navigate('/doctor');
    } else if (user?.role === 'organization') {
      navigate('/organization');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.contactNumber || !formData.numberOfEmployees) {
      setError('All fields are required');
      return false;
    }
    if (isNaN(formData.numberOfEmployees) || formData.numberOfEmployees < 1) {
      setError('Number of employees must be a valid number');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First create organization profile
      const profileResponse = await fetch(`${process.env.REACT_APP_URI}/organization/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to create organization profile');
      }

      // Then complete registration
      const registrationResponse = await fetch(`${process.env.REACT_APP_URI}/api/complete-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          role: 'organization',
          name: formData.name
        })
      });

      if (registrationResponse.ok) {
        const data = await registrationResponse.json();
        login(data.token);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-center mb-8">
            Organization Registration
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="mb-6">
            <div className="flex justify-between">
              <div className={`h-1 w-1/2 ${step === 1 ? 'bg-blue-500' : 'bg-green-500'}`}></div>
              <div className={`h-1 w-1/2 ${step === 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            </div>
            <div className="text-center text-sm text-gray-600 mt-2">
              Step {step} of 2
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Organization Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  id="contactNumber"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="numberOfEmployees" className="block text-sm font-medium text-gray-700">
                  Number of Employees
                </label>
                <input
                  type="number"
                  name="numberOfEmployees"
                  id="numberOfEmployees"
                  required
                  min="1"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  value={formData.numberOfEmployees}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Review Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Organization Name</dt>
                    <dd className="text-sm text-gray-900">{formData.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
                    <dd className="text-sm text-gray-900">{formData.contactNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Number of Employees</dt>
                    <dd className="text-sm text-gray-900">{formData.numberOfEmployees}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Completing Registration...' : 'Complete Registration'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationRegistration;