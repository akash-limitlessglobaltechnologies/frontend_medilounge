import React from 'react';

function DoctorDashboard({ doctorData }) {
  if (!doctorData || !doctorData.info) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <p className="text-gray-600">No profile data available.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Welcome, Dr. {doctorData.info.fullName}
        </h2>
        <p className="text-gray-600 mt-2">{doctorData.info.specialization} • {doctorData.info.experience} years of experience</p>
      </div>

      {/* Professional Details */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Bio</h3>
        <p className="text-gray-600">{doctorData.info.professionalBio}</p>
      </div>

      {/* Qualifications */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Qualifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctorData.info.qualifications && doctorData.info.qualifications.map((qual, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900">{qual.degree}</h4>
              <p className="text-gray-600">{qual.institution}</p>
              <p className="text-sm text-gray-500">{qual.year}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Expertise */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Areas of Expertise</h3>
        <div className="flex flex-wrap gap-2">
          {doctorData.info.expertise && doctorData.info.expertise.map((exp, index) => (
            <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
              {exp.title}
            </span>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {doctorData.info.availableDays && doctorData.info.availableDays.map((day, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900">{day}</h4>
              <div className="mt-2 space-y-1">
                {doctorData.info.timeSlots && doctorData.info.timeSlots.map((slot, slotIndex) => (
                  <p key={slotIndex} className="text-sm text-gray-600">
                    {slot.startTime} - {slot.endTime}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;