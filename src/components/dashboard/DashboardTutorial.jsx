// src/components/dashboard/DashboardTutorial.jsx

import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useAuth } from '../AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function DashboardTutorial({ runTutorial, onComplete }) {
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
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Welcome to DevPath! 🎓</h2>
          <p className="text-gray-700 leading-relaxed">
            Let's take a quick tour to help you get started with your career discovery journey.
            This will only take a minute!
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.quick-stats-section',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2 text-gray-900">Your Progress at a Glance 📊</h3>
          <p className="text-gray-700 leading-relaxed">
            These cards show your overall progress: completed assessments, average scores,
            and your study streak. Keep that streak going! 🔥
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '.career-path-card',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2 text-gray-900">Your Career Path 🎯</h3>
          <p className="text-gray-700 leading-relaxed">
            After completing assessments, you'll receive AI-powered career recommendations here.
            This shows your best career match and how to get there!
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '.action-cards-section',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2 text-gray-900">Quick Actions ⚡</h3>
          <p className="text-gray-700 leading-relaxed">
            Start here! Take assessments to discover your strengths, explore career matches,
            or track your progress. Everything you need is just a click away.
          </p>
        </div>
      ),
      placement: 'left',
      disableBeacon: true,
    },
    {
      target: '.nav-menu-icon',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2 text-gray-900">Navigation Menu 🧭</h3>
          <p className="text-gray-700 leading-relaxed">
            Access all features from here: your profile, settings, reports, and more.
            You can also switch between light and dark themes!
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3 text-gray-900">You're All Set! 🚀</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Ready to discover your ideal career path? Start by taking some assessments!
          </p>
          <p className="text-sm text-gray-500">
            You can always replay this tutorial from Settings → Show Tutorial
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
            'tutorialCompleted.dashboard': true,
            'tutorialCompletedAt': new Date()
          });
          console.log('✅ Tutorial completion saved to Firestore');
        } catch (error) {
          console.error('❌ Error saving tutorial completion:', error);
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
