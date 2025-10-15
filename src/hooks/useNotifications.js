// src/hooks/useNotifications.js
import { useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import {
  checkAssessmentReminders,
  checkCareerMatchNotification,
  initializeUserNotifications,
  createMilestoneNotification,
  checkMilestones,
  createInactivityReminder,
  createIncompleteAssessmentReminder,
  createWeeklyGoalNotification,
  createNewModuleNotification,
  createModuleCompletionNotification,
  createCareerMatchUpdateNotification,
  createResumeUpdateNotification,
  createLeaderboardNotification,
  createBadgeNotification,
  createMonthlyProgressNotification,
  createDeadlineNotification,
  createDailyTipNotification,
  createRecommendationNotification,
  createResourceNotification,
  createNewFeatureNotification,
  createMaintenanceNotification,
  createSecurityAlertNotification
} from '../services/notificationService';

/**
 * Hook to automatically check and create notifications for a user
 */
export function useNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) return;

    // Initialize notifications on mount
    const initialize = async () => {
      try {
        await initializeUserNotifications(user.uid);
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initialize();

    // Check for assessment reminders periodically (every 6 hours)
    const assessmentReminderInterval = setInterval(async () => {
      try {
        await checkAssessmentReminders(user.uid);
      } catch (error) {
        console.error('Error checking assessment reminders:', error);
      }
    }, 6 * 60 * 60 * 1000); // 6 hours

    // Check for career match notifications (every 12 hours)
    const careerMatchInterval = setInterval(async () => {
      try {
        await checkCareerMatchNotification(user.uid);
      } catch (error) {
        console.error('Error checking career match notification:', error);
      }
    }, 12 * 60 * 60 * 1000); // 12 hours

    // Check immediately after mount (with delay)
    const initialCheckTimeout = setTimeout(async () => {
      try {
        await checkAssessmentReminders(user.uid);
        await checkCareerMatchNotification(user.uid);
      } catch (error) {
        console.error('Error during initial notification check:', error);
      }
    }, 5000); // 5 seconds after mount

    return () => {
      clearInterval(assessmentReminderInterval);
      clearInterval(careerMatchInterval);
      clearTimeout(initialCheckTimeout);
    };
  }, [user]);

  return null;
}

/**
 * Hook for manual notification creation
 * Returns notification functions that can be called imperatively
 */
export function useNotify() {
  const { user } = useAuth();

  return {
    // Milestone notifications
    milestone: async (milestoneType, data = {}) => {
      if (!user?.uid) return;
      await createMilestoneNotification(user.uid, { type: milestoneType, ...data });
    },

    checkMilestones: async () => {
      if (!user?.uid) return;
      await checkMilestones(user.uid);
    },

    // Learning reminders
    inactivityReminder: async (daysSinceLastActivity) => {
      if (!user?.uid) return;
      await createInactivityReminder(user.uid, daysSinceLastActivity);
    },

    incompleteAssessment: async (assessmentName) => {
      if (!user?.uid) return;
      await createIncompleteAssessmentReminder(user.uid, assessmentName);
    },

    weeklyGoal: async (goalsData) => {
      if (!user?.uid) return;
      await createWeeklyGoalNotification(user.uid, goalsData);
    },

    // Career & Roadmap
    newModule: async (moduleName) => {
      if (!user?.uid) return;
      await createNewModuleNotification(user.uid, moduleName);
    },

    moduleCompleted: async (moduleData) => {
      if (!user?.uid) return;
      await createModuleCompletionNotification(user.uid, moduleData);
    },

    careerMatchUpdate: async (matchScore) => {
      if (!user?.uid) return;
      await createCareerMatchUpdateNotification(user.uid, matchScore);
    },

    resumeUpdate: async (newSkills) => {
      if (!user?.uid) return;
      await createResumeUpdateNotification(user.uid, newSkills);
    },

    // Engagement & Gamification
    leaderboard: async (rankData) => {
      if (!user?.uid) return;
      await createLeaderboardNotification(user.uid, rankData);
    },

    badge: async (badgeData) => {
      if (!user?.uid) return;
      await createBadgeNotification(user.uid, badgeData);
    },

    monthlyProgress: async (progressData) => {
      if (!user?.uid) return;
      await createMonthlyProgressNotification(user.uid, progressData);
    },

    // Time-sensitive
    deadline: async (deadlineData) => {
      if (!user?.uid) return;
      await createDeadlineNotification(user.uid, deadlineData);
    },

    // Recommendations & Tips
    dailyTip: async (tip) => {
      if (!user?.uid) return;
      await createDailyTipNotification(user.uid, tip);
    },

    recommendation: async (recommendation) => {
      if (!user?.uid) return;
      await createRecommendationNotification(user.uid, recommendation);
    },

    resource: async (resource) => {
      if (!user?.uid) return;
      await createResourceNotification(user.uid, resource);
    },

    // System & Updates
    newFeature: async (featureData) => {
      if (!user?.uid) return;
      await createNewFeatureNotification(user.uid, featureData);
    },

    maintenance: async (maintenanceData) => {
      if (!user?.uid) return;
      await createMaintenanceNotification(user.uid, maintenanceData);
    },

    securityAlert: async (alertData) => {
      if (!user?.uid) return;
      await createSecurityAlertNotification(user.uid, alertData);
    }
  };
}

// Example daily tips for quick use
export const DAILY_TIPS = [
  "Break your study sessions into 25-minute intervals with 5-minute breaks for better retention.",
  "Review your assessment results to identify areas where you can improve.",
  "Set specific learning goals each week to stay motivated and track progress.",
  "Practice coding problems daily to build muscle memory and problem-solving skills.",
  "Join tech communities to learn from others and stay updated with industry trends.",
  "Build a portfolio of projects to showcase your skills to potential employers.",
  "Take notes while learning - writing helps reinforce your memory.",
  "Stay curious and ask questions - there are no stupid questions in learning!",
  "Celebrate small wins along your learning journey - progress is progress!",
  "Connect your learning to real-world applications to better understand concepts."
];

// Example learning recommendations
export const LEARNING_RECOMMENDATIONS = {
  programming: [
    { title: 'JavaScript Fundamentals', area: 'programming', link: '/assessments' },
    { title: 'Data Structures & Algorithms', area: 'programming', link: '/assessments' },
    { title: 'Object-Oriented Programming', area: 'programming', link: '/assessments' }
  ],
  web_development: [
    { title: 'HTML & CSS Mastery', area: 'web development', link: '/assessments' },
    { title: 'React.js Essentials', area: 'web development', link: '/assessments' },
    { title: 'Backend Development with Node.js', area: 'web development', link: '/assessments' }
  ],
  databases: [
    { title: 'SQL Fundamentals', area: 'database', link: '/assessments' },
    { title: 'Database Design Principles', area: 'database', link: '/assessments' },
    { title: 'NoSQL Databases', area: 'database', link: '/assessments' }
  ]
};