import React, { useState } from 'react';
import { Building2, Users, Folder } from 'lucide-react';
import ProjectSlideOver from './ProjectSlideOver';

function OrganizationList({ organizations, onOrganizationClick }) {
  const [selectedOrgForProjects, setSelectedOrgForProjects] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <div
            key={org._id}
            className="relative group cursor-pointer"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-xl transition-all duration-200 hover:shadow-2xl">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="relative mb-4">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30"></div>
                  <img
                    src={org.userId?.profilePhoto || '/default-organization.png'}
                    alt={org.name}
                    className="relative w-20 h-20 rounded-full object-cover border-2 border-white"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{org.name}</h3>
                <div className="flex items-center text-indigo-600 space-x-1">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">Healthcare Organization</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{org.numberOfEmployees} employees</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrgForProjects(org);
                    }}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <Folder className="h-4 w-4 mr-1" />
                    <span>{org.projects?.length || 0} projects</span>
                  </button>
                </div>

                <div className="text-center pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="text-lg font-semibold text-indigo-600">{org.contactNumber}</p>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => onOrganizationClick(org)}
                  className="w-full mt-4 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects Slide Over */}
      <ProjectSlideOver
        isOpen={!!selectedOrgForProjects}
        onClose={() => setSelectedOrgForProjects(null)}
        organization={selectedOrgForProjects || {}}
      />
    </>
  );
}

export default OrganizationList;