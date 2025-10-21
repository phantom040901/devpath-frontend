import { X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
                  <p className="text-green-100 text-sm">How we protect your data</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="text-gray-700 dark:text-gray-300 space-y-4">
              <p>
                Welcome to DevPath. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">1. Information We Collect</h3>
              <p>
                When you create an account on DevPath, we collect the following information:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Full name (first and last name)</li>
                <li>Email address</li>
                <li>Course and year level</li>
                <li>Assessment results and progress data</li>
                <li>Usage statistics and interaction patterns</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">2. How We Use Your Information</h3>
              <p>
                We use your personal information to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide personalized career recommendations</li>
                <li>Track your progress and assessment results</li>
                <li>Improve our services and user experience</li>
                <li>Send important updates and notifications</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">3. Data Security</h3>
              <p>
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All data is encrypted in transit and at rest</li>
                <li>Secure Firebase authentication and storage</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and monitoring</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">4. Data Sharing</h3>
              <p>
                We <strong>do not sell</strong> your personal information to third parties. We may share your data only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>With your educational institution (if applicable)</li>
                <li>When required by law or legal process</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With your explicit consent</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">5. Cookies and Tracking</h3>
              <p>
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Keep you logged in</li>
                <li>Remember your preferences</li>
                <li>Analyze platform usage</li>
                <li>Improve functionality</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">6. Your Rights</h3>
              <p>
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access your personal data</li>
                <li>Request data corrections or deletion</li>
                <li>Export your data</li>
                <li>Opt-out of non-essential communications</li>
                <li>Withdraw consent at any time</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">7. Data Retention</h3>
              <p>
                We retain your personal information for as long as your account is active or as needed to provide services. You may request account deletion at any time through your account settings.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">8. Children's Privacy</h3>
              <p>
                DevPath is designed for students in higher education. We do not knowingly collect information from children under 13 years of age.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">9. Changes to This Policy</h3>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any significant changes via email or platform notification.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">10. Contact Us</h3>
              <p>
                If you have questions about this Privacy Policy or how we handle your data, please contact us at:
              </p>
              <p className="ml-4">
                Email: <a href="mailto:privacy@devpath.com" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@devpath.com</a>
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-8 pt-4 border-t dark:border-gray-700">
                Last updated: October 2025
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t dark:border-gray-800 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              I Understand
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
