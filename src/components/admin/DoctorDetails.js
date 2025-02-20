import React from 'react';

const DoctorDetails = ({ doctor, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{doctor.info.fullName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><span className="font-medium">Specialization:</span> {doctor.info.specialization}</p>
              <p><span className="font-medium">License Number:</span> {doctor.info.licenseNumber}</p>
              <p><span className="font-medium">Experience:</span> {doctor.info.experience} years</p>
              <p><span className="font-medium">Consultation Fee:</span> ${doctor.info.consultationFee}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Qualifications</h3>
            <div className="grid gap-3">
              {doctor.info.qualifications.map((qual, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <p className="font-medium">{qual.degree}</p>
                  <p className="text-gray-600">{qual.institution} ({qual.year})</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
            <div className="grid gap-2">
              <p><span className="font-medium">Email:</span> {doctor.userId.email}</p>
              <p><span className="font-medium">Phone:</span> {doctor.info.contactNumber}</p>
              <p><span className="font-medium">Address:</span> {doctor.info.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;