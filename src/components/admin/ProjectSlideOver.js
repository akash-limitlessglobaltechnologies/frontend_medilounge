import React, { useState } from 'react';
import { X, ExternalLink, Link, ChevronRight } from 'lucide-react';
import TaskManagement from './TaskManagement';
function ProjectSlideOver({ isOpen, onClose, organization }) {
  const [selectedProject, setSelectedProject] = useState(null);
  if (!isOpen) return null;
  if (selectedProject) {
    return (
      <div className="fixed inset-0 overflow-hidden z-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          
          <div className="fixed inset-y-0 right-0 flex max-w-full">
            <div className="w-screen max-w-4xl">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <TaskManagement 
                  project={selectedProject}
                  organization={organization}
                  onClose={() => setSelectedProject(null)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md">
            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{organization.name}</h2>
                    <p className="text-indigo-100 text-sm">All Projects</p>
                  </div>
                  <button onClick={onClose} className="text-white hover:text-gray-200">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Projects List */}
              <div className="flex-1 px-4 py-6 sm:px-6">
                {organization.projects && organization.projects.length > 0 ? (
                  <div className="space-y-6">
                    {organization.projects.map((project, index) => (
                      <div 
                        key={index}
                        className="relative group"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative bg-white rounded-2xl p-6 shadow-xl transition-all duration-200 hover:shadow-2xl">
                          <button 
                            onClick={() => setSelectedProject(project)}
                            className="absolute top-6 right-6 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 transform"
                            title="Manage Project Tasks"
                          >
                            <ChevronRight className="h-6 w-6" />
                          </button>

                          <div className="space-y-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
                              <p className="text-gray-600">{project.description}</p>
                            </div>
                            {project.links && project.links.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Project Links</h4>
                                <div className="space-y-2">
                                  {project.links.map((link, linkIndex) => (
                                    <div
                                      key={linkIndex}
                                      className="flex items-center justify-between group/link"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <a
                                          href={link.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                                        >
                                          <Link className="h-4 w-4" />
                                          <span>{link.title}</span>
                                          <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                        </a>
                                      </div>
                                      {link.assignedDoctor && (
                                        <span className="text-sm text-gray-500">
                                          Assigned
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {/* Project Stats */}
                            <div className="pt-4 border-t border-gray-100">
                              <div className="flex justify-between text-sm text-gray-500">
                                <span>{project.links?.length || 0} Links</span>
                                <span>
                                  {project.links?.filter(link => link.assignedDoctor)?.length || 0} Assigned
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    No projects found for this organization.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProjectSlideOver;