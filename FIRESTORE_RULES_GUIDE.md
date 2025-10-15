# 🔒 Firestore Security Rules - Deployment Guide

## Overview
Updated security rules for DevPath with proper access control and maintenance mode support.

---

## 🎯 What Changed

### **Before (Your Current Rules):**
```javascript
match /{document=**} {
  allow read, write: if request.auth != null;
}
```
- ✅ Simple and permissive
- ❌ Any authenticated user can modify anything
- ❌ No role-based access control
- ❌ No admin protection

### **After (New Rules):**
```javascript
// Specific rules for each collection
// Role-based access (admin vs student)
// Proper data ownership checks
// Maintenance mode support
```
- ✅ Granular access control
- ✅ Admin-only collections
- ✅ Users can only modify their own data
- ✅ Maintenance mode settings protected

---

## 📋 Key Features of New Rules

### **1. System Settings (Maintenance Mode)**
```javascript
match /systemSettings/{document=**} {
  allow read: if isAuthenticated();     // Everyone can read
  allow write: if isAdmin();             // Only admins can change
}
```
- **Students**: Can read maintenance status
- **Admins**: Can toggle maintenance mode

### **2. User Data Protection**
```javascript
match /users/{userId} {
  allow read: if isOwner(userId) || isAdmin();
  allow write: if isOwner(userId) || isAdmin();
}
```
- Users can only access their own data
- Admins can access all user data

### **3. Admin-Only Collections**
- `maintenanceHistory` - Track maintenance events
- `systemLogs` - System activity logs
- `adminSettings` - Admin configurations
- `analytics` - System analytics

### **4. Shared Resources**
- Assessments, careers, resources: Everyone can read, only admins can write

---

## 🚀 How to Deploy (3 Methods)

### **Method 1: Firebase Console (Easiest)**

1. **Open Firebase Console:**
   - Go to: https://console.firebase.google.com
   - Select your project: `devpath-capstone`

2. **Navigate to Firestore Rules:**
   - Click "Firestore Database" in left sidebar
   - Click "Rules" tab at the top

3. **Copy & Paste:**
   - Open `firestore.rules` file (created above)
   - Copy ALL the content
   - Paste into Firebase Console editor

4. **Publish:**
   - Click "Publish" button
   - Wait for confirmation message
   - ✅ Done!

---

### **Method 2: Firebase CLI (Recommended for Production)**

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase** (if not already done):
   ```bash
   firebase init firestore
   ```
   - Select your project
   - Accept default file names

4. **Copy the rules file:**
   - The `firestore.rules` file is already in your project root
   - If you created it elsewhere, copy it to project root

5. **Deploy the rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

6. **Verify:**
   ```bash
   ✔  Deploy complete!
   ```

---

### **Method 3: Quick Update (For Testing)**

**Using Firebase Console:**

1. Go to Firebase Console → Firestore → Rules
2. Replace your current rules with this minimal version for testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // System Settings - READ by all, WRITE by admin
    match /systemSettings/{document=**} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }

    // Everything else - same as before
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

---

## ✅ Verification Steps

After deploying, verify the rules work:

### **Test 1: Student Cannot Write System Settings**
```javascript
// As a regular student user
import { doc, updateDoc } from 'firebase/firestore';

try {
  await updateDoc(doc(db, 'systemSettings', 'config'), {
    maintenanceMode: true
  });
  console.log('❌ ERROR: Student should NOT be able to write!');
} catch (error) {
  console.log('✅ CORRECT: Permission denied for student');
}
```

### **Test 2: Student Can Read System Settings**
```javascript
// As a regular student user
import { doc, getDoc } from 'firebase/firestore';

const snap = await getDoc(doc(db, 'systemSettings', 'config'));
if (snap.exists()) {
  console.log('✅ CORRECT: Student can read settings');
  console.log('Maintenance Mode:', snap.data().maintenanceMode);
}
```

### **Test 3: Admin Can Write System Settings**
```javascript
// As an admin user
await updateDoc(doc(db, 'systemSettings', 'config'), {
  maintenanceMode: true
});
console.log('✅ CORRECT: Admin can write settings');
```

---

## ⚠️ Important Notes

### **Breaking Changes:**
The new rules are **more restrictive** than your current ones. This might cause some errors if:

1. **Students try to access other students' data** → Now blocked ✅
2. **Non-admins try to modify assessments** → Now blocked ✅
3. **Users try to access admin collections** → Now blocked ✅

### **Admin User Setup:**
Make sure your admin user has `role: 'admin'` in Firestore:

```javascript
// In Firestore: users/{adminUserId}
{
  email: "admin@devpath.com",
  role: "admin",    // ← IMPORTANT!
  // ... other fields
}
```

### **Testing:**
1. Test as **student user** first
2. Test as **admin user** second
3. Verify maintenance mode toggle works
4. Check console for permission errors

---

## 🔄 Rollback Plan

If something breaks, you can quickly rollback:

### **Option 1: Firebase Console**
1. Go to Firestore → Rules
2. Click "Rules History" tab
3. Select previous version
4. Click "Restore"

### **Option 2: Restore Old Rules**
Copy-paste your original rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📊 Rules Comparison

| Collection | Before | After |
|-----------|--------|-------|
| **systemSettings** | ❌ Not protected | ✅ Admin-only write |
| **users** | ⚠️ Anyone can read | ✅ Own data + admin |
| **assessments** | ⚠️ Anyone can modify | ✅ Admin-only write |
| **notifications** | ⚠️ Anyone can read | ✅ Own notifications |
| **adminSettings** | ⚠️ Anyone can access | ✅ Admin-only |

---

## 🎯 Next Steps

1. ✅ **Review the new rules** (firestore.rules file)
2. ✅ **Deploy using preferred method**
3. ✅ **Test with student account**
4. ✅ **Test with admin account**
5. ✅ **Verify maintenance mode access**
6. ⏭️ **Run Firebase initialization script**
7. ⏭️ **Implement maintenance mode feature**

---

## 🆘 Troubleshooting

### Error: "Missing or insufficient permissions"
**Cause:** Rules are too restrictive
**Fix:** Check if user has correct role in Firestore

### Error: "admin is not defined"
**Cause:** User document doesn't have `role` field
**Fix:** Add `role: 'admin'` to admin user document

### Error: "get() is not allowed"
**Cause:** Trying to read during write operation
**Fix:** Rules are correct, this is expected Firestore behavior

### Rules not updating
**Cause:** Cache or propagation delay
**Fix:** Wait 1-2 minutes, clear browser cache

---

## 📚 Resources

- [Firestore Security Rules Docs](https://firebase.google.com/docs/firestore/security/get-started)
- [Rules Testing Guide](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [Common Mistakes](https://firebase.google.com/docs/firestore/security/rules-conditions)

---

**Need Help?** Check the Firebase Console Rules Playground to test rules before deploying!

**Ready to Deploy?** Choose your method above and follow the steps! 🚀
