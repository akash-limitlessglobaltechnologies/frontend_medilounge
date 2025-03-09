import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle, Clipboard, Image, Film, FileText } from 'lucide-react';
import OHIFViewer from './OHIFViewer';

// Enhanced helper function to detect media files
function detectMediaType(url) {
  if (!url) return null;
  
  // Extract file extension
  const extension = url.split('.').pop().toLowerCase();
  
  // Check for video files
  if (['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv'].includes(extension) || 
      url.includes('video') || url.includes('mp4')) {
    return 'video';
  }
  
  // Check for image files
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'].includes(extension) || 
      url.includes('image')) {
    return 'image';
  }
  
  // Check for medical imaging files
  if (['dcm', 'dicom'].includes(extension) || 
      url.includes('dicom') || url.includes('wado') || 
      url.includes('ohif') || url.includes('scan') || 
      url.includes('ct')) {
    return 'dicom';
  }
  
  // For testing purposes, always return something
  // You can remove this in production
  return 'dicom';
}

function DoctorTasks({ doctorEmail }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [taskNotes, setTaskNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [viewerImageUrl, setViewerImageUrl] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URI}/doctor/assignments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch assignments');
      const data = await response.json();
      
      if (data.success) {
        setAssignments(data.assignments || []);
      } else {
        throw new Error(data.message || 'Failed to fetch assignments');
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTask = (projectId, linkId) => {
    // Find the project
    const project = assignments.find(a => a._id === projectId);
    if (!project) return;
    
    // Find the link in this project
    const link = project.links.find(l => l._id === linkId);
    if (!link) return;
    
    // Set as active task
    setActiveTask({
      projectId,
      projectName: project.projectName,
      organizationName: project.organizationName,
      linkId: link._id,
      linkTitle: link.title,
      linkUrl: link.url,
      status: link.status,
      notes: link.notes || ''
    });
    
    // Set notes from the link if available
    setTaskNotes(link.notes || '');
    setSaveSuccess(false);
    
    // Hide viewer when switching tasks
    setShowViewer(false);
    setViewerImageUrl('');
  };

  const handleViewMedia = () => {
    if (activeTask && activeTask.linkUrl) {
      setViewerImageUrl(activeTask.linkUrl);
      setShowViewer(true);
    }
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
  };

  const handleTaskAction = async (action) => {
    if (!activeTask) return;
    
    setIsSaving(true);
    try {
      const endpoint = action === 'save-draft' 
        ? `${process.env.REACT_APP_URI}/doctor/assignments/save-draft`
        : `${process.env.REACT_APP_URI}/doctor/assignments/complete`;
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId: activeTask.projectId,
          linkId: activeTask.linkId,
          notes: taskNotes
        })
      });

      if (!response.ok) throw new Error('Failed to update task');
      
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to update task');
      
      setSaveSuccess(true);
      
      // If task was completed, refresh the assignments list
      if (action === 'complete') {
        await fetchAssignments();
        setActiveTask(null);
        setShowViewer(false);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Get appropriate icon based on media type
  const getMediaIcon = (url) => {
    const mediaType = detectMediaType(url);
    
    if (mediaType === 'video') {
      return <Film className="w-3 h-3 mr-1" />;
    } else if (mediaType === 'image') {
      return <Image className="w-3 h-3 mr-1" />;
    } else if (mediaType === 'dicom') {
      return <Image className="w-3 h-3 mr-1" />;
    } else {
      return <FileText className="w-3 h-3 mr-1" />;
    }
  };

  // Get viewer button text based on media type
  const getViewerButtonText = (url) => {
    const mediaType = detectMediaType(url);
    
    if (mediaType === 'video') {
      return 'View Video';
    } else if (mediaType === 'image') {
      return 'View Image';
    } else if (mediaType === 'dicom') {
      return 'View in OHIF Viewer';
    } else {
      return 'View File';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 flex justify-center items-center min-h-96">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-indigo-600">Loading assignments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 flex justify-center items-center min-h-96">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-red-500">Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Assigned Tasks
        </h2>
        <p className="text-gray-600 mt-2">
          Manage the tasks assigned to you by organizations
        </p>
      </div>

      {/* Task View */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Task List */}
        <div className="lg:w-1/3 bg-white rounded-2xl shadow-xl p-6 h-min">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Cases List</h3>
          
          {assignments.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              No tasks assigned to you yet.
            </div>
          ) : (
            <div className="space-y-6">
              {assignments.map((project) => (
                <div key={project._id} className="space-y-3">
                  <div className="font-semibold text-indigo-700 flex items-center">
                    <span className="truncate">{project.projectName}</span>
                    <span className="ml-2 px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-md">
                      {project.organizationName}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {project.links && project.links.map((link) => (
                      <button
                        key={link._id}
                        onClick={() => handleOpenTask(project._id, link._id)}
                        className={`w-full text-left p-3 rounded-lg transition flex items-center justify-between ${
                          activeTask?.linkId === link._id
                            ? 'bg-indigo-50 border-2 border-indigo-300'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="truncate flex-1">
                          <div className="font-medium">{link.title}</div>
                          {detectMediaType(link.url) && (
                            <div className="text-xs text-indigo-600 mt-1 flex items-center">
                              {getMediaIcon(link.url)}
                              {detectMediaType(link.url) === 'video' ? 'Video' : 
                               detectMediaType(link.url) === 'image' ? 'Image' : 
                               'Medical Scan'}
                            </div>
                          )}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ml-2 ${
                          link.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {link.status === 'completed' ? 'Completed' : 'In Progress'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Task Details */}
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            {!activeTask ? (
              <div className="h-96 flex flex-col items-center justify-center text-gray-500">
                <Clipboard className="w-12 h-12 mb-4 text-gray-400" />
                <p>Select a task to view details</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {activeTask.linkTitle}
                  </h3>
                  <p className="text-gray-600">
                    Project: {activeTask.projectName} • Organization: {activeTask.organizationName}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a 
                      href={activeTask.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 underline"
                    >
                      Open Resource Link
                    </a>
                    
                    {detectMediaType(activeTask.linkUrl) && (
                      <button
                        onClick={handleViewMedia}
                        className="ml-4 px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-md flex items-center transition-colors"
                      >
                        {getMediaIcon(activeTask.linkUrl)}
                        <span className="ml-1">{getViewerButtonText(activeTask.linkUrl)}</span>
                      </button>
                    )}
                  </div>
                </div>

                {activeTask.status === 'completed' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-green-700">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    This task has been marked as completed
                  </div>
                ) : (
                  <>
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        rows={8}
                        value={taskNotes}
                        onChange={(e) => setTaskNotes(e.target.value)}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Add your notes about this task here..."
                      />
                    </div>

                    {saveSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                        Changes saved successfully!
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleTaskAction('save-draft')}
                        disabled={isSaving}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save as Draft'}
                      </button>
                      <button
                        onClick={() => handleTaskAction('complete')}
                        disabled={isSaving}
                        className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Mark as Complete'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Media Viewer (conditionally rendered) */}
          {showViewer && activeTask && (
            <div className="relative">
              <button 
                onClick={handleCloseViewer}
                className="absolute right-3 top-3 z-10 bg-white rounded-full p-1 shadow-md"
                title="Close Viewer"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <OHIFViewer imageUrl={viewerImageUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorTasks;