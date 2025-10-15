# 🔔 DevPath Notification System - Usage Guide

## Overview

The DevPath notification system provides comprehensive user engagement through 7 main categories of notifications:

1. **Milestone Achievements** - Celebrate user progress
2. **Learning Reminders** - Keep users engaged
3. **Career & Roadmap** - Guide career development
4. **Engagement & Gamification** - Motivate through competition
5. **Time-Sensitive** - Urgent notifications
6. **Recommendations & Tips** - Educational content
7. **System & Updates** - Platform communications

---

## 🚀 Quick Start

### Using the `useNotify` Hook

```javascript
import { useNotify } from '../hooks/useNotifications';

function MyComponent() {
  const notify = useNotify();

  // Send a milestone notification
  const handleAssessmentComplete = async () => {
    await notify.checkMilestones(); // Auto-checks and creates appropriate milestones
  };

  return <button onClick={handleAssessmentComplete}>Complete</button>;
}
```

---

## 📚 Notification Categories

### 1. Milestone Achievements

**Automatically trigger milestones:**
```javascript
const notify = useNotify();

// Check all milestones automatically
await notify.checkMilestones();
```

**Manual milestone notifications:**
```javascript
// First assessment
await notify.milestone('first_assessment');

// 5 assessments completed
await notify.milestone('five_assessments');

// 10 assessments completed
await notify.milestone('ten_assessments');

// 7-day learning streak
await notify.milestone('streak_7');

// 30-day learning streak
await notify.milestone('streak_30');

// Perfect score achieved
await notify.milestone('perfect_score');

// New skill unlocked
await notify.milestone('skill_unlocked', { skillName: 'React.js' });

// Score improvement
await notify.milestone('score_improvement');
```

### 2. Learning Reminders

**Inactivity reminder:**
```javascript
// After 3, 7, 14, or 30 days of inactivity
await notify.inactivityReminder(3); // 3 days
await notify.inactivityReminder(7); // 1 week
```

**Incomplete assessment:**
```javascript
await notify.incompleteAssessment('JavaScript Fundamentals');
```

**Weekly goals:**
```javascript
await notify.weeklyGoal({
  completed: 3,
  target: 5,
  remaining: 2
});
```

### 3. Career & Roadmap

**New module available:**
```javascript
await notify.newModule('Advanced React Patterns');
```

**Module completed:**
```javascript
await notify.moduleCompleted({
  moduleName: 'JavaScript Basics',
  completed: 5,
  total: 12
});
```

**Career match update:**
```javascript
await notify.careerMatchUpdate(85); // 85% match score
```

**Resume update reminder:**
```javascript
await notify.resumeUpdate(['React', 'Node.js', 'MongoDB']);
```

### 4. Engagement & Gamification

**Leaderboard ranking:**
```javascript
await notify.leaderboard({
  rank: 5,
  percentile: 10 // Top 10%
});
```

**Badge earned:**
```javascript
await notify.badge({
  name: 'Quick Learner',
  description: 'Completed 10 assessments in one week!'
});
```

**Monthly progress summary:**
```javascript
await notify.monthlyProgress({
  assessments: 15,
  hoursSpent: 24
});
```

### 5. Time-Sensitive Notifications

**Deadline reminders:**
```javascript
await notify.deadline({
  name: 'Web Development Assessment',
  timeframe: '24h', // or '3d', '7d'
  timeRemaining: '24 hours',
  link: '/assessments/web-dev'
});
```

### 6. Recommendations & Tips

**Daily tip:**
```javascript
import { DAILY_TIPS } from '../hooks/useNotifications';

const randomTip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];
await notify.dailyTip(randomTip);
```

**Personalized recommendation:**
```javascript
import { LEARNING_RECOMMENDATIONS } from '../hooks/useNotifications';

await notify.recommendation({
  title: 'JavaScript Fundamentals',
  area: 'programming',
  link: '/assessments/js-fundamentals'
});

// Or use predefined recommendations
const recommendations = LEARNING_RECOMMENDATIONS.programming;
await notify.recommendation(recommendations[0]);
```

**Resource recommendation:**
```javascript
await notify.resource({
  type: 'video', // or 'article', 'tutorial'
  description: 'Watch this excellent React tutorial by Traversy Media',
  link: 'https://youtube.com/...'
});
```

### 7. System & Updates

**New feature announcement:**
```javascript
await notify.newFeature({
  name: 'Resume Builder',
  description: 'Create professional resumes with our new builder tool!',
  link: '/dashboard/resume'
});
```

**Maintenance notification:**
```javascript
await notify.maintenance({
  date: 'December 15, 2024',
  time: '2:00 AM EST',
  duration: '2 hours'
});
```

**Security alert:**
```javascript
await notify.securityAlert({
  message: 'New device login detected from Chrome on Windows. If this wasn\'t you, please secure your account.'
});
```

---

## 💡 Example Implementations

### In Assessment Component

