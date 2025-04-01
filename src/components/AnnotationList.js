import React, { useState } from 'react';
import { 
  Lock, Unlock, Trash2, Edit, ChevronLeft, ChevronRight,
  Circle as CircleIcon, Square, PenTool, Type, Target, 
  Minus, AlignCenter, ArrowRightCircle
} from 'lucide-react';

const AnnotationList = ({ 
  annotations,
  activeAnnotation,
  onAnnotationSelect,
  onAnnotationUpdate,
  onAnnotationDelete,
  onAnnotationLockToggle
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingDescription, setEditingDescription] = useState(null);
  const [descriptionText, setDescriptionText] = useState('');

  // Map of annotation types to icons
  const typeIcons = {
    circle: <CircleIcon className="w-4 h-4" />,
    rectangle: <Square className="w-4 h-4" />,
    ellipse: <Target className="w-4 h-4" />,
    freehand: <PenTool className="w-4 h-4" />,
    spline: <ArrowRightCircle className="w-4 h-4" />,
    annotation: <Type className="w-4 h-4" />,
    length: <Minus className="w-4 h-4" />,
    bidirectional: <AlignCenter className="w-4 h-4" />
  };

  const startEditing = (annotation) => {
    setEditingDescription(annotation.id);
    setDescriptionText(annotation.description || '');
  };

  const saveDescription = () => {
    if (editingDescription) {
      onAnnotationUpdate(editingDescription, { description: descriptionText });
      setEditingDescription(null);
    }
  };

  const cancelEditing = () => {
    setEditingDescription(null);
  };

  const calculateArea = (annotation) => {
    if (annotation.type === 'circle') {
      return Math.PI * Math.pow(annotation.radius, 2);
    } else if (annotation.type === 'rectangle') {
      return annotation.width * annotation.height;
    } else if (annotation.type === 'ellipse') {
      return Math.PI * (annotation.width / 2) * (annotation.height / 2);
    }
    return 0;
  };

  return (
    <div className={`bg-gray-800 border-l border-gray-700 flex flex-col ${isCollapsed ? 'w-12' : 'w-64'}`}>
      <div className="p-2 border-b border-gray-700 flex justify-between items-center">
        <h4 className={`text-white font-medium ${isCollapsed ? 'hidden' : 'block'}`}>Annotations</h4>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-full hover:bg-gray-700 text-gray-300"
        >
          {isCollapsed ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {annotations.length === 0 ? (
          <div className={`text-gray-400 text-sm p-2 ${isCollapsed ? 'hidden' : 'block'}`}>
            No annotations created yet.
          </div>
        ) : (
          <div className="space-y-2">
            {annotations.map((annotation, index) => (
              <div 
                key={annotation.id}
                className={`p-2 ${activeAnnotation === annotation.id ? 'bg-gray-700' : 'hover:bg-gray-700'} rounded-md mx-1 cursor-pointer`}
                onClick={() => onAnnotationSelect(annotation.id)}
              >
                {isCollapsed ? (
                  <div className="flex justify-center">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: annotation.color }}
                    >
                      {typeIcons[annotation.type]}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: annotation.color }}
                        >
                          {typeIcons[annotation.type]}
                        </div>
                        <span className="ml-2 text-gray-300">Annotation {index + 1}</span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAnnotationLockToggle(annotation.id);
                          }}
                          className="p-1 rounded-full hover:bg-gray-600 text-gray-300"
                          title={annotation.locked ? "Unlock" : "Lock"}
                        >
                          {annotation.locked ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Unlock className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(annotation);
                          }}
                          className="p-1 rounded-full hover:bg-gray-600 text-gray-300"
                          title="Edit Description"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAnnotationDelete(annotation.id);
                          }}
                          className="p-1 rounded-full hover:bg-gray-600 text-gray-300"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {/* Show area/length for certain annotation types */}
                    {['circle', 'rectangle', 'ellipse'].includes(annotation.type) && (
                      <div className="mt-1 text-xs text-gray-400">
                        Area: {calculateArea(annotation).toFixed(0)} mm²
                      </div>
                    )}
                    {/* Display annotation description */}
                    {editingDescription === annotation.id ? (
                      <div className="mt-2">
                        <textarea
                          value={descriptionText}
                          onChange={(e) => setDescriptionText(e.target.value)}
                          className="w-full p-1 text-sm rounded bg-gray-900 text-white border border-gray-600"
                          rows={3}
                          placeholder="Enter description..."
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex space-x-2 mt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveDescription();
                            }}
                            className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEditing();
                            }}
                            className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : annotation.description ? (
                      <div className="mt-1 text-xs text-gray-300 border-l-2 pl-2 border-gray-600">
                        {annotation.description}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnotationList;