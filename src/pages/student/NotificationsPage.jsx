// src/pages/student/NotificationsPage.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, Filter, ExternalLink, Loader, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import DashboardNav from '../../components/dashboard/DashboardNav';
import DashboardFooter from '../../components/dashboard/DashboardFooter';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../../services/notificationService';

export default function NotificationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getUserNotifications(user.uid, 100);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await markAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
      }
      
      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead(user.uid);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      setIsDeleting(true);
      
      // Delete all notifications one by one
      const deletePromises = notifications.map(notification => 
        deleteNotification(notification.id)
      );
      
      await Promise.all(deletePromises);
      
      // Clear the notifications list
      setNotifications([]);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      alert('Failed to delete notifications. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-500/50 bg-red-500/10';
      case 'medium':
        return 'border-yellow-500/50 bg-yellow-500/10';
      default:
        return 'border-blue-500/50 bg-blue-500/10';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-gradient-to-b from-primary-1400 via-primary-1500 to-black min-h-screen text-primary-50 flex flex-col">
      <DashboardNav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex-grow w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-primary-500/20 rounded-xl flex-shrink-0">
                <Bell size={20} className="sm:w-7 sm:h-7 text-primary-400" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Notifications</h1>
                <p className="text-gray-400 mt-0.5 sm:mt-1 text-sm sm:text-base">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/50 text-primary-400 rounded-lg transition text-sm sm:text-base"
                >
                  <Check size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Mark all read</span>
                  <span className="sm:hidden">Mark read</span>
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg transition text-sm sm:text-base"
                >
                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Delete all</span>
                  <span className="sm:hidden">Delete</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-4 sm:mb-6 bg-gray-900/70 border border-gray-700/40 rounded-xl p-1.5 sm:p-2 w-full sm:w-fit overflow-x-auto"
        >
          {[
            { value: 'all', label: 'All', count: notifications.length },
            { value: 'unread', label: 'Unread', count: unreadCount },
            { value: 'read', label: 'Read', count: notifications.length - unreadCount }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                filter === tab.value
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {loading ? (
            <div className="bg-gray-900/70 border border-gray-700/40 rounded-xl p-12 text-center">
              <Loader size={48} className="animate-spin text-primary-400 mx-auto mb-4" />
              <p className="text-gray-400">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-gray-900/70 border border-gray-700/40 rounded-xl p-12 text-center">
              <Bell size={64} className="mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
              <p className="text-gray-400">
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : filter === 'read'
                  ? "No read notifications yet."
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-gray-900/70 border rounded-xl p-3 sm:p-5 cursor-pointer transition-all hover:border-primary-500/50 hover:bg-gray-900/90 ${
                  !notification.read
                    ? 'border-primary-500/30 bg-primary-500/5'
                    : 'border-gray-700/40'
                }`}
              >
                <div className="flex gap-3 sm:gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl border ${getPriorityColor(notification.priority)}`}>
                    {notification.icon || '📢'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                      <h3 className={`text-base sm:text-lg font-semibold ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="flex-shrink-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-primary-400 rounded-full mt-1.5 sm:mt-2"></div>
                      )}
                    </div>

                    <p className="text-sm sm:text-base text-gray-400 mb-2 sm:mb-3 leading-relaxed">
                      {notification.message}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <span className="text-xs sm:text-sm text-gray-500">
                        {formatTime(notification.createdAt)}
                      </span>

                      {notification.link && (
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-primary-400">
                          <span>View</span>
                          <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Priority Badge */}
                    {notification.priority === 'high' && (
                      <div className="inline-flex items-center gap-1 mt-2 sm:mt-3 px-2 py-1 bg-red-500/20 border border-red-500/50 rounded-md text-xs text-red-400 font-medium">
                        High Priority
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </main>

      {/* Delete All Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-500/20 rounded-full">
                  <AlertTriangle className="text-red-400" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Delete All Notifications</h3>
                  <p className="text-sm text-gray-400 mt-1">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Are you sure you want to delete all {notifications.length} notification{notifications.length !== 1 ? 's' : ''}? 
                This will permanently remove all notifications from your account.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAll}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Delete All
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DashboardFooter />
    </div>
  );
}