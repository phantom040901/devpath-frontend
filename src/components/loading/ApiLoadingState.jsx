import React, { useState, useEffect } from 'react';
import { Loader2, Server, Coffee, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ApiLoadingState - A smart loading component that shows different messages
 * based on how long the API call is taking (optimized for Render cold starts)
 *
 * @param {boolean} isLoading - Whether the API call is in progress
 * @param {string} initialMessage - Optional custom initial message
 * @param {boolean} fullScreen - Whether to show as fullscreen overlay (default: true)
 */
export default function ApiLoadingState({
  isLoading = false,
  initialMessage = "Loading your data...",
  fullScreen = true
}) {
  const [currentMessage, setCurrentMessage] = useState(initialMessage);
  const [currentIcon, setCurrentIcon] = useState('loader');
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setElapsedTime(0);
      setCurrentMessage(initialMessage);
      setCurrentIcon('loader');
      return;
    }

    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);

      // Progressive messages based on elapsed time
      if (elapsed < 5) {
        setCurrentMessage(initialMessage);
        setCurrentIcon('loader');
      } else if (elapsed < 15) {
        setCurrentMessage("Connecting to server...");
        setCurrentIcon('server');
      } else if (elapsed < 30) {
        setCurrentMessage("Service is waking up, please hold on...");
        setCurrentIcon('coffee');
      } else {
        setCurrentMessage("Almost there! Render services can take up to 60 seconds to start...");
        setCurrentIcon('clock');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading, initialMessage]);

  if (!isLoading) return null;

  const IconComponent = {
    loader: Loader2,
    server: Server,
    coffee: Coffee,
    clock: Clock
  }[currentIcon];

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    : "flex items-center justify-center p-8";

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={containerClasses}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-br from-primary-1300 to-primary-1200 dark:from-primary-1300 dark:to-primary-1200 light:from-white light:to-gray-50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-primary-500/20 dark:border-primary-500/20 light:border-gray-200"
          >
            {/* Animated Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{
                  rotate: currentIcon === 'loader' ? 360 : 0,
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl" />
                <IconComponent
                  size={64}
                  className="text-primary-400 relative z-10"
                  strokeWidth={1.5}
                />
              </motion.div>
            </div>

            {/* Main Message */}
            <motion.h3
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-semibold text-center text-gray-100 dark:text-gray-100 light:text-gray-900 mb-3"
            >
              {currentMessage}
            </motion.h3>

            {/* Timer Display */}
            <div className="text-center text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 mb-4">
              {elapsedTime > 0 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {elapsedTime}s elapsed
                </motion.span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-primary-1100/50 dark:bg-primary-1100/50 light:bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-cyan-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{
                  width: elapsedTime >= 60 ? "100%" : `${Math.min((elapsedTime / 60) * 100, 95)}%`
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Additional Info for Long Waits */}
            {elapsedTime >= 15 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-3 bg-primary-1100/30 dark:bg-primary-1100/30 light:bg-blue-50 rounded-lg border border-primary-500/10 dark:border-primary-500/10 light:border-blue-200"
              >
                <p className="text-xs text-gray-300 dark:text-gray-300 light:text-gray-700 text-center leading-relaxed">
                  <strong className="text-primary-400 dark:text-primary-400 light:text-blue-600">Why the wait?</strong>
                  <br />
                  Our free-tier backend service goes to sleep after inactivity.
                  It's waking up now and will be ready soon!
                </p>
              </motion.div>
            )}

            {/* Fun Tips for Very Long Waits */}
            {elapsedTime >= 40 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-center text-xs text-primary-300 dark:text-primary-300 light:text-blue-500"
              >
                💡 Tip: Stay on this page - refreshing will restart the process!
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
