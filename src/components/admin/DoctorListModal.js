import React, { useState, useEffect } from 'react';
import { Search, X, Plus } from 'lucide-react';

const DoctorListModal = ({ isOpen, onClose, onDoctorSelect, loading }) => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDoctors();
    }
  }, [isOpen, searchTerm]);

  const fetchDoctors = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem('token');
      const searchQuery = searchTerm ? `?search=${searchTerm}` : '';
      const response = await fetch(
        `${process.env.REACT_APP_URI}/api/admin/doctors${searchQuery}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }

      const data = await response.json();
      setDoctors(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to fetch doctors');
    } finally {
      setFetchLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Select Doctor</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search doctors..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {fetchLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : doctors.length > 0 ? (
              doctors.map(doctor => (
                <div
                  key={doctor._id}
                  className="flex items-center justify-between p-3 border rounded-lg mb-2 hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium">{doctor.info.fullName}</div>
                    <div className="text-sm text-gray-500">{doctor.info.specialization}</div>
                  </div>
                  <button
                    onClick={() => onDoctorSelect(doctor)}
                    disabled={loading}
                    className="flex items-center px-3 py-1 text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">No doctors found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorListModal;