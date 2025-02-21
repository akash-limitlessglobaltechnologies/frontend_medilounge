import React, { useState } from 'react';
import { Plus, ExternalLink, ChevronRight } from 'lucide-react';
import AddProjectForm from './AddProjectForm';

function ProjectCard({ project }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
      <div className="relative bg-white rounded-2xl p-6 shadow-xl transition-all duration-200 hover:shadow-2xl">
        <div className="absolute top-6 right-6 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="h-6 w-6" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3">{project.name}</h3>
        <p className="text-gray-600 mb-6">{project.description}</p>
        
        {project.links && project.links.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Project Links</h4>
            <div className="grid gap-2">
              {project.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <span>{link.title}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectManagement({ projects, onProjectsUpdate }) {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddProject = (newProject) => {
    onProjectsUpdate([...projects, newProject]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Your Projects
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
            <AddProjectForm
              onAdd={handleAddProject}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        ) : (
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-white rounded-2xl p-8 text-center">
                <p className="text-gray-600">No projects added yet. Click "Add Project" to get started.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectManagement;