// src/scripts/initializeFirebase.js
// Firebase Initialization Script
// Run this once to set up all required Firestore collections and documents

import { doc, setDoc, serverTimestamp, collection, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Initialize System Settings Collection
 * Collection: systemSettings
 * Document: config
 */
async function initializeSystemSettings() {
  console.log('📋 Initializing System Settings...');

  try {
    const settingsRef = doc(db, 'systemSettings', 'config');

    await setDoc(settingsRef, {
      // ========== MAINTENANCE MODE SETTINGS ==========
      maintenanceMode: false,
      maintenanceMessage: "We're currently performing system maintenance. We'll be back soon! Thank you for your patience.",
      estimatedDowntime: null,
      allowedRoles: ['admin'], // Roles that can bypass maintenance mode
      lastUpdated: serverTimestamp(),
      updatedBy: 'system',

      // ========== GENERAL SETTINGS ==========
      siteName: 'DevPath',
      siteDescription: 'AI-powered Career Guidance System',
      version: '1.0.0',

      // ========== ASSESSMENT SETTINGS ==========
      defaultTimeLimit: 30, // minutes
      allowRetakes: true,
      maxRetakes: 3,
      showCorrectAnswers: false,
      passingScore: 70, // percentage

      // ========== EMAIL SETTINGS ==========
      emailNotifications: true,
      adminEmail: 'admin@devpath.com',
      studentWelcomeEmail: true,
      assessmentCompletionEmail: true,
      careerMatchEmail: true,

      // ========== SECURITY SETTINGS ==========
      requireEmailVerification: false,
      sessionTimeout: 60, // minutes
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireStrongPassword: true,

      // ========== DATA SETTINGS ==========
      dataRetentionDays: 365,
      autoBackup: true,
      backupFrequency: 'daily', // 'hourly', 'daily', 'weekly', 'monthly'

      // ========== FEATURE FLAGS ==========
      features: {
        careerMatching: true,
        learningRoadmap: true,
        notifications: true,
        resumeBuilder: true,
        progressTracking: true,
        reports: true
      },

      // ========== METADATA ==========
      createdAt: serverTimestamp(),
      environment: 'production' // 'development', 'staging', 'production'
    }, { merge: true }); // Use merge to avoid overwriting existing data

    console.log('✅ System Settings initialized successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error initializing System Settings:', error);
    throw error;
  }
}

/**
 * Initialize Sample Maintenance History Collection
 * Collection: maintenanceHistory
 * Documents: Individual maintenance records
 */
async function initializeMaintenanceHistory() {
  console.log('📋 Initializing Maintenance History...');

  try {
    // Create a sample maintenance history entry
    const historyRef = collection(db, 'maintenanceHistory');
    const sampleEntry = {
      startTime: serverTimestamp(),
      endTime: null,
      duration: null, // in minutes
      reason: 'Initial system setup',
      performedBy: 'system',
      affectedServices: ['all'],
      status: 'completed', // 'scheduled', 'in-progress', 'completed', 'cancelled'
      notes: 'System initialization and configuration',
      createdAt: serverTimestamp()
    };

    await setDoc(doc(historyRef, 'initial-setup'), sampleEntry);

    console.log('✅ Maintenance History initialized successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error initializing Maintenance History:', error);
    throw error;
  }
}

/**
 * Initialize System Logs Collection
 * Collection: systemLogs
 * Documents: Individual log entries
 */
async function initializeSystemLogs() {
  console.log('📋 Initializing System Logs...');

  try {
    const logsRef = collection(db, 'systemLogs');
    const initialLog = {
      timestamp: serverTimestamp(),
      level: 'info', // 'debug', 'info', 'warn', 'error', 'critical'
      category: 'system',
      action: 'initialization',
      message: 'Firestore collections initialized',
      userId: 'system',
      ipAddress: null,
      userAgent: null,
      metadata: {
        collections: ['systemSettings', 'maintenanceHistory', 'systemLogs']
      }
    };

    await setDoc(doc(logsRef, 'init-' + Date.now()), initialLog);

    console.log('✅ System Logs initialized successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error initializing System Logs:', error);
    throw error;
  }
}

/**
 * Verify all collections exist
 */
async function verifyCollections() {
  console.log('🔍 Verifying collections...');

  try {
    // Check systemSettings
    const settingsRef = doc(db, 'systemSettings', 'config');
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists()) {
      console.log('✅ systemSettings/config exists');
      console.log('   - Maintenance Mode:', settingsSnap.data().maintenanceMode);
      console.log('   - Site Name:', settingsSnap.data().siteName);
    } else {
      console.log('❌ systemSettings/config does not exist');
    }

    return settingsSnap.exists();
  } catch (error) {
    console.error('❌ Error verifying collections:', error);
    return false;
  }
}

