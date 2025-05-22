import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCircle, LogOut, Plus, Trash2, Copy, CheckCircle, Link, Eye } from 'lucide-react';
import axios from 'axios';
import ImageViewer from './ImageViewer'; // Import the ImageViewer component

// Create API instance with correct base URL and auth
const getAPI = () => {
  const token = localStorage.getItem('token');
  
  return axios.create({
    baseURL: process.env.REACT_APP_URI || 'http://localhost:5001',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    withCredentials: true
  });
};

function AICompanyPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [imageAddresses, setImageAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  
  // Image viewer state
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch image addresses on component mount
  useEffect(() => {
    fetchImageAddresses();
  }, []);

  // Function to fetch all image addresses
  const fetchImageAddresses = async () => {
    try {
      setLoading(true);
      const api = getAPI(); // Get fresh API instance with current token
      console.log('Auth header:', api.defaults.headers.Authorization); // Debug log
      
      const response = await api.get('/aicompany/image-addresses');
      if (response.data.success) {
        setImageAddresses(response.data.imageAddresses || []);
      }
    } catch (err) {
      setError('Failed to fetch image addresses. Please try again.');
      console.error('Fetch image addresses error:', err);
      
      // Check if it's an auth error and redirect to login if needed
      if (err.response && err.response.status === 401) {
        console.log('Authentication error. Redirecting to login...');
        localStorage.removeItem('token'); // Clear invalid token
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout: ' + error.message);
    }
  };

  const handleAddImage = () => {
    setShowImagePrompt(true);
    setImageUrl('');
    setImageTitle('');
  };
  
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    
    if (imageUrl.trim() && imageTitle.trim()) {
      try {
        setLoading(true);
        const api = getAPI(); // Get fresh API instance with current token
        
        const response = await api.post('/aicompany/image-address', {
          imageUrl: imageUrl.trim(),
          title: imageTitle.trim()
        });
        
        if (response.data.success) {
          setShowImagePrompt(false);
          // Refresh the image addresses list
          fetchImageAddresses();
        }
      } catch (err) {
        setError('Failed to add image address. Please try again.');
        console.error('Add image address error:', err);
        
        // Check if it's an auth error and redirect to login if needed
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token'); // Clear invalid token
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleCancel = () => {
    setShowImagePrompt(false);
    setImageUrl('');
    setImageTitle('');
  };

  const handleDeleteImage = async (accessKey) => {
    if (window.confirm('Are you sure you want to delete this image address?')) {
      try {
        setLoading(true);
        const api = getAPI(); // Get fresh API instance with current token
        
        const response = await api.delete(`/aicompany/image-address/${accessKey}`);
        
        if (response.data.success) {
          // Refresh the image addresses list
          fetchImageAddresses();
        }
      } catch (err) {
        setError('Failed to delete image address. Please try again.');
        console.error('Delete image address error:', err);
        
        // Check if it's an auth error and redirect to login if needed
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token'); // Clear invalid token
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const copyToClipboard = (text, accessKey) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(accessKey);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };
  
  // Open the image viewer with the selected image and passkey
  const handleOpenImageViewer = (imageData) => {
    setSelectedImage(imageData);
    setShowImageViewer(true);
  };
  
  // Close the image viewer
  const handleCloseImageViewer = () => {
    setShowImageViewer(false);
    setSelectedImage(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30"></div>
                <div className="relative bg-white rounded-full p-2">
                  <svg className="h-10 w-10" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25 10C25 7.23858 27.2386 5 30 5H35C37.7614 5 40 7.23858 40 10V15C40 17.7614 37.7614 20 35 20H30C27.2386 20 25 17.7614 25 15V10Z" fill="#4F46E5"/>
                    <path d="M32.5 20V35C32.5 41.6274 27.1274 47 20.5 47C13.8726 47 8.5 41.6274 8.5 35C8.5 28.3726 13.8726 23 20.5 23" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round"/>
                    <circle cx="32.5" cy="12.5" r="2.5" fill="white"/>
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Medworks
                </span>
                <span className="block text-xs text-gray-500">Healthcare Excellence</span>
              </div>
            </div>

            {/* Profile and Logout Button */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <UserCircle className="h-8 w-8" />
                <span className="font-medium">{user?.displayName || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Medworks</h1>
          <p className="mt-4 text-xl text-gray-600">Your healthcare management platform</p>
        </div>
        
        {/* Add Image Button */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={handleAddImage}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Image Address
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 max-w-lg mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{error}</p>
            <button 
              className="text-red-700 font-bold mt-2 text-sm underline"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* Image Addresses List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-4xl mx-auto">
          <div className="px-6 py-4 bg-indigo-100 border-b border-indigo-200">
            <h2 className="text-xl font-semibold text-indigo-800">Your Image Addresses</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center p-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : imageAddresses.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <Link className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No image addresses added yet.</p>
              <p className="mt-2">Click "Add Image Address" to add your first one.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {imageAddresses.map((img) => (
                <li key={img.accessKey} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{img.title}</h3>
                      <p className="mt-1 text-sm text-gray-500 truncate">{img.imageUrl}</p>
                      <div className="mt-2 flex items-center">
                        <span className="text-xs font-medium text-gray-600 mr-2">Access Key:</span>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{img.accessKey}</code>
                        <button
                          className="ml-2 text-indigo-600 hover:text-indigo-800"
                          onClick={() => copyToClipboard(img.accessKey, img.accessKey)}
                          title="Copy access key"
                        >
                          {copiedKey === img.accessKey ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Image Viewer Button */}
                      <button
                        className="p-2 rounded hover:bg-indigo-100 text-indigo-600 hover:text-indigo-800"
                        onClick={() => handleOpenImageViewer(img)}
                        title="Open in Image Viewer"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        className="p-2 rounded hover:bg-red-100 text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteImage(img.accessKey)}
                        title="Delete image address"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Add Image Modal */}
      {showImagePrompt && (
        <div className="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCancel}></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleImageSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Add Image Address
                      </h3>
                      <div className="mt-4">
                        <label htmlFor="image-title" className="block text-sm font-medium text-gray-700 mb-1">
                          Image Title
                        </label>
                        <input
                          id="image-title"
                          type="text"
                          value={imageTitle}
                          onChange={(e) => setImageTitle(e.target.value)}
                          placeholder="Enter a title for this image"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border mb-4"
                          required
                        />
                        
                        <label htmlFor="image-url" className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <input
                          id="image-url"
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                          required
                        />
                        
                        <p className="mt-2 text-sm text-gray-500">
                          A unique 12-character access key will be generated automatically for this image.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Image'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Image Viewer Component */}
      {showImageViewer && selectedImage && (
        <ImageViewer
          onClose={handleCloseImageViewer}
          imageUrl={selectedImage.imageUrl}
          imageName={selectedImage.title}
          initialPasskey={selectedImage.accessKey} // Pass the access key directly
        />
      )}
    </div>
  );
}

export default AICompanyPage;