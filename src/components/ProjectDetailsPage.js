import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  FileText,
  User
} from 'lucide-react';
import LinkDetailsModal from './LinkDetailsModal';

// Status badge component
function StatusBadge({ status }) {
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

function ProjectDetailsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);

  useEffect(() => {
    console.log("Project ID from params:", projectId);
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      console.log("Fetching project details for ID:", projectId);
      
      const response = await fetch(`${process.env.REACT_APP_URI}/organization/project/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) throw new Error('Failed to fetch project details');
      
      const data = await response.json();
      console.log("Response data:", data);
      
      if (data.success) {
        setProject(data.project);
      } else {
        throw new Error(data.message || 'Failed to fetch project details');
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (link) => {
    setSelectedLink(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-xl text-indigo-600">Loading project details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Project not found</div>
      </div>
    );
  }

  // Calculate completion stats
  const totalLinks = project.links ? project.links.length : 0;
  const completedLinks = project.links ? project.links.filter(link => 
    link.assignedDoctor && link.assignedDoctor.status === 'completed'
  ).length : 0;
  
  const completionPercentage = totalLinks > 0 
    ? Math.round((completedLinks / totalLinks) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/organization')}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Projects
        </button>

        {/* Project Header */}
        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{project.name}</h1>
                <p className="mt-2 text-gray-600">{project.description}</p>
              </div>
              
              {project.assignedDoctor && (
                <StatusBadge status={project.assignedDoctor.status} />
              )}
            </div>
            
            {/* Progress information */}
            <div className="mt-6">
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
        </div>

        {/* Project Links */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Project Resources</h2>
            
            {project.links && project.links.length > 0 ? (
              <div className="grid gap-4">
                {project.links.map((link, index) => (
                  <div 
                    key={link._id || index}
                    onClick={() => handleLinkClick(link)}
                    className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 cursor-pointer transition-colors"
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
                          <StatusBadge status={link.assignedDoctor.status} />
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
              <div className="text-center text-gray-500 py-8">
                <p>No resources added to this project yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

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

export default ProjectDetailsPage;