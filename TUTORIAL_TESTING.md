# Tutorial Testing Guide

## How to Test Tutorials in Production

The tutorials are working correctly, but they only show for users who haven't completed them yet. Here's how to test:

### Method 1: Manual Trigger (Recommended for Testing)

1. **Dashboard Tutorial:**
   - Open browser console (F12)
   - Navigate to `/dashboard`
   - Type: `window.startDashboardTutorial()`
   - Press Enter

2. **Reports Tutorial:**
   - Open browser console (F12)
   - Navigate to `/student/reports`
   - Type: `window.startReportsTutorial()`
   - Press Enter

### Method 2: Reset Tutorial Status in Firebase

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Find your user document in `users` collection
4. Delete the `tutorialCompleted` field (or set `tutorialCompleted.dashboard: false`)
5. Refresh the dashboard page

### Method 3: Create New Account

1. Sign up with a new email
2. Login to dashboard
3. Tutorial should auto-start after 1.5 seconds

## Tutorial Behavior:

- **Auto-trigger**: Only for first-time users (no `tutorialCompleted` field in Firestore)
- **Completion**: Saves `tutorialCompleted.dashboard: true` or `tutorialCompleted.reports: true`
- **Skip**: User can skip anytime, still marks as completed
- **Re-trigger**: Use manual commands above, or reset in Firebase

## Why Tutorial Might Not Show:

1. ✅ User already completed it (field exists in Firestore)
2. ✅ User is still loading (wait for page to fully load)
3. ✅ Tutorial delay hasn't passed yet (1.5s for dashboard, 2s for reports)

## Console Logs to Look For:

When tutorial is working, you'll see:
- `📚 Starting dashboard tutorial for first-time user...` - Tutorial will start
- `✅ User has already completed the tutorial` - Tutorial won't show (already done)

## Quick Test Commands:

```javascript
// Dashboard Tutorial
window.startDashboardTutorial()

// Reports Tutorial
window.startReportsTutorial()

// Check if tutorial function exists
console.log(typeof window.startDashboardTutorial) // should be "function"
```
