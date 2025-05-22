import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function S3Viewer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bucketUrl } = location.state || {};
  
  const [images, setImages] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bucketUrl) {
      navigate('/aicompany');
      return;
    }
    
    // In a real application, you would fetch from the actual S3 bucket URL
    // For demo purposes, we're using mock data with the provided bucket URL
    
    const fetchImagesFromS3 = async () => {
      try {
        // Simulating S3 request
        console.log(`Connecting to S3 bucket: ${bucketUrl}`);
        
        // Simulate loading delay
        setTimeout(() => {
          // Mock data - in a real app, you would actually fetch from the S3 bucket
          const mockImages = [
            { id: 1, name: 'Patient Scan 1', url: `${bucketUrl}/image1.jpg`, lastModified: new Date().toLocaleDateString() },
            { id: 2, name: 'Patient Scan 2', url: `${bucketUrl}/image2.jpg`, lastModified: new Date().toLocaleDateString() },
            { id: 3, name: 'Patient Scan 3', url: `${bucketUrl}/image3.jpg`, lastModified: new Date().toLocaleDateString() },
            { id: 4, name: 'Patient Scan 4', url: `${bucketUrl}/image4.jpg`, lastModified: new Date().toLocaleDateString() },
            { id: 5, name: 'Patient Scan 5', url: `${bucketUrl}/image5.jpg`, lastModified: new Date().toLocaleDateString() },
            { id: 6, name: 'Patient Scan 6', url: `${bucketUrl}/image6.jpg`, lastModified: new Date().toLocaleDateString() },
          ];
          
          setImages(mockImages);
          setLoading(false);
        }, 1500);
        
        /* 
        // Real implementation would use AWS SDK
        import AWS from 'aws-sdk';
        
        // Extract bucket name from URL
        const bucketName = new URL(bucketUrl).hostname.split('.')[0];
        
        // Configure AWS
        AWS.config.update({
          region: 'your-region',
          credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'your-identity-pool-id'
          })
        });
        
        const s3 = new AWS.S3();
        
        const params = {
          Bucket: bucketName,
          Prefix: '' // optional prefix to filter by folder
        };
        
        const response = await s3.listObjectsV2(params).promise();
        const formattedImages = response.Contents
          .filter(obj => obj.Key.match(/\.(jpe?g|png|gif)$/i))
          .map((obj, index) => ({
            id: index,
            name: obj.Key.split('/').pop(),
            url: `${bucketUrl}/${obj.Key}`,
            lastModified: obj.LastModified.toLocaleDateString()
          }));
        
        setImages(formattedImages);
        setLoading(false);
        */
        
      } catch (error) {
        console.error('Error fetching images from S3:', error);
        setLoading(false);
      }
    };

    fetchImagesFromS3();
  }, [bucketUrl, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-4 p-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-600">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">S3 Image Viewer</h1>
                {bucketUrl && (
                  <p className="text-sm text-gray-500 mt-1 truncate max-w-md">{bucketUrl}</p>
                )}
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="bg-gray-100 p-1 rounded-lg flex">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md flex items-center ${
                  viewMode === 'list' 
                    ? 'bg-white shadow text-indigo-600' 
                    : 'text-gray-600 hover:text-indigo-500'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                <span className="ml-1 text-sm font-medium">List</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md flex items-center ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow text-indigo-600' 
                    : 'text-gray-600 hover:text-indigo-500'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span className="ml-1 text-sm font-medium">Grid</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-600">Loading images from S3 bucket...</p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="bg-white rounded-lg shadow overflow-hidden"
                  >
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">{image.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Last Modified: {image.lastModified}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preview
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Modified
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {images.map((image) => (
                      <tr key={image.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 w-16 rounded bg-gray-200 overflow-hidden flex items-center justify-center text-gray-400">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{image.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {image.lastModified}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty state */}
            {images.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
                <p className="mt-1 text-sm text-gray-500">No images were found in this S3 bucket.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default S3Viewer;