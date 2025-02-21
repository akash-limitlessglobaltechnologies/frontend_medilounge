import React, { useState } from 'react';
import { Plus, X, Link as LinkIcon } from 'lucide-react';

function AddProjectForm({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    links: []
  });
  const [newLink, setNewLink] = useState({
    title: '',
    url: ''
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLinkInputChange = (e) => {
    const { name, value } = e.target;
    setNewLink(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      if (!isValidUrl(newLink.url)) {
        setError('Please enter a valid URL');
        return;
      }

      setFormData(prev => ({
        ...prev,
        links: [...prev.links, { ...newLink }]
      }));
      setNewLink({ title: '', url: '' });
      setError(null);
    } else {
      setError('Both title and URL are required for the link');
    }
  };

  const handleRemoveLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      setError('Name and description are required');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_URI}/organization/project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add project');
      }

      const data = await response.json();
      onAdd(data.project);
      onCancel();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Add New Project
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Describe your project"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Links
          </label>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                value={newLink.title}
                onChange={handleLinkInputChange}
                placeholder="Link Title"
                className="rounded-xl border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <input
                type="url"
                name="url"
                value={newLink.url}
                onChange={handleLinkInputChange}
                placeholder="URL"
                className="rounded-xl border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <button
              type="button"
              onClick={handleAddLink}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Link</span>
            </button>
          </div>

          {formData.links.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="h-4 w-4 text-indigo-600" />
                    <div>
                      <p className="font-medium text-sm">{link.title}</p>
                      <p className="text-sm text-gray-500 truncate">{link.url}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Add Project
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProjectForm;