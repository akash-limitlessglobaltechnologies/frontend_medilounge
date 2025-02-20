import React from 'react';

const DoctorList = ({ doctors, onDoctorClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {doctors.map((doctor) => (
        <div
          key={doctor._id}
          onClick={() => onDoctorClick(doctor)}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <img
              src={doctor.userId?.profilePhoto || '/default-avatar.png'}
              alt={doctor.info.fullName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{doctor.info.fullName}</h3>
              <p className="text-gray-600">{doctor.info.specialization}</p>
              <p className="text-sm text-gray-500">{doctor.info.experience} years experience</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorList;