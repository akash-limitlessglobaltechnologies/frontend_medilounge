import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  ZoomIn, ZoomOut, RotateCw, RotateCcw, Maximize, Minimize, 
  Upload, Link, X, Lock, Unlock, Trash2, Edit, Eye, EyeOff,
  Plus, Circle as CircleIcon, Square, Move
} from 'lucide-react';
import AnnotationToolbar from './AnnotationToolbar';
import AnnotationList from './AnnotationList';
import ImageUploader from './ImageUploader';
import PasskeyModal from './PasskeyModal';
import axios from 'axios';

const ImageViewer = ({ onClose, imageUrl: initialImageUrl, imageName: initialImageName, initialPasskey = null }) => {
  // Refs for performance optimization
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const annotationsUpdatedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const lastRenderTime = useRef(0);
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasskeyModal, setShowPasskeyModal] = useState(!initialPasskey);
  const [passkey, setPasskey] = useState(initialPasskey || '');
  
  // Image state
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImageUrl || '/api/placeholder/800/600');
  const [imageName, setImageName] = useState(initialImageName || 'Image');
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Annotation state
  const [annotations, setAnnotations] = useState([]);
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const [currentAnnotationType, setCurrentAnnotationType] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [annotationColor, setAnnotationColor] = useState('#00ff00'); // Green by default
  const [showAnnotations, setShowAnnotations] = useState(true);
  
  // Drag state for moving/resizing annotations
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null); // 'move', 'resize', etc.
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Initialize with initial passkey if provided
  useEffect(() => {
    if (initialPasskey && validatePasskey(initialPasskey)) {
      handlePasskeySubmit(initialPasskey);
    }
  }, [initialPasskey]);

  // Validate passkey format (12 digits, alphanumeric)
  const validatePasskey = useCallback((key) => {
    const passkeyRegex = /^[a-zA-Z0-9]{12}$/;
    return passkeyRegex.test(key);
  }, []);

  // Authenticate user with passkey
  const handlePasskeySubmit = useCallback(async (submittedPasskey) => {
    if (validatePasskey(submittedPasskey)) {
      setPasskey(submittedPasskey);
      setIsAuthenticated(true);
      setShowPasskeyModal(false);
      
      // Fetch existing annotations after authentication
      try {
        const response = await axios.get(`${process.env.REACT_APP_URI}/api/annotations/image`, {
          params: { passkey: submittedPasskey }
        });
        
        if (response.data && response.data.annotations) {
          setAnnotations(response.data.annotations);
        }
      } catch (error) {
        console.error('Error fetching annotations:', error);
      }
    } else {
      alert('Invalid passkey. Please enter a valid 12-digit alphanumeric passkey.');
    }
  }, [validatePasskey]);

  // Save annotations to the API (debounced)
  const saveAnnotations = useCallback(async () => {
    if (!isAuthenticated || !passkey) return;
    
    try {
      await axios.post(`${process.env.REACT_APP_URI}/api/annotations/image`, {
        passkey,
        imageName,
        imageUrl,
        annotations
      });
      annotationsUpdatedRef.current = false;
    } catch (error) {
      console.error('Error saving annotations:', error);
    }
  }, [isAuthenticated, passkey, imageName, imageUrl, annotations]);

  // Debounced save
  useEffect(() => {
    if (annotationsUpdatedRef.current) {
      const timer = setTimeout(() => {
        saveAnnotations();
      }, 1000); // Debounce for 1 second
      
      return () => clearTimeout(timer);
    }
  }, [annotations, saveAnnotations]);

  // Handle image operations
  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  const handleRotateClockwise = useCallback(() => {
    setRotation(prev => prev + 90);
  }, []);

  const handleRotateCounterClockwise = useCallback(() => {
    setRotation(prev => prev - 90);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  // Handle image upload and URL setting
  const handleImageUpload = useCallback((file) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setImageName(file.name);
    setShowImageUploader(false);
  }, []);

  const handleImageUrlSubmit = useCallback((url, name) => {
    setImageUrl(url);
    setImageName(name || 'Remote Image');
    setShowImageUploader(false);
  }, []);

  // Helper functions for annotation interaction
  const getHandleAtPosition = useCallback((annotation, x, y) => {
    const handleSize = 10; // Size of hit area for handles

    // Check for endpoints of bidirectional
    if (annotation.type === 'bidirectional' && annotation.points?.length === 4) {
      // Check all four endpoints for bidirectional
      for (let i = 0; i < 4; i++) {
        if (Math.abs(annotation.points[i][0] - x) < handleSize && 
            Math.abs(annotation.points[i][1] - y) < handleSize) {
          return `endpoint-${i}`;
        }
      }
    }

    // Check if we're on the center handle
    if (Math.abs(annotation.x - x) < handleSize && Math.abs(annotation.y - y) < handleSize) {
      return 'center';
    }

    if (annotation.type === 'circle') {
      // Check cardinal points for circle
      const right = { x: annotation.x + annotation.radius, y: annotation.y };
      const top = { x: annotation.x, y: annotation.y - annotation.radius };
      const left = { x: annotation.x - annotation.radius, y: annotation.y };
      const bottom = { x: annotation.x, y: annotation.y + annotation.radius };
      
      if (Math.abs(right.x - x) < handleSize && Math.abs(right.y - y) < handleSize) return 'right';
      if (Math.abs(top.x - x) < handleSize && Math.abs(top.y - y) < handleSize) return 'top';
      if (Math.abs(left.x - x) < handleSize && Math.abs(left.y - y) < handleSize) return 'left';
      if (Math.abs(bottom.x - x) < handleSize && Math.abs(bottom.y - y) < handleSize) return 'bottom';
    } else if (annotation.type === 'rectangle' || annotation.type === 'ellipse') {
      const halfWidth = annotation.width / 2;
      const halfHeight = annotation.height / 2;
      
      // Check corners
      const topLeft = { x: annotation.x - halfWidth, y: annotation.y - halfHeight };
      const topRight = { x: annotation.x + halfWidth, y: annotation.y - halfHeight };
      const bottomRight = { x: annotation.x + halfWidth, y: annotation.y + halfHeight };
      const bottomLeft = { x: annotation.x - halfWidth, y: annotation.y + halfHeight };
      
      if (Math.abs(topLeft.x - x) < handleSize && Math.abs(topLeft.y - y) < handleSize) return 'topleft';
      if (Math.abs(topRight.x - x) < handleSize && Math.abs(topRight.y - y) < handleSize) return 'topright';
      if (Math.abs(bottomRight.x - x) < handleSize && Math.abs(bottomRight.y - y) < handleSize) return 'bottomright';
      if (Math.abs(bottomLeft.x - x) < handleSize && Math.abs(bottomLeft.y - y) < handleSize) return 'bottomleft';
      
      // Check edges (midpoints)
      const top = { x: annotation.x, y: annotation.y - halfHeight };
      const right = { x: annotation.x + halfWidth, y: annotation.y };
      const bottom = { x: annotation.x, y: annotation.y + halfHeight };
      const left = { x: annotation.x - halfWidth, y: annotation.y };
      
      if (Math.abs(top.x - x) < handleSize && Math.abs(top.y - y) < handleSize) return 'top';
      if (Math.abs(right.x - x) < handleSize && Math.abs(right.y - y) < handleSize) return 'right';
      if (Math.abs(bottom.x - x) < handleSize && Math.abs(bottom.y - y) < handleSize) return 'bottom';
      if (Math.abs(left.x - x) < handleSize && Math.abs(left.y - y) < handleSize) return 'left';
    }
    
    return null;
  }, []);

  const getAnnotationAtPosition = useCallback((x, y) => {
    // Check from top to bottom in z-order
    for (let i = annotations.length - 1; i >= 0; i--) {
      const anno = annotations[i];
      
      if (anno.locked) continue; // Skip locked annotations
      
      if (anno.type === 'circle') {
        const dx = anno.x - x;
        const dy = anno.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if point is close to the circle edge
        const edgeDistance = Math.abs(distance - anno.radius);
        if (edgeDistance < 5) return anno;
      } else if (anno.type === 'rectangle') {
        const halfWidth = anno.width / 2;
        const halfHeight = anno.height / 2;
        
        // Check if near the edge of the rectangle
        const leftEdge = anno.x - halfWidth;
        const rightEdge = anno.x + halfWidth;
        const topEdge = anno.y - halfHeight;
        const bottomEdge = anno.y + halfHeight;
        
        const nearLeftEdge = Math.abs(x - leftEdge) < 5 && y >= topEdge && y <= bottomEdge;
        const nearRightEdge = Math.abs(x - rightEdge) < 5 && y >= topEdge && y <= bottomEdge;
        const nearTopEdge = Math.abs(y - topEdge) < 5 && x >= leftEdge && x <= rightEdge;
        const nearBottomEdge = Math.abs(y - bottomEdge) < 5 && x >= leftEdge && x <= rightEdge;
        
        if (nearLeftEdge || nearRightEdge || nearTopEdge || nearBottomEdge) {
          return anno;
        }
      } else if (anno.type === 'ellipse') {
        // Check if near the ellipse edge
        const halfWidth = anno.width / 2;
        const halfHeight = anno.height / 2;
        
        if (halfWidth === 0 || halfHeight === 0) continue;
        
        const normalized = Math.pow(x - anno.x, 2) / Math.pow(halfWidth, 2) + 
                          Math.pow(y - anno.y, 2) / Math.pow(halfHeight, 2);
        
        // Check if point is close to the ellipse edge
        if (Math.abs(normalized - 1) < 0.1) return anno;
      } else if (anno.type === 'bidirectional' && anno.points?.length === 4) {
        // Check both lines in the bidirectional annotation
        for (let j = 0; j < 3; j += 2) {  // Check line 0-1 and 2-3
          const [x1, y1] = anno.points[j];
          const [x2, y2] = anno.points[j+1];
          
          const line_length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          if (line_length === 0) continue;
          
          const distance = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) / line_length;
          
          const minX = Math.min(x1, x2) - 5;
          const maxX = Math.max(x1, x2) + 5;
          const minY = Math.min(y1, y2) - 5;
          const maxY = Math.max(y1, y2) + 5;
          
          if (distance < 5 && x >= minX && x <= maxX && y >= minY && y <= maxY) {
            return anno;
          }
        }
      }
    }
    
    return null;
  }, [annotations]);

  // Drawing functions
  const startDrawing = useCallback((type) => {
    setCurrentAnnotationType(type);
    setIsDrawing(true);
  }, []);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setCurrentAnnotationType(null);
    
    // Mark annotations as updated
    annotationsUpdatedRef.current = true;
  }, []);

  // Canvas event handlers
  const handleCanvasClick = useCallback((e) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    if (isDrawing && currentAnnotationType) {
      if (['bidirectional'].includes(currentAnnotationType)) {
        // For bidirectional, handle multi-point creation
        const annotation = annotations.find(a => a.id === activeAnnotation && !a.complete);
        
        if (annotation) {
          // This is the second point or later
          setAnnotations(prevAnnotations => 
            prevAnnotations.map(a => {
              if (a.id === activeAnnotation) {
                if (currentAnnotationType === 'bidirectional') {
                  // For bidirectional, if we have 2 points already, add the 3rd point
                  // If we have 3 points, add the 4th and complete
                  if (a.points.length === 2) {
                    return {
                      ...a,
                      points: [...a.points, [x, y]]
                    };
                  } else {
                    return {
                      ...a,
                      points: [...a.points, [x, y]],
                      complete: true
                    };
                  }
                }
              }
              return a;
            })
          );
          
          if (annotation.points?.length === 3 && currentAnnotationType === 'bidirectional') {
            stopDrawing();
          }
          
          // Mark annotations as updated
          annotationsUpdatedRef.current = true;
        } else {
          // This is the first point (create a new annotation)
          const newAnnotation = {
            id: Date.now(),
            type: currentAnnotationType,
            x: x,
            y: y,
            color: annotationColor,
            description: '',
            locked: false,
            complete: false,
            points: [[x, y]]
          };
          
          setAnnotations(prev => [...prev, newAnnotation]);
          setActiveAnnotation(newAnnotation.id);
          
          // Mark annotations as updated
          annotationsUpdatedRef.current = true;
        }
      } else {
        // Standard shapes (rectangle, circle, ellipse)
        const newAnnotation = {
          id: Date.now(),
          type: currentAnnotationType,
          x,
          y,
          width: currentAnnotationType === 'rectangle' ? 100 : 50,
          height: currentAnnotationType === 'rectangle' ? 80 : 50,
          radius: currentAnnotationType === 'circle' ? 50 : null,
          color: annotationColor,
          description: '',
          locked: false
        };
        
        setAnnotations(prev => [...prev, newAnnotation]);
        setActiveAnnotation(newAnnotation.id);
        stopDrawing();
        
        // Mark annotations as updated
        annotationsUpdatedRef.current = true;
      }
    } else {
      // Select an annotation when not in drawing mode
      const clickedAnnotation = getAnnotationAtPosition(x, y);
      setActiveAnnotation(clickedAnnotation ? clickedAnnotation.id : null);
    }
  }, [
    isDrawing, 
    currentAnnotationType, 
    activeAnnotation, 
    annotations, 
    annotationColor, 
    scale, 
    getAnnotationAtPosition, 
    stopDrawing
  ]);

  const handleMouseDown = useCallback((e) => {
    if (activeAnnotation === null || isDrawing || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    const annotation = annotations.find(a => a.id === activeAnnotation);
    if (!annotation || annotation.locked) return;
    
    // Check if we're on a handle or inside the annotation
    const handle = getHandleAtPosition(annotation, x, y);
    if (handle) {
      setDragMode(handle);
      setDragStartPos({ x, y });
      setIsDragging(true);
      e.preventDefault();
    } else if (getAnnotationAtPosition(x, y) === annotation) {
      setDragMode('move');
      setDragStartPos({ x, y });
      setIsDragging(true);
      e.preventDefault();
    }
    
    // Store current mouse position for throttled updates
    lastMousePosition.current = { x, y };
  }, [
    activeAnnotation, 
    isDrawing, 
    scale, 
    annotations, 
    getHandleAtPosition, 
    getAnnotationAtPosition
  ]);

  // Optimized mouse move handler with requestAnimationFrame
  const handleMouseMove = useCallback((e) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    // Store current mouse position for animation frame updates
    lastMousePosition.current = { x, y };
    
    // Only schedule a new frame if we don't have one pending
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(() => {
        animationFrameRef.current = null;
        
        // Get the latest mouse position from the ref
        const { x, y } = lastMousePosition.current;
        
        if (isDrawing) {
          if (['bidirectional'].includes(currentAnnotationType)) {
            // Show a preview of the line being drawn
            const activeAnno = annotations.find(a => a.id === activeAnnotation && !a.complete);
            if (activeAnno) {
              // Update the preview point
              setAnnotations(prevAnnotations => {
                return prevAnnotations.map(anno => {
                  if (anno.id === activeAnnotation) {
                    if (currentAnnotationType === 'bidirectional') {
                      if (anno.points.length === 1) {
                        // Preview second point
                        return {
                          ...anno,
                          previewPoint: [x, y]
                        };
                      } else if (anno.points.length === 3) {
                        // Preview fourth point
                        return {
                          ...anno,
                          previewPoint: [x, y]
                        };
                      }
                    }
                  }
                  return anno;
                });
              });
            }
          }
        } else if (isDragging && activeAnnotation !== null) {
          // Handle moving or resizing annotations
          setAnnotations(prevAnnotations => {
            return prevAnnotations.map(anno => {
              if (anno.id !== activeAnnotation) return anno;
              
              const deltaX = x - dragStartPos.x;
              const deltaY = y - dragStartPos.y;
              
              // Clone annotation for modifications
              const updated = { ...anno };
              
              // For bidirectional, ensure we have a central reference point
              if (anno.type === 'bidirectional' && !anno.hasOwnProperty('x')) {
                if (anno.points && anno.points.length > 0) {
                  // For bidirectional, use the midpoint of the first line
                  if (anno.type === 'bidirectional' && anno.points.length >= 4) {
                    updated.x = (anno.points[0][0] + anno.points[1][0]) / 2;
                    updated.y = (anno.points[0][1] + anno.points[1][1]) / 2;
                  }
                }
              }
              
              if (dragMode === 'move') {
                // Move the entire annotation
                if (anno.points) {
                  // For line-based annotations, move all points
                  updated.points = anno.points.map(([px, py]) => [px + deltaX, py + deltaY]);
                  
                  // Update the center reference if it exists
                  if (anno.hasOwnProperty('x')) {
                    updated.x += deltaX;
                    updated.y += deltaY;
                  }
                } else {
                  // For shape annotations
                  updated.x += deltaX;
                  updated.y += deltaY;
                }
              } else if (dragMode === 'center') {
                // Move the center point for shapes
                if (!anno.points) {
                  updated.x = x;
                  updated.y = y;
                }
              } else if (anno.type === 'circle') {
                // Resize circle based on cardinal point
                const minRadius = 10;
                
                if (dragMode === 'right') {
                  updated.radius = Math.max(minRadius, Math.abs(x - anno.x));
                } else if (dragMode === 'left') {
                  updated.radius = Math.max(minRadius, Math.abs(anno.x - x));
                } else if (dragMode === 'top') {
                  updated.radius = Math.max(minRadius, Math.abs(anno.y - y));
                } else if (dragMode === 'bottom') {
                  updated.radius = Math.max(minRadius, Math.abs(y - anno.y));
                }
              } else if (anno.type === 'rectangle' || anno.type === 'ellipse') {
                // Resize rectangle or ellipse
                const minSize = 10;
                
                if (dragMode === 'right') {
                  updated.width = Math.max(minSize, 2 * Math.abs(x - anno.x));
                } else if (dragMode === 'left') {
                  updated.width = Math.max(minSize, 2 * Math.abs(anno.x - x));
                } else if (dragMode === 'top') {
                  updated.height = Math.max(minSize, 2 * Math.abs(anno.y - y));
                } else if (dragMode === 'bottom') {
                  updated.height = Math.max(minSize, 2 * Math.abs(y - anno.y));
                } else if (dragMode === 'topright') {
                  updated.width = Math.max(minSize, 2 * Math.abs(x - anno.x));
                  updated.height = Math.max(minSize, 2 * Math.abs(anno.y - y));
                } else if (dragMode === 'topleft') {
                  updated.width = Math.max(minSize, 2 * Math.abs(anno.x - x));
                  updated.height = Math.max(minSize, 2 * Math.abs(anno.y - y));
                } else if (dragMode === 'bottomright') {
                  updated.width = Math.max(minSize, 2 * Math.abs(x - anno.x));
                  updated.height = Math.max(minSize, 2 * Math.abs(y - anno.y));
                } else if (dragMode === 'bottomleft') {
                  updated.width = Math.max(minSize, 2 * Math.abs(anno.x - x));
                  updated.height = Math.max(minSize, 2 * Math.abs(y - anno.y));
                }
              } else if (anno.type === 'bidirectional' && anno.points?.length === 4) {
                // Allow editing the endpoints of both lines
                if (dragMode === 'endpoint-0') {
                  updated.points = [[x, y], anno.points[1], anno.points[2], anno.points[3]];
                } else if (dragMode === 'endpoint-1') {
                  updated.points = [anno.points[0], [x, y], anno.points[2], anno.points[3]];
                } else if (dragMode === 'endpoint-2') {
                  updated.points = [anno.points[0], anno.points[1], [x, y], anno.points[3]];
                } else if (dragMode === 'endpoint-3') {
                  updated.points = [anno.points[0], anno.points[1], anno.points[2], [x, y]];
                }
                
                // Update center reference point
                if (updated.hasOwnProperty('x')) {
                  updated.x = (updated.points[0][0] + updated.points[1][0]) / 2;
                  updated.y = (updated.points[0][1] + updated.points[1][1]) / 2;
                }
              }
              
              return updated;
            });
          });
          
          setDragStartPos({ x, y });
          
          // Mark annotations as updated when dragging
          annotationsUpdatedRef.current = true;
        }
        
        // Update canvas if needed
        renderCanvas();
      });
    }
  }, [
    isDrawing, 
    isDragging, 
    activeAnnotation, 
    annotations, 
    currentAnnotationType, 
    dragMode, 
    dragStartPos, 
    scale
  ]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDragMode(null);
      
      // Save annotations after drag operation is complete
      if (annotationsUpdatedRef.current) {
        saveAnnotations();
      }
    }
  }, [isDragging, saveAnnotations]);

  // Annotation operations
  const updateAnnotation = useCallback((id, updates) => {
    setAnnotations(prevAnnotations => 
      prevAnnotations.map(anno => 
        anno.id === id ? { ...anno, ...updates } : anno
      )
    );
    
    // Mark annotations as updated
    annotationsUpdatedRef.current = true;
    
    // Save annotations after update
    setTimeout(saveAnnotations, 100);
  }, [saveAnnotations]);

  const deleteAnnotation = useCallback((id) => {
    setAnnotations(prevAnnotations => prevAnnotations.filter(anno => anno.id !== id));
    if (activeAnnotation === id) {
      setActiveAnnotation(null);
    }
    
    // Mark annotations as updated
    annotationsUpdatedRef.current = true;
    
    // Save annotations after deletion
    setTimeout(saveAnnotations, 100);
  }, [activeAnnotation, saveAnnotations]);

  const toggleAnnotationLock = useCallback((id) => {
    setAnnotations(prevAnnotations => 
      prevAnnotations.map(anno => 
        anno.id === id ? { ...anno, locked: !anno.locked } : anno
      )
    );
    
    // Mark annotations as updated
    annotationsUpdatedRef.current = true;
    
    // Save annotations after locking/unlocking
    setTimeout(saveAnnotations, 100);
  }, [saveAnnotations]);

  // Measurement calculations
  const calculateArea = useCallback((annotation) => {
    if (annotation.type === 'circle') {
      return Math.PI * Math.pow(annotation.radius, 2);
    } else if (annotation.type === 'rectangle') {
      return annotation.width * annotation.height;
    } else if (annotation.type === 'ellipse') {
      return Math.PI * (annotation.width / 2) * (annotation.height / 2);
    }
    return 0;
  }, []);

  // Optimized canvas rendering
  const renderCanvas = useCallback(() => {
    if (!canvasRef.current || !showAnnotations) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set cursor based on context
    if (isDrawing) {
      canvas.style.cursor = 'crosshair';
    } else if (isDragging) {
      canvas.style.cursor = 'grabbing';
    } else if (activeAnnotation !== null) {
      const anno = annotations.find(a => a.id === activeAnnotation);
      if (anno && !anno.locked) {
        canvas.style.cursor = 'move';
      } else {
        canvas.style.cursor = 'default';
      }
    } else {
      canvas.style.cursor = 'default';
    }
    
    // Draw each annotation
    annotations.forEach(annotation => {
      ctx.strokeStyle = annotation.color;
      ctx.lineWidth = 2;
      ctx.setLineDash(annotation.locked ? [] : [5, 5]);
      
      if (annotation.type === 'circle') {
        ctx.beginPath();
        ctx.arc(annotation.x, annotation.y, annotation.radius, 0, 2 * Math.PI);
        ctx.stroke();
        
        // If active, show measurements
        if (activeAnnotation === annotation.id) {
          const area = calculateArea(annotation).toFixed(0);
          ctx.fillStyle = annotation.color;
          ctx.font = '14px Arial';
          ctx.fillText(`Area: ${area} mm²`, annotation.x, annotation.y + annotation.radius + 20);
        }
      } else if (annotation.type === 'rectangle') {
        ctx.beginPath();
        ctx.rect(
          annotation.x - annotation.width / 2, 
          annotation.y - annotation.height / 2, 
          annotation.width, 
          annotation.height
        );
        ctx.stroke();
        
        // If active, show measurements
        if (activeAnnotation === annotation.id) {
          const area = calculateArea(annotation).toFixed(0);
          ctx.fillStyle = annotation.color;
          ctx.font = '14px Arial';
          ctx.fillText(`Area: ${area} mm²`, annotation.x, annotation.y + annotation.height / 2 + 20);
        }
      } else if (annotation.type === 'ellipse') {
        ctx.beginPath();
        ctx.ellipse(
          annotation.x, 
          annotation.y, 
          annotation.width / 2, 
          annotation.height / 2, 
          0, 0, 2 * Math.PI
        );
        ctx.stroke();
        
        // If active, show measurements
        if (activeAnnotation === annotation.id) {
          const area = (Math.PI * (annotation.width / 2) * (annotation.height / 2)).toFixed(0);
          ctx.fillStyle = annotation.color;
          ctx.font = '14px Arial';
          ctx.fillText(`Area: ${area} mm²`, annotation.x, annotation.y + annotation.height / 2 + 20);
        }
      } else if (annotation.type === 'bidirectional' && annotation.points?.length >= 1) {
        // Draw the first line
        ctx.beginPath();
        ctx.moveTo(annotation.points[0][0], annotation.points[0][1]);
        
        if (annotation.points.length >= 2) {
          ctx.lineTo(annotation.points[1][0], annotation.points[1][1]);
        } else if (annotation.previewPoint) {
          ctx.lineTo(annotation.previewPoint[0], annotation.previewPoint[1]);
          ctx.setLineDash([5, 3]);
        }
        
        ctx.stroke();
        ctx.setLineDash(annotation.locked ? [] : [5, 5]);
        
        // Draw the second line if we have enough points
        if (annotation.points.length >= 3) {
          ctx.beginPath();
          ctx.moveTo(annotation.points[2][0], annotation.points[2][1]);
          
          if (annotation.points.length >= 4) {
            ctx.lineTo(annotation.points[3][0], annotation.points[3][1]);
          } else if (annotation.previewPoint) {
            ctx.lineTo(annotation.previewPoint[0], annotation.previewPoint[1]);
            ctx.setLineDash([5, 3]);
          }
          
          ctx.stroke();
          ctx.setLineDash(annotation.locked ? [] : [5, 5]);
        }
        
        // If active, show measurements
        if (activeAnnotation === annotation.id) {
          ctx.fillStyle = annotation.color;
          ctx.font = '14px Arial';
          
          // First line measurement
          if (annotation.points.length >= 2) {
            const dx1 = annotation.points[1][0] - annotation.points[0][0];
            const dy1 = annotation.points[1][1] - annotation.points[0][1];
            const length1 = Math.sqrt(dx1 * dx1 + dy1 * dy1).toFixed(1);
            
            const midX1 = (annotation.points[0][0] + annotation.points[1][0]) / 2;
            const midY1 = (annotation.points[0][1] + annotation.points[1][1]) / 2;
            ctx.fillText(`L1: ${length1} mm`, midX1, midY1 - 10);
          }
          
          // Second line measurement
          if (annotation.points.length >= 4) {
            const dx2 = annotation.points[3][0] - annotation.points[2][0];
            const dy2 = annotation.points[3][1] - annotation.points[2][1];
            const length2 = Math.sqrt(dx2 * dx2 + dy2 * dy2).toFixed(1);
            
            const midX2 = (annotation.points[2][0] + annotation.points[3][0]) / 2;
            const midY2 = (annotation.points[2][1] + annotation.points[3][1]) / 2;
            ctx.fillText(`L2: ${length2} mm`, midX2, midY2 - 10);
          }
        }
      }
      
      // If annotation is active, draw handles for resizing
      if (activeAnnotation === annotation.id && !annotation.locked) {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        
        if (annotation.type === 'bidirectional' && annotation.points?.length >= 4) {
          // Draw handles for endpoints of bidirectional
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(annotation.points[i][0], annotation.points[i][1], 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
          }
          
          // Draw center handle for moving the entire annotation
          const centerX = (annotation.points[0][0] + annotation.points[1][0]) / 2;
          const centerY = (annotation.points[0][1] + annotation.points[1][1]) / 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        } else if (['circle', 'rectangle', 'ellipse'].includes(annotation.type)) {
          // Draw center handle
          ctx.beginPath();
          ctx.arc(annotation.x, annotation.y, 5, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
          
          // Draw corner/edge handles based on annotation type
          const handles = [];
          
          if (annotation.type === 'circle') {
            // For circle, just need handles at cardinal points
            handles.push([annotation.x + annotation.radius, annotation.y]); // right
            handles.push([annotation.x, annotation.y - annotation.radius]); // top
            handles.push([annotation.x - annotation.radius, annotation.y]); // left
            handles.push([annotation.x, annotation.y + annotation.radius]); // bottom
          } else {
            // For rectangle and ellipse
            const halfWidth = annotation.width / 2;
            const halfHeight = annotation.height / 2;
            
            // Corners
            handles.push([annotation.x - halfWidth, annotation.y - halfHeight]); // top-left
            handles.push([annotation.x + halfWidth, annotation.y - halfHeight]); // top-right
            handles.push([annotation.x + halfWidth, annotation.y + halfHeight]); // bottom-right
            handles.push([annotation.x - halfWidth, annotation.y + halfHeight]); // bottom-left
            
            // Edges (midpoints)
            handles.push([annotation.x, annotation.y - halfHeight]); // top
            handles.push([annotation.x + halfWidth, annotation.y]); // right
            handles.push([annotation.x, annotation.y + halfHeight]); // bottom
            handles.push([annotation.x - halfWidth, annotation.y]); // left
          }
          
          // Draw all handles
          handles.forEach(([hx, hy]) => {
            ctx.beginPath();
            ctx.arc(hx, hy, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
          });
        }
      }
    });
  }, [
    activeAnnotation, 
    annotations, 
    isDrawing, 
    isDragging, 
    showAnnotations, 
    calculateArea
  ]);

  // Re-render canvas when critical state changes
  useEffect(() => {
    renderCanvas();
  }, [
    annotations, 
    activeAnnotation, 
    showAnnotations, 
    isDrawing, 
    isDragging, 
    renderCanvas
  ]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Resize canvas when image loads
  const handleImageLoad = useCallback(() => {
    if (canvasRef.current && imageRef.current) {
      canvasRef.current.width = imageRef.current.naturalWidth;
      canvasRef.current.height = imageRef.current.naturalHeight;
      setImageLoaded(true);
    }
  }, []);

  useEffect(() => {
    const img = imageRef.current;
    if (img) {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener('load', handleImageLoad);
        return () => {
          img.removeEventListener('load', handleImageLoad);
        };
      }
    }
  }, [imageUrl, handleImageLoad]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      {/* Passkey Authentication Modal */}
      {showPasskeyModal && (
        <PasskeyModal 
          onSubmit={handlePasskeySubmit}
          onClose={onClose} 
          initialPasskey={initialPasskey}
        />
      )}
      
      {isAuthenticated && (
        <div 
          ref={containerRef}
          className="relative w-full h-full max-w-[95%] max-h-[95%] bg-gray-900 rounded-lg flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-2 border-b border-gray-700 bg-gray-800 rounded-t-lg">
            <h3 className="text-lg font-medium text-white">
              Image Viewer - {imageName} <span className="text-xs text-gray-400">Passkey: {passkey}</span>
            </h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowImageUploader(true)}
                className="p-1 rounded-full hover:bg-gray-600 text-gray-300"
                title="Upload/Link Image"
              >
                <Upload className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowAnnotations(!showAnnotations)}
                className="p-1 rounded-full hover:bg-gray-600 text-gray-300"
                title={showAnnotations ? "Hide Annotations" : "Show Annotations"}
              >
                {showAnnotations ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-600 text-gray-300"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Annotation Tools */}
            <AnnotationToolbar 
              onSelectTool={startDrawing}
              currentTool={currentAnnotationType}
              color={annotationColor}
              onColorChange={setAnnotationColor}
            />
            
            {/* Main Image Area */}
            <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-indigo-500 border-gray-700"></div>
                </div>
              )}
              <div 
                style={{ 
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease'
                }}
                className="relative"
              >
                <img 
                  ref={imageRef}
                  src={imageUrl} 
                  alt={imageName} 
                  className="max-h-full max-w-full object-contain"
                />
                <canvas 
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-auto"
                  onClick={handleCanvasClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>
            </div>
            
            {/* Right Sidebar - Annotation List */}
            <AnnotationList 
              annotations={annotations}
              activeAnnotation={activeAnnotation}
              onAnnotationSelect={setActiveAnnotation}
              onAnnotationUpdate={updateAnnotation}
              onAnnotationDelete={deleteAnnotation}
              onAnnotationLockToggle={toggleAnnotationLock}
            />
          </div>
          
          {/* Footer Controls */}
          <div className="p-2 border-t border-gray-700 bg-gray-800 rounded-b-lg flex justify-center space-x-4">
            <button 
              onClick={handleZoomIn}
              className="p-2 rounded-full hover:bg-gray-700 text-gray-300"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button 
              onClick={handleZoomOut}
              className="p-2 rounded-full hover:bg-gray-700 text-gray-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button 
              onClick={handleRotateClockwise}
              className="p-2 rounded-full hover:bg-gray-700 text-gray-300"
              title="Rotate Clockwise"
            >
              <RotateCw className="w-5 h-5" />
            </button>
            <button 
              onClick={handleRotateCounterClockwise}
              className="p-2 rounded-full hover:bg-gray-700 text-gray-300"
              title="Rotate Counter-Clockwise"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleFullscreen}
              className="p-2 rounded-full hover:bg-gray-700 text-gray-300"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>
  
          {/* Image Upload/Link Modal */}
          {showImageUploader && (
            <ImageUploader 
              onClose={() => setShowImageUploader(false)}
              onImageUpload={handleImageUpload}
              onImageUrlSubmit={handleImageUrlSubmit}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(ImageViewer);