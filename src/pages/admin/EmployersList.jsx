// src/pages/admin/EmployersList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Shield,
  Loader2,
  Building2,
  Mail,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, where, orderBy, updateDoc, doc } from "firebase/firestore";

export default function EmployersList() {
  const navigate = useNavigate();
  const [employers, setEmployers] = useState([]);
  const [filteredEmployers, setFilteredEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchEmployers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, employers]);

  const fetchEmployers = async () => {
    try {
      setLoading(true);
      const employersRef = collection(db, "employers");
      const snapshot = await getDocs(employersRef);

      const employersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calculate stats
      const statsData = {
        total: employersList.length,
        pending: employersList.filter((e) => e.verificationStatus === "pending").length,
        verified: employersList.filter(
          (e) => e.verificationStatus === "tier1_verified" || e.verificationStatus === "tier2_verified"
        ).length,
        rejected: employersList.filter((e) => e.verificationStatus === "rejected").length,
      };

      setEmployers(employersList);
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching employers:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...employers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (employer) =>
          employer.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employer.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "verified") {
        filtered = filtered.filter(
          (e) => e.verificationStatus === "tier1_verified" || e.verificationStatus === "tier2_verified"
        );
      } else {
        filtered = filtered.filter((e) => e.verificationStatus === statusFilter);
      }
    }

    setFilteredEmployers(filtered);
  };

  const handleQuickApprove = async (employerId) => {
    try {
      const employerRef = doc(db, "employers", employerId);
      await updateDoc(employerRef, {
        verificationStatus: "tier1_verified",
        updatedAt: new Date().toISOString(),
      });

      // Refresh list
      fetchEmployers();
    } catch (error) {
      console.error("Error approving employer:", error);
    }
  };

  const handleQuickReject = async (employerId) => {
    try {
      const employerRef = doc(db, "employers", employerId);
      await updateDoc(employerRef, {
        verificationStatus: "rejected",
        rejectionReason: "Did not meet verification requirements",
        updatedAt: new Date().toISOString(),
      });

      // Refresh list
      fetchEmployers();
    } catch (error) {
      console.error("Error rejecting employer:", error);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors text-sm sm:text-base flex-shrink-0"
              >
                ← Back
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Briefcase size={20} className="text-red-400 sm:w-7 sm:h-7 flex-shrink-0" />
                  <span className="truncate">Employer Management</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Manage and verify employer accounts</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/admin/employer-verification")}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors text-sm sm:text-base flex-shrink-0"
            >
              <Clock size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="whitespace-nowrap">Pending Reviews ({stats.pending})</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <StatCard
            icon={Building2}
            label="Total Employers"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon={Clock}
            label="Pending Review"
            value={stats.pending}
            color="yellow"
          />
          <StatCard
            icon={CheckCircle}
            label="Verified"
            value={stats.verified}
            color="green"
          />
          <StatCard
            icon={XCircle}
            label="Rejected"
            value={stats.rejected}
            color="red"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company name, email..."
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors text-sm sm:text-base"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-red-500 transition-colors text-sm sm:text-base"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Employers List */}
        {filteredEmployers.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/70 border border-gray-800 rounded-xl">
            <Briefcase className="mx-auto text-gray-600 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-white mb-2">No employers found</h3>
            <p className="text-gray-400">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters or search query."
                : "No employer accounts have been registered yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEmployers.map((employer, index) => (
              <EmployerCard
                key={employer.id}
                employer={employer}
                index={index}
                onApprove={handleQuickApprove}
                onReject={handleQuickReject}
                onViewDetails={() => navigate(`/admin/employer/${employer.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }) {
  const colorClasses = {
    blue: "bg-blue-500/20 border-blue-500/30 text-blue-400",
    yellow: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
    green: "bg-green-500/20 border-green-500/30 text-green-400",
    red: "bg-red-500/20 border-red-500/30 text-red-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/70 border border-gray-800 rounded-xl p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon size={20} className="sm:w-6 sm:h-6" />
        </div>
        <TrendingUp className="text-gray-600" size={16} />
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs sm:text-sm text-gray-400">{label}</p>
    </motion.div>
  );
}

// Employer Card Component
function EmployerCard({ employer, index, onApprove, onReject, onViewDetails }) {
  const getStatusDisplay = () => {
    switch (employer.verificationStatus) {
      case "tier1_verified":
      case "tier2_verified":
        return {
          icon: CheckCircle,
          text: employer.verificationStatus === "tier2_verified" ? "Premium Verified" : "Verified",
          color: "text-green-400",
          bg: "bg-green-500/20",
          border: "border-green-500/40",
        };
      case "rejected":
        return {
          icon: XCircle,
          text: "Rejected",
          color: "text-red-400",
          bg: "bg-red-500/20",
          border: "border-red-500/40",
        };
      default:
        return {
          icon: Clock,
          text: "Pending Review",
          color: "text-yellow-400",
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/40",
        };
    }
  };

  const status = getStatusDisplay();
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-gray-900/70 border border-gray-800 rounded-xl p-4 sm:p-6 hover:border-red-500/40 transition-all"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Company Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-base sm:text-xl flex-shrink-0">
              {employer.companyName?.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-xl font-semibold text-white mb-1 truncate">
                {employer.companyName}
              </h3>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-3 text-xs sm:text-sm text-gray-400">
                <span className="flex items-center gap-1 truncate">
                  <Mail size={12} className="sm:w-[14px] sm:h-[14px] flex-shrink-0" />
                  <span className="truncate">{employer.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Building2 size={12} className="sm:w-[14px] sm:h-[14px] flex-shrink-0" />
                  <span className="truncate">{employer.industry}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} className="sm:w-[14px] sm:h-[14px] flex-shrink-0" />
                  {new Date(employer.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1">Company Size</p>
              <p className="text-white font-medium text-sm sm:text-base truncate">{employer.companySize}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1">Contact Person</p>
              <p className="text-white font-medium text-sm sm:text-base truncate">{employer.contactPerson}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border ${status.bg} ${status.border}`}>
            <StatusIcon size={14} className={`${status.color} sm:w-4 sm:h-4`} />
            <span className={`text-xs sm:text-sm font-medium ${status.color}`}>{status.text}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[140px]">
          <button
            onClick={onViewDetails}
            className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors text-xs sm:text-sm"
          >
            <Eye size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">View</span>
          </button>

          {employer.verificationStatus === "pending" && (
            <>
              <button
                onClick={() => onApprove(employer.id)}
                className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 transition-colors text-xs sm:text-sm"
              >
                <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                Approve
              </button>
              <button
                onClick={() => onReject(employer.id)}
                className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-colors text-xs sm:text-sm"
              >
                <XCircle size={14} className="sm:w-4 sm:h-4" />
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      {/* Documents Info */}
      {employer.documents && employer.documents.length > 0 && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-800">
          <p className="text-xs sm:text-sm text-gray-400 mb-2">
            <Shield size={12} className="inline mr-1 sm:w-[14px] sm:h-[14px]" />
            {employer.documents.length} document(s) uploaded
          </p>
        </div>
      )}
    </motion.div>
  );
}
