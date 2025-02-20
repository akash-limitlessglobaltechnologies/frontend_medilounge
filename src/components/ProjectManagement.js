import React, { useState } from 'react';

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

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
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
    <div className="bg-white rounded-lg p-6 mb-4">
      <h3 className="text-lg font-medium mb-4">Add New Project</h3>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Project Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Links</label>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="title"
                value={newLink.title}
                onChange={handleLinkInputChange}
                placeholder="Link Title"
                className="rounded-md border border-gray-300 px-3 py-2"
              />
              <input
                type="url"
                name="url"
                value={newLink.url}
                onChange={handleLinkInputChange}
                placeholder="URL"
                className="rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <button
              type="button"
              onClick={handleAddLink}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add Link
            </button>
          </div>
          
          {formData.links.length > 0 && (
            <div className="mt-3 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Added Links:</h4>
              {formData.links.map((link, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{link.title}</p>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {link.url}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Add Project
          </button>
        </div>
      </form>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-2">{project.name}</h3>
      <p className="text-gray-600 mb-4">{project.description}</p>
      {project.links && project.links.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Project Links:</h4>
          <div className="grid gap-2">
            {project.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
              >
                <span>{link.title}</span>
                <span className="text-gray-400">→</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectManagement({ projects, onProjectsUpdate }) {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddProject = (newProject) => {
    onProjectsUpdate([...projects, newProject]);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Projects</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Add Project
        </button>
      </div>

      {showAddForm && (
        <AddProjectForm
          onAdd={handleAddProject}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        ) : (
          <p className="text-gray-600">No projects added yet.</p>
        )}
      </div>
    </div>
  );
}

export default ProjectManagement;