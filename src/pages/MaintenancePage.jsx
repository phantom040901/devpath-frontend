// src/pages/MaintenancePage.jsx
// Page displayed to students when system is under maintenance

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Clock, AlertCircle, RefreshCw, Mail, Home } from 'lucide-react';
import { getMaintenanceStatus } from '../services/systemSettingsService';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';

export default function MaintenancePage() {
  const navigate = useNavigate();
  const [maintenanceInfo, setMaintenanceInfo] = useState({
    message: "We're currently performing system maintenance. We'll be back soon!",
    estimatedDowntime: null,
    lastUpdated: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaintenanceInfo();
  }, []);

  const loadMaintenanceInfo = async () => {
    try {
      const status = await getMaintenanceStatus();
      setMaintenanceInfo({
        message: status.message,
        estimatedDowntime: status.estimatedDowntime,
        lastUpdated: status.lastUpdated
      });
    } catch (error) {
      console.error('Error loading maintenance info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const formatEstimatedTime = (timestamp) => {
    if (!timestamp) return null;

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary-500/10 rounded-full blur-[100px] sm:blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-[100px] sm:blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-cyan-500/5 rounded-full blur-[120px] sm:blur-[150px]"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <img
                src={logoImage}
                alt="DevPath Logo"
                className="relative h-24 w-24 md:h-32 md:w-32"
                style={{
                  filter: 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.8)) brightness(1.2)',
                }}
              />
            </div>
          </motion.div>

          {/* Main Content Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gray-900/70 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            {/* Icon */}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 mb-6"
            >
              <Settings className="text-yellow-400" size={40} />
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              System Under Maintenance
            </h1>

            {/* Message */}
            <div className="mb-8">
              {loading ? (
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <RefreshCw className="animate-spin" size={18} />
                  <span>Loading information...</span>
                </div>
              ) : (
                <p className="text-lg text-gray-300 leading-relaxed max-w-xl mx-auto">
                  {maintenanceInfo.message}
                </p>
              )}
            </div>

            {/* Estimated Downtime */}
            {maintenanceInfo.estimatedDowntime && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg"
              >
                <Clock className="text-blue-400" size={18} />
                <span className="text-blue-300 text-sm">
                  Expected back: {formatEstimatedTime(maintenanceInfo.estimatedDowntime)}
                </span>
              </motion.div>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-500/20 rounded-lg">
                    <AlertCircle className="text-primary-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1">What's happening?</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      We're performing scheduled maintenance to improve system performance and add new features.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Clock className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1">When will it be back?</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {maintenanceInfo.estimatedDowntime
                        ? `Expected by ${formatEstimatedTime(maintenanceInfo.estimatedDowntime)}`
                        : "We're working to restore access as quickly as possible. Please check back soon!"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-primary-500/50"
              >
                <RefreshCw size={18} />
                Refresh Page
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg transition-all border border-gray-700"
              >
                <Home size={18} />
                Go to Home
              </motion.button>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 text-sm mb-2">Need immediate assistance?</p>
            <a
              href="mailto:support@devpath.com"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
            >
              <Mail size={16} />
              support@devpath.com
            </a>
          </motion.div>

          {/* Status Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500"
          >
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            <span>System Status: Under Maintenance</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
