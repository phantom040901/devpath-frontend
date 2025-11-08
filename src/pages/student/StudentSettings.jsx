// src/pages/student/StudentSettings.jsx
import { useState, useEffect } from 'react';
import { User, Lock, Shield, Save, Eye, EyeOff, CheckCircle, AlertCircle, Loader, Trash2, Download, Bell, Palette, Sun, Moon, GraduationCap } from 'lucide-react';
import { useAuth } from '../../components/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import DashboardNav from '../../components/dashboard/DashboardNav';
import DashboardFooter from '../../components/dashboard/DashboardFooter';
import { db } from '../../lib/firebase';
import ProfileCompletionTracker from '../../components/student/ProfileCompletionTracker';
import {
  getUserSettings,
  updatePersonalInfo,
  updateUserPassword,
  validatePassword,
  deleteUserAccount,
  exportUserData,
  updateNotificationPreferences
} from '../../services/settingsService';

export default function StudentSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    course: '',
    yearLevel: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: ''
  });

  // Career from Assessment (Read-only)
  const [careerFromAssessment, setCareerFromAssessment] = useState({
    careerCategory: '',
    selectedCareerJobRole: '',
    selectedCareerMatchScore: ''
  });

  // Account Settings State
  const [accountSettings, setAccountSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState(null);

  // Notification Preferences State
  const [notificationPrefs, setNotificationPrefs] = useState({
    assessmentReminders: true,
    careerMatches: true,
    milestones: true,
    progressUpdates: true,
    newModules: true,
    recommendations: true,
    maintenance: true,
    security: true
  });

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibleToEmployers: false,
    showFullNameToEmployers: false,
    showCareerPath: true,
    showSkills: true,
    showAssessmentScores: false,
    showContactInfo: false
  });

  // Enrollment Status State
  const [enrollmentStatus, setEnrollmentStatus] = useState({
    status: "current_pwc", // "current_pwc", "pwc_alumni", "external"
    yearLevel: "",
    graduationYear: "",
  });

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) return;

      try {
        setInitialLoading(true);
        const userData = await getUserSettings(user.uid);

        setPersonalInfo({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          course: userData.course || '',
          yearLevel: userData.yearLevel || '',
          phoneNumber: userData.phoneNumber || '',
          dateOfBirth: userData.dateOfBirth || '',
          address: userData.address || ''
        });

        setCareerFromAssessment({
          careerCategory: userData.careerCategory || 'Not set',
          selectedCareerJobRole: userData.selectedCareerJobRole || 'Not set',
          selectedCareerMatchScore: userData.selectedCareerMatchScore || 'N/A'
        });

        // Load notification preferences
        if (userData.settings?.notifications) {
          setNotificationPrefs({
            ...notificationPrefs,
            ...userData.settings.notifications
          });
        }

        // Load privacy settings
        setPrivacySettings({
          profileVisibleToEmployers: userData.profileVisibleToEmployers || false,
          showFullNameToEmployers: userData.privacy?.showFullNameToEmployers ?? false,
          showCareerPath: userData.privacy?.showCareerPath ?? true,
          showSkills: userData.privacy?.showSkills ?? true,
          showAssessmentScores: userData.privacy?.showAssessmentScores ?? false,
          showContactInfo: userData.privacy?.showContactInfo ?? false
        });

        // Load enrollment status
        setEnrollmentStatus({
          status: userData.enrollmentStatus || "current_pwc",
          yearLevel: userData.yearLevel || "",
          graduationYear: userData.graduationYear || "",
        });
      } catch (error) {
        setSaveStatus({ type: 'error', message: 'Failed to load user settings' });
      } finally {
        setInitialLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Validate password as user types
  useEffect(() => {
    if (accountSettings.newPassword) {
      const validation = validatePassword(accountSettings.newPassword);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation(null);
    }
  }, [accountSettings.newPassword]);

  const handleSavePersonalInfo = async () => {
    setLoading(true);
    setSaveStatus(null);
    
    try {
      await updatePersonalInfo(user.uid, personalInfo);
      setSaveStatus({ type: 'success', message: 'Personal information updated successfully!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: error.message || 'Failed to save settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      setSaveStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    const validation = validatePassword(accountSettings.newPassword);
    if (!validation.isValid) {
      setSaveStatus({ type: 'error', message: 'Password does not meet requirements' });
      return;
    }

    setLoading(true);
    setSaveStatus(null);
    
    try {
      await updateUserPassword(accountSettings.currentPassword, accountSettings.newPassword);
      setSaveStatus({ type: 'success', message: 'Password updated successfully!' });
      
      setAccountSettings({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: error.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    setSaveStatus(null);
    
    try {
      const data = await exportUserData(user.uid);
      
      // Create downloadable JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `devpath-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSaveStatus({ type: 'success', message: 'Data exported successfully!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to export data' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setSaveStatus({ type: 'error', message: 'Please enter your password' });
      return;
    }

    setLoading(true);
    setSaveStatus(null);

    try {
      await deleteUserAccount(user.uid, deletePassword);
    } catch (error) {
      setSaveStatus({ type: 'error', message: error.message || 'Failed to delete account' });
      setShowDeleteModal(false);
      setDeletePassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotificationPreferences = async () => {
    setLoading(true);
    setSaveStatus(null);

    try {
      await updateNotificationPreferences(user.uid, notificationPrefs);
      setSaveStatus({ type: 'success', message: 'Notification preferences updated successfully!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: error.message || 'Failed to save notification preferences' });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacySettings = async () => {
    setLoading(true);
    setSaveStatus(null);

    try {
      const { updateDoc, doc } = await import('firebase/firestore');
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        profileVisibleToEmployers: privacySettings.profileVisibleToEmployers,
        privacy: {
          showFullNameToEmployers: privacySettings.showFullNameToEmployers,
          showCareerPath: privacySettings.showCareerPath,
          showSkills: privacySettings.showSkills,
          showAssessmentScores: privacySettings.showAssessmentScores,
          showContactInfo: privacySettings.showContactInfo
        },
        updatedAt: new Date().toISOString()
      });

      setSaveStatus({ type: 'success', message: 'Privacy settings updated successfully!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to save privacy settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEnrollmentStatus = async () => {
    setLoading(true);
    setSaveStatus(null);

    try {
      const { updateDoc, doc } = await import('firebase/firestore');
      const userRef = doc(db, 'users', user.uid);

      const updateData = {
        enrollmentStatus: enrollmentStatus.status,
        isEnrolled: enrollmentStatus.status === "current_pwc",
        updatedAt: new Date().toISOString()
      };

      // Add year level for current students
      if (enrollmentStatus.status === "current_pwc") {
        updateData.yearLevel = enrollmentStatus.yearLevel;
      }

      // Add graduation year for alumni
      if (enrollmentStatus.status === "pwc_alumni" && enrollmentStatus.graduationYear) {
        updateData.graduationYear = enrollmentStatus.graduationYear;
      }

      await updateDoc(userRef, updateData);

      setSaveStatus({ type: 'success', message: 'Enrollment status updated successfully!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to save enrollment status' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'account', label: 'Security', icon: Shield }
  ];

  if (initialLoading) {
    return (
      <div className="bg-gradient-to-b from-primary-1400 via-primary-1500 to-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-primary-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-primary-1400 via-primary-1500 to-black min-h-screen text-primary-50 flex flex-col">
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 flex-grow w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage your account settings and preferences</p>
        </motion.div>

        {/* Status Messages */}
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              saveStatus.type === 'success' 
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400' 
                : 'bg-red-500/20 border border-red-500/50 text-red-400'
            }`}
          >
            {saveStatus.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{saveStatus.message}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar Tabs - Horizontal on mobile, vertical on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-2 lg:sticky lg:top-24">
              {/* Mobile: Horizontal scroll */}
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible scrollbar-hide">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-shrink-0 lg:flex-shrink flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-left transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium text-sm sm:text-base">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-4 sm:p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <ProfileTab
                  personalInfo={personalInfo}
                  setPersonalInfo={setPersonalInfo}
                  careerFromAssessment={careerFromAssessment}
                  handleSavePersonalInfo={handleSavePersonalInfo}
                  enrollmentStatus={enrollmentStatus}
                  setEnrollmentStatus={setEnrollmentStatus}
                  handleSaveEnrollmentStatus={handleSaveEnrollmentStatus}
                  loading={loading}
                />
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && <AppearanceTab />}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <NotificationsTab
                  notificationPrefs={notificationPrefs}
                  setNotificationPrefs={setNotificationPrefs}
                  handleSaveNotificationPreferences={handleSaveNotificationPreferences}
                  loading={loading}
                />
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <PrivacyTab
                  privacySettings={privacySettings}
                  setPrivacySettings={setPrivacySettings}
                  handleSavePrivacySettings={handleSavePrivacySettings}
                  loading={loading}
                />
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <AccountTab
                  accountSettings={accountSettings}
                  setAccountSettings={setAccountSettings}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  passwordValidation={passwordValidation}
                  handleUpdatePassword={handleUpdatePassword}
                  handleExportData={handleExportData}
                  setShowDeleteModal={setShowDeleteModal}
                  loading={loading}
                />
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteModal
          deletePassword={deletePassword}
          setDeletePassword={setDeletePassword}
          setShowDeleteModal={setShowDeleteModal}
          handleDeleteAccount={handleDeleteAccount}
          loading={loading}
        />
      )}

      <DashboardFooter />
    </div>
  );
}

// Profile Tab Component
function ProfileTab({ personalInfo, setPersonalInfo, careerFromAssessment, handleSavePersonalInfo, enrollmentStatus, setEnrollmentStatus, handleSaveEnrollmentStatus, loading }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Profile Information</h2>
        <p className="text-sm sm:text-base text-gray-400">Update your personal details and complete your profile</p>
      </div>

      {/* Profile Completion Tracker */}
      <ProfileCompletionTracker userData={{
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        course: personalInfo.course,
        yearLevel: personalInfo.yearLevel,
        phoneNumber: personalInfo.phoneNumber,
        dateOfBirth: personalInfo.dateOfBirth,
        enrollmentStatus: enrollmentStatus.status
      }} />

      {/* Enrollment Status Section */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <GraduationCap className="text-blue-400" size={20} />
          Enrollment Status
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What is your status?
            </label>
            <select
              value={enrollmentStatus.status}
              onChange={(e) => {
                const status = e.target.value;
                setEnrollmentStatus({
                  ...enrollmentStatus,
                  status,
                  yearLevel: status !== "current_pwc" ? "" : enrollmentStatus.yearLevel,
                });
              }}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="current_pwc">Current PWC Student</option>
              <option value="pwc_alumni">PWC Alumni (Graduated)</option>
              <option value="external">External User (Other school/Self-learner)</option>
            </select>
          </div>

          {/* Year Level for Current Students */}
          {enrollmentStatus.status === "current_pwc" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Year Level
              </label>
              <select
                value={enrollmentStatus.yearLevel}
                onChange={(e) => setEnrollmentStatus({ ...enrollmentStatus, yearLevel: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Select your year level</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          )}

          {/* Graduation Year for Alumni */}
          {enrollmentStatus.status === "pwc_alumni" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Graduation Year (Optional)
              </label>
              <input
                type="number"
                value={enrollmentStatus.graduationYear}
                onChange={(e) => setEnrollmentStatus({ ...enrollmentStatus, graduationYear: e.target.value })}
                placeholder="e.g., 2023"
                min="1990"
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          )}

          <button
            onClick={handleSaveEnrollmentStatus}
            disabled={loading}
            className="w-full py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Enrollment Status"}
          </button>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
          <input
            type="text"
            value={personalInfo.firstName}
            onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
          <input
            type="text"
            value={personalInfo.lastName}
            onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
          <input
            type="tel"
            value={personalInfo.phoneNumber}
            onChange={(e) => setPersonalInfo({...personalInfo, phoneNumber: e.target.value})}
            placeholder="+63 XXX XXX XXXX"
            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Course</label>
          <select
            value={personalInfo.course}
            onChange={(e) => setPersonalInfo({...personalInfo, course: e.target.value})}
            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
          >
            <option value="">Select Course</option>
            <option value="BS Information Systems">BS Information Systems</option>
            <option value="BS Computer Science">BS Computer Science</option>
            <option value="BS Information Technology">BS Information Technology</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Year Level</label>
          <select
            value={personalInfo.yearLevel}
            onChange={(e) => setPersonalInfo({...personalInfo, yearLevel: e.target.value})}
            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
          >
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
          <input
            type="date"
            value={personalInfo.dateOfBirth}
            onChange={(e) => setPersonalInfo({...personalInfo, dateOfBirth: e.target.value})}
            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
          <textarea
            value={personalInfo.address}
            onChange={(e) => setPersonalInfo({...personalInfo, address: e.target.value})}
            rows={3}
            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition resize-none"
            placeholder="Enter your complete address"
          />
        </div>
        </div>

        {/* Save Personal Info Button */}
        <div className="flex justify-end pt-6 border-t border-gray-700/40 mt-6">
          <button
            onClick={handleSavePersonalInfo}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Career from Assessment (Read-only) */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Career Match Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Career Category</label>
            <input
              type="text"
              value={careerFromAssessment.careerCategory}
              disabled
              className="w-full px-4 py-2.5 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Based on assessment results</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Recommended Career Role</label>
            <input
              type="text"
              value={careerFromAssessment.selectedCareerJobRole}
              disabled
              className="w-full px-4 py-2.5 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Match Score: {careerFromAssessment.selectedCareerMatchScore}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Account Tab Component
function AccountTab({ accountSettings, setAccountSettings, showPassword, setShowPassword, passwordValidation, handleUpdatePassword, handleExportData, setShowDeleteModal, loading }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Account Security</h2>
        <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Manage your password and account data</p>
      </div>

      {/* Password Change Section */}
      <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Change Password</h3>
        
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-yellow-400 font-medium mb-2">Password Requirements</h4>
              <ul className="text-sm text-yellow-300/80 space-y-1">
                <li className={passwordValidation?.errors.minLength === false ? 'text-emerald-400' : ''}>
                  • At least 8 characters long
                </li>
                <li className={passwordValidation?.errors.hasUpperCase === false ? 'text-emerald-400' : ''}>
                  • Include uppercase and lowercase letters
                </li>
                <li className={passwordValidation?.errors.hasNumber === false ? 'text-emerald-400' : ''}>
                  • Include at least one number
                </li>
                <li className={passwordValidation?.errors.hasSpecialChar === false ? 'text-emerald-400' : ''}>
                  • Include at least one special character
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={accountSettings.currentPassword}
                onChange={(e) => setAccountSettings({...accountSettings, currentPassword: e.target.value})}
                className="w-full px-4 py-2.5 pr-12 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={accountSettings.newPassword}
              onChange={(e) => setAccountSettings({...accountSettings, newPassword: e.target.value})}
              className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={accountSettings.confirmPassword}
              onChange={(e) => setAccountSettings({...accountSettings, confirmPassword: e.target.value})}
              className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleUpdatePassword}
            disabled={loading || !accountSettings.currentPassword || !accountSettings.newPassword || !accountSettings.confirmPassword}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Lock size={18} />
                Update Password
              </>
            )}
          </button>
        </div>
      </div>

      {/* Data Export Section */}
      <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <Download size={18} sm:size={20} className="text-primary-400" />
          Export Your Data
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm mb-4">
          Download all your data including profile information, assessment results, and progress tracking.
        </p>
        <button
          onClick={handleExportData}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader size={16} className="animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download size={16} />
              Download Data (JSON)
            </>
          )}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/10 rounded-xl border border-red-500/30 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
        <p className="text-gray-400 text-xs sm:text-sm mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 font-medium rounded-lg transition-all"
        >
          <Trash2 size={16} />
          Delete Account
        </button>
      </div>
    </div>
  );
}

// Notifications Tab Component
function NotificationsTab({ notificationPrefs, setNotificationPrefs, handleSaveNotificationPreferences, loading }) {
  const togglePref = (key) => {
    setNotificationPrefs({ ...notificationPrefs, [key]: !notificationPrefs[key] });
  };

  const toggleAll = (enabled) => {
    const updatedPrefs = {};
    Object.keys(notificationPrefs).forEach(key => {
      updatedPrefs[key] = enabled;
    });
    setNotificationPrefs(updatedPrefs);
  };

  const notificationCategories = [
    {
      title: 'Learning & Progress',
      icon: '📚',
      items: [
        { key: 'assessmentReminders', label: 'Assessment Reminders', description: 'Get notified to start your assessments and continue your learning journey' },
        { key: 'progressUpdates', label: 'Progress Updates', description: 'Important updates about your learning progress and achievements' },
        { key: 'milestones', label: 'Achievement Milestones', description: 'Celebrate when you reach important milestones and complete goals' }
      ]
    },
    {
      title: 'Career Guidance',
      icon: '🎯',
      items: [
        { key: 'careerMatches', label: 'Career Matches', description: 'Receive notifications about personalized career recommendations' },
        { key: 'newModules', label: 'New Learning Modules', description: 'Get notified when new career-related modules become available' },
        { key: 'recommendations', label: 'Personalized Recommendations', description: 'Tailored suggestions to improve your skills and career readiness' }
      ]
    },
    {
      title: 'System Notifications',
      icon: '🔔',
      items: [
        { key: 'maintenance', label: 'System Maintenance', description: 'Important alerts about scheduled system maintenance' },
        { key: 'security', label: 'Security Alerts', description: 'Critical security notifications and account updates (Always Enabled)', locked: true }
      ]
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Notification Preferences</h2>
        <p className="text-sm sm:text-base text-gray-400">Manage your essential notifications. We'll only send you important updates to keep you on track.</p>
      </div>

      {notificationCategories.map((category, idx) => (
        <div key={idx} className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{category.icon}</span>
            <span className="text-sm sm:text-base">{category.title}</span>
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {category.items.map((item) => (
              <div key={item.key} className="flex items-start gap-3 py-2 sm:py-3 border-b border-gray-700/30 last:border-0">
                <div className="flex-1 min-w-0">
                  <label htmlFor={item.key} className={`text-white font-medium text-sm sm:text-base ${item.locked ? 'cursor-default' : 'cursor-pointer'}`}>
                    {item.label}
                  </label>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1 leading-relaxed">{item.description}</p>
                </div>
                <button
                  id={item.key}
                  onClick={() => !item.locked && togglePref(item.key)}
                  disabled={item.locked}
                  className={`flex-shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    item.locked || notificationPrefs[item.key] ? 'bg-primary-500' : 'bg-gray-600'
                  } ${item.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      item.locked || notificationPrefs[item.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSaveNotificationPreferences}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Appearance Tab Component
function AppearanceTab() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-2">Appearance Settings</h2>
        <p className="text-sm sm:text-base text-gray-400 dark:text-gray-400 light:text-gray-600">
          Customize how DevPath looks for you. Choose between light and dark themes.
        </p>
      </div>

      {/* Theme Selector */}
      <div className="bg-gray-800/30 dark:bg-gray-800/30 light:bg-white rounded-xl border border-gray-700/50 dark:border-gray-700/50 light:border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-white dark:text-white light:text-gray-900 mb-1 flex items-center gap-2">
              <Palette size={20} className="text-primary-400" />
              Color Theme
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
              Select your preferred color scheme
            </p>
          </div>
        </div>

        {/* Theme Toggle Slider */}
        <div className="space-y-4">
          {/* Current Theme Display */}
          <div className="flex items-center justify-between p-4 bg-primary-500/10 dark:bg-primary-500/10 light:bg-primary-50 rounded-xl border border-primary-500/30 dark:border-primary-500/30 light:border-primary-200">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <div className="p-2 bg-gray-800 dark:bg-gray-800 light:bg-gray-100 rounded-lg">
                  <Moon size={20} className="text-primary-400" />
                </div>
              ) : (
                <div className="p-2 bg-white dark:bg-white light:bg-gray-50 rounded-lg">
                  <Sun size={20} className="text-yellow-500" />
                </div>
              )}
              <div>
                <p className="font-semibold text-white dark:text-white light:text-gray-900">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600">
                  {theme === 'dark' ? 'Easy on the eyes' : 'Bright and clean'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400 dark:text-gray-400 light:text-gray-600">Active</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            </div>
          </div>

          {/* Toggle Switch - Responsive Layout */}
          <div className="p-4 sm:p-6 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 rounded-xl">
            {/* Mobile: Stacked Layout */}
            <div className="flex flex-col sm:hidden gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl transition-colors ${theme === 'dark' ? 'bg-primary-500/20 text-primary-400' : 'bg-gray-700/50 text-gray-500'}`}>
                    <Moon size={20} />
                  </div>
                  <div className="text-sm font-medium">
                    <p className="text-white dark:text-white light:text-gray-900">Dark Mode</p>
                    <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600">Reduced eye strain</p>
                  </div>
                </div>
              </div>

              {/* Center Toggle */}
              <div className="flex justify-center">
                <button
                  onClick={toggleTheme}
                  className="relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgb(6 182 212)' : 'rgb(156 163 175)'
                  }}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                      theme === 'dark' ? 'translate-x-9' : 'translate-x-1'
                    }`}
                  >
                    {theme === 'dark' ? (
                      <Moon size={14} className="text-primary-400 m-auto mt-1" />
                    ) : (
                      <Sun size={14} className="text-yellow-500 m-auto mt-1" />
                    )}
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl transition-colors ${theme === 'light' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-700/50 text-gray-500'}`}>
                    <Sun size={20} />
                  </div>
                  <div className="text-sm font-medium">
                    <p className="text-white dark:text-white light:text-gray-900">Light Mode</p>
                    <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600">Bright interface</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: Horizontal Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-colors ${theme === 'dark' ? 'bg-primary-500/20 text-primary-400' : 'bg-gray-700/50 text-gray-500'}`}>
                  <Moon size={24} />
                </div>
                <div className="text-sm font-medium">
                  <p className="text-white dark:text-white light:text-gray-900">Dark Mode</p>
                  <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600">Reduced eye strain</p>
                </div>
              </div>

              {/* Animated Toggle */}
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgb(6 182 212)' : 'rgb(156 163 175)'
                }}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                    theme === 'dark' ? 'translate-x-9' : 'translate-x-1'
                  }`}
                >
                  {theme === 'dark' ? (
                    <Moon size={14} className="text-primary-400 m-auto mt-1" />
                  ) : (
                    <Sun size={14} className="text-yellow-500 m-auto mt-1" />
                  )}
                </span>
              </button>

              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-right">
                  <p className="text-white dark:text-white light:text-gray-900">Light Mode</p>
                  <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600">Bright interface</p>
                </div>
                <div className={`p-3 rounded-xl transition-colors ${theme === 'light' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-700/50 text-gray-500'}`}>
                  <Sun size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Theme Preview Cards - More Compact for Mobile */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
            {/* Dark Theme Preview */}
            <button
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`relative group overflow-hidden rounded-lg sm:rounded-xl border-2 transition-all ${
                theme === 'dark'
                  ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <Moon size={14} className="text-primary-400 sm:w-4 sm:h-4" />
                  {theme === 'dark' && (
                    <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold text-primary-400">
                      <CheckCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                      <span className="hidden sm:inline">Active</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="h-1.5 sm:h-2 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-1.5 sm:h-2 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-6 sm:h-8 bg-primary-500/20 rounded mt-2 sm:mt-3 flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs text-primary-400 font-medium">Dark</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Light Theme Preview */}
            <button
              onClick={() => theme !== 'light' && toggleTheme()}
              className={`relative group overflow-hidden rounded-lg sm:rounded-xl border-2 transition-all ${
                theme === 'light'
                  ? 'border-yellow-500 shadow-lg shadow-yellow-500/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <Sun size={14} className="text-yellow-500 sm:w-4 sm:h-4" />
                  {theme === 'light' && (
                    <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold text-yellow-600">
                      <CheckCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                      <span className="hidden sm:inline">Active</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="h-1.5 sm:h-2 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-1.5 sm:h-2 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-6 sm:h-8 bg-yellow-500/20 rounded mt-2 sm:mt-3 flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs text-yellow-700 font-medium">Light</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-500/10 dark:bg-blue-500/10 light:bg-blue-50 border border-blue-500/30 dark:border-blue-500/30 light:border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="p-2 bg-blue-500/20 dark:bg-blue-500/20 light:bg-blue-100 rounded-lg">
              <AlertCircle size={18} className="text-blue-400 dark:text-blue-400 light:text-blue-600" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-400 dark:text-blue-400 light:text-blue-700 mb-1">
              Your preference is automatically saved
            </h4>
            <p className="text-xs text-blue-300/80 dark:text-blue-300/80 light:text-blue-600">
              The theme you select will be applied immediately and remembered across all your sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Delete Modal Component
function DeleteModal({ deletePassword, setDeletePassword, setShowDeleteModal, handleDeleteAccount, loading }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <AlertCircle className="text-red-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">Delete Account</h3>
        </div>
        
        <p className="text-gray-400 mb-4">
          This action cannot be undone. All your data, progress, and assessments will be permanently deleted.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enter your password to confirm
          </label>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setDeletePassword('');
            }}
            className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAccount}
            disabled={loading || !deletePassword}
            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Privacy Tab Component
function PrivacyTab({ privacySettings, setPrivacySettings, handleSavePrivacySettings, loading }) {
  const toggleSetting = (key) => {
    setPrivacySettings({ ...privacySettings, [key]: !privacySettings[key] });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Privacy Settings</h2>
      <p className="text-gray-400 mb-6">Control who can see your profile and information</p>

      {/* Employer Visibility Section */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Eye className="text-blue-400" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Profile Visibility to Employers</h3>
            <p className="text-sm text-gray-300 mb-4">
              Allow verified employers to view your profile and contact you for job opportunities.
              Your profile will only be visible to employers who have been verified by DevPath administrators.
            </p>
            <button
              onClick={() => toggleSetting('profileVisibleToEmployers')}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all font-medium ${
                privacySettings.profileVisibleToEmployers
                  ? 'bg-green-500/20 border-2 border-green-500/50 text-green-400'
                  : 'bg-gray-800 border-2 border-gray-700 text-gray-400 hover:bg-gray-750'
              }`}
            >
              {privacySettings.profileVisibleToEmployers ? (
                <>
                  <CheckCircle size={20} />
                  Profile Visible to Employers
                </>
              ) : (
                <>
                  <EyeOff size={20} />
                  Profile Hidden from Employers
                </>
              )}
            </button>
          </div>
        </div>

        {privacySettings.profileVisibleToEmployers && (
          <div className="ml-16 border-t border-blue-500/30 pt-4">
            <p className="text-sm font-medium text-blue-300 mb-3">
              Choose what employers can see:
            </p>
            <div className="space-y-3">
              <PrivacyToggle
                label="Full Name"
                description="Show your full name (default: only initials visible until contact approval)"
                enabled={privacySettings.showFullNameToEmployers}
                onToggle={() => toggleSetting('showFullNameToEmployers')}
              />
              <PrivacyToggle
                label="Career Path & Recommendations"
                description="Show your predicted career path and match scores"
                enabled={privacySettings.showCareerPath}
                onToggle={() => toggleSetting('showCareerPath')}
              />
              <PrivacyToggle
                label="Skills & Competencies"
                description="Display your technical and soft skills"
                enabled={privacySettings.showSkills}
                onToggle={() => toggleSetting('showSkills')}
              />
              <PrivacyToggle
                label="Assessment Scores"
                description="Share your detailed assessment results"
                enabled={privacySettings.showAssessmentScores}
                onToggle={() => toggleSetting('showAssessmentScores')}
              />
              <PrivacyToggle
                label="Contact Information"
                description="Allow employers to see your email and phone number"
                enabled={privacySettings.showContactInfo}
                onToggle={() => toggleSetting('showContactInfo')}
              />
            </div>
          </div>
        )}
      </div>

      {/* Privacy Tips */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="text-primary-400" size={20} />
          Privacy Tips
        </h3>
        <ul className="space-y-3 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-primary-400 mt-1">•</span>
            <span>Only verified employers who have passed our verification process can view your profile</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400 mt-1">•</span>
            <span>You can turn off employer visibility at any time without affecting your learning progress</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400 mt-1">•</span>
            <span>Showing more information increases your chances of being discovered by employers</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400 mt-1">•</span>
            <span>Your personal information is never shared without your explicit consent</span>
          </li>
        </ul>
      </div>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button
          onClick={handleSavePrivacySettings}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Privacy Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Privacy Toggle Component
function PrivacyToggle({ label, description, enabled, onToggle }) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 bg-gray-900/50 rounded-lg">
      <div className="flex-1">
        <p className="text-white font-medium mb-1">{label}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-green-500' : 'bg-gray-700'
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            enabled ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}