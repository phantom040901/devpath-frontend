// src/pages/admin/AdminMessaging.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Megaphone,
  Send,
  Search,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  User,
  Loader2,
  Trash2
} from 'lucide-react';
import AdminNav from '../../components/admin/AdminNav';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  doc,
  getDoc,
  onSnapshot,
  limit,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAdmin } from '../../contexts/AdminContext';
import { validateMessage, logProfanityAttempt, checkProfanity } from '../../utils/profanityFilter';
import { createAnnouncementNotifications } from '../../services/notificationService';

export default function AdminMessaging() {
  const { admin } = useAdmin();
  const [activeTab, setActiveTab] = useState('messages');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Load students
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const usersRef = collection(db, 'users');
        // Load all users (no role filter since users don't have a role field)
        const snapshot = await getDocs(usersRef);

        const studentsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort by creation date or name
        studentsList.sort((a, b) => {
          const nameA = a.fullName || a.firstName || a.email || '';
          const nameB = b.fullName || b.firstName || b.email || '';
          return nameA.localeCompare(nameB);
        });

        setStudents(studentsList);
        console.log('✅ Loaded students:', studentsList.length);
      } catch (error) {
        console.error('❌ Error loading students:', error);
      }
    };

    loadStudents();
  }, []);

  // Load messages for selected student
  useEffect(() => {
    if (!selectedStudent) return;

    setLoadingMessages(true);
    const messagesRef = collection(db, 'directMessages');
    // Remove orderBy to avoid index requirement - we'll sort client-side instead
    const q = query(
      messagesRef,
      where('studentId', '==', selectedStudent.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort messages by timestamp client-side
      messagesList.sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        return a.timestamp.toMillis() - b.timestamp.toMillis();
      });

      setMessages(messagesList);
      setLoadingMessages(false);
    });

    return () => unsubscribe();
  }, [selectedStudent]);

  // Load announcements
  useEffect(() => {
    if (activeTab !== 'announcements') return;

    setLoading(true);
    const announcementsRef = collection(db, 'announcements');
    // Remove orderBy to avoid index requirement - we'll sort client-side
    const q = query(announcementsRef, limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
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
    });

    return () => unsubscribe();
  }, [activeTab]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedStudent || sending) return;

    // Validate message for profanity and length
    const validation = validateMessage(newMessage, 'message');
    if (!validation.isValid) {
      alert(validation.error);
      const profanityCheck = checkProfanity(newMessage);
      if (!profanityCheck.isClean) {
        logProfanityAttempt(admin.uid, newMessage, profanityCheck.detectedWords);
      }
      return;
    }

    setSending(true);
    try {
      const studentName = selectedStudent.fullName ||
                         `${selectedStudent.firstName || ''} ${selectedStudent.lastName || ''}`.trim() ||
                         selectedStudent.email;

      await addDoc(collection(db, 'directMessages'), {
        studentId: selectedStudent.id,
        studentName: studentName,
        senderId: admin.uid,
        senderName: admin.displayName || admin.email,
        senderType: 'admin',
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

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim() || sending) return;

    // Validate title for profanity
    const titleValidation = validateMessage(newAnnouncement.title, 'announcement');
    if (!titleValidation.isValid) {
      alert('Title: ' + titleValidation.error);
      const profanityCheck = checkProfanity(newAnnouncement.title);
      if (!profanityCheck.isClean) {
        logProfanityAttempt(admin.uid, newAnnouncement.title, profanityCheck.detectedWords);
      }
      return;
    }

    // Validate content for profanity
    const contentValidation = validateMessage(newAnnouncement.content, 'announcement');
    if (!contentValidation.isValid) {
      alert('Content: ' + contentValidation.error);
      const profanityCheck = checkProfanity(newAnnouncement.content);
      if (!profanityCheck.isClean) {
        logProfanityAttempt(admin.uid, newAnnouncement.content, profanityCheck.detectedWords);
      }
      return;
    }

    setSending(true);
    try {
      // Create the announcement document
      const announcementRef = await addDoc(collection(db, 'announcements'), {
        title: newAnnouncement.title.trim(),
        content: newAnnouncement.content.trim(),
        createdBy: admin.uid,
        createdByName: admin.displayName || admin.email,
        timestamp: serverTimestamp(),
        viewedBy: []
      });

      // Send notifications to all students
      console.log('📢 Sending notifications to all students...');
      const notificationCount = await createAnnouncementNotifications({
        id: announcementRef.id,
        title: newAnnouncement.title.trim(),
        content: newAnnouncement.content.trim(),
        createdBy: admin.uid
      });

      setNewAnnouncement({ title: '', content: '' });
      alert(`Announcement created successfully!\n${notificationCount} students notified.`);
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'announcements', announcementId));
      console.log('✅ Announcement deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting announcement:', error);
      alert('Failed to delete announcement. Please try again.');
    }
  };

  const filteredStudents = students.filter(student => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = student.fullName || `${student.firstName || ''} ${student.lastName || ''}`.trim();
    return (
      fullName.toLowerCase().includes(searchLower) ||
      student.firstName?.toLowerCase().includes(searchLower) ||
      student.lastName?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.course?.toLowerCase().includes(searchLower)
    );
  });

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
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            Communication Center
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Send direct messages to students or create announcements for everyone
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
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6"
            >
              {/* Students List */}
              <div className="lg:col-span-4 bg-gray-900/70 border border-gray-700/40 rounded-xl p-4 sm:p-6 h-[600px] flex flex-col">
                <div className="mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Students
                  </h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                  {filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`w-full p-3 rounded-lg transition-all text-left ${
                        selectedStudent?.id === student.id
                          ? 'bg-primary-500/20 border border-primary-500/30'
                          : 'bg-gray-800/30 hover:bg-gray-800/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-emerald-400 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white text-sm truncate">
                            {student.fullName || `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.email || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-400 truncate">{student.email}</div>
                          {student.course && (
                            <div className="text-xs text-gray-500">{student.course}</div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                  {filteredStudents.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No students found
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-8 bg-gray-900/70 border border-gray-700/40 rounded-xl overflow-hidden flex flex-col h-[600px]">
                {selectedStudent ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-700/40 bg-gray-800/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-emerald-400 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {selectedStudent.fullName || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-400">{selectedStudent.email}</div>
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
                          No messages yet. Start the conversation!
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                msg.senderType === 'admin'
                                  ? 'bg-primary-500/20 border border-primary-500/30'
                                  : 'bg-gray-800/50 border border-gray-700/40'
                              }`}
                            >
                              <div className="text-xs text-gray-400 mb-1">
                                {msg.senderName}
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
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-semibold">Select a student</p>
                      <p className="text-sm">Choose a student to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="announcements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6"
            >
              {/* Create Announcement */}
              <div className="lg:col-span-5 bg-gray-900/70 border border-gray-700/40 rounded-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Megaphone className="w-5 h-5" />
                  Create Announcement
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., System Maintenance Notice"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Content
                    </label>
                    <textarea
                      placeholder="Write your announcement message here..."
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                      rows={8}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <button
                    onClick={handleCreateAnnouncement}
                    disabled={!newAnnouncement.title.trim() || !newAnnouncement.content.trim() || sending}
                    className="w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Post Announcement</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Announcements List */}
              <div className="lg:col-span-7 bg-gray-900/70 border border-gray-700/40 rounded-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
                  Recent Announcements
                </h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
                    </div>
                  ) : announcements.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-semibold">No announcements yet</p>
                      <p className="text-sm">Create your first announcement</p>
                    </div>
                  ) : (
                    announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="p-4 bg-gray-800/30 border border-gray-700/40 rounded-lg hover:border-gray-700 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-semibold text-white flex-1">{announcement.title}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimestamp(announcement.timestamp)}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                              className="p-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all opacity-0 group-hover:opacity-100"
                              title="Delete announcement"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{announcement.content}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>By {announcement.createdByName}</span>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{announcement.viewedBy?.length || 0} views</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
