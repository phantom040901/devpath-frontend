import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "../../AuthContext";
import { useTheme } from "../../../contexts/ThemeContext";

export default function PasswordResetModal({ isOpen, onClose, email }) {
  const { theme } = useTheme();
  const { resetPassword } = useAuth();

  const [step, setStep] = useState(1); // 1: Enter code, 2: Set new password, 3: Success
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password validation
  const passwordRequirements = {
    minLength: newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(newPassword),
    hasLowercase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  async function handleVerifyCode() {
    if (!code || code.length !== 6) {
      setError("Please enter the 6-digit code sent to your email.");
      return;
    }

    setError("");

    // Verify code from localStorage
    const resetDataStr = localStorage.getItem('passwordResetData');
    if (!resetDataStr) {
      setError("Reset session expired. Please request a new password reset.");
      return;
    }

    const resetData = JSON.parse(resetDataStr);

    // Check if expired
    if (Date.now() > resetData.expiry) {
      localStorage.removeItem('passwordResetData');
      setError("Reset code has expired. Please request a new one.");
      return;
    }

    // Check if email matches
    if (resetData.email !== email) {
      setError("Email mismatch. Please try again.");
      return;
    }

    // Verify code
    if (resetData.code !== code) {
      setError("Invalid code. Please check your email and try again.");
      return;
    }

    // Code is valid, move to next step
    setStep(2);
    setError("");
  }

  async function handleResetPassword() {
    if (!isPasswordValid) {
      setError("Password does not meet all requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Get verification code from localStorage
      const resetDataStr = localStorage.getItem('passwordResetData');
      if (!resetDataStr) {
        setError("Reset session expired. Please request a new password reset.");
        setIsLoading(false);
        return;
      }

      const resetData = JSON.parse(resetDataStr);

      // Call Firebase Cloud Function to reset password
      const { functions } = await import("../../../lib/firebase");
      const { httpsCallable } = await import("firebase/functions");

      const resetUserPassword = httpsCallable(functions, 'resetUserPassword');

      console.log("🔐 Calling Cloud Function to reset password...");
      const result = await resetUserPassword({
        email: email,
        verificationCode: resetData.code,
        newPassword: newPassword,
      });

      console.log("✅ Password reset successfully:", result.data);

      // Clean up localStorage
      localStorage.removeItem('passwordResetData');

      setStep(3);
    } catch (err) {
      console.error("❌ Password reset error:", err);

      if (err.code === 'functions/not-found') {
        setError("No user found with this email address.");
      } else if (err.code === 'functions/invalid-argument') {
        setError(err.message || "Password does not meet requirements.");
      } else {
        setError(err.message || "Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendCode() {
    setIsLoading(true);
    setError("");

    try {
      await resetPassword(email);
      setError("");
      alert("A new code has been sent to your email!");
    } catch (err) {
      setError(err.message || "Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setStep(1);
    localStorage.removeItem('passwordResetData');
    onClose();
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${
            theme === 'light' ? 'bg-white' : 'bg-gray-900'
          }`}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className={`absolute top-4 right-4 p-2 rounded-lg transition z-10 ${
              theme === 'light'
                ? 'hover:bg-gray-100 text-gray-600'
                : 'hover:bg-gray-800 text-gray-400'
            }`}
          >
            <X size={20} />
          </button>

          <div className="p-6 sm:p-8">
            {/* Step 1: Verify Code */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    theme === 'light' ? 'bg-primary-100' : 'bg-primary-500/20'
                  }`}>
                    <Mail className="text-primary-500" size={32} />
                  </div>
                  <h2 className={`text-2xl font-bold mb-2 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    Enter Reset Code
                  </h2>
                  <p className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    We've sent a 6-digit code to <strong>{email}</strong>
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className={`w-full text-center text-2xl font-bold tracking-widest rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-gray-800 text-white'
                    }`}
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleVerifyCode}
                    disabled={isLoading || code.length !== 6}
                    className="w-full bg-gradient-to-r from-primary-500 to-emerald-400 hover:from-primary-600 hover:to-emerald-500 text-white rounded-xl py-3 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Verifying..." : "Verify Code"}
                  </button>

                  <button
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className={`w-full rounded-xl py-2 text-sm font-medium transition ${
                      theme === 'light'
                        ? 'text-primary-600 hover:bg-gray-100'
                        : 'text-primary-400 hover:bg-gray-800'
                    } disabled:opacity-50`}
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Set New Password */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    theme === 'light' ? 'bg-primary-100' : 'bg-primary-500/20'
                  }`}>
                    <Lock className="text-primary-500" size={32} />
                  </div>
                  <h2 className={`text-2xl font-bold mb-2 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    Set New Password
                  </h2>
                  <p className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Choose a strong password for your account
                  </p>
                </div>

                <div className="space-y-4">
                  {/* New Password */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className={`w-full rounded-xl px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-primary-500 ${
                          theme === 'light'
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-gray-800 text-white'
                        }`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className={`w-full rounded-xl px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-primary-500 ${
                          theme === 'light'
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-gray-800 text-white'
                        }`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className={`p-3 rounded-lg ${
                    theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
                  }`}>
                    <p className={`text-xs font-medium mb-2 ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      Password must contain:
                    </p>
                    <div className="space-y-1">
                      {Object.entries({
                        'At least 8 characters': passwordRequirements.minLength,
                        'One uppercase letter': passwordRequirements.hasUppercase,
                        'One lowercase letter': passwordRequirements.hasLowercase,
                        'One number': passwordRequirements.hasNumber,
                      }).map(([label, met]) => (
                        <div key={label} className="flex items-center gap-2">
                          <Check
                            size={14}
                            className={met ? 'text-green-500' : 'text-gray-400'}
                          />
                          <span className={`text-xs ${
                            met
                              ? 'text-green-500'
                              : theme === 'light'
                              ? 'text-gray-600'
                              : 'text-gray-400'
                          }`}>
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleResetPassword}
                  disabled={isLoading || !isPasswordValid || newPassword !== confirmPassword}
                  className="w-full bg-gradient-to-r from-primary-500 to-emerald-400 hover:from-primary-600 hover:to-emerald-500 text-white rounded-xl py-3 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </button>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="space-y-6 text-center py-8">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${
                  theme === 'light' ? 'bg-green-100' : 'bg-green-500/20'
                }`}>
                  <Check className="text-green-500" size={40} />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    Password Reset Successfully!
                  </h2>
                  <p className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Your password has been changed successfully for <strong>{email}</strong>.
                    You can now log in with your new password.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full bg-gradient-to-r from-primary-500 to-emerald-400 hover:from-primary-600 hover:to-emerald-500 text-white rounded-xl py-3 font-semibold transition"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
