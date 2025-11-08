// src/pages/admin/EmployerVerification.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Building2,
  Mail,
  Phone,
  Globe,
  Users,
  Calendar,
  Shield,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

export default function EmployerVerification() {
  const navigate = useNavigate();
  const [pendingEmployers, setPendingEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingEmployers();
  }, []);

  const fetchPendingEmployers = async () => {
    try {
      setLoading(true);
      const employersRef = collection(db, "employers");
      const q = query(employersRef, where("verificationStatus", "==", "pending"));
      const snapshot = await getDocs(q);

      const employersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by date (oldest first - priority queue)
      employersList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      setPendingEmployers(employersList);
    } catch (error) {
      console.error("Error fetching pending employers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (employerId, tier = "tier1_verified") => {
    setActionLoading(true);
    try {
      const employerRef = doc(db, "employers", employerId);
      await updateDoc(employerRef, {
        verificationStatus: tier,
        verifiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Refresh list
      await fetchPendingEmployers();
      setSelectedEmployer(null);

      // TODO: Send email notification to employer
      console.log(`✅ Employer ${employerId} approved as ${tier}`);
    } catch (error) {
      console.error("Error approving employer:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    setActionLoading(true);
    try {
      const employerRef = doc(db, "employers", selectedEmployer.id);
      await updateDoc(employerRef, {
        verificationStatus: "rejected",
        rejectionReason: rejectionReason,
        rejectedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Refresh list
      await fetchPendingEmployers();
      setSelectedEmployer(null);
      setShowRejectModal(false);
      setRejectionReason("");

      // TODO: Send email notification to employer
      console.log(`❌ Employer ${selectedEmployer.id} rejected`);
    } catch (error) {
      console.error("Error rejecting employer:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <Loader2 className="animate-spin text-red-400" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/employers")}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
              >
                ← Back to All Employers
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Clock size={28} className="text-yellow-400" />
                  Employer Verification
                </h1>
                <p className="text-sm text-gray-400">
                  {pendingEmployers.length} employer{pendingEmployers.length !== 1 ? "s" : ""} awaiting review
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {pendingEmployers.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/70 border border-gray-800 rounded-xl">
            <CheckCircle className="mx-auto text-green-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
            <p className="text-gray-400 mb-6">
              There are no pending employers to review at this time.
            </p>
            <button
              onClick={() => navigate("/admin/employers")}
              className="px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
            >
              View All Employers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-yellow-400" />
                  Review Queue
                </h3>
                <div className="space-y-3">
                  {pendingEmployers.map((employer) => (
                    <button
                      key={employer.id}
                      onClick={() => setSelectedEmployer(employer)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedEmployer?.id === employer.id
                          ? "bg-red-500/20 border-red-500/40"
                          : "bg-gray-800 border-gray-700 hover:bg-gray-750"
                      }`}
                    >
                      <p className="font-semibold text-white mb-1 truncate">
                        {employer.companyName}
                      </p>
                      <p className="text-sm text-gray-400 truncate">{employer.email}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(employer.createdAt).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Detail View */}
            <div className="lg:col-span-2">
              {selectedEmployer ? (
                <EmployerDetailView
                  employer={selectedEmployer}
                  onApprove={handleApprove}
                  onReject={() => setShowRejectModal(true)}
                  loading={actionLoading}
                />
              ) : (
                <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-12 text-center">
                  <Building2 className="mx-auto text-gray-600 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Select an Employer
                  </h3>
                  <p className="text-gray-400">
                    Choose an employer from the queue to review their application
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <RejectModal
          employer={selectedEmployer}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          onReject={handleReject}
          onCancel={() => {
            setShowRejectModal(false);
            setRejectionReason("");
          }}
          loading={actionLoading}
        />
      )}
    </div>
  );
}

// Employer Detail View Component
function EmployerDetailView({ employer, onApprove, onReject, loading }) {
  const hasPremiumDocs = employer.documents && employer.documents.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-900/70 border border-gray-800 rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-800">
        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
          {employer.companyName?.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">{employer.companyName}</h2>
          <p className="text-gray-400">{employer.industry}</p>
        </div>
      </div>

      {/* Company Details */}
      <div className="space-y-6 mb-6">
        <DetailSection title="Contact Information">
          <DetailItem icon={Mail} label="Email" value={employer.email} />
          <DetailItem icon={Phone} label="Phone" value={employer.contactPhone} />
          <DetailItem icon={Users} label="Contact Person" value={employer.contactPerson} />
          {employer.companyWebsite && (
            <DetailItem icon={Globe} label="Website" value={employer.companyWebsite} link />
          )}
        </DetailSection>

        <DetailSection title="Company Information">
          <DetailItem icon={Building2} label="Company Size" value={employer.companySize} />
          <DetailItem icon={Building2} label="Industry" value={employer.industry} />
          <DetailItem
            icon={Calendar}
            label="Registered"
            value={new Date(employer.createdAt).toLocaleDateString()}
          />
        </DetailSection>

        {/* Documents */}
        {hasPremiumDocs && (
          <DetailSection title="Uploaded Documents">
            <div className="space-y-3">
              {employer.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="text-blue-400" size={20} />
                    <div>
                      <p className="text-white font-medium">{doc.type}</p>
                      <p className="text-sm text-gray-400">{doc.filename}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm text-white transition-colors">
                    View
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-300">
                <Shield size={16} className="inline mr-2" />
                This employer has uploaded {employer.documents.length} document(s) and qualifies for
                <strong> Premium Verification</strong> (tier2_verified)
              </p>
            </div>
          </DetailSection>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t border-gray-800">
        <button
          onClick={onReject}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <XCircle size={20} />
              Reject
            </>
          )}
        </button>

        {hasPremiumDocs && (
          <button
            onClick={() => onApprove(employer.id, "tier2_verified")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Shield size={20} />
                Approve Premium
              </>
            )}
          </button>
        )}

        <button
          onClick={() => onApprove(employer.id, "tier1_verified")}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <CheckCircle size={20} />
              Approve {hasPremiumDocs ? "Basic" : ""}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// Detail Section Component
function DetailSection({ title, children }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

// Detail Item Component
function DetailItem({ icon: Icon, label, value, link }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
      <Icon className="text-gray-400 mt-1" size={18} />
      <div className="flex-1">
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        {link ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-400 transition-colors"
          >
            {value}
          </a>
        ) : (
          <p className="text-white">{value}</p>
        )}
      </div>
    </div>
  );
}

// Reject Modal Component
function RejectModal({ employer, rejectionReason, setRejectionReason, onReject, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40">
            <AlertCircle className="text-red-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Reject Employer</h3>
            <p className="text-sm text-gray-400">{employer.companyName}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Rejection Reason <span className="text-red-400">*</span>
          </label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Explain why this employer is being rejected..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            This reason will be shared with the employer via email.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onReject}
            disabled={loading || !rejectionReason.trim()}
            className="flex-1 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Rejecting...
              </>
            ) : (
              "Confirm Rejection"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
