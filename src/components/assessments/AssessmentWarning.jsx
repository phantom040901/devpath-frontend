import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const AssessmentWarning = ({ isOpen, onClose, onProceed }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleProceed = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideAssessmentWarning', 'true');
    }
    onProceed();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-black">
        {/* Header */}
        <div className="bg-yellow-500 p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Important Notice</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded p-1 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <p className="text-gray-700 text-lg leading-relaxed">
            Before taking any assessment, please read and understand these important rules:
          </p>

          {/* Rules List */}
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-500 bg-yellow-100 pl-4 py-3 rounded-r">
              <h3 className="font-bold text-gray-900 mb-1">Time Limit</h3>
              <p className="text-gray-800">
                MCQ assessments have a 15-minute time limit. The timer cannot be paused once started.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 bg-orange-100 pl-4 py-3 rounded-r">
              <h3 className="font-bold text-gray-900 mb-1">Maximum Attempts</h3>
              <p className="text-gray-800">
                You can only take each assessment 2 times. Use your attempts wisely.
              </p>
            </div>

            <div className="border-l-4 border-red-500 bg-red-100 pl-4 py-3 rounded-r">
              <h3 className="font-bold text-gray-900 mb-1">Cannot Return to Dashboard</h3>
              <p className="text-gray-800">
                Going back to the dashboard or closing the assessment will count as 1 attempt.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 bg-blue-100 pl-4 py-3 rounded-r">
              <h3 className="font-bold text-gray-900 mb-1">Complete in One Session</h3>
              <p className="text-gray-800">
                Assessments must be completed in one sitting. Do not refresh or close your browser.
              </p>
            </div>
          </div>

          {/* Preparation Tips */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-3">Before You Start:</h3>
            <ul className="space-y-2 text-gray-800">
              <li>• Ensure stable internet connection</li>
              <li>• Find a quiet environment</li>
              <li>• Allocate enough time</li>
              <li>• Close unnecessary tabs</li>
              <li>• Read each question carefully</li>
            </ul>
          </div>

          {/* Note */}
          <p className="text-sm text-gray-600 italic">
            Note: Detailed instructions will be shown before each assessment starts.
          </p>

          {/* Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 text-yellow-600 rounded focus:ring-2 focus:ring-yellow-500"
            />
            <span className="text-gray-700">Don't show this warning again</span>
          </label>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 rounded-b-lg flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded font-medium transition"
          >
            Go Back
          </button>
          <button
            onClick={handleProceed}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-medium transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentWarning;
