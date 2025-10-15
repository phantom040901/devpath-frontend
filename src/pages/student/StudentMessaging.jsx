// src/pages/student/StudentMessaging.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Megaphone,
  Send,
  User,
  Clock,
  Loader2,
  Shield
} from 'lucide-react';
import DashboardNav from '../../components/dashboard/DashboardNav';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../components/AuthContext';
import { validateMessage, logProfanityAttempt, checkProfanity } from '../../utils/profanityFilter';

export default function StudentMessaging() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  // Load messages
  useEffect(() => {
    if (!user || activeTab !== 'messages') return;

    setLoadingMessages(true);
    const messagesRef = collection(db, 'directMessages');
    // Remove orderBy to avoid index requirement - sort client-side
    const q = query(
      messagesRef,
      where('studentId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort messages by timestamp client-side (oldest first)
      messagesList.sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        return a.timestamp.toMillis() - b.timestamp.toMillis();
      });

      setMessages(messagesList);
      setLoadingMessages(false);
      console.log('✅ Loaded messages:', messagesList.length);
    });

    return () => unsubscribe();
  }, [user, activeTab]);

  // Load announcements
  useEffect(() => {
    if (activeTab !== 'announcements') return;

    setLoading(true);
    const announcementsRef = collection(db, 'announcements');
    // Remove orderBy to avoid index requirement - sort client-side
    const q = query(announcementsRef);

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const announcementsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by timestamp descending (newest first) client-side
      announcementsList.sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        return b.timestamp.toMillis() - a.timestamp.toMillis();
      });

      setAnnouncements(announcementsList);
      setLoading(false);

      // Mark announcements as viewed
      if (user) {
        for (const announcement of announcementsList) {
          if (!announcement.viewedBy || !announcement.viewedBy.includes(user.uid)) {
            try {
              const announcementRef = doc(db, 'announcements', announcement.id);
              await updateDoc(announcementRef, {
                viewedBy: arrayUnion(user.uid)
              });
            } catch (error) {
              console.error('Error marking announcement as viewed:', error);
            }
          }
        }
      }
    });

    return () => unsubscribe();
  }, [activeTab, user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || sending) return;

    // Validate message for profanity and length
    const validation = validateMessage(newMessage, 'message');
    if (!validation.isValid) {
      alert(validation.error);
      const profanityCheck = checkProfanity(newMessage);
      if (!profanityCheck.isClean) {
        logProfanityAttempt(user.uid, newMessage, profanityCheck.detectedWords);
      }
      return;
    }

    setSending(true);
    try {
      await addDoc(collection(db, 'directMessages'), {
        studentId: user.uid,
        studentName: user.displayName || user.email,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        senderType: 'student',
        message: newMessage.trim(),
        timestamp: serverTimestamp(),
        read: false
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black">
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            Messages & Announcements
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Chat with admins and stay updated with announcements
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex gap-2 sm:gap-4 border-b border-gray-700/40">
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-semibold transition-all relative text-sm sm:text-base ${
                activeTab === 'messages'
                  ? 'text-primary-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Direct Messages</span>
              {activeTab === 'messages' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-semibold transition-all relative text-sm sm:text-base ${
                activeTab === 'announcements'
                  ? 'text-primary-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Megaphone className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Announcements</span>
              {activeTab === 'announcements' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400"
                />
              )}
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'messages' ? (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-900/70 border border-gray-700/40 rounded-xl overflow-hidden flex flex-col"
              style={{ height: 'calc(100vh - 350px)', minHeight: '400px' }}
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-700/40 bg-gray-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Admin Team</div>
                    <div className="text-xs text-gray-400">DevPath Support</div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No messages yet. Start a conversation with the admin team!
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderType === 'student' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.senderType === 'student'
                            ? 'bg-primary-500/20 border border-primary-500/30'
                            : 'bg-gray-800/50 border border-gray-700/40'
                        }`}
                      >
                        <div className="text-xs text-gray-400 mb-1">
                          {msg.senderType === 'admin' ? '👨‍💼 Admin' : 'You'}
                        </div>
                        <div className="text-white text-sm">{msg.message}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTimestamp(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-700/40 bg-gray-800/30">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="announcements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-900/70 border border-gray-700/40 rounded-xl p-4 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Megaphone className="w-5 h-5" />
                Latest Announcements
              </h2>
              <div className="space-y-4 max-h-[calc(100vh-350px)] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
                  </div>
                ) : announcements.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold">No announcements yet</p>
                    <p className="text-sm">Check back later for updates</p>
                  </div>
                ) : (
                  announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="p-4 sm:p-5 bg-gray-800/30 border border-gray-700/40 rounded-lg hover:border-primary-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-white text-base sm:text-lg">
                          {announcement.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimestamp(announcement.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                        {announcement.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          <span>From {announcement.createdByName}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
