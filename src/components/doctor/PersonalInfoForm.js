import React from 'react';

const PersonalInfoForm = ({ formData, onChange, errors = {} }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          className={`mt-1 block w-full rounded-md border ${
            errors.fullName ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2`}
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={(e) => onChange('dateOfBirth', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2`}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
  name="gender"
  value={formData.gender}
  onChange={(e) => onChange('gender', e.target.value)}
  className={`mt-1 block w-full rounded-md border ${
    errors.gender ? 'border-red-500' : 'border-gray-300'
  } px-3 py-2`}
>
  <option value="">Select Gender</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Other">Other</option>
</select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
        <input
          type="tel"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={(e) => onChange('contactNumber', e.target.value)}
          className={`mt-1 block w-full rounded-md border ${
            errors.contactNumber ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2`}
          placeholder="Enter your contact number"
        />
        {errors.contactNumber && (
          <p className="mt-1 text-sm text-red-500">{errors.contactNumber}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={(e) => onChange('address', e.target.value)}
          rows="3"
          className={`mt-1 block w-full rounded-md border ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2`}
          placeholder="Enter your address"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-500">{errors.address}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoForm;