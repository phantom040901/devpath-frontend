// src/components/admin/OnlineUsersWidget.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Circle, User, Mail, Clock, Minimize2, Maximize2 } from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '../../lib/firebase';

export default function OnlineUsersWidget() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const onlineUsersRef = ref(realtimeDb, 'presence');

    const unsubscribe = onValue(onlineUsersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const usersList = Object.entries(data).map(([uid, userData]) => ({
          uid,
          ...userData,
        }));
        setOnlineUsers(usersList);
      } else {
        setOnlineUsers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Just now';
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min ago';
    if (minutes < 60) return `${minutes} mins ago`;

    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 sm:w-96 shadow-2xl"
    >
      <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/40 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-emerald-500/10 to-primary-500/10 border-b border-gray-700/40">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/20 flex-shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">Online Users</h3>
              <p className="text-xs text-gray-400 hidden sm:block">Currently active students</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <Circle className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-emerald-400 fill-emerald-400 animate-pulse" />
              <span className="text-sm sm:text-base font-bold text-emerald-400">
                {onlineUsers.length}
              </span>
              <span className="text-xs text-emerald-400/80 hidden sm:inline">online</span>
            </div>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {isMinimized ? (
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              ) : (
                <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Content - Collapsible */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-3 sm:p-4">
                {/* Users List */}
                {loading ? (
                  <div className="flex items-center justify-center py-6 sm:py-8">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary-400"></div>
                  </div>
                ) : onlineUsers.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-600 opacity-50" />
                    <p className="text-gray-400 text-xs sm:text-sm">No users currently online</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                    {onlineUsers.map((user, index) => (
                      <motion.div
                        key={user.uid}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all group"
                      >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 rounded-full border-2 border-gray-900"></div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <p className="font-semibold text-white text-xs sm:text-sm truncate">
                              {user.name || 'Anonymous User'}
                            </p>
                            {user.status === 'online' && (
                              <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-medium flex-shrink-0">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 mt-0.5">
                            <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                            <span className="truncate">{user.email || 'No email'}</span>
                          </div>
                        </div>

                        {/* Last Seen */}
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 flex-shrink-0">
                          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="whitespace-nowrap">{formatLastSeen(user.lastSeen)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Footer Stats */}
                {onlineUsers.length > 0 && (
                  <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-700/40">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-400">
                      <span className="truncate">Real-time updates enabled</span>
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        <Circle className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-emerald-400 fill-emerald-400 animate-pulse" />
                        <span>Live</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.8);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.9);
        }
      `}</style>
    </motion.div>
  );
}
