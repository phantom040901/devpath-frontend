import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Check, X, AlertTriangle } from "lucide-react";
import { auth } from "../lib/firebase";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { useTheme } from "../contexts/ThemeContext";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(true);
  const [invalidLink, setInvalidLink] = useState(false);

  const oobCode = searchParams.get("oobCode");

  // Password validation
  const passwordRequirements = {
    minLength: newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(newPassword),
    hasLowercase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  useEffect(() => {
    if (!oobCode) {
      setInvalidLink(true);
      setVerifyingCode(false);
      return;
    }

    // Verify the reset code
    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        setEmail(email);
        setVerifyingCode(false);
      })
      .catch((error) => {
        console.error("Invalid reset code:", error);
        setInvalidLink(true);
        setVerifyingCode(false);
      });
  }, [oobCode]);

  async function handleResetPassword(e) {
    e.preventDefault();

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
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (verifyingCode) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'light'
          ? 'bg-gradient-to-b from-gray-50 via-white to-gray-100'
          : 'bg-gradient-to-b from-primary-1400 via-primary-1500 to-black'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
            Verifying reset link...
          </p>
        </div>
      </div>
    );
  }

  if (invalidLink) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${
        theme === 'light'
          ? 'bg-gradient-to-b from-gray-50 via-white to-gray-100'
          : 'bg-gradient-to-b from-primary-1400 via-primary-1500 to-black'
      }`}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`max-w-md w-full rounded-2xl shadow-2xl p-8 text-center ${
            theme === 'light' ? 'bg-white' : 'bg-gray-900'
          }`}
        >
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            theme === 'light' ? 'bg-red-100' : 'bg-red-500/20'
          }`}>
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Invalid or Expired Link
          </h2>
          <p className={`mb-6 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-primary-500 to-emerald-400 hover:from-primary-600 hover:to-emerald-500 text-white rounded-xl py-3 font-semibold transition"
          >
            Go to Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${
        theme === 'light'
          ? 'bg-gradient-to-b from-gray-50 via-white to-gray-100'
          : 'bg-gradient-to-b from-primary-1400 via-primary-1500 to-black'
      }`}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`max-w-md w-full rounded-2xl shadow-2xl p-8 text-center ${
            theme === 'light' ? 'bg-white' : 'bg-gray-900'
          }`}
        >
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            theme === 'light' ? 'bg-green-100' : 'bg-green-500/20'
          }`}>
            <Check className="text-green-500" size={40} />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Password Reset Successful! 🎉
          </h2>
          <p className={`mb-6 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Your password has been changed successfully. You can now log in with your new password.
          </p>
          <p className={`text-sm ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            Redirecting to home page in 3 seconds...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${
      theme === 'light'
        ? 'bg-gradient-to-b from-gray-50 via-white to-gray-100'
        : 'bg-gradient-to-b from-primary-1400 via-primary-1500 to-black'
    }`}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`max-w-md w-full rounded-2xl shadow-2xl overflow-hidden ${
          theme === 'light' ? 'bg-white' : 'bg-gray-900'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-emerald-400 p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Reset Your Password</h1>
          <p className="text-white/90 text-sm">for {email}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="p-6 space-y-4">
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
                required
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
                required
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
                  {met ? (
                    <Check size={14} className="text-green-500" />
                  ) : (
                    <X size={14} className="text-gray-400" />
                  )}
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !isPasswordValid || newPassword !== confirmPassword}
            className="w-full bg-gradient-to-r from-primary-500 to-emerald-400 hover:from-primary-600 hover:to-emerald-500 text-white rounded-xl py-3 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </button>

          {/* Back to Login */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className={`w-full rounded-xl py-2 text-sm font-medium transition ${
              theme === 'light'
                ? 'text-primary-600 hover:bg-gray-100'
                : 'text-primary-400 hover:bg-gray-800'
            }`}
          >
            Back to Login
          </button>
        </form>
      </motion.div>
    </div>
  );
}