```javascript
// src/components/assessments/Assessment.jsx
import { useNotify } from '../../hooks/useNotifications';

export default function Assessment() {
  const notify = useNotify();

  const handleSubmitAssessment = async (score) => {
    // Save assessment result...

    // Check for milestones
    await notify.checkMilestones();

    // Send recommendation if score is low
    if (score < 70) {
      await notify.recommendation({
        title: 'Review this topic',
        area: 'programming',
        link: '/assessments/review'
      });
    }

    // Celebrate perfect score
    if (score === 100) {
      await notify.milestone('perfect_score');
    }
  };

  return (
    // Your component JSX...
  );
}
```

### In Career Roadmap Component

```javascript
// src/pages/CareerRoadmap.jsx
import { useNotify } from '../hooks/useNotifications';

export default function CareerRoadmap() {
  const notify = useNotify();

  const handleModuleComplete = async (moduleData) => {
    // Mark module as complete...

    // Send completion notification
    await notify.moduleCompleted({
      moduleName: moduleData.title,
      completed: moduleData.completed,
      total: moduleData.total
    });

    // If halfway through, send encouragement
    if (moduleData.completed === Math.floor(moduleData.total / 2)) {
      await notify.badge({
        name: 'Halfway There',
        description: 'You\'ve completed half of your learning roadmap!'
      });
    }
  };

  return (
    // Your component JSX...
  );
}
```

### In Student Dashboard

```javascript
// src/pages/StudentDashboard.jsx
import { useNotify } from '../hooks/useNotifications';
import { DAILY_TIPS } from '../hooks/useNotifications';

export default function StudentDashboard() {
  const notify = useNotify();

  useEffect(() => {
    // Send daily tip on dashboard load (once per day logic recommended)
    const sendDailyTip = async () => {
      const tip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];
      await notify.dailyTip(tip);
    };

    // Check if tip was already sent today
    const lastTipDate = localStorage.getItem('lastDailyTip');
    const today = new Date().toDateString();

    if (lastTipDate !== today) {
      sendDailyTip();
      localStorage.setItem('lastDailyTip', today);
    }
  }, []);

  return (
    // Your component JSX...
  );
}
```

### In Settings/Profile Update

```javascript
// When user gains new skills
const handleSkillsUpdate = async (newSkills) => {
  // Update user profile...

  // Notify about resume update
  if (newSkills.length > 0) {
    await notify.resumeUpdate(newSkills);
  }
};
```

---

## 🎯 Best Practices

### 1. Don't Spam Users
- Limit notification frequency
- Check if notification was recently sent
- Use appropriate priority levels

```javascript
// Example: Check before sending
const lastNotification = localStorage.getItem('lastMilestoneNotification');
const hoursSinceLastNotif = (Date.now() - parseInt(lastNotification)) / (1000 * 60 * 60);

if (hoursSinceLastNotif > 24) {
  await notify.milestone('streak_7');
  localStorage.setItem('lastMilestoneNotification', Date.now().toString());
}
```

### 2. Use Appropriate Priority Levels
- **high**: Critical actions, major milestones, security alerts
- **medium**: Regular updates, recommendations, reminders
- **low**: Tips, general info, monthly summaries

### 3. Provide Context
Always include relevant links so users can take action:
```javascript
await notify.recommendation({
  title: 'JavaScript Fundamentals',
  area: 'programming',
  link: '/assessments/js-fundamentals' // ✅ Good - actionable
});
```

### 4. Test Notifications
Test notifications in development:
```javascript
// Add a test button in dev mode
{process.env.NODE_ENV === 'development' && (
  <button onClick={() => notify.milestone('first_assessment')}>
    Test Notification
  </button>
)}
```

---

## 📊 Monitoring & Analytics

Track notification effectiveness:

```javascript
// Track notification clicks in analytics
const handleNotificationClick = (notification) => {
  // Your analytics code
  analytics.track('notification_clicked', {
    type: notification.type,
    title: notification.title
  });
};
```

---

## 🔧 Troubleshooting

### Notifications not appearing?
1. Check user is authenticated: `user?.uid` must exist
2. Verify Firebase permissions
3. Check browser console for errors
4. Ensure notification service is imported correctly

### Too many notifications?
1. Implement rate limiting
2. Add user notification preferences
3. Use localStorage to track sent notifications
4. Respect user's notification settings

---

## 🚀 Next Steps

1. **Implement notification preferences** - Let users control which notifications they receive
2. **Add notification sounds** - Optional audio alerts
3. **Push notifications** - Extend to browser push notifications
4. **Email notifications** - Important updates via email
5. **In-app notification center** - Already implemented via NotificationBell

---

## 📝 Available Notification Types

```javascript
{
  // Milestones
  'milestone',

  // Learning
  'assessment_reminder',
  'inactivity_reminder',
  'incomplete_assessment',
  'weekly_goal',

  // Career
  'career_match',
  'career_match_update',
  'new_module',
  'module_completed',
  'resume_update',

  // Engagement
  'leaderboard',
  'badge_earned',
  'monthly_summary',

  // Time-sensitive
  'deadline',

  // Recommendations
  'daily_tip',
  'recommendation',
  'resource',

  // System
  'new_feature',
  'maintenance',
  'security',
  'study_reminder',
  'progress_update'
}
```

---

For questions or feature requests, please contact the development team!
