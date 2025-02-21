import React from 'react';
import { Stethoscope, Award, Calendar } from 'lucide-react';

function DoctorList({ doctors, onDoctorClick }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <div
          key={doctor._id}
          onClick={() => onDoctorClick(doctor)}
          className="relative group cursor-pointer"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-xl transition-all duration-200 hover:shadow-2xl">
            <div className="flex flex-col items-center text-center mb-4">
              <div className="relative mb-4">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30"></div>
                <img
                  src={doctor.userId?.profilePhoto || '/default-avatar.png'}
                  alt={doctor.info.fullName}
                  className="relative w-20 h-20 rounded-full object-cover border-2 border-white"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.info.fullName}</h3>
              <div className="flex items-center text-indigo-600 space-x-1">
                <Stethoscope className="h-4 w-4" />
                <span className="text-sm">{doctor.info.specialization}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Award className="h-4 w-4 mr-1" />
                  <span>{doctor.info.experience} years exp.</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{doctor.info.qualifications?.length || 0} qualifications</span>
                </div>
              </div>

              <div className="text-center pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">Consultation Fee</p>
                <p className="text-lg font-semibold text-indigo-600">₹{doctor.info.consultationFee}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DoctorList;