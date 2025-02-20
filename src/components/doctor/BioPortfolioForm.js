import React, { useState } from 'react';

const BioPortfolioForm = ({ formData, onChange, errors = {} }) => {
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: '',
    description: '',
    link: ''
  });

  const handlePortfolioItemAdd = () => {
    if (newPortfolioItem.title && newPortfolioItem.description) {
      onChange('portfolioItems', [...(formData.portfolioItems || []), newPortfolioItem]);
      setNewPortfolioItem({ title: '', description: '', link: '' });
    }
  };

  const handlePortfolioItemRemove = (index) => {
    const newItems = formData.portfolioItems.filter((_, i) => i !== index);
    onChange('portfolioItems', newItems);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Professional Bio</label>
        <textarea
          value={formData.professionalBio}
          onChange={(e) => onChange('professionalBio', e.target.value)}
          rows="4"
          className={`mt-1 block w-full rounded-md border ${
            errors.professionalBio ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2`}
          placeholder="Write a brief professional bio..."
        />
        {errors.professionalBio && (
          <p className="mt-1 text-sm text-red-500">{errors.professionalBio}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Portfolio Items</label>
        </div>
        <div className="space-y-4 bg-gray-50 p-4 rounded-md mb-4">
          <div>
            <input
              type="text"
              placeholder="Title"
              value={newPortfolioItem.title}
              onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, title: e.target.value }))}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 mb-2"
            />
            <textarea
              placeholder="Description"
              value={newPortfolioItem.description}
              onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, description: e.target.value }))}
              rows="2"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 mb-2"
            />
            <input
              type="url"
              placeholder="Link (optional)"
              value={newPortfolioItem.link}
              onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, link: e.target.value }))}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 mb-2"
            />
            <button
              type="button"
              onClick={handlePortfolioItemAdd}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Add Portfolio Item
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {formData.portfolioItems?.map((item, index) => (
            <div key={index} className="bg-white border rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{item.title}</h4>
                <button
                  type="button"
                  onClick={() => handlePortfolioItemRemove(index)}
                  className="text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  View Link →
                </a>
              )}
            </div>
          ))}
        </div>
        {errors.portfolioItems && (
          <p className="mt-1 text-sm text-red-500">{errors.portfolioItems}</p>
        )}
      </div>
    </div>
  );
};

export default BioPortfolioForm;