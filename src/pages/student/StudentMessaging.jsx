// src/pages/student/StudentMessaging.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Megaphone,
  Send,
  Shield,
  Clock,
  Loader2,
  Plus,
  X,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Tag
} from 'lucide-react';
import DashboardNav from '../../components/dashboard/DashboardNav';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  deleteDoc,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../components/AuthContext';
import { validateMessage, logProfanityAttempt, checkProfanity } from '../../utils/profanityFilter';

const INQUIRY_CATEGORIES = [
  { id: 'account', label: 'Account Issues', icon: '👤', description: 'Login, password, profile issues' },
  { id: 'technical', label: 'Technical Support', icon: '🔧', description: 'Bugs, errors, technical problems' },
  { id: 'assessment', label: 'Assessment Questions', icon: '📝', description: 'Questions about assessments' },
  { id: 'career', label: 'Career Guidance', icon: '🎯', description: 'Career recommendations, roadmap' },
  { id: 'bug', label: 'Report a Bug', icon: '🐛', description: 'Report a bug or issue' },
  { id: 'feature', label: 'Feature Request', icon: '💡', description: 'Suggest new features' },
  { id: 'other', label: 'Other', icon: '❓', description: 'General inquiries' }
];

export default function StudentMessaging() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('messages');
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedText, setEditedText] = useState('');

  // New ticket form
  const [newTicket, setNewTicket] = useState({
    category: '',
    subject: '',
    message: ''
  });

  // Load user's tickets
  useEffect(() => {
    if (!user || activeTab !== 'messages') return;

    setLoading(true);
    const ticketsRef = collection(db, 'supportTickets');
    const q = query(ticketsRef, where('studentId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by creation date (newest first)
      ticketsList.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });

      setTickets(ticketsList);
      setLoading(false);

      // Auto-select first approved ticket if none selected
      if (!selectedTicket && ticketsList.length > 0) {
        const approvedTicket = ticketsList.find(t => t.status === 'approved');
        if (approvedTicket) setSelectedTicket(approvedTicket);
      }
    });

    return () => unsubscribe();
  }, [user, activeTab]);

  // Load announcements
  useEffect(() => {
    if (activeTab !== 'announcements') return;

    setLoading(true);
    const announcementsRef = collection(db, 'announcements');
    const q = query(announcementsRef);

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const announcementsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      announcementsList.sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        return b.timestamp.toMillis() - a.timestamp.toMillis();
      });

      setAnnouncements(announcementsList);
      setLoading(false);

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

  // Check if user can create more tickets today
  const canCreateTicket = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysTickets = tickets.filter(ticket => {
      if (!ticket.createdAt) return false;
      const ticketDate = ticket.createdAt.toDate();
      ticketDate.setHours(0, 0, 0, 0);
      return ticketDate.getTime() === today.getTime();
    });

    return todaysTickets.length < 5;
  };

  const handleCreateTicket = async () => {
    if (!newTicket.category || !newTicket.subject.trim() || !newTicket.message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Check rate limit
    const canCreate = await canCreateTicket();
    if (!canCreate) {
      alert('You have reached the maximum of 5 tickets per day. Please try again tomorrow.');
      return;
    }

    // Validate message
    const validation = validateMessage(newTicket.message, 'message');
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setSending(true);
    try {
      // Generate ticket number
      const ticketNumber = `TKT-${Date.now().toString().slice(-8)}`;

      const ticketData = {
        ticketNumber,
        studentId: user.uid,
        studentName: user.displayName || user.email,
        studentEmail: user.email,
        category: newTicket.category,
        subject: newTicket.subject,
        status: 'pending', // pending, approved, rejected, resolved
        createdAt: serverTimestamp(),
        messages: [{
          id: Date.now().toString(),
          senderId: user.uid,
          senderName: user.displayName || user.email,
          senderType: 'student',
          text: newTicket.message,
          timestamp: Timestamp.now(),
          edited: false,
          deleted: false
        }]
      };

      const docRef = await addDoc(collection(db, 'supportTickets'), ticketData);
      console.log('✅ Ticket created:', docRef.id);

      // Reset form
      setNewTicket({ category: '', subject: '', message: '' });
      setShowNewTicketModal(false);

      alert(`Ticket ${ticketNumber} created successfully! Waiting for admin approval.`);
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket || sending) return;

    if (selectedTicket.status !== 'approved') {
      alert('You can only send messages on approved tickets.');
      return;
    }

    const validation = validateMessage(newMessage, 'message');
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setSending(true);
    try {
      const messageData = {
        id: Date.now().toString(),
        senderId: user.uid,
        senderName: user.displayName || user.email,
        senderType: 'student',
        text: newMessage.trim(),
        timestamp: Timestamp.now(),
        edited: false,
        deleted: false
      };

      const ticketRef = doc(db, 'supportTickets', selectedTicket.id);
      await updateDoc(ticketRef, {
        messages: arrayUnion(messageData),
        lastMessageAt: serverTimestamp()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleEditMessage = async (messageId) => {
    if (!editedText.trim()) return;

    const validation = validateMessage(editedText, 'message');
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      const updatedMessages = selectedTicket.messages.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            text: editedText.trim(),
            edited: true,
            editedAt: Timestamp.now()
          };
        }
        return msg;
      });

      const ticketRef = doc(db, 'supportTickets', selectedTicket.id);
      await updateDoc(ticketRef, {
        messages: updatedMessages
      });

      setEditingMessageId(null);
      setEditedText('');
    } catch (error) {
      console.error('Error editing message:', error);
      alert('Failed to edit message.');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const updatedMessages = selectedTicket.messages.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            text: '[Message deleted]',
            deleted: true,
            deletedAt: Timestamp.now()
          };
        }
        return msg;
      });

      const ticketRef = doc(db, 'supportTickets', selectedTicket.id);
      await updateDoc(ticketRef, {
        messages: updatedMessages
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message.');
    }
  };

  const canEditMessage = (message) => {
    if (message.senderId !== user.uid) return false;
    if (message.deleted) return false;
    if (!message.timestamp) return false;

    const messageTime = message.timestamp.toMillis();
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;

    return (now - messageTime) < tenMinutes;
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

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock, label: 'Pending Approval' },
      approved: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle, label: 'Approved' },
      rejected: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle, label: 'Rejected' },
      resolved: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: CheckCircle, label: 'Resolved' }
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const getCategoryInfo = (categoryId) => {
    return INQUIRY_CATEGORIES.find(c => c.id === categoryId) || INQUIRY_CATEGORIES[6];
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Support Tickets & Announcements
              </h1>
              <p className="text-sm sm:text-base text-gray-400">
                Get help from admins and stay updated with announcements
              </p>
            </div>
            {activeTab === 'messages' && (
              <button
                onClick={async () => {
                  const canCreate = await canCreateTicket();
                  if (!canCreate) {
                    alert('You have reached the maximum of 5 tickets per day. Please try again tomorrow.');
                    return;
                  }
                  setShowNewTicketModal(true);
                }}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Ticket</span>
              </button>
            )}
          </div>
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
              <span>Support Tickets</span>
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
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
              {/* Tickets List */}
              <motion.div
                key="tickets-list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900/70 border border-gray-700/40 rounded-xl p-4 overflow-y-auto"
                style={{ maxHeight: 'calc(100vh - 350px)' }}
              >
                <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                  Your Tickets
                </h3>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No tickets yet</p>
                    <p className="text-xs mt-1">Create your first ticket</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tickets.map((ticket) => {
                      const category = getCategoryInfo(ticket.category);
                      return (
                        <button
                          key={ticket.id}
                          onClick={() => setSelectedTicket(ticket)}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            selectedTicket?.id === ticket.id
                              ? 'bg-primary-500/20 border border-primary-500/30'
                              : 'bg-gray-800/30 border border-gray-700/40 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{category.icon}</span>
                              <span className="text-xs font-mono text-gray-400">
                                {ticket.ticketNumber}
                              </span>
                            </div>
                            {getStatusBadge(ticket.status)}
                          </div>
                          <p className="text-sm font-medium text-white mb-1 truncate">
                            {ticket.subject}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTimestamp(ticket.createdAt)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              {/* Chat Area */}
              <motion.div
                key="chat-area"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900/70 border border-gray-700/40 rounded-xl overflow-hidden flex flex-col"
                style={{ height: 'calc(100vh - 350px)', minHeight: '400px' }}
              >
                {selectedTicket ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-700/40 bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-2">
                              {selectedTicket.subject}
                              {getStatusBadge(selectedTicket.status)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {selectedTicket.ticketNumber} • {getCategoryInfo(selectedTicket.category).label}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rejection Reason */}
                      {selectedTicket.status === 'rejected' && selectedTicket.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <div className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-400 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-red-400 mb-1">Ticket Rejected</p>
                              <p className="text-xs text-red-300">{selectedTicket.rejectionReason}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Pending Notice */}
                      {selectedTicket.status === 'pending' && (
                        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-yellow-400 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-yellow-400 mb-1">Awaiting Admin Approval</p>
                              <p className="text-xs text-yellow-300">Your ticket is pending review. You'll be notified once approved.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {selectedTicket.messages && selectedTicket.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderType === 'student' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              msg.deleted
                                ? 'bg-gray-800/30 border border-gray-700/40 opacity-60'
                                : msg.senderType === 'student'
                                ? 'bg-primary-500/20 border border-primary-500/30'
                                : 'bg-gray-800/50 border border-gray-700/40'
                            }`}
                          >
                            <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                              <span>{msg.senderType === 'admin' ? '👨‍💼 Admin' : 'You'}</span>
                              {msg.edited && !msg.deleted && (
                                <span className="text-gray-500 italic">(edited)</span>
                              )}
                            </div>

                            {editingMessageId === msg.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editedText}
                                  onChange={(e) => setEditedText(e.target.value)}
                                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm"
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditMessage(msg.id)}
                                    className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingMessageId(null);
                                      setEditedText('');
                                    }}
                                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="text-white text-sm">{msg.text}</div>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="text-xs text-gray-500">
                                    {formatTimestamp(msg.timestamp)}
                                  </div>
                                  {msg.senderType === 'student' && !msg.deleted && canEditMessage(msg) && (
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => {
                                          setEditingMessageId(msg.id);
                                          setEditedText(msg.text);
                                        }}
                                        className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-primary-400"
                                        title="Edit message"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteMessage(msg.id)}
                                        className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400"
                                        title="Delete message"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    {selectedTicket.status === 'approved' && (
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
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>Select a ticket to view conversation</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
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

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewTicketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create Support Ticket</h2>
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Inquiry Category *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {INQUIRY_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setNewTicket({ ...newTicket, category: category.id })}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          newTicket.category === category.id
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{category.icon}</span>
                          <span className="font-semibold text-white">{category.label}</span>
                        </div>
                        <p className="text-xs text-gray-400">{category.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of your issue"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    placeholder="Please provide details about your inquiry..."
                    value={newTicket.message}
                    onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Info Box */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-400 mt-0.5" />
                    <div className="text-xs text-blue-300">
                      <p className="font-semibold mb-1">How it works:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Your ticket will be reviewed by an admin</li>
                        <li>Once approved, you can chat with the admin team</li>
                        <li>You can edit or delete your messages within 10 minutes</li>
                        <li>Maximum 5 tickets per day</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowNewTicketModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTicket}
                    disabled={!newTicket.category || !newTicket.subject.trim() || !newTicket.message.trim() || sending}
                    className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Create Ticket
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
