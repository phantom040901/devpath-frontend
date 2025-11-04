# OAuth Authentication Setup Guide

This guide will help you set up Google and GitHub OAuth authentication for DevPath.

## Overview

We've implemented OAuth authentication using Firebase Auth, allowing users to sign in with:
- **Google Account**
- **GitHub Account**

## Firebase Console Setup

### 1. Enable Google Sign-In

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **devpath-capstone**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Click **Enable** toggle
6. Add your **Project support email** (required)
7. Click **Save**

**That's it!** Google OAuth is now enabled. Firebase automatically handles the OAuth client configuration.

### 2. Enable GitHub Sign-In

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Click on **GitHub** provider
3. Click **Enable** toggle
4. You'll see two fields:
   - **Client ID** (you'll get this from GitHub)
   - **Client Secret** (you'll get this from GitHub)
5. Copy the **Authorization callback URL** (e.g., `https://devpath-capstone.firebaseapp.com/__/auth/handler`)
6. Keep this tab open

### 3. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App** (or **Register a new application**)
3. Fill in the application details:
   - **Application name**: `DevPath` (or any name you prefer)
   - **Homepage URL**: Your app URL (e.g., `https://devpath-capstone.web.app` or `http://localhost:5173` for dev)
   - **Application description**: `DevPath - AI-powered career guidance platform`
   - **Authorization callback URL**: Paste the URL from Firebase (step 2.5)
4. Click **Register application**
5. You'll see your **Client ID** - copy it
6. Click **Generate a new client secret**
7. Copy the **Client Secret** (save it somewhere safe - you can only see it once!)

### 4. Configure GitHub in Firebase

1. Go back to Firebase Console (GitHub provider settings)
2. Paste the **Client ID** from GitHub
3. Paste the **Client Secret** from GitHub
4. Click **Save**

**Done!** GitHub OAuth is now configured.

## Testing the Implementation

### Local Testing (http://localhost:5173)

1. Make sure your dev server is running: `npm run dev`
2. Open the login or signup modal
3. You should see:
   - "Continue with Google" button with Google logo
   - "Continue with GitHub" button with GitHub logo
4. Click on either button to test

**Important for Local Testing:**
- You may need to add `http://localhost:5173` to Firebase's authorized domains
- Go to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
- Add `localhost` if it's not already there

### Production Testing

1. Deploy your app to Firebase Hosting
2. Add your production domain to authorized domains in Firebase
3. Update GitHub OAuth app with production URL

## OAuth Features Implemented

### User Experience
- ✅ One-click sign-in/sign-up with Google or GitHub
- ✅ Automatic account creation in Firestore for new OAuth users
- ✅ Profile photo from OAuth provider saved
- ✅ Email verification status from provider
- ✅ Seamless redirect to dashboard after authentication

### Security Features
- ✅ Popup-based authentication (no redirects required)
- ✅ Account linking detection (warns if email exists with different provider)
- ✅ Comprehensive error handling
- ✅ User data stored securely in Firestore

### Data Stored for OAuth Users

When a user signs in with OAuth, we automatically create a Firestore profile with:

```javascript
{
  uid: "user-firebase-uid",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  photoURL: "https://...",
  createdAt: "2025-11-04T...",
  emailVerified: true,
  authProvider: "google" | "github",
  assessmentsCompleted: [],
  careerPath: null,
  progress: {
    technical: 0,
    personal: 0,
    overall: 0
  }
}
```

## Code Changes Made

### Files Modified:

1. **[AuthContext.jsx](src/components/AuthContext.jsx)**
   - Added `signInWithGoogle()` function
   - Added `signInWithGitHub()` function
   - Imported OAuth providers from Firebase Auth
   - Added Firestore profile creation for OAuth users

2. **[LoginModal.jsx](src/components/sections/Modal/LoginModal.jsx)**
   - Added OAuth buttons with branded styling
   - Added `handleOAuthSignIn()` function
   - Added divider: "OR CONTINUE WITH"
   - Integrated with AuthContext OAuth functions

3. **[SignUpModal.jsx](src/components/sections/Modal/SignUpModal.jsx)**
   - Added OAuth buttons
   - Added `handleOAuthSignIn()` function
   - Added "Already have an account?" link
   - OAuth signup creates account and redirects to dashboard

## Troubleshooting

### Common Issues

#### 1. "Popup was blocked by the browser"
**Solution**: Allow popups for your domain in browser settings

#### 2. "An account already exists with this email"
**Solution**: This means the user already signed up with email/password. They should use that method or we need to implement account linking.

#### 3. GitHub OAuth not working locally
**Solution**:
- Make sure you added `http://localhost:5173` to GitHub OAuth app settings
- Check that the callback URL is exactly what Firebase provided

#### 4. Google OAuth fails
**Solution**:
- Verify Google provider is enabled in Firebase Console
- Check that you added a support email in Firebase settings
- Ensure your domain is in Firebase authorized domains

### Debug Mode

Check browser console for detailed error logs:
```javascript
console.log("Google sign-in error:", error);
console.log("Error code:", error.code);
```

## Advanced Configuration

### Account Linking (Future Enhancement)

If you want users to link multiple auth methods to one account:

```javascript
import { linkWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
await linkWithPopup(auth.currentUser, provider);
```

### Custom OAuth Scopes

To request additional permissions:

```javascript
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
```

### Redirect vs Popup

We use `signInWithPopup()` for better UX. For mobile apps, you might prefer:

```javascript
import { signInWithRedirect, getRedirectResult } from "firebase/auth";

// Initiate sign-in
await signInWithRedirect(auth, provider);

// After redirect, get result
const result = await getRedirectResult(auth);
```

## Security Best Practices

1. **Never commit secrets**: GitHub client secrets should be in environment variables
2. **Validate domains**: Keep authorized domains list minimal in Firebase
3. **Monitor auth events**: Set up Firebase Authentication alerts
4. **Rate limiting**: Firebase automatically handles this
5. **Review OAuth scopes**: Only request permissions you need

## Support

If you encounter issues:
1. Check Firebase Console → **Authentication** → **Users** to see if accounts are being created
2. Review browser console for error messages
3. Check Firebase Console → **Authentication** → **Settings** → **Authorized domains**
4. Verify GitHub OAuth app settings match Firebase callback URL

## Next Steps

After setup is complete:
- [ ] Test both Google and GitHub sign-in flows
- [ ] Verify user profiles are created in Firestore
- [ ] Test on mobile devices
- [ ] Add OAuth to admin login (if needed)
- [ ] Implement account linking (optional)
- [ ] Set up analytics tracking for OAuth events

---

**Created**: November 4, 2025
**Last Updated**: November 4, 2025
**Status**: ✅ Implementation Complete - Awaiting Firebase Console Configuration
