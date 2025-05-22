import React, { useState, useEffect } from 'react';
import { Key, AlertTriangle, X } from 'lucide-react';

const PasskeyModal = ({ onSubmit, onClose = () => {}, initialPasskey = null }) => {
  const [passkey, setPasskey] = useState(initialPasskey || '');
  const [error, setError] = useState('');
  
  // Auto-submit when initialPasskey is provided
  useEffect(() => {
    if (initialPasskey && validatePasskey(initialPasskey)) {
      onSubmit(initialPasskey);
    }
  }, [initialPasskey, onSubmit]);
  
  const validatePasskey = (key) => {
    const passkeyRegex = /^[a-zA-Z0-9]{12}$/;
    return passkeyRegex.test(key);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passkey format
    if (!validatePasskey(passkey)) {
      setError('Passkey must be exactly 12 alphanumeric characters.');
      return;
    }
    
    // Call the parent component's submission handler
    onSubmit(passkey);
  };
  
  const generateRandomPasskey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPasskey(result);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-gray-100 transition-colors"
        title="Close"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="flex items-center mb-4">
        <Key className="w-6 h-6 text-indigo-400 mr-2" />
        <h2 className="text-xl font-semibold text-white">Authentication Required</h2>
      </div>
      
      <p className="text-gray-300 mb-6">
        Please enter a 12-digit alphanumeric passkey to access the image viewer. 
        This passkey will be used to save and retrieve your annotations.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="passkey">
            Passkey
          </label>
          <div className="flex">
            <input
              id="passkey"
              type="text"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-l text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter 12-digit passkey"
              maxLength={12}
            />
            <button
              type="button"
              onClick={generateRandomPasskey}
              className="px-3 py-2 bg-gray-600 text-white rounded-r hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Generate random passkey"
            >
              Generate
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-900 bg-opacity-30 border border-red-800 rounded flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-400 text-sm">
            Remember this passkey for future sessions.
          </p>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasskeyModal;