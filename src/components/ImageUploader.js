import React, { useState, useRef } from 'react';
import { X, Upload, Link, Image, FileUp } from 'lucide-react';

const ImageUploader = ({ onClose, onImageUpload, onImageUrlSubmit }) => {
  const [activeTab, setActiveTab] = useState('link'); // Changed default to 'link' instead of 'upload'
  const [imageUrl, setImageUrl] = useState('');
  const [imageName, setImageName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      onImageUrlSubmit(imageUrl, imageName);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Add Image</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tabs - Reordered */}
        <div className="flex border-b border-gray-700 mb-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'link' 
              ? 'text-indigo-400 border-b-2 border-indigo-400' 
              : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('link')}
          >
            <div className="flex items-center">
              <Link className="w-4 h-4 mr-2" />
              Image URL
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'upload' 
              ? 'text-indigo-400 border-b-2 border-indigo-400' 
              : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('upload')}
          >
            <div className="flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </div>
          </button>
        </div>
        
        {/* URL Tab */}
        {activeTab === 'link' && (
          <form onSubmit={handleUrlSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Image Name (optional)
              </label>
              <input
                type="text"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder=""
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Load Image
            </button>
          </form>
        )}
        
        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-64
              ${dragOver ? 'border-indigo-400 bg-indigo-900 bg-opacity-20' : 'border-gray-600'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Image className="w-16 h-16 text-gray-500 mb-4" />
            <p className="text-gray-300 text-center mb-4">
              Drag and drop an image file here, or click to select a file
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <div className="flex items-center">
                <FileUp className="w-4 h-4 mr-2" />
                Select Image
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;