// src/components/dashboard/ReportsTutorial.jsx

import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useAuth } from '../AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function ReportsTutorial({ runTutorial, onComplete }) {
  const { user } = useAuth();
  const [run, setRun] = useState(false);

  useEffect(() => {
    setRun(runTutorial);
  }, [runTutorial]);

  const steps = [
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Welcome to Career Reports! 📊</h2>
          <p className="text-gray-700 leading-relaxed">
            Let's explore your personalized career analysis report. This guide will help you
            understand all the insights and recommendations we've generated for you!
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.student-info-section',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2 text-gray-900">Your Profile Summary 👤</h3>
          <p className="text-gray-700 leading-relaxed">
            This shows your basic information and current academic standing. It gives context
            to your career recommendations based on your background and performance.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '.career-readiness-cards',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2 text-gray-900">Career Readiness Overview 🎯</h3>
          <p className="text-gray-700 leading-relaxed">
            These cards show your readiness level for different career paths. Check your
            overall match score, confidence level, and preparedness indicators.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '.career-matches-section',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2 text-gray-900">Top Career Matches 🌟</h3>
          <p className="text-gray-700 leading-relaxed">
            Your top 3 career recommendations based on AI analysis. Click on each card to expand
            and see detailed insights, skill gaps, strengths, and personalized recommendations!
          </p>
        </div>
      ),
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '.skills-charts-section',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2 text-gray-900">Skills Analysis 📈</h3>
          <p className="text-gray-700 leading-relaxed">
            Visual charts showing your technical and personal skills assessment. The radar chart
            displays your skill distribution across different areas relevant to your career path.
          </p>
        </div>
      ),
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '.download-report-btn',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2 text-gray-900">Download Your Report 💾</h3>
          <p className="text-gray-700 leading-relaxed">
            Save your complete career analysis report as a PDF. Perfect for sharing with
            advisors, keeping for your records, or tracking your progress over time!
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3 text-gray-900">You're All Set! 🚀</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Now you know how to read and understand your career analysis report.
            Review your matches and start planning your career journey!
          </p>
          <p className="text-sm text-gray-500">
            You can replay this tutorial anytime from Settings → Show Tutorial
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = async (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);

      // Save tutorial completion status to Firestore
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            'tutorialCompleted.reports': true,
            'tutorialReportsCompletedAt': new Date()
          });
          console.log('✅ Reports tutorial completion saved to Firestore');
        } catch (error) {
          console.error('❌ Error saving reports tutorial completion:', error);
        }
      }

      // Call onComplete callback
      if (onComplete) {
        onComplete();
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#3b82f6', // Primary blue color
          textColor: '#1f2937', // Dark gray text
          backgroundColor: '#ffffff',
          arrowColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: '12px',
          padding: '20px',
          fontSize: '15px',
        },
        buttonNext: {
          backgroundColor: '#3b82f6',
          borderRadius: '8px',
          padding: '10px 20px',
          fontSize: '14px',
          fontWeight: '600',
        },
        buttonBack: {
          color: '#6b7280',
          marginRight: '10px',
          fontSize: '14px',
        },
        buttonSkip: {
          color: '#9ca3af',
          fontSize: '14px',
        },
        buttonClose: {
          display: 'none', // Hide close button to encourage using Skip or completing
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
}
