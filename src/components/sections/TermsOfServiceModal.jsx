import { X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TermsOfServiceModal({ isOpen, onClose }) {
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
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Terms of Service</h2>
                  <p className="text-purple-100 text-sm">Our platform guidelines</p>
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
                Welcome to DevPath. By creating an account and using our platform, you agree to be bound by these Terms and Conditions.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">1. Acceptance of Terms</h3>
              <p>
                By registering for DevPath and using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">2. User Accounts</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">3. Educational Use</h3>
              <p>
                DevPath is designed for educational purposes to support students in their development journey. Users must be enrolled in an accredited educational institution to use the platform.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">4. Privacy & Data Protection</h3>
              <p>
                We take your privacy seriously. Your personal information, including your name, email, course, and year level, will be collected and stored securely. We will never share your information with third parties without your explicit consent.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">5. User Conduct</h3>
              <p>
                You agree not to use DevPath for any unlawful purposes or in any way that could damage, disable, or impair the platform. You will not:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Upload malicious code or viruses</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Share your account credentials with others</li>
                <li>Use automated bots or scripts</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">6. Intellectual Property</h3>
              <p>
                All content, features, and functionality on DevPath are owned by us and are protected by copyright, trademark, and other intellectual property laws. You may not:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Reverse engineer or decompile the platform</li>
                <li>Remove copyright or proprietary notices</li>
                <li>Use our branding without authorization</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">7. Service Modifications</h3>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of DevPath at any time. We will provide notice of significant changes when possible. We may also update these Terms periodically, and your continued use constitutes acceptance of those changes.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">8. Limitation of Liability</h3>
              <p>
                DevPath is provided "as is" without warranties of any kind, either express or implied. We are not liable for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of data or business interruption</li>
                <li>Accuracy of career recommendations</li>
                <li>Third-party content or services</li>
                <li>Unauthorized access to your account</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">9. Account Termination</h3>
              <p>
                We reserve the right to terminate or suspend your account at any time if you violate these Terms. You may also delete your account at any time through your account settings.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">10. Disclaimer</h3>
              <p>
                Career recommendations provided by DevPath are based on assessment results and AI analysis. They should be used as guidance only and do not guarantee employment or career success. Always consult with professional career advisors for personalized guidance.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">11. Governing Law</h3>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">12. Contact Information</h3>
              <p>
                If you have any questions about these Terms and Conditions, please contact our support team at:
              </p>
              <p className="ml-4">
                Email: <a href="mailto:support@devpath.com" className="text-blue-600 dark:text-blue-400 hover:underline">support@devpath.com</a>
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
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              I Agree
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
