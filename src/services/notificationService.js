// src/services/notificationService.js
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Create a notification for a user
 */
export async function createNotification(userId, notification) {
  try {
    const notificationsRef = collection(db, 'notifications');
    const notificationData = {
      userId,
      ...notification,
      read: false,
      createdAt: Timestamp.now()
    };
    
    await setDoc(doc(notificationsRef), notificationData);
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Get all notifications for a user
 */
export async function getUserNotifications(userId, limitCount = 50) {
  try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const notifications = [];
    
    snapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId) {
  try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId) {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true,
      readAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(userId) {
  try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    const updatePromises = [];
    
    snapshot.forEach((doc) => {
      updatePromises.push(
        updateDoc(doc.ref, {
          read: true,
          readAt: Timestamp.now()
        })
      );
    });
    
    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    console.error('Error marking all as read:', error);
    throw error;
  }
}

/**
 * Check user notification preferences
 */
async function checkNotificationPreference(userId, preferenceKey) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return true; // Default to enabled if no settings

    const userData = userDoc.data();
    const notificationPrefs = userData.settings?.notifications || {};

    // If preference not set, default to true
    return notificationPrefs[preferenceKey] !== false;
  } catch (error) {
    console.error('Error checking notification preference:', error);
    return true; // Default to enabled on error
  }
}

/**
 * Check and create assessment reminder notifications
 */
