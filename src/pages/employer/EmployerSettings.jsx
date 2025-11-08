// src/pages/employer/EmployerSettings.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployer } from "../../contexts/EmployerContext";
import { motion } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  Users,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { db } from "../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function EmployerSettings() {
  const { employer, refreshEmployerData } = useEmployer();
  const navigate = useNavigate();

  // Profile Form State
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    companyWebsite: "",
    contactPerson: "",
    contactPhone: "",
    email: "",
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!employer) {
      navigate("/employer/login");
      return;
    }

    // Initialize form with employer data
    setFormData({
      companyName: employer.companyName || "",
      industry: employer.industry || "",
      companySize: employer.companySize || "",
      companyWebsite: employer.companyWebsite || "",
      contactPerson: employer.contactPerson || "",
      contactPhone: employer.contactPhone || "",
      email: employer.email || "",
    });
  }, [employer, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const employerRef = doc(db, "employers", employer.uid);
      await updateDoc(employerRef, {
        companyName: formData.companyName,
        industry: formData.industry,
        companySize: formData.companySize,
        companyWebsite: formData.companyWebsite,
        contactPerson: formData.contactPerson,
        contactPhone: formData.contactPhone,
        updatedAt: new Date().toISOString(),
      });

      await refreshEmployerData();
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: `Error: ${error.message}` });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMessage({ type: "", text: "" });

    // Validation
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "New password must be at least 6 characters" });
      setSavingPassword(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" });
      setSavingPassword(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, passwordData.newPassword);

      setPasswordMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.code === "auth/wrong-password") {
        setPasswordMessage({ type: "error", text: "Current password is incorrect" });
      } else if (error.code === "auth/weak-password") {
        setPasswordMessage({ type: "error", text: "Password is too weak" });
      } else {
        setPasswordMessage({ type: "error", text: `Error: ${error.message}` });
      }
    } finally {
      setSavingPassword(false);
      setTimeout(() => setPasswordMessage({ type: "", text: "" }), 5000);
    }
  };

  if (!employer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/70 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/employer/dashboard")}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Company Settings</h1>
              <p className="text-sm text-gray-400">Manage your company profile and preferences</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Company Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Building2 className="text-blue-400" size={24} />
            Company Profile
          </h2>

          <form onSubmit={handleSaveProfile}>
            <div className="space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                  <Mail className="absolute right-3 top-2.5 text-gray-500" size={20} />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Industry <span className="text-red-400">*</span>
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Industry</option>
                  <option value="Software Development">Software Development</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Telecommunications">Telecommunications</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Finance/Fintech">Finance/Fintech</option>
                  <option value="Healthcare IT">Healthcare IT</option>
                  <option value="Education Technology">Education Technology</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Company Size */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Size <span className="text-red-400">*</span>
                </label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Size</option>
                  <option value="1-10 employees">1-10 employees</option>
                  <option value="11-50 employees">11-50 employees</option>
                  <option value="51-200 employees">51-200 employees</option>
                  <option value="201-500 employees">201-500 employees</option>
                  <option value="501-1000 employees">501-1000 employees</option>
                  <option value="1000+ employees">1000+ employees</option>
                </select>
              </div>

              {/* Company Website */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Website
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    placeholder="https://www.example.com"
                    className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <Globe className="absolute left-3 top-2.5 text-gray-500" size={20} />
                </div>
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contact Person <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contact Phone <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    required
                    placeholder="+63 XXX XXX XXXX"
                    className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <Phone className="absolute left-3 top-2.5 text-gray-500" size={20} />
                </div>
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-green-500/20 border border-green-500/40 text-green-400"
                    : "bg-red-500/20 border border-red-500/40 text-red-400"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span>{message.text}</span>
              </motion.div>
            )}

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Profile
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Change Password Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/70 border border-gray-800 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Lock className="text-yellow-400" size={24} />
            Change Password
          </h2>

          <form onSubmit={handleChangePassword}>
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300"
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Message */}
            {passwordMessage.text && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                  passwordMessage.type === "success"
                    ? "bg-green-500/20 border border-green-500/40 text-green-400"
                    : "bg-red-500/20 border border-red-500/40 text-red-400"
                }`}
              >
                {passwordMessage.type === "success" ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span>{passwordMessage.text}</span>
              </motion.div>
            )}

            {/* Change Password Button */}
            <button
              type="submit"
              disabled={savingPassword}
              className="mt-6 w-full py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {savingPassword ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Changing Password...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Change Password
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
