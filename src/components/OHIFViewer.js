import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ZoomIn, ZoomOut, RotateCw, Move, Maximize, MinusCircle, PlusCircle, Download, 
         Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';

// Sample DICOM images from GitHub for testing
const SAMPLE_IMAGES = [
  'https://raw.githubusercontent.com/cornerstonejs/cornerstoneWADOImageLoader/master/testImages/CT2_J2KR',
  'https://raw.githubusercontent.com/cornerstonejs/cornerstoneWADOImageLoader/master/testImages/MR-MONO2-16-head'
];

function OHIFViewer({ imageUrl }) {
  const viewportRef = useRef(null);
  const videoRef = useRef(null);
  const imgRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewport, setViewport] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [windowWidth, setWindowWidth] = useState(null);
  const [windowCenter, setWindowCenter] = useState(null);
  const [metadata, setMetadata] = useState({});
  const [activeTool, setActiveTool] = useState('Wwwc');
  
  // Media type state
  const [mediaType, setMediaType] = useState(''); // 'dicom', 'video', 'image'
  
  // Video controls state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Initialize cornerstone on mount for DICOM images
  useEffect(() => {
    if (viewportRef.current && mediaType === 'dicom') {
      try {
        cornerstone.enable(viewportRef.current);
        
        // Add tools we want to use
        cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
        cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
        cornerstoneTools.addTool(cornerstoneTools.PanTool);
        cornerstoneTools.addTool(cornerstoneTools.MagnifyTool);
        cornerstoneTools.addTool(cornerstoneTools.LengthTool);
        cornerstoneTools.addTool(cornerstoneTools.AngleTool);
        cornerstoneTools.addTool(cornerstoneTools.EllipticalRoiTool);
        cornerstoneTools.addTool(cornerstoneTools.RectangleRoiTool);
      } catch (err) {
        console.error('Error initializing cornerstone:', err);
        setError('Failed to initialize viewer');
      }
    }

    // Cleanup function for DICOM viewer
    return () => {
      if (viewportRef.current && mediaType === 'dicom' && cornerstone.getEnabledElement(viewportRef.current)) {
        cornerstone.disable(viewportRef.current);
      }
    };
  }, [mediaType]);

  // Detect file type and load appropriate viewer
  useEffect(() => {
    if (!imageUrl) {
      setError('No URL provided');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const extension = imageUrl.split('.').pop().toLowerCase();
    
    // Detect media type based on URL extension or patterns
    if (extension === 'mp4' || extension === 'webm' || extension === 'ogg' || extension === 'mov' || imageUrl.includes('video')) {
      setMediaType('video');
      loadVideo(imageUrl);
    } 
    else if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif' || extension === 'webp') {
      setMediaType('image');
      loadImage(imageUrl);
    } 
    else if (extension === 'dcm' || imageUrl.includes('dicom') || imageUrl.includes('wado') || imageUrl.includes('ohif')) {
      setMediaType('dicom');
      loadDicom(imageUrl);
    } 
    else {
      // Use a sample DICOM image for testing if file type is unknown
      setMediaType('dicom');
      loadDicom(SAMPLE_IMAGES[0]);
    }
  }, [imageUrl]);

  // Load standard image
  const loadImage = (url) => {
    setIsLoading(true);
    
    const img = new Image();
    img.src = url;
    
    img.onload = () => {
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setError('Failed to load image');
      setIsLoading(false);
    };
  };
  
  // Load video file
  const loadVideo = (url) => {
    setIsLoading(true);
    setVideoLoaded(false);
    
    // For testing, we'll use a public video if URL isn't accessible
    if (!url.startsWith('http') && !url.startsWith('/')) {
      url = 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
    }
  };

  // Load DICOM image
  const loadDicom = (url) => {
    if (!viewportRef.current || !cornerstone.getEnabledElement(viewportRef.current)) {
      setTimeout(() => loadDicom(url), 100); // Retry after cornerstone is initialized
      return;
    }

    setIsLoading(true);
    
    // Process URL for Cornerstone
    let processedImageId = `wadouri:${SAMPLE_IMAGES[0]}`; // Default to sample
    
    // When ready to use real URLs, uncomment this
    /*
    if (url.endsWith('.dcm')) {
      processedImageId = `wadouri:${url}`;
    } else if (url.includes('wado') && !url.includes('wadouri:')) {
      processedImageId = `wadouri:${url}`;
    } else {
      processedImageId = `wadouri:${url}`;
    }
    */
    
    console.log('Loading DICOM with ID:', processedImageId);
    setImageId(processedImageId);

    cornerstone.loadAndCacheImage(processedImageId)
      .then(image => {
        try {
          const dicomMetadata = image.data ? image.data.metadata : {};
          setMetadata(dicomMetadata);

          const defaultWw = image.windowWidth || 400;
          const defaultWc = image.windowCenter || 40;
          setWindowWidth(defaultWw);
          setWindowCenter(defaultWc);
        } catch (err) {
          console.warn('Unable to extract metadata', err);
        }

        const viewport = cornerstone.getDefaultViewportForImage(viewportRef.current, image);
        cornerstone.displayImage(viewportRef.current, image, viewport);
        setViewport(viewport);
        
        setToolActive('Wwwc');
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading DICOM:', err);
        setError(`Failed to load DICOM image: ${err.message || 'Unknown error'}`);
        setIsLoading(false);
        
        // Try the other sample image if the first one fails
        if (processedImageId === `wadouri:${SAMPLE_IMAGES[0]}`) {
          console.log('Trying alternative sample DICOM...');
          loadDicom(SAMPLE_IMAGES[1]);
        }
      });
  };

  // Set DICOM tool active
  const setToolActive = (toolName) => {
    if (mediaType !== 'dicom') return;
    
    // Deactivate all tools first
    cornerstoneTools.setToolDisabled('Wwwc');
    cornerstoneTools.setToolDisabled('Zoom');
    cornerstoneTools.setToolDisabled('Pan');
    cornerstoneTools.setToolDisabled('Length');
    cornerstoneTools.setToolDisabled('Angle');
    cornerstoneTools.setToolDisabled('EllipticalRoi');
    cornerstoneTools.setToolDisabled('RectangleRoi');

    // Activate the requested tool
    cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
    setActiveTool(toolName);
  };

  // Zoom functions
  const zoomIn = () => {
    if (mediaType === 'dicom' && viewportRef.current && viewport) {
      const newZoom = zoomLevel * 1.2;
      const updatedViewport = {
        ...viewport,
        scale: newZoom
      };
      cornerstone.setViewport(viewportRef.current, updatedViewport);
      setZoomLevel(newZoom);
      setViewport(updatedViewport);
    } else if (mediaType === 'image') {
      const newZoom = zoomLevel * 1.2;
      setZoomLevel(newZoom);
      if (imgRef.current) {
        imgRef.current.style.transform = `scale(${newZoom})`;
      }
    }
  };

  const zoomOut = () => {
    if (mediaType === 'dicom' && viewportRef.current && viewport) {
      const newZoom = zoomLevel * 0.8;
      const updatedViewport = {
        ...viewport,
        scale: newZoom
      };
      cornerstone.setViewport(viewportRef.current, updatedViewport);
      setZoomLevel(newZoom);
      setViewport(updatedViewport);
    } else if (mediaType === 'image') {
      const newZoom = zoomLevel * 0.8;
      setZoomLevel(newZoom);
      if (imgRef.current) {
        imgRef.current.style.transform = `scale(${newZoom})`;
      }
    }
  };

  const resetView = () => {
    if (mediaType === 'dicom' && viewportRef.current && imageId) {
      cornerstone.reset(viewportRef.current);
      setZoomLevel(1);
      
      if (windowWidth && windowCenter) {
        const updatedViewport = {
          ...viewport,
          voi: {
            windowWidth: windowWidth,
            windowCenter: windowCenter
          }
        };
        cornerstone.setViewport(viewportRef.current, updatedViewport);
        setViewport(updatedViewport);
      }
    } else if (mediaType === 'image') {
      setZoomLevel(1);
      if (imgRef.current) {
        imgRef.current.style.transform = 'scale(1)';
      }
    } else if (mediaType === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  // DICOM window adjustments
  const adjustWindowWidth = (delta) => {
    if (mediaType !== 'dicom' || !viewportRef.current || !viewport) return;
    
    const newWw = viewport.voi.windowWidth + delta;
    if (newWw > 1) {
      const updatedViewport = {
        ...viewport,
        voi: {
          windowWidth: newWw,
          windowCenter: viewport.voi.windowCenter
        }
      };
      cornerstone.setViewport(viewportRef.current, updatedViewport);
      setViewport(updatedViewport);
      setWindowWidth(newWw);
    }
  };

  const adjustWindowCenter = (delta) => {
    if (mediaType !== 'dicom' || !viewportRef.current || !viewport) return;
    
    const newWc = viewport.voi.windowCenter + delta;
    const updatedViewport = {
      ...viewport,
      voi: {
        windowWidth: viewport.voi.windowWidth,
        windowCenter: newWc
      }
    };
    cornerstone.setViewport(viewportRef.current, updatedViewport);
    setViewport(updatedViewport);
    setWindowCenter(newWc);
  };

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const stepForward = () => {
    if (videoRef.current) {
      // Step forward by 1/30th of a second (typical frame rate)
      videoRef.current.currentTime += (1/30);
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const stepBackward = () => {
    if (videoRef.current) {
      // Step backward by 1/30th of a second
      videoRef.current.currentTime -= (1/30);
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoProgress = (e) => {
    if (videoRef.current) {
      const seekTime = (e.target.value / 100) * videoRef.current.duration;
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
      setVideoLoaded(true);
    }
  };

  const handleVideoError = () => {
    setError('Failed to load video');
    setIsLoading(false);
  };

  // Download current media
  const downloadMedia = () => {
    if (mediaType === 'dicom' && viewportRef.current) {
      const element = viewportRef.current;
      const filename = 'dicom-image.png';
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.width = element.offsetWidth;
      canvas.height = element.offsetHeight;
      
      context.drawImage(element, 0, 0, canvas.width, canvas.height);
      
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } 
    else if (mediaType === 'image') {
      const link = document.createElement('a');
      link.download = 'image-download.jpg';
      link.href = imageUrl;
      link.click();
    }
    else if (mediaType === 'video') {
      // For videos, we'll create a download link to the source
      const link = document.createElement('a');
      link.download = 'video-download.mp4';
      link.href = videoRef.current.src;
      link.click();
    }
  };

  // Format time for video display (MM:SS)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {mediaType === 'dicom' ? 'Medical Image Viewer' : 
         mediaType === 'video' ? 'Video Viewer' : 
         'Image Viewer'}
      </h3>
      
      {/* Toolbar - Conditional rendering based on media type */}
      <div className="mb-4 bg-gray-100 rounded-lg p-2 flex flex-wrap gap-2">
        {/* DICOM Tools */}
        {mediaType === 'dicom' && (
          <>
            <button 
              onClick={() => setToolActive('Wwwc')}
              className={`p-2 rounded ${activeTool === 'Wwwc' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-200'}`}
              title="Window Level"
            >
              <Maximize className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setToolActive('Zoom')}
              className={`p-2 rounded ${activeTool === 'Zoom' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-200'}`}
              title="Zoom"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setToolActive('Pan')}
              className={`p-2 rounded ${activeTool === 'Pan' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-200'}`}
              title="Pan"
            >
              <Move className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setToolActive('Length')}
              className={`p-2 rounded ${activeTool === 'Length' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-200'}`}
              title="Length Measurement"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12H22M5 8V16M19 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button 
              onClick={() => setToolActive('Angle')}
              className={`p-2 rounded ${activeTool === 'Angle' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-200'}`}
              title="Angle Measurement"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22V12M12 12L20 4M12 12L4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button 
              onClick={() => setToolActive('EllipticalRoi')}
              className={`p-2 rounded ${activeTool === 'EllipticalRoi' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-200'}`}
              title="Elliptical ROI"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="12" cy="12" rx="8" ry="6" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <button 
              onClick={() => setToolActive('RectangleRoi')}
              className={`p-2 rounded ${activeTool === 'RectangleRoi' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-200'}`}
              title="Rectangle ROI"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="6" width="16" height="12" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            
            <div className="border-l border-gray-300 mx-1"></div>
            
            <button 
              onClick={() => adjustWindowWidth(10)} 
              className="p-2 rounded text-gray-600 hover:bg-gray-200"
              title="Increase Window Width"
            >
              W+
            </button>
            <button 
              onClick={() => adjustWindowWidth(-10)} 
              className="p-2 rounded text-gray-600 hover:bg-gray-200"
              title="Decrease Window Width"
            >
              W-
            </button>
            <button 
              onClick={() => adjustWindowCenter(10)} 
              className="p-2 rounded text-gray-600 hover:bg-gray-200"
              title="Increase Window Center"
            >
              C+
            </button>
            <button 
              onClick={() => adjustWindowCenter(-10)} 
              className="p-2 rounded text-gray-600 hover:bg-gray-200"
              title="Decrease Window Center"
            >
              C-
            </button>
          </>
        )}
        
        {/* Video Controls */}
        {mediaType === 'video' && videoLoaded && (
          <>
            <button 
              onClick={togglePlay} 
              className="p-2 rounded text-gray-600 hover:bg-gray-200"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button 
              onClick={stepBackward} 
              className="p-2 rounded text-gray-600 hover:bg-gray-200"
              title="Previous Frame"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button 
              onClick={stepForward} 
              className="p-2 rounded text-gray-600 hover:bg-gray-200"
              title="Next Frame"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleMute} 
              className="p-2 rounded text-gray-600 hover:bg-gray-200"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            
            <div className="flex-1 flex items-center mx-2">
              <span className="text-xs text-gray-500 mr-2">{formatTime(currentTime)}</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleVideoProgress}
                className="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer" 
              />
              <span className="text-xs text-gray-500 ml-2">{formatTime(duration)}</span>
            </div>
          </>
        )}
        
        {/* Common Controls */}
        <div className={`${mediaType === 'video' && videoLoaded ? 'border-l border-gray-300 mx-1' : ''}`}></div>
        
        {(mediaType === 'dicom' || mediaType === 'image') && (
          <>
            <button onClick={zoomIn} className="p-2 rounded text-gray-600 hover:bg-gray-200" title="Zoom In">
              <PlusCircle className="w-5 h-5" />
            </button>
            <button onClick={zoomOut} className="p-2 rounded text-gray-600 hover:bg-gray-200" title="Zoom Out">
              <MinusCircle className="w-5 h-5" />
            </button>
          </>
        )}
        
        <button onClick={resetView} className="p-2 rounded text-gray-600 hover:bg-gray-200" title="Reset View">
          <RotateCw className="w-5 h-5" />
        </button>
        
        <button onClick={downloadMedia} className="p-2 rounded text-gray-600 hover:bg-gray-200" title="Download">
          <Download className="w-5 h-5" />
        </button>
      </div>
      
      {/* Viewport - Conditional rendering based on media type */}
      <div className="relative flex-grow" style={{ minHeight: '500px' }}>
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <span className="ml-2 text-indigo-600">Loading media...</span>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-75 z-10">
            <div className="text-red-600 text-center">
              <div className="font-bold">Error loading media</div>
              <div>{error}</div>
            </div>
          </div>
        )}
        
        {/* DICOM Viewport */}
        {mediaType === 'dicom' && (
          <div 
            ref={viewportRef}
            className="w-full h-full bg-black"
            style={{ 
              minHeight: '500px', 
              border: '1px solid #ddd',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              display: mediaType === 'dicom' ? 'block' : 'none'
            }}
          ></div>
        )}
        
        {/* Video Player */}
        {mediaType === 'video' && (
          <div className="w-full h-full flex items-center justify-center bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="max-w-full max-h-full"
              src={imageUrl}
              onLoadedMetadata={handleVideoLoaded}
              onTimeUpdate={handleTimeUpdate}
              onError={handleVideoError}
              onEnded={() => setIsPlaying(false)}
              style={{ maxHeight: '500px' }}
              playsInline
            ></video>
          </div>
        )}
        
        {/* Standard Image */}
        {mediaType === 'image' && (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden">
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Viewer content"
              className="max-w-full max-h-full transition-transform duration-200"
              style={{ 
                maxHeight: '500px',
                transform: `scale(${zoomLevel})`
              }}
              onLoad={() => setIsLoading(false)}
              onError={() => setError('Failed to load image')}
            />
          </div>
        )}
      </div>
      
      {/* Information Panel */}
      {!isLoading && !error && (
        <div className="mt-4 text-sm text-gray-700 overflow-x-auto">
          {/* DICOM Info */}
          {mediaType === 'dicom' && imageId && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <div className="font-medium">Zoom</div>
                <div>{(zoomLevel * 100).toFixed(0)}%</div>
              </div>
              {windowWidth && windowCenter && (
                <>
                  <div>
                    <div className="font-medium">Window Width</div>
                    <div>{windowWidth.toFixed(0)}</div>
                  </div>
                  <div>
                    <div className="font-medium">Window Center</div>
                    <div>{windowCenter.toFixed(0)}</div>
                  </div>
                </>
              )}
              {metadata && metadata.patientId && (
                <div>
                  <div className="font-medium">Patient ID</div>
                  <div>{metadata.patientId}</div>
                </div>
              )}
              {metadata && metadata.studyDate && (
                <div>
                  <div className="font-medium">Study Date</div>
                  <div>{metadata.studyDate}</div>
                </div>
              )}
              {metadata && metadata.modality && (
                <div>
                  <div className="font-medium">Modality</div>
                  <div>{metadata.modality}</div>
                </div>
              )}
            </div>
          )}
          
          {/* Video/Image Info */}
          {mediaType !== 'dicom' && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {mediaType === 'image' && (
                <div>
                  <div className="font-medium">Zoom</div>
                  <div>{(zoomLevel * 100).toFixed(0)}%</div>
                </div>
              )}
              {mediaType === 'video' && videoLoaded && (
                <>
                  <div>
                    <div className="font-medium">Current Time</div>
                    <div>{formatTime(currentTime)}</div>
                  </div>
                  <div>
                    <div className="font-medium">Duration</div>
                    <div>{formatTime(duration)}</div>
                  </div>
                </>
              )}
              <div>
                <div className="font-medium">Type</div>
                <div className="capitalize">{mediaType}</div>
              </div>
              <div>
                <div className="font-medium">Source</div>
                <div className="truncate max-w-40">{imageUrl.split('/').pop()}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OHIFViewer;