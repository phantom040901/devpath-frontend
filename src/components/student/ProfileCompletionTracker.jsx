// src/components/student/ProfileCompletionTracker.jsx
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfileCompletionTracker({ userData }) {
  // Calculate completion percentage based on personal information fields
  const calculateCompletion = () => {
    const fields = {
      firstName: { weight: 15, completed: false, label: 'First Name' },
      lastName: { weight: 15, completed: false, label: 'Last Name' },
      email: { weight: 10, completed: false, label: 'Email Address' },
      course: { weight: 15, completed: false, label: 'Course/Program' },
      yearLevel: { weight: 15, completed: false, label: 'Year Level' },
      enrollmentStatus: { weight: 15, completed: false, label: 'Enrollment Status' },
      phoneNumber: { weight: 10, completed: false, label: 'Phone Number' },
      dateOfBirth: { weight: 5, completed: false, label: 'Date of Birth' },
    };

    // Check each field
    if (userData?.firstName && userData.firstName.trim()) {
      fields.firstName.completed = true;
    }
    if (userData?.lastName && userData.lastName.trim()) {
      fields.lastName.completed = true;
    }
    if (userData?.email && userData.email.trim()) {
      fields.email.completed = true;
    }
    if (userData?.course && userData.course.trim()) {
      fields.course.completed = true;
    }
    if (userData?.yearLevel && userData.yearLevel.trim()) {
      fields.yearLevel.completed = true;
    }
    if (userData?.enrollmentStatus) {
      fields.enrollmentStatus.completed = true;
    }
    if (userData?.phoneNumber && userData.phoneNumber.trim()) {
      fields.phoneNumber.completed = true;
    }
    if (userData?.dateOfBirth && userData.dateOfBirth.trim()) {
      fields.dateOfBirth.completed = true;
    }

    // Calculate total percentage
    let totalPercentage = 0;
    let completedCount = 0;
    Object.values(fields).forEach(field => {
      if (field.completed) {
        totalPercentage += field.weight;
        completedCount++;
      }
    });

    return { fields, totalPercentage, completedCount, totalFields: Object.keys(fields).length };
  };

  const { fields, totalPercentage, completedCount, totalFields } = calculateCompletion();

  const getCompletionColor = (percentage) => {
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Profile Completion</h3>
          <p className="text-xs text-gray-400 mt-1">
            {completedCount} of {totalFields} fields completed
          </p>
        </div>
        <span className={`text-2xl font-bold ${getCompletionColor(totalPercentage)}`}>
          {totalPercentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${totalPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${getProgressBarColor(totalPercentage)}`}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {totalPercentage === 100
            ? '🎉 Your profile information is complete!'
            : 'Complete your personal information to increase visibility to employers'}
        </p>
      </div>

      {/* Field Checklist - Show only incomplete fields */}
      <div className="space-y-2">
        {Object.entries(fields).map(([key, field]) => {
          // Only show incomplete fields, or show all if less than 4 are complete
          if (field.completed && completedCount > 3) return null;

          return (
            <div
              key={key}
              className="flex items-center gap-3 p-2 rounded-lg bg-gray-900/50"
            >
              {field.completed ? (
                <CheckCircle className="text-green-400 flex-shrink-0" size={18} />
              ) : (
                <Circle className="text-gray-500 flex-shrink-0" size={18} />
              )}
              <p className={`text-sm ${field.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                {field.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {totalPercentage < 100 && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-2">
          <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-blue-400">
            Go to Settings to complete your personal information. A complete profile helps employers find you!
          </p>
        </div>
      )}
    </div>
  );
}
