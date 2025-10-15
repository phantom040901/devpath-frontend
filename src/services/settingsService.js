// src/services/settingsService.js
import { doc, getDoc, updateDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { db, auth } from '../lib/firebase';

/**
 * Get user settings from Firebase
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} User settings data
 */
export const getUserSettings = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user settings:', error);
    throw error;
  }
};

/**
 * Update personal information
 * @param {string} userId - The user's ID
 * @param {Object} personalInfo - Personal information to update
 * @returns {Promise<void>}
 */
export const updatePersonalInfo = async (userId, personalInfo) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      email: personalInfo.email,
      course: personalInfo.course,
      yearLevel: personalInfo.yearLevel,
      phoneNumber: personalInfo.phoneNumber || '',
      dateOfBirth: personalInfo.dateOfBirth || '',
      address: personalInfo.address || '',
      updatedAt: serverTimestamp()
    });

    // If email changed, update Firebase Auth email
    if (personalInfo.email && personalInfo.email !== auth.currentUser.email) {
      await updateEmail(auth.currentUser, personalInfo.email);
    }

    return { success: true, message: 'Personal information updated successfully' };
  } catch (error) {
    console.error('Error updating personal info:', error);
    throw error;
  }
};

/**
 * Update learning preferences
 * @param {string} userId - The user's ID
 * @param {Object} preferences - Learning preferences
 * @returns {Promise<void>}
 */
export const updateLearningPreferences = async (userId, preferences) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      'learningPreferences': preferences,
      updatedAt: serverTimestamp()
    });

    return { success: true, message: 'Learning preferences updated' };
  } catch (error) {
    console.error('Error updating learning preferences:', error);
    throw error;
  }
};

/**
 * Update career preferences
 * @param {string} userId - The user's ID
 * @param {Object} careerPrefs - Career preferences
 * @returns {Promise<void>}
 */
export const updateCareerPreferences = async (userId, careerPrefs) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      'careerPreferences': careerPrefs,
      updatedAt: serverTimestamp()
    });

    return { success: true, message: 'Career preferences updated' };
  } catch (error) {
    console.error('Error updating career preferences:', error);
    throw error;
  }
};

/**
 * Update user password
 * @param {string} currentPassword - Current password for reauthentication
 * @param {string} newPassword - New password
 * @returns {Promise<Object>}
 */
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    
    // Reauthenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, newPassword);
    
    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    console.error('Error updating password:', error);
    
    if (error.code === 'auth/wrong-password') {
      throw new Error('Current password is incorrect');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('New password is too weak');
    } else {
      throw new Error('Failed to update password');
    }
  }
};

/**
 * Update notification preferences
 * @param {string} userId - The user's ID
 * @param {Object} notifications - Notification preferences
 * @returns {Promise<void>}
 */
export const updateNotificationPreferences = async (userId, notifications) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      'settings.notifications': notifications,
      updatedAt: serverTimestamp()
    });

    return { success: true, message: 'Notification preferences updated' };
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
};

/**
 * Export user data (assessments, progress, profile)
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} All user data
 */
export const exportUserData = async (userId) => {
  try {
    // Get user profile
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    // Get assessment results
    const resultsRef = collection(db, 'users', userId, 'results');
    const resultsSnap = await getDocs(resultsRef);
    const results = resultsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get roadmap progress
    const roadmapRef = doc(db, 'roadmapProgress', userId);
    const roadmapSnap = await getDoc(roadmapRef);
    const roadmapData = roadmapSnap.exists() ? roadmapSnap.data() : null;

    // Get selected career
    const careerRef = doc(db, 'users', userId, 'selectedCareer', 'current');
    const careerSnap = await getDoc(careerRef);
    const careerData = careerSnap.exists() ? careerSnap.data() : null;

    return {
      profile: userData,
      assessmentResults: results,
      roadmapProgress: roadmapData,
      selectedCareer: careerData,
      exportedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw error;
  }
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const isValid = 
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar;
  
  return {
    isValid,
    errors: {
      minLength: password.length < minLength,
      hasUpperCase: !hasUpperCase,
      hasLowerCase: !hasLowerCase,
      hasNumber: !hasNumber,
      hasSpecialChar: !hasSpecialChar
    }
  };
};

/**
 * Delete user account
 * @param {string} userId - The user's ID
 * @param {string} password - User's password for confirmation
 * @returns {Promise<void>}
 */
export const deleteUserAccount = async (userId, password) => {
  try {
    const user = auth.currentUser;
    
    // Reauthenticate before deletion
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    
    // Delete user document from Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      deleted: true,
      deletedAt: serverTimestamp()
    });
    
    // Delete Firebase Auth account
    await user.delete();
    
    return { success: true, message: 'Account deleted successfully' };
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};