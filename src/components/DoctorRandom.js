import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw, Calendar, Award, HeartPulse, Pill, Brain, Thermometer, Image as ImageIcon } from 'lucide-react';

const randomTips = [
  { 
    icon: <Calendar className="h-8 w-8 text-indigo-600" />,
    title: "Weekly Schedule Optimization", 
    content: "Allocate dedicated time blocks for different types of patient appointments to maximize efficiency." 
  },
  { 
    icon: <Award className="h-8 w-8 text-emerald-600" />,
    title: "Latest Medical Research", 
    content: "New findings suggest that regular mindfulness practice may significantly reduce cortisol levels in stressed patients." 
  },
  { 
    icon: <HeartPulse className="h-8 w-8 text-rose-600" />,
    title: "Cardiovascular Health Reminder", 
    content: "Encourage patients over 50 to maintain regular monitoring of blood pressure even when values appear stable." 
  },
  { 
    icon: <Pill className="h-8 w-8 text-blue-600" />,
    title: "Medication Management", 
    content: "Consider scheduling medication reviews for patients on multiple prescriptions at least twice annually." 
  },
  { 
    icon: <Brain className="h-8 w-8 text-purple-600" />,
    title: "Cognitive Health", 
    content: "Simple memory exercises can be beneficial for patients of all ages, not just those at risk for cognitive decline." 
  },
  { 
    icon: <Thermometer className="h-8 w-8 text-orange-600" />,
    title: "Preventive Care", 
    content: "Seasonal vaccination reminders sent via the patient portal have shown a 27% increase in compliance rates." 
  }
];

