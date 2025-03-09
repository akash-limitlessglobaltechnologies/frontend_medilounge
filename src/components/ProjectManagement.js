import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight, Clock, CheckCircle, X, ExternalLink, FileText, User } from 'lucide-react';
import AddProjectForm from './AddProjectForm';

function ProjectStatusBadge({ status }) {
  if (!status || status === 'pending') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </span>
    );
  } else if (status === 'assigned') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <Clock className="mr-1 h-3 w-3" />
        In Progress
      </span>
    );
  } else if (status === 'completed') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="mr-1 h-3 w-3" />
        Completed
      </span>
    );
  }
  
  return null;
}

// Sliding panel for project details
function ProjectDetailsPanel({ project, isOpen, onClose, onLinkClick }) {
  if (!isOpen || !project) return null;
  
  // Calculate completion stats
  const totalLinks = project.links ? project.links.length : 0;
  const completedLinks = project.links ? project.links.filter(link => 
    link.assignedDoctor && link.assignedDoctor.status === 'completed'
  ).length : 0;
  
  const completionPercentage = totalLinks > 0 
    ? Math.round((completedLinks / totalLinks) * 100) 
    : 0;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div 
        className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-full h-[70vh] rounded-t-3xl shadow-xl overflow-hidden flex flex-col"
        style={{ 
          animation: "slideUp 0.3s ease-out forwards",
        }}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white bg-opacity-90 backdrop-blur-md z-10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {project.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* Project Description */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex justify-between items-start mb-4">
                <p className="text-gray-600">{project.description}</p>
                
                {project.assignedDoctor && (
                  <ProjectStatusBadge status={project.assignedDoctor.status} />
                )}
              </div>
              
              {/* Progress information */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    Completion Progress
                  </h3>
                  <span className="text-sm font-medium text-gray-700">
                    {completedLinks} of {totalLinks} tasks completed ({completionPercentage}%)
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Project Links */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Project Resources</h3>
              
              {project.links && project.links.length > 0 ? (
                <div className="grid gap-4">
                  {project.links.map((link, index) => (
                    <div 
                      key={link._id || index}
                      onClick={() => onLinkClick(link)}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{link.title}</h3>
                          <a 
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center mt-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="truncate">{link.url}</span>
                            <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0" />
                          </a>
                        </div>
                        
                        <div className="ml-4">
                          {link.assignedDoctor ? (
                            <ProjectStatusBadge status={link.assignedDoctor.status} />
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Unassigned
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {link.assignedDoctor && link.assignedDoctor.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-500">
                            <FileText className="h-4 w-4 mr-1" />
                            <span>Doctor's notes available</span>
                          </div>
                        </div>
                      )}
                      
                      {link.assignedDoctor && link.assignedDoctor.doctorEmail && (
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          <span className="truncate">{link.assignedDoctor.doctorEmail}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8 bg-white rounded-xl">
                  <p>No resources added to this project yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// Link details modal
function LinkDetailsModal({ link, onClose }) {
  if (!link) return null;
  
  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {link.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Link details */}
          <div>
            <h4 className="text-sm font-medium text-gray-500">Resource Link</h4>
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-1 flex items-center text-indigo-600 hover:text-indigo-800"
            >
              {link.url}
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
          
          {/* Status information */}
          <div className="py-3 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <ProjectStatusBadge status={link.assignedDoctor?.status} />
            </div>
            
            {link.assignedDoctor && (
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Assigned To</h5>
                    <p className="mt-1 text-gray-900">{link.assignedDoctor.doctorEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Assignment Date</h5>
                    <p className="mt-1 text-gray-900">{formatDate(link.assignedDoctor.assignedDate)}</p>
                  </div>
                </div>
                
                {link.assignedDoctor.status === 'completed' && (
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <h5 className="text-sm font-medium text-gray-500">Completion Date</h5>
                      <p className="mt-1 text-gray-900">{formatDate(link.assignedDoctor.completionDate)}</p>
                    </div>
                  </div>
                )}
                
                {link.assignedDoctor.notes && (
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <h5 className="text-sm font-medium text-gray-500">Doctor's Notes</h5>
                      <div className="mt-2 p-4 bg-gray-50 rounded-xl">
                        <p className="text-gray-900 whitespace-pre-wrap">{link.assignedDoctor.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, onViewDetails }) {
  // Calculate completion stats
  const totalLinks = project.links ? project.links.length : 0;
  const completedLinks = project.links ? project.links.filter(link => 
    link.assignedDoctor && link.assignedDoctor.status === 'completed'
  ).length : 0;
  
  const completionPercentage = totalLinks > 0 
    ? Math.round((completedLinks / totalLinks) * 100) 
    : 0;

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
      <div className="relative bg-white rounded-2xl p-6 shadow-xl transition-all duration-200 hover:shadow-2xl">
        <div className="absolute top-6 right-6 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="h-6 w-6" />
        </div>
        
        <div className="flex justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
          
          {project.assignedDoctor && (
            <ProjectStatusBadge status={project.assignedDoctor.status} />
          )}
        </div>
        
        <p className="text-gray-600 mb-6 line-clamp-2">{project.description}</p>
        
        {/* Link count and completion progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700">
              {totalLinks} {totalLinks === 1 ? 'Link' : 'Links'}
            </h4>
            <span className="text-sm font-medium text-gray-700">
              {completedLinks} of {totalLinks} completed
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* View Details Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => onViewDetails(project)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectManagement({ projects, onProjectsUpdate }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);

  const handleAddProject = (newProject) => {
    onProjectsUpdate([...projects, newProject]);
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const handleLinkClick = (link) => {
    setSelectedLink(link);
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
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onViewDetails={handleViewDetails}
            />
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

      {/* Project Details Panel */}
      <ProjectDetailsPanel
        project={selectedProject}
        isOpen={showProjectDetails}
        onClose={() => setShowProjectDetails(false)}
        onLinkClick={handleLinkClick}
      />
      
      {/* Link Details Modal */}
      {selectedLink && (
        <LinkDetailsModal 
          link={selectedLink} 
          onClose={() => setSelectedLink(null)} 
        />
      )}
    </div>
  );
}

export default ProjectManagement;