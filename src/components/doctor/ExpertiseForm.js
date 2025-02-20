import React, { useState } from 'react';

const ExpertiseForm = ({ formData, onChange, errors = {} }) => {
  const [newExpertise, setNewExpertise] = useState('');

  const handleAddExpertise = () => {
    if (newExpertise.trim()) {
      onChange('expertise', [...(formData.expertise || []), { title: newExpertise.trim() }]);
      setNewExpertise('');
    }
  };

  const handleRemoveExpertise = (index) => {
    const newExpertise = formData.expertise.filter((_, i) => i !== index);
    onChange('expertise', newExpertise);
  };

  const languageOptions = [
    'English',
    'Hindi',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Arabic'
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Areas of Expertise</label>
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newExpertise}
            onChange={(e) => setNewExpertise(e.target.value)}
            placeholder="Enter area of expertise"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2"
          />
          <button
            type="button"
            onClick={handleAddExpertise}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {formData.expertise?.map((exp, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
              <span>{exp.title}</span>
              <button
                type="button"
                onClick={() => handleRemoveExpertise(index)}
                className="text-red-600 hover:text-red-900"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {errors.expertise && (
          <p className="mt-1 text-sm text-red-500">{errors.expertise}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages Spoken
        </label>
        <div className="grid grid-cols-2 gap-2">
          {languageOptions.map(language => (
            <label key={language} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={language}
                checked={formData.languages?.includes(language)}
                onChange={(e) => {
                  const newLanguages = e.target.checked
                    ? [...(formData.languages || []), language]
                    : formData.languages?.filter(lang => lang !== language) || [];
                  onChange('languages', newLanguages);
                }}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">{language}</span>
            </label>
          ))}
        </div>
        {errors.languages && (
          <p className="mt-1 text-sm text-red-500">{errors.languages}</p>
        )}
      </div>
    </div>
  );
};

export default ExpertiseForm;