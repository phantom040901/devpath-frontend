import { motion, AnimatePresence } from "framer-motion";
import { Mail, AlertCircle, X } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function PasswordResetConfirmModal({ isOpen, onClose, onConfirm, email }) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className={`relative max-w-md w-full rounded-2xl p-6 shadow-2xl ${
            theme === 'light'
              ? 'bg-white border border-gray-200'
              : 'bg-gray-900 border border-gray-700'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${
              theme === 'light'
                ? 'hover:bg-gray-100 text-gray-600'
                : 'hover:bg-gray-800 text-gray-400'
            }`}
          >
            <X size={20} />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${
              theme === 'light'
                ? 'bg-blue-100'
                : 'bg-blue-500/20'
            }`}>
              <Mail className={`${
                theme === 'light' ? 'text-blue-600' : 'text-blue-400'
              }`} size={32} />
            </div>
          </div>

          {/* Title */}
          <h2 className={`text-2xl font-bold text-center mb-2 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Reset Your Password?
          </h2>

          {/* Description */}
          <p className={`text-center mb-6 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            We'll send a password reset link to:
          </p>

          {/* Email Display */}
          <div className={`p-4 rounded-lg mb-6 text-center ${
            theme === 'light'
              ? 'bg-gray-50 border border-gray-200'
              : 'bg-gray-800/50 border border-gray-700'
          }`}>
            <p className={`font-semibold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {email}
            </p>
          </div>

          {/* Warning */}
          <div className={`flex items-start gap-3 p-4 rounded-lg mb-6 ${
            theme === 'light'
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-yellow-500/10 border border-yellow-500/30'
          }`}>
            <AlertCircle className={`flex-shrink-0 mt-0.5 ${
              theme === 'light' ? 'text-yellow-600' : 'text-yellow-500'
            }`} size={20} />
            <div>
              <p className={`text-sm font-medium mb-1 ${
                theme === 'light' ? 'text-yellow-800' : 'text-yellow-400'
              }`}>
                Important
              </p>
              <p className={`text-xs ${
                theme === 'light' ? 'text-yellow-700' : 'text-yellow-300/80'
              }`}>
                The reset link will expire in 1 hour. Check your spam folder if you don't see the email.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                theme === 'light'
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all shadow-lg ${
                theme === 'light'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
              }`}
            >
              Send Reset Link
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
