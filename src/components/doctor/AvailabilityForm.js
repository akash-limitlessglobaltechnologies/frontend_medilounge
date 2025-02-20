import React, { useState } from 'react';

const AvailabilityForm = ({ formData, onChange, errors = {} }) => {
  const [newTimeSlot, setNewTimeSlot] = useState({ startTime: '', endTime: '' });
  
  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const handleTimeSlotAdd = () => {
    if (newTimeSlot.startTime && newTimeSlot.endTime) {
      onChange('timeSlots', [...(formData.timeSlots || []), newTimeSlot]);
      setNewTimeSlot({ startTime: '', endTime: '' });
    }
  };

  const handleTimeSlotRemove = (index) => {
    const newTimeSlots = formData.timeSlots.filter((_, i) => i !== index);
    onChange('timeSlots', newTimeSlots);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            name="consultationFee"
            value={formData.consultationFee}
            onChange={(e) => onChange('consultationFee', e.target.value)}
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            placeholder="0.00"
            min="0"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">USD</span>
          </div>
        </div>
        {errors.consultationFee && (
          <p className="mt-1 text-sm text-red-500">{errors.consultationFee}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
        <div className="grid grid-cols-4 gap-2">
          {daysOfWeek.map(day => (
            <div
              key={day}
              onClick={() => {
                const newDays = formData.availableDays?.includes(day)
                  ? formData.availableDays.filter(d => d !== day)
                  : [...(formData.availableDays || []), day];
                onChange('availableDays', newDays);
              }}
              className={`px-4 py-2 rounded-md cursor-pointer text-center ${
                formData.availableDays?.includes(day)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        {errors.availableDays && (
          <p className="mt-1 text-sm text-red-500">{errors.availableDays}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Time Slots</label>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="time"
            value={newTimeSlot.startTime}
            onChange={(e) => setNewTimeSlot(prev => ({ ...prev, startTime: e.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2"
          />
          <input
            type="time"
            value={newTimeSlot.endTime}
            onChange={(e) => setNewTimeSlot(prev => ({ ...prev, endTime: e.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <button
          type="button"
          onClick={handleTimeSlotAdd}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 mb-4"
        >
          Add Time Slot
        </button>
        <div className="space-y-2">
          {formData.timeSlots?.map((slot, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
              <span>{`${slot.startTime} - ${slot.endTime}`}</span>
              <button
                type="button"
                onClick={() => handleTimeSlotRemove(index)}
                className="text-red-600 hover:text-red-900"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {errors.timeSlots && (
          <p className="mt-1 text-sm text-red-500">{errors.timeSlots}</p>
        )}
      </div>
    </div>
  );
};

export default AvailabilityForm;