import React, { useState } from 'react';
import { 
  Circle as CircleIcon, Square, MousePointer,
  ChevronLeft, ChevronRight, AlignCenter, Target
} from 'lucide-react';

const AnnotationToolbar = ({ onSelectTool, currentTool, color, onColorChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const tools = [
    { id: 'bidirectional', name: 'Bidirectional', icon: <AlignCenter className="w-5 h-5" /> },
    { id: 'ellipse', name: 'Ellipse', icon: <Target className="w-5 h-5" /> },
    { id: 'rectangle', name: 'Rectangle', icon: <Square className="w-5 h-5" /> },
    { id: 'circle', name: 'Circle', icon: <CircleIcon className="w-5 h-5" /> },
  ];
  
  const predefinedColors = [
    '#00ff00', // Green
    '#ff0000', // Red
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#ffffff', // White
    '#ffa500', // Orange
  ];

  return (
    <div className={`bg-gray-800 border-r border-gray-700 flex flex-col ${isCollapsed ? 'w-12' : 'w-48'}`}>
      <div className="p-2 border-b border-gray-700 flex justify-between items-center">
        <h4 className={`text-white font-medium ${isCollapsed ? 'hidden' : 'block'}`}>Tools</h4>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-full hover:bg-gray-700 text-gray-300"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        <div className="space-y-1">
          {/* Pointer/Move Tool */}
          <button
            onClick={() => onSelectTool(null)}
            className={`w-full flex items-center p-2 ${currentTool === null ? 'bg-indigo-600' : 'hover:bg-gray-700'} rounded-md mx-1 ${isCollapsed ? 'justify-center' : ''}`}
            title="Select/Move"
          >
            <MousePointer className="w-5 h-5 text-gray-300" />
            {!isCollapsed && <span className="ml-2 text-gray-300">Select/Move</span>}
          </button>
          
          {/* Annotation Tools */}
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`w-full flex items-center p-2 ${currentTool === tool.id ? 'bg-indigo-600' : 'hover:bg-gray-700'} rounded-md mx-1 ${isCollapsed ? 'justify-center' : ''}`}
              title={tool.name}
            >
              <span className="text-gray-300">{tool.icon}</span>
              {!isCollapsed && <span className="ml-2 text-gray-300">{tool.name}</span>}
            </button>
          ))}
        </div>
        
        {/* Color Selector */}
        {!isCollapsed && (
          <div className="mt-4 px-2">
            <h5 className="text-gray-400 text-sm mb-2">Annotation Color</h5>
            <div className="grid grid-cols-4 gap-2">
              {predefinedColors.map(colorOption => (
                <button
                  key={colorOption}
                  onClick={() => onColorChange(colorOption)}
                  className={`w-6 h-6 rounded-full border ${color === colorOption ? 'border-white border-2' : 'border-gray-600'}`}
                  style={{ backgroundColor: colorOption }}
                  title={colorOption}
                />
              ))}
            </div>
            
            {/* Custom color input */}
            <div className="mt-2 flex">
              <input
                type="color"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-6 h-6 cursor-pointer"
              />
              <span className="ml-2 text-gray-300 text-xs">Custom Color</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnotationToolbar;