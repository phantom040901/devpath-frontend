import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, AlertTriangle } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function PasswordResetSuccessModal({ isOpen, onClose, email }) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
        onClick={onClose}
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
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-lg transition z-10 ${
              theme === 'light'
                ? 'hover:bg-gray-100 text-gray-600'
                : 'hover:bg-gray-800 text-gray-400'
            }`}
          >
            <X size={20} />
          </button>

          <div className="p-6 sm:p-8">
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                theme === 'light' ? 'bg-green-100' : 'bg-green-500/20'
              }`}>
                <Mail className="text-green-500" size={32} />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Password Reset Email Sent! ✅
              </h2>
              <p className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                We've sent a password reset link to:
              </p>
              <p className={`text-sm font-semibold mt-1 ${
                theme === 'light' ? 'text-primary-600' : 'text-primary-400'
              }`}>
                {email}
              </p>
            </div>

            {/* Important Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className={`text-sm font-semibold mb-2 ${
                    theme === 'light' ? 'text-yellow-700' : 'text-yellow-400'
                  }`}>
                    ⚠️ IMPORTANT: Check Your SPAM/JUNK Folder!
                  </p>
                  <p className={`text-xs ${
                    theme === 'light' ? 'text-yellow-600' : 'text-yellow-300'
                  }`}>
                    Password reset emails often go to spam. If you don't see it in your inbox, please check your spam/junk folder.
                  </p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className={`p-4 rounded-lg mb-6 ${
              theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
            }`}>
              <p className={`text-xs font-semibold mb-3 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                📬 What to do next:
              </p>
              <ol className={`text-xs space-y-2 list-decimal list-inside ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <li>Check your inbox and <strong>spam/junk folder</strong></li>
                <li>Look for email from: <code className={`text-xs px-1 py-0.5 rounded ${
                  theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-gray-300'
                }`}>noreply@devpath-capstone.firebaseapp.com</code></li>
                <li>Click the password reset link in the email</li>
                <li>Set your new password on the secure Firebase page</li>
                <li>If found in spam, mark it as "Not Spam" for future emails</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-primary-500 to-emerald-400 hover:from-primary-600 hover:to-emerald-500 text-white rounded-xl py-3 font-semibold transition"
              >
                Got it!
              </button>
              <p className={`text-center text-xs ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Didn't receive the email? Wait a few minutes and check spam folder.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
