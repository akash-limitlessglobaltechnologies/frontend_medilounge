import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  UserPlus,
  UserMinus,
  CheckCircle,
  AlertCircle,
  ClipboardList,
  LinkIcon,
  ExternalLink,
  X
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
    assigned: { color: 'bg-blue-100 text-blue-800', icon: ClipboardList },
    completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <Icon className="w-4 h-4 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

function ProjectTaskManagement({ project, organization, onClose, doctors }) {
  const [assignModal, setAssignModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAssign = async (doctorEmail) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_URI}/api/admin/assignments/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          projectId: project._id,
          linkId: selectedLink._id,
          doctorEmail
        })
      });

      if (!response.ok) throw new Error('Failed to assign task');
      
      setAssignModal(false);
      // Refresh data
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (linkId, status) => {
    try {
      setLoading(true);
      await fetch(`${process.env.REACT_APP_URI}/api/admin/assignments/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          projectId: project._id,
          linkId,
          status
        })
      });
      // Refresh data
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={onClose}
                  className="mr-4 text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                  <p className="text-sm text-gray-500">{organization.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Project Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Project Description</h2>
            <p className="text-gray-600">{project.description}</p>
          </div>

          {/* Links and Assignments */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Links & Assignments</h2>
            <div className="space-y-4">
              {project.links?.map((link, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{link.title}</h3>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center mt-1"
                      >
                        <LinkIcon className="h-4 w-4 mr-1" />
                        <span>View Link</span>
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </div>

                    <div className="flex items-center space-x-4">
                      {link.assignedDoctor ? (
                        <>
                          <StatusBadge status={link.assignedDoctor.status} />
                          <select
                            value={link.assignedDoctor.status}
                            onChange={(e) => handleStatusChange(link._id, e.target.value)}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-lg"
                          >
                            <option value="pending">Pending</option>
                            <option value="assigned">Assigned</option>
                            <option value="completed">Completed</option>
                          </select>
                          <button 
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeassign(link._id)}
                          >
                            <UserMinus className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedLink(link);
                            setAssignModal(true);
                          }}
                          className="flex items-center px-3 py-1 text-indigo-600 hover:text-indigo-800 border border-indigo-600 rounded-lg"
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          <span>Assign</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Assign Task</h3>
              <button onClick={() => setAssignModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Doctor</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Choose a doctor...</option>
                  {doctors?.map(doctor => (
                    <option key={doctor._id} value={doctor.userId.email}>
                      {doctor.info.fullName} - {doctor.info.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setAssignModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAssign(selectedDoctor)}
                  disabled={!selectedDoctor || loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
          <div className="flex">
            <div className="py-1">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectTaskManagement;