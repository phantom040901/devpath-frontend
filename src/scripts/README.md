# 🔥 Firebase Initialization Script

## Overview
This script initializes all required Firestore collections for the DevPath system, including the **Maintenance Mode** feature.

---

## 📋 Collections Created

### 1. **systemSettings** (Main Configuration)
- Document ID: `config`
- Contains all system-wide settings
- **Key Fields:**
  - `maintenanceMode`: Enable/disable student access
  - `maintenanceMessage`: Custom message shown during maintenance
  - `siteName`, `siteDescription`: General settings
  - Assessment, email, security, and data settings

### 2. **maintenanceHistory** (Audit Log)
- Tracks all maintenance events
- Records: start time, end time, duration, reason, who performed it

### 3. **systemLogs** (Activity Logging)
- System-wide activity logs
- Tracks important events and changes

---

## 🚀 How to Run

### **Method 1: Using the Browser UI (Recommended)**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the initializer page:**
   ```
   http://localhost:5173/initialize-firebase
   ```

3. **Click "Initialize All Collections"**
   - Wait for the process to complete
   - Check the console output for success messages
   - Verify in Firebase Console

4. **Click "Display Settings"** (optional)
   - View current configuration
   - Verify all settings were created correctly

---

### **Method 2: Using Browser Console (Advanced)**

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser console** (F12)

3. **Run the script:**
   ```javascript
   import { initializeAllCollections } from './scripts/initializeFirebase';
   await initializeAllCollections();
   ```

---

## ✅ Verification Steps

After running the script:

1. **Check Firebase Console:**
   - Go to: https://console.firebase.google.com
   - Navigate to Firestore Database
   - Verify these collections exist:
     - `systemSettings` → `config` document
     - `maintenanceHistory` → documents
     - `systemLogs` → documents

2. **Verify Settings:**
   - Click on `systemSettings` → `config`
   - Check that `maintenanceMode` = `false`
   - Verify all other fields are present

3. **Check Console Output:**
   - You should see:
     ```
     ✅ System Settings initialized successfully!
     ✅ Maintenance History initialized successfully!
     ✅ System Logs initialized successfully!
     ✅ Verification: Success
     🎉 All collections initialized successfully!
     ```

---

## 🔒 Security Rules

**IMPORTANT:** Update your Firestore security rules!

Add this to `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // System Settings - Read by all authenticated users, Write by admin only
    match /systemSettings/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Maintenance History - Admin only
    match /maintenanceHistory/{document=**} {
      allow read, write: if request.auth != null &&
                           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // System Logs - Admin only
    match /systemLogs/{document=**} {
      allow read, write: if request.auth != null &&
                           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // ... your other rules ...
  }
}
```

**Deploy rules:**
```bash
firebase deploy --only firestore:rules
```

---

## 📊 What Gets Created

### systemSettings/config Document:
```javascript
{
  // Maintenance Mode
  maintenanceMode: false,
  maintenanceMessage: "We're currently performing system maintenance...",
  estimatedDowntime: null,
  allowedRoles: ['admin'],
  lastUpdated: <timestamp>,
  updatedBy: 'system',

  // General
  siteName: 'DevPath',
  siteDescription: 'AI-powered Career Guidance System',
  version: '1.0.0',

  // Assessment Settings
  defaultTimeLimit: 30,
  allowRetakes: true,
  maxRetakes: 3,
  showCorrectAnswers: false,
  passingScore: 70,

  // Email Settings
  emailNotifications: true,
  adminEmail: 'admin@devpath.com',
  studentWelcomeEmail: true,
  assessmentCompletionEmail: true,

  // Security
  requireEmailVerification: false,
  sessionTimeout: 60,
  maxLoginAttempts: 5,
  passwordMinLength: 8,
  requireStrongPassword: true,

  // Data Management
  dataRetentionDays: 365,
  autoBackup: true,
  backupFrequency: 'daily',

  // Feature Flags
  features: {
    careerMatching: true,
    learningRoadmap: true,
    notifications: true,
    resumeBuilder: true,
    progressTracking: true,
    reports: true
  }
}
```

---

## 🔧 Troubleshooting

### Error: "Permission denied"
- **Cause:** Firestore security rules not set up
- **Fix:** Add the security rules shown above

### Error: "Collection already exists"
- **Cause:** Script was run before
- **Fix:** This is OK! The script uses `merge: true` to avoid overwriting

### Error: "Firebase not initialized"
- **Cause:** Firebase config missing
- **Fix:** Check `src/lib/firebase.js` configuration

### No output in console
- **Cause:** Browser console filtering
- **Fix:** Clear console filters, check "All levels"

---

## 🎯 Next Steps

After successful initialization:

1. ✅ **Verify in Firebase Console**
2. ✅ **Update Firestore security rules**
3. ✅ **Deploy security rules**
4. ⏭️ **Proceed with implementing maintenance mode feature**
5. ⏭️ **Test toggling maintenance mode**
6. ⏭️ **Test student access blocking**

---

## 📝 Notes

- **Run this script only ONCE** per Firebase project
- The script is **idempotent** - safe to run multiple times
- All timestamps are server-side timestamps
- Default settings can be customized in the script
- The initializer page (`/initialize-firebase`) can be removed in production

---

## 🆘 Support

If you encounter issues:

1. Check Firebase Console for error messages
2. Verify your Firebase configuration
3. Check browser console for detailed errors
4. Ensure you have proper Firebase permissions
5. Verify your internet connection

---

## 📚 Related Files

- `src/scripts/initializeFirebase.js` - Main initialization logic
- `src/scripts/runInitialization.jsx` - Browser UI component
- `src/App.jsx` - Route configuration
- `firestore.rules` - Security rules (to be updated)

---

**Created by:** DevPath Development Team
**Last Updated:** December 2024
**Version:** 1.0.0
