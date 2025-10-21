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
  Trash2,
  Edit2,
  Check,
  XCircle,
  Ticket,
  AlertTriangle,
  FileText
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
  deleteDoc,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAdmin } from '../../contexts/AdminContext';
import { validateMessage, logProfanityAttempt, checkProfanity } from '../../utils/profanityFilter';
import { createAnnouncementNotifications } from '../../services/notificationService';

// Inquiry category icons mapping
const categoryIcons = {
  'account': '👤',
  'technical': '🔧',
  'assessment': '📝',
  'career': '🎯',
  'bug': '🐛',
  'feature': '💡',
  'other': '❓'
};

export default function AdminMessaging() {
  const { admin } = useAdmin();
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedMessageText, setEditedMessageText] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [ticketToReject, setTicketToReject] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, approved, rejected, resolved

  // Load support tickets
  useEffect(() => {
    setLoadingTickets(true);
    const ticketsRef = collection(db, 'supportTickets');
    const q = query(ticketsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by timestamp descending (newest first) client-side
      ticketsList.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });

      setTickets(ticketsList);
      setLoadingTickets(false);

      // Auto-select first pending ticket if none selected
      if (!selectedTicket && ticketsList.length > 0) {
        const firstPending = ticketsList.find(t => t.status === 'pending');
        if (firstPending) {
          setSelectedTicket(firstPending);
        }
      }

      // Update selected ticket if it changed
      if (selectedTicket) {
        const updated = ticketsList.find(t => t.id === selectedTicket.id);
        if (updated) {
          setSelectedTicket(updated);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Load announcements
  useEffect(() => {
    if (activeTab !== 'announcements') return;

    setLoading(true);
    const announcementsRef = collection(db, 'announcements');
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

  const handleApproveTicket = async (ticketId) => {
    if (!confirm('Approve this support ticket and start conversation?')) return;

    try {
      const ticketRef = doc(db, 'supportTickets', ticketId);
      await updateDoc(ticketRef, {
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: admin.uid
      });
      console.log('✅ Ticket approved successfully');
    } catch (error) {
      console.error('❌ Error approving ticket:', error);
      alert('Failed to approve ticket. Please try again.');
    }
  };

  const handleRejectTicket = (ticket) => {
    setTicketToReject(ticket);
    setShowRejectModal(true);
  };

  const confirmRejectTicket = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      const ticketRef = doc(db, 'supportTickets', ticketToReject.id);
      await updateDoc(ticketRef, {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        rejectedBy: admin.uid,
        rejectionReason: rejectReason.trim()
      });

      setShowRejectModal(false);
      setRejectReason('');
      setTicketToReject(null);
      console.log('✅ Ticket rejected successfully');
    } catch (error) {
      console.error('❌ Error rejecting ticket:', error);
      alert('Failed to reject ticket. Please try again.');
    }
  };

  const handleResolveTicket = async (ticketId) => {
    if (!confirm('Mark this ticket as resolved? This will close the conversation.')) return;

    try {
      const ticketRef = doc(db, 'supportTickets', ticketId);
      await updateDoc(ticketRef, {
        status: 'resolved',
        resolvedAt: serverTimestamp(),
        resolvedBy: admin.uid
      });
      console.log('✅ Ticket resolved successfully');
    } catch (error) {
      console.error('❌ Error resolving ticket:', error);
      alert('Failed to resolve ticket. Please try again.');
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'supportTickets', ticketId));
      setSelectedTicket(null);
      console.log('✅ Ticket deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting ticket:', error);
      alert('Failed to delete ticket. Please try again.');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket || sending) return;

    // Only allow messages in approved tickets
    if (selectedTicket.status !== 'approved') {
      alert('Cannot send messages to tickets that are not approved');
      return;
    }

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
      const newMsg = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId: admin.uid,
        senderName: admin.displayName || admin.email,
        senderType: 'admin',
        text: newMessage.trim(),
        timestamp: serverTimestamp(),
        edited: false,
        deleted: false
      };

      const ticketRef = doc(db, 'supportTickets', selectedTicket.id);
      await updateDoc(ticketRef, {
        messages: arrayUnion(newMsg),
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

  const canEditMessage = (message) => {
    if (message.senderId !== admin.uid) return false;
    if (message.deleted) return false;
    if (!message.timestamp) return false;

    const messageTime = message.timestamp.toMillis();
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;

    return (now - messageTime) < tenMinutes;
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(message.id);
    setEditedMessageText(message.text);
  };

  const handleSaveEdit = async (messageId) => {
    if (!editedMessageText.trim() || !selectedTicket) return;

    // Validate edited message
    const validation = validateMessage(editedMessageText, 'message');
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      const ticketRef = doc(db, 'supportTickets', selectedTicket.id);
      const updatedMessages = selectedTicket.messages.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            text: editedMessageText.trim(),
            edited: true,
            editedAt: new Date()
          };
        }
        return msg;
      });

      await updateDoc(ticketRef, {
        messages: updatedMessages
      });

      setEditingMessageId(null);
      setEditedMessageText('');
    } catch (error) {
      console.error('Error editing message:', error);
      alert('Failed to edit message. Please try again.');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Delete this message? This action cannot be undone.')) return;

    try {
      const ticketRef = doc(db, 'supportTickets', selectedTicket.id);
      const updatedMessages = selectedTicket.messages.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            text: '[Message deleted]',
            deleted: true,
            deletedAt: new Date()
          };
        }
        return msg;
      });

      await updateDoc(ticketRef, {
        messages: updatedMessages
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again.');
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

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Pending', icon: Clock },
      approved: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Approved', icon: CheckCircle },
      rejected: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Rejected', icon: XCircle },
      resolved: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Resolved', icon: Check }
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${badge.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const filteredTickets = tickets.filter(ticket => {
    // Filter by status
    if (filterStatus !== 'all' && ticket.status !== filterStatus) {
      return false;
    }

    // Filter by search query
    const searchLower = searchQuery.toLowerCase();
    return (
      ticket.ticketNumber?.toLowerCase().includes(searchLower) ||
      ticket.subject?.toLowerCase().includes(searchLower) ||
      ticket.studentName?.toLowerCase().includes(searchLower) ||
      ticket.studentEmail?.toLowerCase().includes(searchLower) ||
      ticket.category?.toLowerCase().includes(searchLower)
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

  const getTimeRemaining = (timestamp) => {
    if (!timestamp) return null;
    const messageTime = timestamp.toMillis();
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    const remaining = tenMinutes - (now - messageTime);

    if (remaining <= 0) return null;

    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            Support & Communication
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Manage support tickets, respond to student inquiries, and create announcements
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
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-semibold transition-all relative text-sm sm:text-base ${
                activeTab === 'tickets'
                  ? 'text-primary-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Support Tickets</span>
              {tickets.filter(t => t.status === 'pending').length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                  {tickets.filter(t => t.status === 'pending').length}
                </span>
              )}
              {activeTab === 'tickets' && (
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
          {activeTab === 'tickets' ? (
            <motion.div
              key="tickets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6"
            >
              {/* Tickets List */}
              <div className="lg:col-span-4 bg-gray-900/70 border border-gray-700/40 rounded-xl p-4 sm:p-6 h-[700px] flex flex-col">
                <div className="mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Ticket className="w-5 h-5" />
                    Support Tickets
                  </h2>

                  {/* Status Filter */}
                  <div className="mb-3 flex gap-2 flex-wrap">
                    {['all', 'pending', 'approved', 'rejected', 'resolved'].map(status => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          filterStatus === status
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                  {loadingTickets ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
                    </div>
                  ) : filteredTickets.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No tickets found
                    </div>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`w-full p-3 rounded-lg transition-all text-left ${
                          selectedTicket?.id === ticket.id
                            ? 'bg-primary-500/20 border border-primary-500/30'
                            : 'bg-gray-800/30 hover:bg-gray-800/50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{categoryIcons[ticket.category] || '❓'}</span>
                            <span className="text-xs font-mono text-gray-400">{ticket.ticketNumber}</span>
                          </div>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <div className="font-semibold text-white text-sm mb-1 truncate">
                          {ticket.subject}
                        </div>
                        <div className="text-xs text-gray-400 mb-1">{ticket.studentName}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(ticket.createdAt)}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Ticket Detail Area */}
              <div className="lg:col-span-8 bg-gray-900/70 border border-gray-700/40 rounded-xl overflow-hidden flex flex-col h-[700px]">
                {selectedTicket ? (
                  <>
                    {/* Ticket Header */}
                    <div className="p-4 border-b border-gray-700/40 bg-gray-800/30">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{categoryIcons[selectedTicket.category] || '❓'}</span>
                            <div>
                              <div className="font-semibold text-white text-lg">
                                {selectedTicket.subject}
                              </div>
                              <div className="text-xs text-gray-400 font-mono">
                                {selectedTicket.ticketNumber}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <User className="w-4 h-4" />
                            <span>{selectedTicket.studentName}</span>
                            <span>•</span>
                            <span>{selectedTicket.studentEmail}</span>
                          </div>
                        </div>
                        {getStatusBadge(selectedTicket.status)}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        {selectedTicket.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveTicket(selectedTicket.id)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all text-sm font-semibold flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve Ticket
                            </button>
                            <button
                              onClick={() => handleRejectTicket(selectedTicket)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-sm font-semibold flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject Ticket
                            </button>
                          </>
                        )}
                        {selectedTicket.status === 'approved' && (
                          <button
                            onClick={() => handleResolveTicket(selectedTicket.id)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-semibold flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Mark as Resolved
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTicket(selectedTicket.id)}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all text-sm font-semibold flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Ticket
                        </button>
                      </div>

                      {/* Rejection Reason Display */}
                      {selectedTicket.status === 'rejected' && selectedTicket.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-sm font-semibold text-red-400 mb-1">Rejection Reason:</div>
                              <div className="text-sm text-gray-300">{selectedTicket.rejectionReason}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {!selectedTicket.messages || selectedTicket.messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                          {selectedTicket.status === 'pending'
                            ? 'Approve this ticket to start the conversation'
                            : 'No messages yet'}
                        </div>
                      ) : (
                        selectedTicket.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                msg.senderType === 'admin'
                                  ? 'bg-primary-500/20 border border-primary-500/30'
                                  : 'bg-gray-800/50 border border-gray-700/40'
                              } ${msg.deleted ? 'opacity-50' : ''}`}
                            >
                              <div className="text-xs text-gray-400 mb-1">
                                {msg.senderName}
                              </div>

                              {editingMessageId === msg.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editedMessageText}
                                    onChange={(e) => setEditedMessageText(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white text-sm resize-none"
                                    rows={3}
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleSaveEdit(msg.id)}
                                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingMessageId(null);
                                        setEditedMessageText('');
                                      }}
                                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs font-semibold"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="text-white text-sm">
                                    {msg.text}
                                    {msg.edited && !msg.deleted && (
                                      <span className="text-xs text-gray-500 ml-2">(edited)</span>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between mt-1">
                                    <div className="text-xs text-gray-500">
                                      {formatTimestamp(msg.timestamp)}
                                    </div>
                                    {msg.senderType === 'admin' && canEditMessage(msg) && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-yellow-400">
                                          {getTimeRemaining(msg.timestamp)}
                                        </span>
                                        <button
                                          onClick={() => handleEditMessage(msg)}
                                          className="p-1 hover:bg-gray-700/50 rounded text-gray-400 hover:text-white"
                                          title="Edit message"
                                        >
                                          <Edit2 className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteMessage(msg.id)}
                                          className="p-1 hover:bg-gray-700/50 rounded text-gray-400 hover:text-red-400"
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
                        ))
                      )}
                    </div>

                    {/* Message Input */}
                    {selectedTicket.status === 'approved' ? (
                      <div className="p-4 border-t border-gray-700/40 bg-gray-800/30">
                        <div className="flex gap-2">
                          <textarea
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                            rows={2}
                          />
                          <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || sending}
                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 self-end"
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
                    ) : (
                      <div className="p-4 border-t border-gray-700/40 bg-gray-800/30">
                        <div className="text-center text-gray-400 text-sm">
                          {selectedTicket.status === 'pending' && 'Ticket must be approved before messaging'}
                          {selectedTicket.status === 'rejected' && 'Cannot message rejected tickets'}
                          {selectedTicket.status === 'resolved' && 'This ticket has been resolved'}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <Ticket className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-semibold">Select a ticket</p>
                      <p className="text-sm">Choose a support ticket to view details</p>
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

      {/* Reject Ticket Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRejectModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-400" />
                  Reject Ticket
                </h3>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Please provide a reason for rejecting this support ticket:
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Duplicate ticket, Insufficient information, Out of scope..."
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
                rows={4}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRejectTicket}
                  disabled={!rejectReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
