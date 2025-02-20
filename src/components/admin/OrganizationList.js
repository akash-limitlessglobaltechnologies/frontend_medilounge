import React from 'react';

const OrganizationList = ({ organizations, onOrganizationClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {organizations.map((org) => (
        <div
          key={org._id}
          onClick={() => onOrganizationClick(org)}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <img
              src={org.userId?.profilePhoto || '/default-avatar.png'}
              alt={org.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
              <p className="text-gray-600">{org.numberOfEmployees} employees</p>
              <p className="text-sm text-gray-500">Projects: {org.projects?.length || 0}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrganizationList;