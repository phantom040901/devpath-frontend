// src/utils/assessmentCompletionHandler.js
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  createNotification, 
  checkCareerMatchNotification 
} from '../services/notificationService';

/**
 * Handle actions after an assessment is completed
 */
export async function handleAssessmentCompletion(userId, assessmentType) {
  try {
    // Get user data to check assessment completion status
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) return;
    
    const userData = userDoc.data();
    const assessmentResults = userData.assessmentResults || {};
    const completedCount = Object.keys(assessmentResults).length;

    // Create congratulations notification for first assessment
    if (completedCount === 1) {
      await createNotification(userId, {
        type: 'progress_update',
        title: 'Great Start! 🎉',
        message: 'You\'ve completed your first assessment! Keep going to unlock your personalized career recommendations.',
        icon: '🎉',
        link: '/assessments',
        priority: 'medium'
      });
    }

    // After 3 assessments, prompt to check career matches
    if (completedCount === 3) {
      await createNotification(userId, {
        type: 'career_recommendation',
        title: 'Career Matches Available! 🎯',
        message: 'You\'ve completed enough assessments! Check out your personalized career matches now.',
        icon: '🎯',
        link: '/career-matches',
        priority: 'high'
      });
    }

    // Milestone notifications
    if (completedCount === 5) {
      await createNotification(userId, {
        type: 'progress_update',
        title: 'Halfway There! 💪',
        message: 'You\'ve completed 5 assessments! Your career profile is getting more accurate with each one.',
        icon: '💪',
        link: '/student/progress',
        priority: 'low'
      });
    }

    if (completedCount === 10) {
      await createNotification(userId, {
        type: 'progress_update',
        title: 'Assessment Master! 🏆',
        message: 'Amazing! You\'ve completed 10 assessments. Your career roadmap is now highly personalized.',
        icon: '🏆',
        link: '/career-roadmap',
        priority: 'medium'
      });
    }

    // Check if career matches should be updated
    if (completedCount >= 3) {
      await checkCareerMatchNotification(userId);
    }

    return true;
  } catch (error) {
    console.error('Error handling assessment completion:', error);
    return false;
  }
}

/**
 * Create study reminder notification
 */
export async function scheduleStudyReminder(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) return;
    
    const userData = userDoc.data();
    const settings = userData.settings || {};
    const notifications = settings.notifications || {};

    // Only create reminder if user has enabled study reminders
    if (notifications.studyReminders) {
      await createNotification(userId, {
        type: 'study_reminder',
        title: 'Time to Learn! 📖',
        message: 'Ready to continue your learning journey? Complete an assessment or review your roadmap today.',
        icon: '📖',
        link: '/dashboard',
        priority: 'low'
      });
    }

    return true;
  } catch (error) {
    console.error('Error scheduling study reminder:', error);
    return false;
  }
}

/**
 * Create notification for career roadmap update
 */
export async function notifyCareerRoadmapReady(userId, careerRole) {
  try {
    await createNotification(userId, {
      type: 'career_recommendation',
      title: 'Your Career Roadmap is Ready! 🗺️',
      message: `Based on your assessments, we've created a personalized roadmap for ${careerRole}. Start your journey today!`,
      icon: '🗺️',
      link: '/career-roadmap',
      priority: 'high'
    });

    return true;
  } catch (error) {
    console.error('Error notifying roadmap ready:', error);
    return false;
  }
}

/**
 * Create notification when user completes all resources in a module
 */
export async function notifyModuleCompletion(userId, topicName, assessmentId) {
  try {
    console.log(`📢 Attempting to create module completion notification for user: ${userId}, topic: ${topicName}`);

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.log(`⚠️ User document not found for userId: ${userId}`);
      return;
    }

    const userData = userDoc.data();
    const settings = userData.settings || {};
    const notifications = settings.notifications || {};

    // Check if user has notification preferences set, default to true if not set
    const assessmentRemindersEnabled = notifications.assessmentReminders !== false;

    console.log(`🔔 Notification preferences - assessmentReminders: ${assessmentRemindersEnabled}`, notifications);

    // Only create notification if user has enabled assessment reminders (or not disabled them)
    if (assessmentRemindersEnabled) {
      // Format assessment name from ID
      const assessmentName = assessmentId
        .replace(/assessments_|technicalAssessments_|personalAssessments_/g, '')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Check if similar notification already exists (unread) in the last 24 hours
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('type', '==', 'progress_update'),
        where('read', '==', false)
      );

      const snapshot = await getDocs(q);

      // Check if there's already a notification for this specific module in last 24 hours
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const existingNotification = snapshot.docs.find(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate();
        return data.message &&
               data.message.includes(topicName) &&
               createdAt &&
               createdAt > oneDayAgo;
      });

      // Only create if no similar notification exists
      if (!existingNotification) {
        await createNotification(userId, {
          type: 'progress_update',
          title: 'Module Completed! 🎉',
          message: `Great job completing the ${topicName} module! You can now retake the ${assessmentName} assessment to improve your score.`,
          icon: '🎉',
          link: '/assessments',
          priority: 'high'
        });

        console.log(`✅ Module completion notification created for ${topicName}`);
      } else {
        console.log(`ℹ️ Skipping duplicate notification for ${topicName}`);
      }
    } else {
      console.log(`ℹ️ Assessment reminders disabled for user ${userId}`);
    }

    return true;
  } catch (error) {
    console.error('Error notifying module completion:', error);
    return false;
  }
}