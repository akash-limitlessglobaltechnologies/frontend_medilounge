import React from 'react';

const ReviewInfo = ({ formData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        {/* Personal Information */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Full Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.fullName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.dateOfBirth}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.gender}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.contactNumber}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.address}</dd>
            </div>
          </dl>
        </div>

        {/* Professional Information */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Specialization</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.specialization}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">License Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.licenseNumber}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Years of Experience</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.experience} years</dd>
            </div>
          </dl>

          {formData.qualifications?.length > 0 && (
            <div className="mt-4">
              <dt className="text-sm font-medium text-gray-500 mb-2">Qualifications</dt>
              <dd className="mt-1 space-y-2">
                {formData.qualifications.map((qual, index) => (
                  <div key={index} className="text-sm text-gray-900 bg-white p-2 rounded">
                    {qual.degree} from {qual.institution} ({qual.year})
                  </div>
                ))}
              </dd>
            </div>
          )}
        </div>

        {/* Expertise & Skills */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Expertise & Skills</h3>
          {formData.expertise?.length > 0 && (
            <div className="mb-4">
              <dt className="text-sm font-medium text-gray-500 mb-2">Areas of Expertise</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {formData.expertise.map((exp, index) => (
                  <span key={index} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
                    {exp.title}
                  </span>
                ))}
              </dd>
            </div>
          )}

          {formData.languages?.length > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-2">Languages</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {formData.languages.map((lang, index) => (
                  <span key={index} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
                    {lang}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </div>

        {/* Pricing & Availability */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Availability</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Consultation Fee</dt>
              <dd className="mt-1 text-sm text-gray-900">${formData.consultationFee}</dd>
            </div>

            {formData.availableDays?.length > 0 && (
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-2">Available Days</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {formData.availableDays.map((day, index) => (
                    <span key={index} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
                      {day}
                    </span>
                  ))}
                </dd>
              </div>
            )}

            {formData.timeSlots?.length > 0 && (
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-2">Time Slots</dt>
                <dd className="mt-1 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {formData.timeSlots.map((slot, index) => (
                    <span key={index} className="px-3 py-1 bg-white rounded text-sm text-gray-700">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Bio & Portfolio */}
        {(formData.professionalBio || formData.portfolioItems?.length > 0) && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Bio & Portfolio</h3>
            {formData.professionalBio && (
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500 mb-2">Professional Bio</dt>
                <dd className="mt-1 text-sm text-gray-900 bg-white p-4 rounded">
                  {formData.professionalBio}
                </dd>
              </div>
            )}

            {formData.portfolioItems?.length > 0 && (
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-2">Portfolio Items</dt>
                <dd className="mt-1 space-y-3">
                  {formData.portfolioItems.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-900 mt-2 inline-block"
                        >
                          View Link →
                        </a>
                      )}
                    </div>
                  ))}
                </dd>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewInfo;