import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StepIndicator from './doctor/StepIndicator';
import PersonalInfoForm from './doctor/PersonalInfoForm';
import ProfessionalInfoForm from './doctor/ProfessionalInfoForm';
import ExpertiseForm from './doctor/ExpertiseForm';
import AvailabilityForm from './doctor/AvailabilityForm';
import BioPortfolioForm from './doctor/BioPortfolioForm';
import ReviewInfo from './doctor/ReviewInfo';

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    address: '',
    specialization: '',
    licenseNumber: '',
    experience: '',
    qualifications: [],
    expertise: [],
    languages: [],
    consultationFee: '',
    availableDays: [],
    timeSlots: [],
    professionalBio: '',
    portfolioItems: []
  });

  useEffect(() => {
    if (user?.role === 'doctor') {
      navigate('/doctor');
    } else if (user?.role === 'organization') {
      navigate('/organization');
    }
  }, [user, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for the field when it's changed
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (currentStep) => {
    let stepErrors = {};
    switch (currentStep) {
      case 0: // Personal Info
        if (!formData.fullName) stepErrors.fullName = 'Full name is required';
        if (!formData.dateOfBirth) stepErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) stepErrors.gender = 'Gender is required';
        if (!formData.contactNumber) stepErrors.contactNumber = 'Contact number is required';
        if (!formData.address) stepErrors.address = 'Address is required';
        break;
      case 1: // Professional Info
        if (!formData.specialization) stepErrors.specialization = 'Specialization is required';
        if (!formData.licenseNumber) stepErrors.licenseNumber = 'License number is required';
        if (!formData.experience) stepErrors.experience = 'Experience is required';
        if (formData.qualifications.length === 0) stepErrors.qualifications = 'At least one qualification is required';
        break;
      case 2: // Expertise
        if (formData.expertise.length === 0) stepErrors.expertise = 'At least one area of expertise is required';
        if (formData.languages.length === 0) stepErrors.languages = 'At least one language is required';
        break;
      case 3: // Availability
        if (!formData.consultationFee) stepErrors.consultationFee = 'Consultation fee is required';
        if (formData.availableDays.length === 0) stepErrors.availableDays = 'At least one available day is required';
        if (formData.timeSlots.length === 0) stepErrors.timeSlots = 'At least one time slot is required';
        break;
      case 4: // Bio & Portfolio
        if (!formData.professionalBio) stepErrors.professionalBio = 'Professional bio is required';
        break;
      default:
        break;
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      // Create doctor profile
      const profileResponse = await fetch(`${process.env.REACT_APP_URI}/doctor/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ info: formData })
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        throw new Error(errorData.message || 'Failed to create doctor profile');
      }

      // Complete registration
      const registrationResponse = await fetch(`${process.env.REACT_APP_URI}/api/complete-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          role: 'doctor',
          name: formData.fullName
        })
      });

      if (!registrationResponse.ok) {
        throw new Error('Registration failed');
      }

      const data = await registrationResponse.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        login(data.token);
        navigate('/doctor');
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <PersonalInfoForm
            formData={formData}
            onChange={handleInputChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <ProfessionalInfoForm
            formData={formData}
            onChange={handleInputChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <ExpertiseForm
            formData={formData}
            onChange={handleInputChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <AvailabilityForm
            formData={formData}
            onChange={handleInputChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <BioPortfolioForm
            formData={formData}
            onChange={handleInputChange}
            errors={errors}
          />
        );
      case 5:
        return <ReviewInfo formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Complete Your Doctor Profile</h1>
          
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {errors.submit}
            </div>
          )}

          <StepIndicator currentStep={step} />
          
          <div className="mb-8">
            {renderStepContent()}
          </div>

          <div className="flex justify-between">
            {step > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Back
              </button>
            )}
            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Completing Registration...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistration;