// src/pages/admin/SystemSettings.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminNav from "../../components/admin/AdminNav";
import { useAuth } from "../../components/AuthContext";
import {
  Settings,
  Save,
  Clock,
  Mail,
  Shield,
  Database,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  getSystemSettings,
  updateSystemSettings,
  validateSettings,
} from "../../services/systemSettingsService";

export default function SystemSettings() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "DevPath",
    siteDescription: "Career Guidance System",
    maintenanceMode: false,

    // Assessment Settings
    defaultTimeLimit: 30,
    allowRetakes: true,
    maxRetakes: 3,
    showCorrectAnswers: false,

    // Email Settings
    emailNotifications: true,
    adminEmail: "admin@devpath.com",
    studentWelcomeEmail: true,
    assessmentCompletionEmail: true,

    // Security Settings
    requireEmailVerification: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,

    // Data Settings
    dataRetentionDays: 365,
    autoBackup: true,
    backupFrequency: "daily",
  });

  // Load settings from Firebase on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await getSystemSettings();

      if (result.success && result.data) {
        setSettings(result.data);
      } else {
        showNotification("Unable to load settings. Using defaults.", "error");
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      showNotification("Failed to load settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Validate settings first
      const validation = validateSettings(settings);

      if (!validation.isValid) {
        showNotification(`Validation error: ${validation.errors[0]}`, "error");
        setSaving(false);
        return;
      }

      // Save to Firebase
      const result = await updateSystemSettings(settings, user?.email || 'admin');

      if (result.success) {
        showNotification("Settings saved successfully!", "success");
      } else {
        showNotification(`Failed to save: ${result.error}`, "error");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      showNotification("An error occurred while saving", "error");
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <AdminNav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
            <p className="text-gray-400">
              Configure system-wide preferences and options
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                : "bg-red-500/20 border-red-500/40 text-red-300"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {notification.message}
          </motion.div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* General Settings */}
          <SettingsSection
            icon={<Settings className="text-blue-400" size={24} />}
            title="General Settings"
          >
            <SettingField
              label="Site Name"
              value={settings.siteName}
              onChange={(e) => handleChange("siteName", e.target.value)}
              type="text"
            />
            <SettingField
              label="Site Description"
              value={settings.siteDescription}
              onChange={(e) => handleChange("siteDescription", e.target.value)}
              type="text"
            />
            <SettingToggle
              label="Maintenance Mode"
              description="Temporarily disable student access"
              checked={settings.maintenanceMode}
              onChange={(checked) => handleChange("maintenanceMode", checked)}
            />
          </SettingsSection>

          {/* Assessment Settings */}
          <SettingsSection
            icon={<Clock className="text-purple-400" size={24} />}
            title="Assessment Settings"
          >
            <SettingField
              label="Default Time Limit (minutes)"
              value={settings.defaultTimeLimit}
              onChange={(e) =>
                handleChange("defaultTimeLimit", parseInt(e.target.value))
              }
              type="number"
              min="1"
            />
            <SettingToggle
              label="Allow Retakes"
              description="Students can retake assessments"
              checked={settings.allowRetakes}
              onChange={(checked) => handleChange("allowRetakes", checked)}
            />
            {settings.allowRetakes && (
              <SettingField
                label="Maximum Retakes"
                value={settings.maxRetakes}
                onChange={(e) =>
                  handleChange("maxRetakes", parseInt(e.target.value))
                }
                type="number"
                min="1"
                max="10"
              />
            )}
            <SettingToggle
              label="Show Correct Answers"
              description="Display correct answers after submission"
              checked={settings.showCorrectAnswers}
              onChange={(checked) => handleChange("showCorrectAnswers", checked)}
            />
          </SettingsSection>

          {/* Email Settings */}
          <SettingsSection
            icon={<Mail className="text-emerald-400" size={24} />}
            title="Email Settings"
          >
            <SettingToggle
              label="Email Notifications"
              description="Enable system email notifications"
              checked={settings.emailNotifications}
              onChange={(checked) => handleChange("emailNotifications", checked)}
            />
            <SettingField
              label="Admin Email"
              value={settings.adminEmail}
              onChange={(e) => handleChange("adminEmail", e.target.value)}
              type="email"
            />
            <SettingToggle
              label="Welcome Email"
              description="Send email when students register"
              checked={settings.studentWelcomeEmail}
              onChange={(checked) =>
                handleChange("studentWelcomeEmail", checked)
              }
              disabled={!settings.emailNotifications}
            />
            <SettingToggle
              label="Assessment Completion Email"
              description="Notify students when they complete assessments"
              checked={settings.assessmentCompletionEmail}
              onChange={(checked) =>
                handleChange("assessmentCompletionEmail", checked)
              }
              disabled={!settings.emailNotifications}
            />
          </SettingsSection>

          {/* Security Settings */}
          <SettingsSection
            icon={<Shield className="text-yellow-400" size={24} />}
            title="Security Settings"
          >
            <SettingToggle
              label="Email Verification Required"
              description="Students must verify email before accessing system"
              checked={settings.requireEmailVerification}
              onChange={(checked) =>
                handleChange("requireEmailVerification", checked)
              }
            />
            <SettingField
              label="Session Timeout (minutes)"
              value={settings.sessionTimeout}
              onChange={(e) =>
                handleChange("sessionTimeout", parseInt(e.target.value))
              }
              type="number"
              min="5"
              max="1440"
            />
            <SettingField
              label="Max Login Attempts"
              value={settings.maxLoginAttempts}
              onChange={(e) =>
                handleChange("maxLoginAttempts", parseInt(e.target.value))
              }
              type="number"
              min="3"
              max="10"
            />
          </SettingsSection>

          {/* Data Settings */}
          <SettingsSection
            icon={<Database className="text-red-400" size={24} />}
            title="Data Management"
          >
            <SettingField
              label="Data Retention (days)"
              value={settings.dataRetentionDays}
              onChange={(e) =>
                handleChange("dataRetentionDays", parseInt(e.target.value))
              }
              type="number"
              min="30"
              description="How long to keep student data"
            />
            <SettingToggle
              label="Auto Backup"
              description="Automatically backup database"
              checked={settings.autoBackup}
              onChange={(checked) => handleChange("autoBackup", checked)}
            />
            {settings.autoBackup && (
              <div className="ml-8">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Backup Frequency
                </label>
                <select
                  value={settings.backupFrequency}
                  onChange={(e) =>
                    handleChange("backupFrequency", e.target.value)
                  }
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary-500 transition-colors"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
          </SettingsSection>
        </div>

        {/* Save Button (Bottom) */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save All Changes
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

// Settings Section Component
function SettingsSection({ icon, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
        {icon}
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="space-y-6">{children}</div>
    </motion.div>
  );
}

// Setting Field Component
function SettingField({ label, value, onChange, type = "text", description, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary-500 transition-colors"
        {...props}
      />
      {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
    </div>
  );
}

// Setting Toggle Component
function SettingToggle({ label, description, checked, onChange, disabled = false }) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <label className="block text-sm font-medium text-white mb-1">{label}</label>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
          checked ? "bg-primary-500" : "bg-gray-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
