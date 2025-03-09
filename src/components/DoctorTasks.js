import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle, Clipboard, ExternalLink, Download, FileType, Image, File, Folder, FileImage, FileText, Copy, CheckCheck } from 'lucide-react';

function DoctorTasks({ doctorEmail }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [taskNotes, setTaskNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showOhifViewer, setShowOhifViewer] = useState(false);
  const [hasFile, setHasFile] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [isCheckingFile, setIsCheckingFile] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    // Check if active task URL contains any file
    if (activeTask && activeTask.linkUrl) {
      checkForFile(activeTask.linkUrl);
    } else {
      resetFileInfo();
    }
  }, [activeTask]);

  const resetFileInfo = () => {
    setHasFile(false);
    setFileName('');
    setFileType('');
    setDownloadUrl('');
  };

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

  const handleCopyProjectKey = (projectKey) => {
    if (!projectKey) return;
    
    navigator.clipboard.writeText(projectKey)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
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
      projectKey: project.projectKey, // Include project key
      linkId: link._id,
      linkTitle: link.title,
      linkUrl: link.url,
      status: link.status,
      notes: link.notes || ''
    });
    
    // Set notes from the link if available
    setTaskNotes(link.notes || '');
    setSaveSuccess(false);
    setShowOhifViewer(false); // Hide viewer when opening a new task
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
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Check if URL is from a cloud service
  const isCloudLink = (url) => {
    if (!url) return false;
    
    const cloudServices = [
      'drive.google.com',
      'docs.google.com',
      'dropbox.com',
      'onedrive.live.com',
      'sharepoint.com',
      'box.com',
      'icloud.com',
      'mega.nz',
      'wetransfer.com',
      'amazonaws.com',
      's3.',
      'blob.core.windows.net',
      'firebasestorage.googleapis.com'
    ];
    
    return cloudServices.some(service => url.includes(service));
  };

  // Function to check for file in URL
  const checkForFile = (url) => {
    setIsCheckingFile(true);
    
    try {
      // Extract the file information from URL
      const fileInfo = extractFileInfo(url);
      
      if (fileInfo.hasFile) {
        setHasFile(true);
        setFileName(fileInfo.fileName);
        setFileType(fileInfo.fileType);
        setDownloadUrl(fileInfo.downloadUrl || url);
      } else {
        resetFileInfo();
      }
    } catch (error) {
      console.error("Error checking for file:", error);
      resetFileInfo();
    } finally {
      setIsCheckingFile(false);
    }
  };

  // Extract file information from URL
  const extractFileInfo = (url) => {
    // Google Drive
    if (url.includes('drive.google.com')) {
      return extractGoogleDriveFileInfo(url);
    }
    
    // Dropbox
    if (url.includes('dropbox.com')) {
      return extractDropboxFileInfo(url);
    }
    
    // OneDrive/SharePoint
    if (url.includes('onedrive.live.com') || url.includes('sharepoint.com')) {
      return extractOneDriveFileInfo(url);
    }
    
    // Generic file detection
    return extractGenericFileInfo(url);
  };

  // Extract file info from Google Drive URL
  const extractGoogleDriveFileInfo = (url) => {
    let fileId = null;
    
    if (url.includes('/file/d/')) {
      const match = url.match(/\/file\/d\/([^/]+)/);
      fileId = match ? match[1] : null;
    } else if (url.includes('id=')) {
      const match = url.match(/id=([^&]+)/);
      fileId = match ? match[1] : null;
    } else if (url.includes('folders/')) {
      const match = url.match(/folders\/([^?&]+)/);
      fileId = match ? match[1] : null;
      return {
        hasFile: true,
        fileName: 'Folder',
        fileType: 'folder',
        downloadUrl: url
      };
    }
    
    if (!fileId) {
      return { hasFile: false };
    }
    
    // Check if file name is in URL
    const fileNameMatch = url.match(/([^/]+\.(dcm|jpg|jpeg|png|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar|dicom))/i);
    let fileName = fileNameMatch ? fileNameMatch[1] : `file-${fileId.substring(0, 8)}`;
    let fileType = fileNameMatch ? fileNameMatch[2].toLowerCase() : 'unknown';
    
    // If its a medical image, apply special handling
    if (url.toLowerCase().includes('image-') && url.toLowerCase().includes('.dcm')) {
      fileName = url.match(/image-\d+\.dcm/i)[0];
      fileType = 'dcm';
    }
    
    // Generate download URL
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    return {
      hasFile: true,
      fileName,
      fileType,
      downloadUrl
    };
  };

  // Extract file info from Dropbox URL
  const extractDropboxFileInfo = (url) => {
    // Convert to download link if it's not already
    let downloadUrl = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    downloadUrl = downloadUrl.replace('?dl=0', '?dl=1');
    
    // Check for file name in URL
    const fileNameMatch = url.match(/\/([^/]+\.[^/]+)(\?|$)/);
    if (!fileNameMatch) {
      if (url.includes('/folder/')) {
        return {
          hasFile: true,
          fileName: 'Folder',
          fileType: 'folder',
          downloadUrl: url
        };
      }
      return { hasFile: false };
    }
    
    const fileName = fileNameMatch[1];
    const fileExtMatch = fileName.match(/\.([^.]+)$/);
    const fileType = fileExtMatch ? fileExtMatch[1].toLowerCase() : 'unknown';
    
    return {
      hasFile: true,
      fileName,
      fileType,
      downloadUrl
    };
  };

  // Extract file info from OneDrive URL
  const extractOneDriveFileInfo = (url) => {
    // Check for file name in URL or path
    const fileNameMatch = url.match(/\/([^/]+\.[^/]+)(\?|$)/);
    
    if (!fileNameMatch) {
      // Check if it's a folder
      if (url.includes('folder/')) {
        return {
          hasFile: true,
          fileName: 'Folder',
          fileType: 'folder',
          downloadUrl: url
        };
      }
      return { hasFile: false };
    }
    
    const fileName = fileNameMatch[1];
    const fileExtMatch = fileName.match(/\.([^.]+)$/);
    const fileType = fileExtMatch ? fileExtMatch[1].toLowerCase() : 'unknown';
    
    // Generate download URL (just use the same URL for OneDrive)
    const downloadUrl = url.includes('download=1') ? url : url + (url.includes('?') ? '&download=1' : '?download=1');
    
    return {
      hasFile: true,
      fileName,
      fileType,
      downloadUrl
    };
  };

  // Extract file info from generic URL
  const extractGenericFileInfo = (url) => {
    // Check for file patterns in URL
    const fileExtensions = 'dcm|jpg|jpeg|png|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar|dicom|gif|mp4|mp3|mov|avi';
    const fileNameMatch = url.match(new RegExp(`([^/]+\\.(${fileExtensions}))`, 'i'));
    
    if (!fileNameMatch) {
      // If no direct file found, check if URL contains indications of files
      if (url.includes('/download/') || url.includes('/file/') || url.includes('filename=')) {
        // Try to get a file name from any available indicator
        const fallbackNameMatch = url.match(/filename=([^&]+)/i);
        if (fallbackNameMatch) {
          const fileName = decodeURIComponent(fallbackNameMatch[1]);
          const fileExtMatch = fileName.match(/\.([^.]+)$/);
          const fileType = fileExtMatch ? fileExtMatch[1].toLowerCase() : 'unknown';
          
          return {
            hasFile: true,
            fileName,
            fileType,
            downloadUrl: url
          };
        }
        
        // Still return as a file even if we can't determine its name
        return {
          hasFile: true,
          fileName: 'Download File',
          fileType: 'unknown',
          downloadUrl: url
        };
      }
      
      // Check for folder patterns
      if (url.includes('/folder/') || url.includes('/directory/')) {
        return {
          hasFile: true,
          fileName: 'Folder',
          fileType: 'folder',
          downloadUrl: url
        };
      }
      
      return { hasFile: false };
    }
    
    const fileName = fileNameMatch[1];
    const fileExtMatch = fileName.match(/\.([^.]+)$/);
    const fileType = fileExtMatch ? fileExtMatch[1].toLowerCase() : 'unknown';
    
    return {
      hasFile: true,
      fileName,
      fileType,
      downloadUrl: url
    };
  };

  const handleOpenOhifViewer = () => {
    setShowOhifViewer(true);
  };

  const handleCloseOhifViewer = () => {
    setShowOhifViewer(false);
  };

  const downloadFile = () => {
    if (!downloadUrl) return;
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'dcm':
      case 'dicom':
        return <Image className="w-4 h-4 text-purple-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage className="w-4 h-4 text-blue-600" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-600" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="w-4 h-4 text-orange-600" />;
      case 'folder':
        return <Folder className="w-4 h-4 text-yellow-600" />;
      default:
        return <File className="w-4 h-4 text-gray-600" />;
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
          Assigned Cases
        </h2>
        <p className="text-gray-600 mt-2">
          Manage the tasks assigned to you by organizations
        </p>
      </div>

      {/* OHIF Viewer Modal */}
      {showOhifViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-[90%] max-h-[90%] bg-white rounded-lg">
            <div className="flex justify-between items-center p-2 border-b">
              <h3 className="text-lg font-medium">DICOM Viewer</h3>
              <button 
                onClick={handleCloseOhifViewer}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <iframe 
              src="http://localhost:3000"
              className="w-full h-[calc(100%-40px)]"
              title="OHIF Viewer"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

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
                          {isCloudLink(link.url) && (
                            <div className="text-xs text-indigo-600 flex items-center mt-1">
                              <FileType className="w-3 h-3 mr-1" />
                              Cloud Resource
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
        <div className="lg:w-2/3 bg-white rounded-2xl shadow-xl p-6">
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

                {/* Project Key Display */}
                {activeTask.projectKey && (
                  <div className="mt-3 p-2 bg-gray-50 rounded-md border border-gray-200 flex items-center">
                    <span className="text-gray-500 text-sm mr-2">DICOM Case Passkey:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-indigo-700 font-mono text-sm flex-1">
                      {activeTask.projectKey}
                    </code>
                    <button
                      onClick={() => handleCopyProjectKey(activeTask.projectKey)}
                      className="ml-2 p-1 text-gray-500 hover:text-indigo-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      title="Copy Project Key"
                    >
                      {copySuccess ? (
                        <CheckCheck className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
                
                <div className="mt-4">
                  <div className="flex flex-col">
                    <a 
                      href={activeTask.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 underline"
                    >
                      Open Resource Link
                    </a>
                    
                    {isCheckingFile ? (
                      <div className="mt-2 flex items-center text-gray-600">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Checking resource...
                      </div>
                    ) : hasFile ? (
                      <div className="mt-2 flex items-center">
                        {getFileIcon(fileType)}
                        <span className="text-gray-600 ml-2">{fileName}</span>
                        {fileType !== 'folder' && (
                          <button
                            onClick={downloadFile}
                            className="ml-2 text-green-600 hover:text-green-700 flex items-center"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            <span className="text-sm">Download</span>
                          </button>
                        )}
                      </div>
                    ) : null}
                  </div>
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

                  <div className="flex flex-wrap gap-4">
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
                    <button
                      onClick={handleOpenOhifViewer}
                      className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open DICOM Viewer
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorTasks;