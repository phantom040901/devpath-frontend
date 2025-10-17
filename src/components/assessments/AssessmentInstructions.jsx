import React, { useState } from 'react';
import { X, AlertCircle, Clock, BookOpen } from 'lucide-react';

const AssessmentInstructions = ({ isOpen, onClose, onStart, assessmentType = 'MCQ' }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleStart = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideAssessmentInstructions', 'true');
    }
    onStart();
  };

  const isMCQ = assessmentType === 'MCQ';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-black">
        {/* Header */}
        <div className="bg-blue-600 p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Assessment Instructions</h2>
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
          {/* Critical Warning */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-800 mb-1">Important: Cannot Return to Dashboard</h3>
                <p className="text-red-700">
                  Going back to the dashboard or closing the assessment will count as 1 attempt. Complete the assessment in one session.
                </p>
              </div>
            </div>
          </div>

          {/* Assessment Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-100 border-l-4 border-blue-600 rounded-r p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <p className="font-semibold text-gray-900">Duration</p>
              </div>
              <p className="text-gray-800">{isMCQ ? '15 minutes' : 'No time limit'}</p>
            </div>

            <div className="bg-purple-100 border-l-4 border-purple-600 rounded-r p-4">
              <p className="font-semibold text-gray-900 mb-2">Maximum Attempts</p>
              <p className="text-gray-800">2 Times</p>
            </div>
          </div>

          {/* Rules */}
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-4">Assessment Rules</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-red-100 p-3 rounded-lg border-l-4 border-red-600">
                <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <p className="text-gray-900 pt-0.5">
                  <span className="font-semibold">Cannot Return to Dashboard:</span> Going back to the dashboard or closing the assessment will count as 1 attempt.
                </p>
              </div>

              <div className="flex items-start gap-3 bg-orange-100 p-3 rounded-lg border-l-4 border-orange-600">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <p className="text-gray-900 pt-0.5">
                  <span className="font-semibold">{isMCQ ? 'Time Limit:' : 'Take Your Time:'}</span> {isMCQ ? 'You have 15 minutes to complete the assessment. The timer will count down automatically.' : 'This is a survey with no time limit. Answer thoughtfully.'}
                </p>
              </div>

              <div className="flex items-start gap-3 bg-yellow-100 p-3 rounded-lg border-l-4 border-yellow-600">
                <span className="flex-shrink-0 w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <p className="text-gray-900 pt-0.5">
                  <span className="font-semibold">Answer All Questions:</span> Make sure to answer each question before proceeding to the next one.
                </p>
              </div>

              <div className="flex items-start gap-3 bg-green-100 p-3 rounded-lg border-l-4 border-green-600">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <p className="text-gray-900 pt-0.5">
                  <span className="font-semibold">Attempt Limit:</span> You can take this assessment a maximum of 2 times. Use your attempts wisely.
                </p>
              </div>

              <div className="flex items-start gap-3 bg-blue-100 p-3 rounded-lg border-l-4 border-blue-600">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                <p className="text-gray-900 pt-0.5">
                  <span className="font-semibold">Don't Refresh or Close:</span> Closing the browser or refreshing the page may count as an attempt.
                </p>
              </div>

              <div className="flex items-start gap-3 bg-indigo-100 p-3 rounded-lg border-l-4 border-indigo-600">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
                <p className="text-gray-900 pt-0.5">
                  <span className="font-semibold">Complete in One Session:</span> Once started, complete the assessment in one sitting. You cannot pause and resume later.
                </p>
              </div>

              {isMCQ && (
                <div className="flex items-start gap-3 bg-purple-100 p-3 rounded-lg border-l-4 border-purple-600">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">7</span>
                  <p className="text-gray-900 pt-0.5">
                    <span className="font-semibold">Auto-Submit:</span> The assessment will automatically submit when time expires.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-teal-100 border-l-4 border-teal-600 rounded-r p-4">
            <h3 className="font-bold text-teal-900 mb-2">Quick Tips for Success</h3>
            <ul className="space-y-1 text-sm text-teal-900">
              <li>• Find a quiet place with stable internet connection</li>
              <li>• Read each question carefully before answering</li>
              {isMCQ && <li>• Keep track of your time - pace yourself accordingly</li>}
              <li>• Review your answer before clicking "Next"</li>
              <li>• Stay calm and focused throughout the assessment</li>
            </ul>
          </div>

          {/* Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700">Don't show these instructions again</span>
          </label>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 rounded-b-lg flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
          >
            Start Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentInstructions;
