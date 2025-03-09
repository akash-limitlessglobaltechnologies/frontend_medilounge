import React from 'react';
import { X, ExternalLink, CheckCircle, Clock, User, Calendar, FileText } from 'lucide-react';

// Status badge component for modal
function StatusBadge({ status }) {
  if (!status || status === 'pending') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </span>
    );
  } else if (status === 'assigned') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <Clock className="mr-1 h-3 w-3" />
        In Progress
      </span>
    );
  } else if (status === 'completed') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="mr-1 h-3 w-3" />
        Completed
      </span>
    );
  }
  
  return null;
}

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
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
              <StatusBadge status={link.assignedDoctor?.status} />
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
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Assignment Date</h5>
                    <p className="mt-1 text-gray-900">{formatDate(link.assignedDoctor.assignedDate)}</p>
                  </div>
                </div>
                
                {link.assignedDoctor.status === 'completed' && (
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
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

export default LinkDetailsModal;