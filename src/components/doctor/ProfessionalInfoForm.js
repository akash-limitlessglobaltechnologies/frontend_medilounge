import React from 'react';

const ProfessionalInfoForm = ({ formData, onChange, errors = {} }) => {
  const specializations = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Pediatrics',
    'Psychiatry',
    'Surgery',
    'Other'
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Specialization</label>
        <select
          name="specialization"
          value={formData.specialization}
          onChange={(e) => onChange('specialization', e.target.value)}
          className={`mt-1 block w-full rounded-md border ${
            errors.specialization ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2`}
        >
          <option value="">Select Specialization</option>
          {specializations.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
        {errors.specialization && (
          <p className="mt-1 text-sm text-red-500">{errors.specialization}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">License Number</label>
        <input
          type="text"
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={(e) => onChange('licenseNumber', e.target.value)}
          className={`mt-1 block w-full rounded-md border ${
            errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2`}
          placeholder="Enter your medical license number"
        />
        {errors.licenseNumber && (
          <p className="mt-1 text-sm text-red-500">{errors.licenseNumber}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
        <input
          type="number"
          name="experience"
          min="0"
          value={formData.experience}
          onChange={(e) => onChange('experience', e.target.value)}
          className={`mt-1 block w-full rounded-md border ${
            errors.experience ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2`}
        />
        {errors.experience && (
          <p className="mt-1 text-sm text-red-500">{errors.experience}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Qualifications</label>
          <button
            type="button"
            onClick={() => onChange('qualifications', [...(formData.qualifications || []), {
              degree: '',
              institution: '',
              year: ''
            }])}
            className="text-sm text-indigo-600 hover:text-indigo-900"
          >
            + Add Qualification
          </button>
        </div>
        {formData.qualifications?.map((qual, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-4 bg-gray-50 p-4 rounded-md">
            <div>
              <input
                type="text"
                placeholder="Degree"
                value={qual.degree}
                onChange={(e) => {
                  const newQuals = [...formData.qualifications];
                  newQuals[index].degree = e.target.value;
                  onChange('qualifications', newQuals);
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Institution"
                value={qual.institution}
                onChange={(e) => {
                  const newQuals = [...formData.qualifications];
                  newQuals[index].institution = e.target.value;
                  onChange('qualifications', newQuals);
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Year"
                value={qual.year}
                onChange={(e) => {
                  const newQuals = [...formData.qualifications];
                  newQuals[index].year = e.target.value;
                  onChange('qualifications', newQuals);
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
              <button
                type="button"
                onClick={() => {
                  const newQuals = formData.qualifications.filter((_, i) => i !== index);
                  onChange('qualifications', newQuals);
                }}
                className="text-red-600 hover:text-red-900"
              >
                ×
              </button>
            </div>
          </div>
        ))}
        {errors.qualifications && (
          <p className="mt-1 text-sm text-red-500">{errors.qualifications}</p>
        )}
      </div>
    </div>
  );
};

export default ProfessionalInfoForm;