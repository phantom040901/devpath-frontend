// src/services/systemSettingsService.js
// Service for managing system-wide settings including maintenance mode

import { doc, getDoc, updateDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const SETTINGS_DOC_PATH = 'systemSettings/config';

/**
 * Get current system settings
 * @returns {Promise<Object>} System settings object
 */
export async function getSystemSettings() {
  try {
    const settingsRef = doc(db, 'systemSettings', 'config');
    const snapshot = await getDoc(settingsRef);

    if (snapshot.exists()) {
      return {
        success: true,
        data: snapshot.data()
      };
    } else {
      console.warn('System settings not found. Initialize Firebase first.');
      return {
        success: false,
        error: 'Settings not initialized',
        data: null
      };
    }
  } catch (error) {
    console.error('Error fetching system settings:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}

/**
 * Update system settings
 * @param {Object} updates - Object containing settings to update
 * @param {string} updatedBy - Email of user making the update
 * @returns {Promise<Object>} Success/error response
 */
export async function updateSystemSettings(updates, updatedBy = 'admin') {
  try {
    const settingsRef = doc(db, 'systemSettings', 'config');

    // Add metadata
    const updateData = {
      ...updates,
      lastUpdated: serverTimestamp(),
      updatedBy
    };

    await updateDoc(settingsRef, updateData);

    return {
      success: true,
      message: 'Settings updated successfully'
    };
  } catch (error) {
    console.error('Error updating system settings:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Check if maintenance mode is currently enabled
 * @returns {Promise<boolean>} True if maintenance mode is on
 */
export async function isMaintenanceModeEnabled() {
  try {
    const result = await getSystemSettings();

    if (result.success && result.data) {
      return result.data.maintenanceMode === true;
    }

    return false; // Default to false if settings not found
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    return false;
  }
}

/**
 * Toggle maintenance mode on/off
 * @param {boolean} enabled - True to enable, false to disable
 * @param {string} message - Optional custom maintenance message
 * @param {string} updatedBy - Email of admin toggling the mode
 * @returns {Promise<Object>} Success/error response
 */
export async function toggleMaintenanceMode(enabled, message = null, updatedBy = 'admin') {
  try {
    const updates = {
      maintenanceMode: enabled
    };

    // If custom message provided, update it
    if (message) {
      updates.maintenanceMessage = message;
    }

    const result = await updateSystemSettings(updates, updatedBy);

    if (result.success) {
      console.log(`✅ Maintenance mode ${enabled ? 'ENABLED' : 'DISABLED'} by ${updatedBy}`);

      // Log this event
      await logMaintenanceEvent(enabled, updatedBy);
    }

    return result;
  } catch (error) {
    console.error('Error toggling maintenance mode:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get maintenance mode status and message
 * @returns {Promise<Object>} Object with enabled status and message
 */
export async function getMaintenanceStatus() {
  try {
    const result = await getSystemSettings();

    if (result.success && result.data) {
      return {
        enabled: result.data.maintenanceMode || false,
        message: result.data.maintenanceMessage || "We're currently performing system maintenance.",
        estimatedDowntime: result.data.estimatedDowntime || null,
        lastUpdated: result.data.lastUpdated || null,
        updatedBy: result.data.updatedBy || 'system'
      };
    }

    return {
      enabled: false,
      message: "We're currently performing system maintenance.",
      estimatedDowntime: null,
      lastUpdated: null,
      updatedBy: 'system'
    };
  } catch (error) {
    console.error('Error getting maintenance status:', error);
    return {
      enabled: false,
      message: "We're currently performing system maintenance.",
      estimatedDowntime: null,
      lastUpdated: null,
      updatedBy: 'system'
    };
  }
}

/**
 * Subscribe to real-time maintenance mode changes
 * @param {Function} callback - Called when maintenance mode changes
 * @returns {Function} Unsubscribe function
 */
export function subscribeToMaintenanceMode(callback) {
  const settingsRef = doc(db, 'systemSettings', 'config');

  const unsubscribe = onSnapshot(settingsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      callback({
        enabled: data.maintenanceMode || false,
        message: data.maintenanceMessage || "We're currently performing system maintenance.",
        estimatedDowntime: data.estimatedDowntime || null,
        lastUpdated: data.lastUpdated || null,
        updatedBy: data.updatedBy || 'system'
      });
    }
  }, (error) => {
    console.error('Error in maintenance mode subscription:', error);
  });

  return unsubscribe;
}

/**
 * Subscribe to all system settings changes
 * @param {Function} callback - Called when any setting changes
 * @returns {Function} Unsubscribe function
 */
export function subscribeToSystemSettings(callback) {
  const settingsRef = doc(db, 'systemSettings', 'config');

  const unsubscribe = onSnapshot(settingsRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({
        success: true,
        data: snapshot.data()
      });
    } else {
      callback({
        success: false,
        data: null,
        error: 'Settings not found'
      });
    }
  }, (error) => {
    console.error('Error in settings subscription:', error);
    callback({
      success: false,
      data: null,
      error: error.message
    });
  });

  return unsubscribe;
}

/**
 * Log maintenance mode event to history
 * @param {boolean} enabled - Whether maintenance was enabled or disabled
 * @param {string} performedBy - Who performed the action
 * @returns {Promise<void>}
 */
async function logMaintenanceEvent(enabled, performedBy) {
  try {
    const { collection, addDoc } = await import('firebase/firestore');
    const historyRef = collection(db, 'maintenanceHistory');

    await addDoc(historyRef, {
      action: enabled ? 'enabled' : 'disabled',
      performedBy,
      timestamp: serverTimestamp(),
      status: 'completed'
    });
  } catch (error) {
    console.error('Error logging maintenance event:', error);
    // Don't throw - logging failure shouldn't break the main operation
  }
}

/**
 * Update specific setting fields
 * @param {Object} fieldUpdates - Object with field names and values
 * @param {string} updatedBy - Email of user making the update
 * @returns {Promise<Object>} Success/error response
 */
export async function updateSettingFields(fieldUpdates, updatedBy = 'admin') {
  return updateSystemSettings(fieldUpdates, updatedBy);
}

/**
 * Reset settings to defaults
 * @param {string} updatedBy - Email of admin resetting settings
 * @returns {Promise<Object>} Success/error response
 */
export async function resetSettingsToDefaults(updatedBy = 'admin') {
  try {
    const settingsRef = doc(db, 'systemSettings', 'config');

    const defaultSettings = {
      // Maintenance Mode
      maintenanceMode: false,
      maintenanceMessage: "We're currently performing system maintenance. We'll be back soon!",
      estimatedDowntime: null,

      // General Settings
      siteName: 'DevPath',
      siteDescription: 'AI-powered Career Guidance System',

      // Assessment Settings
      defaultTimeLimit: 30,
      allowRetakes: true,
      maxRetakes: 3,
      showCorrectAnswers: false,

      // Email Settings
      emailNotifications: true,
      adminEmail: 'admin@devpath.com',
      studentWelcomeEmail: true,
      assessmentCompletionEmail: true,

      // Security Settings
      requireEmailVerification: false,
      sessionTimeout: 60,
      maxLoginAttempts: 5,

      // Data Settings
      dataRetentionDays: 365,
      autoBackup: true,
      backupFrequency: 'daily',

      // Metadata
      lastUpdated: serverTimestamp(),
      updatedBy
    };

    await setDoc(settingsRef, defaultSettings, { merge: true });

    return {
      success: true,
      message: 'Settings reset to defaults'
    };
  } catch (error) {
    console.error('Error resetting settings:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Validate settings object
 * @param {Object} settings - Settings to validate
 * @returns {Object} Validation result with errors if any
 */
export function validateSettings(settings) {
  const errors = [];

  // Validate maintenance message
  if (settings.maintenanceMessage && settings.maintenanceMessage.length > 500) {
    errors.push('Maintenance message must be less than 500 characters');
  }

  // Validate time limit
  if (settings.defaultTimeLimit && (settings.defaultTimeLimit < 1 || settings.defaultTimeLimit > 1440)) {
    errors.push('Default time limit must be between 1 and 1440 minutes');
  }

  // Validate max retakes
  if (settings.maxRetakes && (settings.maxRetakes < 1 || settings.maxRetakes > 10)) {
    errors.push('Max retakes must be between 1 and 10');
  }

  // Validate session timeout
  if (settings.sessionTimeout && (settings.sessionTimeout < 5 || settings.sessionTimeout > 1440)) {
    errors.push('Session timeout must be between 5 and 1440 minutes');
  }

  // Validate max login attempts
  if (settings.maxLoginAttempts && (settings.maxLoginAttempts < 3 || settings.maxLoginAttempts > 10)) {
    errors.push('Max login attempts must be between 3 and 10');
  }

  // Validate email
  if (settings.adminEmail && !settings.adminEmail.includes('@')) {
    errors.push('Admin email must be a valid email address');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Export all functions
export default {
  getSystemSettings,
  updateSystemSettings,
  isMaintenanceModeEnabled,
  toggleMaintenanceMode,
  getMaintenanceStatus,
  subscribeToMaintenanceMode,
  subscribeToSystemSettings,
  updateSettingFields,
  resetSettingsToDefaults,
  validateSettings
};
