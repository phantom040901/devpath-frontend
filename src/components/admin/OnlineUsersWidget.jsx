// src/components/admin/OnlineUsersWidget.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Circle, User, Mail, Clock } from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '../../lib/firebase';

export default function OnlineUsersWidget() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="bg-gray-900/70 border border-gray-700/40 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-emerald-500/20">
            <Users className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Online Users</h3>
            <p className="text-sm text-gray-400">Currently active students</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <Circle className="w-3 h-3 text-emerald-400 fill-emerald-400 animate-pulse" />
          <span className="text-lg font-bold text-emerald-400">
            {onlineUsers.length}
          </span>
          <span className="text-sm text-emerald-400/80">online</span>
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
        </div>
      ) : onlineUsers.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-600 opacity-50" />
          <p className="text-gray-400 text-sm">No users currently online</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {onlineUsers.map((user, index) => (
            <motion.div
              key={user.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all group"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-gray-900"></div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white text-sm truncate">
                    {user.name || 'Anonymous User'}
                  </p>
                  {user.status === 'online' && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                      Active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{user.email || 'No email'}</span>
                </div>
              </div>

              {/* Last Seen */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{formatLastSeen(user.lastSeen)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer Stats */}
      {onlineUsers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/40">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Real-time updates enabled</span>
            <div className="flex items-center gap-1">
              <Circle className="w-2 h-2 text-emerald-400 fill-emerald-400 animate-pulse" />
              <span>Live</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