/**
 * Main initialization function
 * Run all initialization tasks
 */
export async function initializeAllCollections() {
  console.log('🚀 Starting Firebase Initialization...\n');

  const startTime = Date.now();
  const results = {
    systemSettings: false,
    maintenanceHistory: false,
    systemLogs: false,
    verification: false
  };

  try {
    // Initialize System Settings
    results.systemSettings = await initializeSystemSettings();
    console.log('');

    // Initialize Maintenance History
    results.maintenanceHistory = await initializeMaintenanceHistory();
    console.log('');

    // Initialize System Logs
    results.systemLogs = await initializeSystemLogs();
    console.log('');

    // Verify everything was created
    results.verification = await verifyCollections();
    console.log('');

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('📊 INITIALIZATION SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`✅ System Settings:      ${results.systemSettings ? 'Success' : 'Failed'}`);
    console.log(`✅ Maintenance History:  ${results.maintenanceHistory ? 'Success' : 'Failed'}`);
    console.log(`✅ System Logs:          ${results.systemLogs ? 'Success' : 'Failed'}`);
    console.log(`✅ Verification:         ${results.verification ? 'Success' : 'Failed'}`);
    console.log('═══════════════════════════════════════');
    console.log(`⏱️  Time taken: ${duration}s`);
    console.log('═══════════════════════════════════════\n');

    if (Object.values(results).every(r => r === true)) {
      console.log('🎉 All collections initialized successfully!');
      console.log('📝 Next steps:');
      console.log('   1. Check Firebase Console to verify collections');
      console.log('   2. Update Firestore security rules');
      console.log('   3. Proceed with implementing maintenance mode feature');
      return true;
    } else {
      console.log('⚠️  Some collections failed to initialize. Check errors above.');
      return false;
    }

  } catch (error) {
    console.error('❌ Fatal error during initialization:', error);
    return false;
  }
}

/**
 * Display current system settings
 */
export async function displaySystemSettings() {
  console.log('📋 Fetching current system settings...\n');

  try {
    const settingsRef = doc(db, 'systemSettings', 'config');
    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
      console.log('❌ System settings not found. Run initializeAllCollections() first.');
      return null;
    }

    const settings = settingsSnap.data();

    console.log('═══════════════════════════════════════');
    console.log('⚙️  CURRENT SYSTEM SETTINGS');
    console.log('═══════════════════════════════════════');
    console.log('');

    console.log('🔧 MAINTENANCE MODE');
    console.log(`   Status: ${settings.maintenanceMode ? '🔴 ENABLED' : '🟢 DISABLED'}`);
    console.log(`   Message: ${settings.maintenanceMessage}`);
    console.log(`   Last Updated: ${settings.lastUpdated?.toDate?.() || 'N/A'}`);
    console.log(`   Updated By: ${settings.updatedBy}`);
    console.log('');

    console.log('🌐 GENERAL');
    console.log(`   Site Name: ${settings.siteName}`);
    console.log(`   Description: ${settings.siteDescription}`);
    console.log(`   Version: ${settings.version || 'N/A'}`);
    console.log('');

    console.log('📝 ASSESSMENT');
    console.log(`   Time Limit: ${settings.defaultTimeLimit} minutes`);
    console.log(`   Allow Retakes: ${settings.allowRetakes ? 'Yes' : 'No'}`);
    console.log(`   Max Retakes: ${settings.maxRetakes}`);
    console.log(`   Show Answers: ${settings.showCorrectAnswers ? 'Yes' : 'No'}`);
    console.log('');

    console.log('📧 EMAIL');
    console.log(`   Notifications: ${settings.emailNotifications ? 'Enabled' : 'Disabled'}`);
    console.log(`   Admin Email: ${settings.adminEmail}`);
    console.log('');

    console.log('🔒 SECURITY');
    console.log(`   Email Verification: ${settings.requireEmailVerification ? 'Required' : 'Optional'}`);
    console.log(`   Session Timeout: ${settings.sessionTimeout} minutes`);
    console.log(`   Max Login Attempts: ${settings.maxLoginAttempts}`);
    console.log('');

    console.log('💾 DATA');
    console.log(`   Retention: ${settings.dataRetentionDays} days`);
    console.log(`   Auto Backup: ${settings.autoBackup ? 'Enabled' : 'Disabled'}`);
    console.log(`   Backup Frequency: ${settings.backupFrequency}`);
    console.log('');

    console.log('═══════════════════════════════════════\n');

    return settings;
  } catch (error) {
    console.error('❌ Error fetching system settings:', error);
    return null;
  }
}

// Fix import for getDoc
import { getDoc } from 'firebase/firestore';

// Export individual functions for flexibility
export {
  initializeSystemSettings,
  initializeMaintenanceHistory,
  initializeSystemLogs,
  verifyCollections
};

// Default export
export default initializeAllCollections;