export async function checkAssessmentReminders(userId) {
  try {
    // Check user preference
    const isEnabled = await checkNotificationPreference(userId, 'assessmentReminders');
    if (!isEnabled) return false;

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return;

    const userData = userDoc.data();
    const assessmentResults = userData.assessmentResults || {};

    // Check if user has completed any assessments
    const completedAssessments = Object.keys(assessmentResults).length;

    if (completedAssessments === 0) {
      // Check if this notification already exists (within last 7 days)
      const notificationsRef = collection(db, 'notifications');
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Simplified query to avoid composite index requirement
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('type', '==', 'assessment_reminder')
      );

      const snapshot = await getDocs(q);

      // Filter and sort in memory to avoid index requirement
      const assessmentReminders = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(notif => notif.title === 'Start Your Journey')
        .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

      const lastNotification = assessmentReminders[0];

      // Only create if no notification sent in the last 7 days
      if (!lastNotification || lastNotification.createdAt.toDate() < sevenDaysAgo) {
        await createNotification(userId, {
          type: 'assessment_reminder',
          title: 'Start Your Journey',
          message: 'Take your first assessment to discover your career path and unlock personalized recommendations.',
          icon: '📚',
          link: '/assessments',
          priority: 'high'
        });
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking assessment reminders:', error);
    return false;
  }
}

/**
 * Check and create career match notification
 */
export async function checkCareerMatchNotification(userId) {
  try {
    // Check user preference
    const isEnabled = await checkNotificationPreference(userId, 'careerMatches');
    if (!isEnabled) return false;

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return;

    const userData = userDoc.data();
    const assessmentResults = userData.assessmentResults || {};
    const hasCareerMatch = userData.selectedCareerJobRole;

    // Count completed assessments
    const completedCount = Object.keys(assessmentResults).length;

    // If user has completed assessments but hasn't checked career matches
    if (completedCount >= 3 && hasCareerMatch) {
      // Check if notification already sent recently
      const notificationsRef = collection(db, 'notifications');

      // Simplified query to avoid composite index requirement
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('type', '==', 'career_match')
      );

      const snapshot = await getDocs(q);

      // Sort in memory to avoid index requirement
      const careerMatchNotifications = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

      const lastNotification = careerMatchNotifications[0];

      // Only send if no notification in last 24 hours
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      if (!lastNotification || lastNotification.createdAt.toDate() < oneDayAgo) {
        await createNotification(userId, {
          type: 'career_match',
          title: 'Your Career Matches Are Ready! 🎯',
          message: 'Discover careers that align with your strengths and skills. Check out your personalized career recommendations now.',
          icon: '🎯',
          link: '/career-matches',
          priority: 'high'
        });
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking career match notification:', error);
    return false;
  }
}

/**
 * Create daily study reminder
 */
export async function createStudyReminder(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) return;
    
    const userData = userDoc.data();
    const settings = userData.settings || {};
    const notificationPrefs = settings.notifications || {};
    
    // Check if study reminders are enabled
    if (notificationPrefs.studyReminders) {
      await createNotification(userId, {
        type: 'study_reminder',
        title: 'Time to Study! 📖',
        message: 'Keep your momentum going! Complete an assessment or review your learning materials today.',
        icon: '📖',
        link: '/dashboard',
        priority: 'medium'
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error creating study reminder:', error);
    return false;
  }
}

/**
 * Create progress update notification
 */
export async function createProgressUpdate(userId, progressData) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) return;
    
    const userData = userDoc.data();
    const settings = userData.settings || {};
    const notificationPrefs = settings.notifications || {};
    
    if (notificationPrefs.progressUpdates) {
      await createNotification(userId, {
        type: 'progress_update',
        title: 'Progress Update 📊',
        message: progressData.message || 'You\'ve made great progress! Keep up the excellent work.',
        icon: '📊',
        link: '/student/progress',
        priority: 'low'
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error creating progress update:', error);
    return false;
  }
}

/**
 * Delete a single notification
 */
export async function deleteNotification(notificationId) {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await deleteDoc(notificationRef);
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

/**
 * Initialize notifications for a new user
 */
export async function initializeUserNotifications(userId) {
  try {
    await checkAssessmentReminders(userId);
    return true;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return false;
  }
}

// ==================== MILESTONE ACHIEVEMENTS ====================

/**
 * Create milestone achievement notification
 */
export async function createMilestoneNotification(userId, milestone) {
  try {
    // Check user preference
    const isEnabled = await checkNotificationPreference(userId, 'milestones');
    if (!isEnabled) return false;

    const milestones = {
      first_assessment: {
        title: 'First Assessment Complete! 🎉',
        message: 'Congratulations on completing your first assessment! You\'re on your way to discovering your ideal career path.',
        icon: '🎉',
        link: '/student/progress'
      },
      five_assessments: {
        title: '5 Assessments Completed! ⭐',
        message: 'Amazing progress! You\'ve completed 5 assessments. Keep up the great work!',
        icon: '⭐',
        link: '/student/progress'
      },
      ten_assessments: {
        title: '10 Assessments Milestone! 🏆',
        message: 'Incredible achievement! You\'ve completed 10 assessments. You\'re becoming an expert!',
        icon: '🏆',
        link: '/student/progress'
      },
      streak_7: {
        title: '7-Day Streak! 🔥',
        message: 'You\'re on fire! 7 consecutive days of learning. Keep the momentum going!',
        icon: '🔥',
        link: '/dashboard'
      },
      streak_30: {
        title: '30-Day Streak! 🌟',
        message: 'Phenomenal dedication! 30 days of continuous learning. You\'re unstoppable!',
        icon: '🌟',
        link: '/dashboard'
      },
      perfect_score: {
        title: 'Perfect Score! 💯',
        message: 'Outstanding! You achieved a perfect score on your assessment. Excellence at its finest!',
        icon: '💯',
        link: '/student/progress'
      },
      skill_unlocked: {
        title: `New Skill Unlocked: ${milestone.skillName}! 🎓`,
        message: `Congratulations! You've unlocked a new skill: ${milestone.skillName}. Keep building your expertise!`,
        icon: '🎓',
        link: '/student/progress'
      },
      score_improvement: {
        title: 'Score Improved by 20%! 📈',
        message: 'Great job! Your assessment scores have improved by 20%. Your hard work is paying off!',
        icon: '📈',
        link: '/student/progress'
      }
    };

    const milestoneData = milestones[milestone.type] || milestone;

    await createNotification(userId, {
      type: 'milestone',
      title: milestoneData.title,
      message: milestoneData.message,
      icon: milestoneData.icon,
      link: milestoneData.link,
      priority: 'high'
    });

    return true;
  } catch (error) {
    console.error('Error creating milestone notification:', error);
    return false;
  }
}

/**
 * Check and create milestone notifications based on user progress
 */
export async function checkMilestones(userId) {
  try {
    const resultsRef = collection(db, 'users', userId, 'results');
    const resultsSnap = await getDocs(resultsRef);

    const completedAssessments = resultsSnap.size;

    // Check assessment count milestones
    if (completedAssessments === 1) {
      await createMilestoneNotification(userId, { type: 'first_assessment' });
    } else if (completedAssessments === 5) {
      await createMilestoneNotification(userId, { type: 'five_assessments' });
    } else if (completedAssessments === 10) {
      await createMilestoneNotification(userId, { type: 'ten_assessments' });
    }

    // Check for perfect scores
    resultsSnap.forEach((doc) => {
      const result = doc.data();
      if (result.score === 100) {
        createMilestoneNotification(userId, { type: 'perfect_score' });
      }
    });

    return true;
  } catch (error) {
    console.error('Error checking milestones:', error);
    return false;
  }
}

// ==================== LEARNING REMINDERS ====================

/**
 * Create inactivity reminder notification
 */
export async function createInactivityReminder(userId, daysSinceLastActivity) {
  try {
    // Check user preference
    const isEnabled = await checkNotificationPreference(userId, 'inactivityReminders');
    if (!isEnabled) return false;

    const messages = {
      3: {
        title: 'We Miss You! 👋',
        message: 'It\'s been 3 days since your last assessment. Come back and continue your learning journey!',
        icon: '👋'
      },
      7: {
        title: 'Don\'t Lose Your Progress! 📚',
        message: 'It\'s been a week! Your learning momentum is waiting. Jump back in and keep growing!',
        icon: '📚'
      },
      14: {
        title: 'Your Goals Are Waiting! 🎯',
        message: 'Two weeks away! Your career path progress is on hold. Let\'s get back on track!',
        icon: '🎯'
      },
      30: {
        title: 'Long Time No See! 🌟',
        message: 'We\'ve missed you for a month! Come back and rediscover your potential. Your future awaits!',
        icon: '🌟'
      }
    };

    const reminder = messages[daysSinceLastActivity] || messages[3];

    await createNotification(userId, {
      type: 'inactivity_reminder',
      title: reminder.title,
      message: reminder.message,
      icon: reminder.icon,
      link: '/dashboard',
      priority: 'medium'
    });

    return true;
  } catch (error) {
    console.error('Error creating inactivity reminder:', error);
    return false;
  }
}

/**
 * Create incomplete assessment reminder
 */
export async function createIncompleteAssessmentReminder(userId, assessmentName) {
  try {
    await createNotification(userId, {
      type: 'incomplete_assessment',
      title: 'Continue Where You Left Off 🎯',
      message: `You have an incomplete assessment: ${assessmentName}. Pick up where you left off!`,
      icon: '🎯',
      link: '/assessments',
      priority: 'medium'
    });

    return true;
  } catch (error) {
    console.error('Error creating incomplete assessment reminder:', error);
    return false;
  }
}

/**
 * Create weekly goal notification
 */
export async function createWeeklyGoalNotification(userId, goalsData) {
  try {
    await createNotification(userId, {
      type: 'weekly_goal',
      title: 'Weekly Goal Update ⏰',
      message: `You're ${goalsData.completed} out of ${goalsData.target} assessments this week. ${goalsData.remaining} more to go!`,
      icon: '⏰',
      link: '/assessments',
      priority: 'medium'
    });

    return true;
  } catch (error) {
    console.error('Error creating weekly goal notification:', error);
    return false;
  }
}

// ==================== CAREER & ROADMAP ====================

/**
 * Create new roadmap module notification
 */
export async function createNewModuleNotification(userId, moduleName) {
  try {
    // Check user preference
    const isEnabled = await checkNotificationPreference(userId, 'newModules');
    if (!isEnabled) return false;

    await createNotification(userId, {
      type: 'new_module',
      title: 'New Module Available! 🎯',
      message: `A new learning module is now available: ${moduleName}. Start learning now!`,
      icon: '🎯',
      link: '/career-roadmap',
      priority: 'high'
    });

    return true;
  } catch (error) {
    console.error('Error creating new module notification:', error);
    return false;
  }
}

/**
 * Create module completion notification
 */
export async function createModuleCompletionNotification(userId, moduleData) {
  try {
    await createNotification(userId, {
      type: 'module_completed',
      title: 'Module Completed! ✅',
      message: `Great job! You've completed ${moduleData.moduleName}. ${moduleData.completed} out of ${moduleData.total} modules done!`,
      icon: '✅',
      link: '/career-roadmap',
      priority: 'medium'
    });

    return true;
  } catch (error) {
    console.error('Error creating module completion notification:', error);
    return false;
  }
}

/**
 * Create career match update notification
 */
export async function createCareerMatchUpdateNotification(userId, matchScore) {
  try {
    await createNotification(userId, {
      type: 'career_match_update',
      title: 'Career Match Score Updated! 🌟',
      message: `Your career match score has increased to ${matchScore}%! Check your updated recommendations.`,
      icon: '🌟',
      link: '/career-matches',
      priority: 'high'
    });

    return true;
  } catch (error) {
    console.error('Error creating career match update notification:', error);
    return false;
  }
}

/**
 * Create resume update reminder
 */
export async function createResumeUpdateNotification(userId, newSkills) {
  try {
    await createNotification(userId, {
      type: 'resume_update',
      title: 'Update Your Resume! 📋',
      message: `You've gained ${newSkills.length} new skills! Update your resume to showcase your growth.`,
      icon: '📋',
      link: '/dashboard/resume',
      priority: 'medium'
    });

    return true;
  } catch (error) {
    console.error('Error creating resume update notification:', error);
    return false;
  }
}

// ==================== ENGAGEMENT & GAMIFICATION ====================

/**
 * Create leaderboard notification
 */
export async function createLeaderboardNotification(userId, rankData) {
  try {
    await createNotification(userId, {
      type: 'leaderboard',
      title: `You're Ranked #${rankData.rank}! 🏅`,
      message: `Amazing! You're in the top ${rankData.percentile}% of learners this week. Keep it up!`,
      icon: '🏅',
      link: '/student/progress',
      priority: 'low'
    });

    return true;
  } catch (error) {
    console.error('Error creating leaderboard notification:', error);
    return false;
  }
}

/**
 * Create badge earned notification
 */
export async function createBadgeNotification(userId, badgeData) {
  try {
    // Check user preference
    const isEnabled = await checkNotificationPreference(userId, 'badges');
    if (!isEnabled) return false;

    await createNotification(userId, {
      type: 'badge_earned',
      title: `New Badge Earned: ${badgeData.name}! 🎖️`,
      message: badgeData.description,
      icon: '🎖️',
      link: '/student/progress',
      priority: 'medium'
    });

    return true;
  } catch (error) {
    console.error('Error creating badge notification:', error);
    return false;
  }
}

/**
 * Create monthly progress summary
 */
export async function createMonthlyProgressNotification(userId, progressData) {
  try {
    await createNotification(userId, {
      type: 'monthly_summary',
      title: 'Monthly Progress Report! 🎊',
      message: `This month: ${progressData.assessments} assessments completed, ${progressData.hoursSpent} hours of learning. Keep growing!`,
      icon: '🎊',
      link: '/student/progress',
      priority: 'low'
    });

    return true;
  } catch (error) {
    console.error('Error creating monthly progress notification:', error);
    return false;
  }
}

// ==================== TIME-SENSITIVE ====================

/**
 * Create deadline reminder notification
 */
export async function createDeadlineNotification(userId, deadlineData) {
  try {
    const timeframes = {
      '24h': { title: 'Deadline Tomorrow! ⏳', priority: 'high' },
      '3d': { title: 'Deadline in 3 Days ⏰', priority: 'medium' },
      '7d': { title: 'Deadline in 1 Week 📅', priority: 'low' }
    };

    const notification = timeframes[deadlineData.timeframe] || timeframes['24h'];

    await createNotification(userId, {
      type: 'deadline',
      title: notification.title,
      message: `${deadlineData.name} is due in ${deadlineData.timeRemaining}. Don't miss out!`,
      icon: '⏳',
      link: deadlineData.link || '/assessments',
      priority: notification.priority
    });

    return true;
  } catch (error) {
    console.error('Error creating deadline notification:', error);
    return false;
  }
}

// ==================== RECOMMENDATIONS & TIPS ====================

/**
 * Create daily tip notification
 */
export async function createDailyTipNotification(userId, tip) {
  try {
    // Check user preference
    const isEnabled = await checkNotificationPreference(userId, 'dailyTips');
    if (!isEnabled) return false;

    await createNotification(userId, {
      type: 'daily_tip',
      title: 'Tip of the Day! 💡',
      message: tip,
      icon: '💡',
      link: '/dashboard',
      priority: 'low'
    });

    return true;
  } catch (error) {
    console.error('Error creating daily tip notification:', error);
    return false;
  }
}

/**
 * Create personalized recommendation notification
 */
export async function createRecommendationNotification(userId, recommendation) {
  try {
    await createNotification(userId, {
      type: 'recommendation',
      title: 'Personalized Recommendation 💡',
      message: `Based on your results, we recommend: ${recommendation.title}. This will help strengthen your ${recommendation.area} skills.`,
      icon: '💡',
      link: recommendation.link || '/assessments',
      priority: 'medium'
    });

    return true;
  } catch (error) {
    console.error('Error creating recommendation notification:', error);
    return false;
  }
}

/**
 * Create resource recommendation notification
 */
export async function createResourceNotification(userId, resource) {
  try {
    await createNotification(userId, {
      type: 'resource',
      title: `Recommended: ${resource.type} 📖`,
      message: resource.description,
      icon: resource.type === 'video' ? '🎥' : '📖',
      link: resource.link,
      priority: 'low'
    });

    return true;
  } catch (error) {
    console.error('Error creating resource notification:', error);
    return false;
  }
}

// ==================== SYSTEM & UPDATES ====================

/**
 * Create new feature notification
 */
export async function createNewFeatureNotification(userId, featureData) {
  try {
    // Check user preference
    const isEnabled = await checkNotificationPreference(userId, 'newFeatures');
    if (!isEnabled) return false;

    await createNotification(userId, {
      type: 'new_feature',
      title: `New Feature: ${featureData.name}! ✨`,
      message: featureData.description,
      icon: '✨',
      link: featureData.link || '/dashboard',
      priority: 'low'
    });

    return true;
  } catch (error) {
    console.error('Error creating new feature notification:', error);
    return false;
  }
}

/**
 * Create maintenance notification
 */
export async function createMaintenanceNotification(userId, maintenanceData) {
  try {
    await createNotification(userId, {
      type: 'maintenance',
      title: 'Scheduled Maintenance 🔧',
      message: `System maintenance scheduled for ${maintenanceData.date} at ${maintenanceData.time}. Expected duration: ${maintenanceData.duration}.`,
      icon: '🔧',
      link: null,
      priority: 'medium'
    });

    return true;
  } catch (error) {
    console.error('Error creating maintenance notification:', error);
    return false;
  }
}

/**
 * Create security alert notification
 */
export async function createSecurityAlertNotification(userId, alertData) {
  try {
    await createNotification(userId, {
      type: 'security',
      title: 'Security Alert 🔒',
      message: alertData.message,
      icon: '🔒',
      link: '/student/settings',
      priority: 'high'
    });

    return true;
  } catch (error) {
    console.error('Error creating security alert notification:', error);
    return false;
  }
}

// ==================== ANNOUNCEMENT NOTIFICATIONS ====================

/**
 * Create announcement notification for all students
 * @param {object} announcementData - { title, content, createdBy }
 * @returns {Promise<number>} - Number of notifications created
 */
export async function createAnnouncementNotifications(announcementData) {
  try {
    // Get all users from the users collection
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);

    let notificationCount = 0;
    const notificationPromises = [];

    // Create notification for each user
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;

      // Check if user has announcement notifications enabled
      const isEnabled = await checkNotificationPreference(userId, 'announcements');
      if (!isEnabled) continue;

      // Create notification promise
      const notificationPromise = createNotification(userId, {
        type: 'announcement',
        title: `📢 ${announcementData.title}`,
        message: announcementData.content.length > 100
          ? announcementData.content.substring(0, 100) + '...'
          : announcementData.content,
        icon: '📢',
        link: '/student/messaging',
        priority: 'high',
        announcementId: announcementData.id
      });

      notificationPromises.push(notificationPromise);
      notificationCount++;
    }

    // Execute all notifications in parallel for better performance
    await Promise.all(notificationPromises);

    console.log(`✅ Created ${notificationCount} announcement notifications`);
    return notificationCount;
  } catch (error) {
    console.error('❌ Error creating announcement notifications:', error);
    return 0;
  }
}