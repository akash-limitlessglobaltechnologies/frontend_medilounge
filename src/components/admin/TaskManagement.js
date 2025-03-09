import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Square, 
  CheckSquare, 
  Link2, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Minus,
  X
} from 'lucide-react';
import DoctorListModal from './DoctorListModal';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
    assigned: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
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

const RemovalModal = ({ isOpen, onClose, onConfirm, link, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Remove Doctor Assignment</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-600 mb-4">How would you like to remove the doctor?</p>
          <div className="space-y-3">
            <button
              onClick={() => onConfirm(false)}
              disabled={loading}
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Remove only from "{link?.title}"
            </button>
            <button
              onClick={() => onConfirm(true)}
              disabled={loading}
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Remove from all links assigned to this doctor in the project
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

function TaskManagement({ project, onClose, onUpdate }) {
  const [doctorListModal, setDoctorListModal] = useState(false);
  const [removalModal, setRemovalModal] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [linkToRemove, setLinkToRemove] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (selectAll) {
      const pendingLinks = project.links
        .filter(link => !link.assignedDoctor || link.assignedDoctor.status === 'pending')
        .map(link => link._id);
      setSelectedLinks(pendingLinks);
    } else {
      setSelectedLinks([]);
    }
  }, [selectAll, project.links]);

  const toggleLinkSelection = (linkId) => {
    setSelectedLinks(prev => 
      prev.includes(linkId) 
        ? prev.filter(id => id !== linkId)
        : [...prev, linkId]
    );
  };

  const handleDoctorSelect = async (doctor) => {
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
          linkIds: selectedLinks,
          doctorEmail: doctor.userId.email
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to assign tasks');
      }

      setDoctorListModal(false);
      setSelectedLinks([]);
      setSelectAll(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDoctor = async (removeAll) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_URI}/api/admin/assignments`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          projectId: project._id,
          linkIds: removeAll ? [] : [linkToRemove._id],
          removeAll,
          doctorEmail: linkToRemove.assignedDoctor.doctorEmail
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove doctor');
      }

      setRemovalModal(false);
      setLinkToRemove(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center">
              <button
                onClick={onClose}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-sm text-gray-500">Task Management</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Project Description</h2>
            <p className="text-gray-600">{project.description}</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Project Links</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectAll(!selectAll)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  {selectAll ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                  <span>Select All Pending</span>
                </button>
                {selectedLinks.length > 0 && (
                  <button
                    onClick={() => setDoctorListModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Assign Selected ({selectedLinks.length})
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {project.links?.map((link) => {
                const canSelect = !link.assignedDoctor || link.assignedDoctor.status === 'pending';
                return (
                  <div 
                    key={link._id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {canSelect && (
                          <button
                            onClick={() => toggleLinkSelection(link._id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {selectedLinks.includes(link._id) ? 
                              <CheckSquare className="h-5 w-5 text-blue-600" /> : 
                              <Square className="h-5 w-5" />
                            }
                          </button>
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{link.title}</h3>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center mt-1"
                          >
                            <Link2 className="h-4 w-4 mr-1" />
                            Visit Link
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        </div>
                      </div>

                      {link.assignedDoctor && (
                        <div className="flex items-center space-x-4">
                          <div className="flex flex-col items-end">
                            <div className="text-sm text-gray-900">
                              {link.assignedDoctor.doctorEmail}
                            </div>
                            <StatusBadge status={link.assignedDoctor.status} />
                          </div>
                          <button
                            onClick={() => {
                              setLinkToRemove(link);
                              setRemovalModal(true);
                            }}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Minus className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <DoctorListModal
        isOpen={doctorListModal}
        onClose={() => {
          setDoctorListModal(false);
          setError(null);
        }}
        onDoctorSelect={handleDoctorSelect}
        loading={loading}
      />

      <RemovalModal
        isOpen={removalModal}
        onClose={() => {
          setRemovalModal(false);
          setLinkToRemove(null);
        }}
        onConfirm={handleRemoveDoctor}
        link={linkToRemove}
        loading={loading}
      />

      {error && (
        <div 
          onClick={() => setError(null)}
          className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded cursor-pointer"
        >
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

export default TaskManagement;