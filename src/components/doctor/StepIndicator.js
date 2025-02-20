import React from 'react';
import { User, Briefcase, Star, DollarSign, FileText } from 'lucide-react';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { icon: <User className="w-5 h-5" />, label: "Personal Information" },
    { icon: <Briefcase className="w-5 h-5" />, label: "Professional Information" },
    { icon: <Star className="w-5 h-5" />, label: "Expertise & Skills" },
    { icon: <DollarSign className="w-5 h-5" />, label: "Pricing & Availability" },
    { icon: <FileText className="w-5 h-5" />, label: "Bio & Portfolio" }
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-center items-center mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div
                className={`h-1 w-16 ${
                  index <= currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              />
            )}
            <div
              className={`w-12 h-12 rounded-full ${
                index === currentStep
                  ? 'bg-indigo-600 text-white'
                  : index < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              } flex items-center justify-center mx-2`}
            >
              {step.icon}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between px-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`text-xs ${
              index === currentStep
                ? 'text-indigo-600 font-medium'
                : index < currentStep
                ? 'text-green-500'
                : 'text-gray-400'
            } text-center w-24`}
          >
            {step.label}
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-gray-600 mt-4">
        Step {currentStep + 1} of {steps.length}
      </div>
    </div>
  );
};

export default StepIndicator;