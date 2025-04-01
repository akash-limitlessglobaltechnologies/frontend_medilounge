import React from 'react';

const DicomViewer = ({ onClose, dicomUrl }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative w-full h-full max-w-[90%] max-h-[90%] bg-white rounded-lg">
        <div className="flex justify-between items-center p-2 border-b">
          <h3 className="text-lg font-medium">DICOM Viewer</h3>
          <button 
            onClick={onClose}
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
  );
};

export default DicomViewer;