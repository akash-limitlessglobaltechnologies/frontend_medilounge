import React from 'react';
import { Link, ExternalLink, Square, CheckSquare } from 'lucide-react';
import StatusBadge from './StatusBadge';

const LinkItem = ({ link, isSelected, onSelect, canSelect }) => {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {canSelect && (
            <button
              onClick={() => onSelect(link._id)}
              className="text-gray-400 hover:text-gray-600"
            >
              {isSelected ? 
                <CheckSquare className="h-5 w-5 text-blue-600" /> : 
                <Square className="h-5 w-5" />
              }
            </button>
          )}
          <div>
            <h3 className="font-medium text-gray-900">{link.title}</h3>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center mt-1"
            >
              <Link className="h-4 w-4 mr-1" />
              Visit Link
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>

        {link.assignedDoctor && (
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Assigned to: {link.assignedDoctor.doctorEmail}
            </div>
            <StatusBadge status={link.assignedDoctor.status} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkItem;