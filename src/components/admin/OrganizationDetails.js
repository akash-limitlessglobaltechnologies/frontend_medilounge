import React from 'react';

const OrganizationDetails = ({ organization, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{organization.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Organization Information</h3>
            <div className="grid gap-2">
              <p><span className="font-medium">Email:</span> {organization.userId.email}</p>
              <p><span className="font-medium">Contact:</span> {organization.contactNumber}</p>
              <p><span className="font-medium">Employees:</span> {organization.numberOfEmployees}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Projects</h3>
            <div className="space-y-4">
              {organization.projects.map((project, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-lg mb-2">{project.name}</h4>
                  <p className="text-gray-600 mb-3">{project.description}</p>
                  {project.links && project.links.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">Project Links:</p>
                      <div className="space-y-1">
                        {project.links.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline block"
                          >
                            {link.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;