function DoctorRandom({ doctorData }) {
  const [loading, setLoading] = useState(false);
  const [randomCases, setRandomCases] = useState([]);
  const [randomTip, setRandomTip] = useState(null);
  const [imageIds, setImageIds] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    generateRandomContent();
    loadDicomImages();
  }, []);
  
  const generateRandomContent = async () => {
    setLoading(true);
    
    try {
      // Generate random medical tip
      const tipIndex = Math.floor(Math.random() * randomTips.length);
      setRandomTip(randomTips[tipIndex]);
      
      // Mock API call for random cases
      // In a real application, you would fetch this from your backend
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay
      
      const mockCases = [
        {
          id: 'case-' + Math.floor(Math.random() * 1000),
          patientName: 'Alex Thompson',
          age: 42,
          condition: 'Hypertension',
          priority: 'Medium',
          lastChecked: '3 days ago'
        },
        {
          id: 'case-' + Math.floor(Math.random() * 1000),
          patientName: 'Sarah Johnson',
          age: 65,
          condition: 'Type 2 Diabetes',
          priority: 'High',
          lastChecked: '1 week ago'
        },
        {
          id: 'case-' + Math.floor(Math.random() * 1000),
          patientName: 'Michael Chen',
          age: 35,
          condition: 'Migraine',
          priority: 'Low',
          lastChecked: '2 days ago'
        }
      ];
      
      setRandomCases(mockCases);
    } catch (error) {
      console.error('Error generating random content:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadDicomImages = async () => {
    setImageLoading(true);
    try {
      // In a real application, you would import this function from your DICOM viewer library
      // Here we're making actual API calls to the WADO-RS server to get instances
      const fetchImageInstances = async ({ StudyInstanceUID, SeriesInstanceUID, wadoRsRoot }) => {
        // First, get list of instances in this series
        const instancesUrl = `${wadoRsRoot}/studies/${StudyInstanceUID}/series/${SeriesInstanceUID}/instances`;
        
        // Simulate network delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, this would make a fetch request to the instances endpoint
        // and process the returned list of instances
        
        // For now, we'll create synthetic UIDs to represent real instance UIDs
        const instanceUIDs = [];
        for (let i = 1; i <= 10; i++) {
          instanceUIDs.push(`1.3.6.1.4.1.14519.5.2.1.7009.2403.${100000000000 + i}`);
        }
        
        // Create image URLs for each instance
        const imageUrls = instanceUIDs.map(instanceUID => {
          // The actual image URL would be constructed differently depending on your DICOM viewer
          // This is a simplified approach for demonstration
          return `${wadoRsRoot}/studies/${StudyInstanceUID}/series/${SeriesInstanceUID}/instances/${instanceUID}/frames/1`;
        });
        
        return imageUrls;
      };
      
      // Call the function with the real parameters
      const imageUrls = await fetchImageInstances({
        StudyInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
        SeriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
        wadoRsRoot: 'https://d14fa38qiwhyfd.cloudfront.net/dicomweb',
      });
      
      setImageIds(imageUrls);
      
      // Pre-fetch the images (in a real implementation)
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
      
    } catch (error) {
      console.error('Error loading DICOM images:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  
  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : imageIds.length - 1));
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < imageIds.length - 1 ? prev + 1 : 0));
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Random Medical Content</h1>
        <button 
          onClick={generateRandomContent}
          disabled={loading}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-indigo-400"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-5 w-5" />
              <span>Generate New</span>
            </>
          )}
        </button>
      </div>
      
      {/* Daily Medical Tip */}
      {randomTip && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all">
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-50 rounded-lg p-3">
                {randomTip.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{randomTip.title}</h3>
                <p className="text-gray-600 mt-1">{randomTip.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Random Cases Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Random Case Studies</h2>
          <p className="text-sm text-gray-500 mt-1">Explore these randomized cases for reference</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {randomCases.map((caseItem) => (
              <div key={caseItem.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{caseItem.patientName}</h3>
                    <p className="text-sm text-gray-500">Age {caseItem.age} • Last checked {caseItem.lastChecked}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                    {caseItem.priority}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-700"><span className="font-medium">Condition:</span> {caseItem.condition}</p>
                </div>
                <div className="mt-4">
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* DICOM Image Viewer */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Medical Imaging</h2>
          <p className="text-sm text-gray-500 mt-1">
            DICOM Series: 1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561
          </p>
        </div>
        
        <div className="p-6">
          {imageLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading DICOM images...</span>
            </div>
          ) : imageIds.length > 0 ? (
            <div>
              <div className="bg-black rounded-lg p-4 flex justify-center items-center">
                <div className="relative w-full">
                  {/* DICOM Image Viewer */}
                  <div className="bg-gray-900 h-96 w-full max-w-3xl mx-auto rounded overflow-hidden relative">
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-3 z-10 flex justify-between items-center">
                      <div className="text-white text-sm">
                        <span className="px-2 py-1 bg-blue-600 rounded-md">Image {currentImageIndex + 1}/{imageIds.length}</span>
                      </div>
                      <div className="text-white text-xs opacity-70">
                        Series: {(imageIds[currentImageIndex] || "").split('/series/')[1]?.split('/instances')[0]?.substring(0, 12)}...
                      </div>
                    </div>
                    
                    {/* The actual image - in a real implementation this would be replaced with a proper DICOM renderer */}
                    <div className="h-full w-full flex items-center justify-center relative">
                      {/* We'll use an example medical image for demonstration */}
                      <img 
                        src={`/api/placeholder/800/600`} 
                        alt={`DICOM Image ${currentImageIndex + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                      
                      {/* Overlay with image details */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <div className="text-white text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="opacity-70">Study Date:</span> 2023-05-{10 + currentImageIndex}
                            </div>
                            <div>
                              <span className="opacity-70">Modality:</span> CT
                            </div>
                            <div>
                              <span className="opacity-70">Patient ID:</span> TCGA-{65 + currentImageIndex}
                            </div>
                            <div>
                              <span className="opacity-70">Slice:</span> {15 + currentImageIndex * 5} mm
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Image controls */}
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Navigation buttons */}
              <div className="flex justify-center mt-4 space-x-4">
                <button 
                  onClick={handlePreviousImage}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
                >
                  Previous Image
                </button>
                <button 
                  onClick={handleNextImage}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
                >
                  Next Image
                </button>
              </div>
              
              <div className="mt-6 grid grid-cols-5 gap-2">
                {imageIds.map((id, index) => (
                  <button 
                    key={id} 
                    onClick={() => setCurrentImageIndex(index)}
                    className={`p-2 rounded ${index === currentImageIndex ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <div className="aspect-square bg-gray-800 rounded flex items-center justify-center relative overflow-hidden">
                      {/* This would normally show thumbnails of each image */}
                      <img 
                        src={`/api/placeholder/100/100`}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover opacity-70"
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium bg-black/30">
                        {index + 1}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No DICOM images available</p>
              <button 
                onClick={loadDicomImages}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
              >
                Retry Loading Images
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Doctor Stats */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Your Random Statistics</h2>
          <p className="text-sm text-gray-500 mt-1">Performance metrics from random time periods</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-indigo-600">Patient Satisfaction</p>
            <p className="text-2xl font-bold text-gray-800 mt-2">{92 + Math.floor(Math.random() * 8)}%</p>
            <p className="text-sm text-gray-500 mt-1">Last quarter average</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-emerald-600">Cases Resolved</p>
            <p className="text-2xl font-bold text-gray-800 mt-2">{15 + Math.floor(Math.random() * 20)}</p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-600">Average Response Time</p>
            <p className="text-2xl font-bold text-gray-800 mt-2">{3 + Math.floor(Math.random() * 4)} hrs</p>
            <p className="text-sm text-gray-500 mt-1">For urgent consultations</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorRandom;