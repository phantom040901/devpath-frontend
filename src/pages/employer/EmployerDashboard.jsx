// src/pages/employer/EmployerDashboard.jsx
import { useEmployer } from "../../contexts/EmployerContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  FileText,
  Settings,
  LogOut,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  TrendingUp,
  Heart,
} from "lucide-react";

export default function EmployerDashboard() {
  const { employer, logoutEmployer } = useEmployer();
  const navigate = useNavigate();

  if (!employer) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logoutEmployer();
      navigate("/employer/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getVerificationStatusDisplay = () => {
    switch (employer.verificationStatus) {
      case "tier1_verified":
        return {
          icon: CheckCircle,
          text: "Verified",
          color: "green",
          bgColor: "bg-green-500/20",
          borderColor: "border-green-500/40",
          textColor: "text-green-400",
          iconBg: "bg-green-500/20",
        };
      case "tier2_verified":
        return {
          icon: Shield,
          text: "Premium Verified",
          color: "blue",
          bgColor: "bg-blue-500/20",
          borderColor: "border-blue-500/40",
          textColor: "text-blue-400",
          iconBg: "bg-blue-500/20",
        };
      case "rejected":
        return {
          icon: AlertCircle,
          text: "Verification Failed",
          color: "red",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/40",
          textColor: "text-red-400",
          iconBg: "bg-red-500/20",
        };
      default:
        return {
          icon: Clock,
          text: "Pending Verification",
          color: "yellow",
          bgColor: "bg-yellow-500/20",
          borderColor: "border-yellow-500/40",
          textColor: "text-yellow-400",
          iconBg: "bg-yellow-500/20",
        };
    }
  };

  const verificationStatus = getVerificationStatusDisplay();
  const StatusIcon = verificationStatus.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/70 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                <Briefcase className="text-blue-400" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{employer.companyName}</h1>
                <p className="text-sm text-gray-400">{employer.industry}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-300 hover:bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-300 transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Verification Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${verificationStatus.bgColor} ${verificationStatus.borderColor} border rounded-xl p-6 mb-8`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${verificationStatus.iconBg}`}>
              <StatusIcon className={verificationStatus.textColor} size={28} />
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${verificationStatus.textColor} mb-2`}>
                {verificationStatus.text}
              </h3>
              {employer.verificationStatus === "pending" && (
                <div className="text-gray-300">
                  <p className="mb-3">
                    Your account is currently under review. This typically takes 1-2 business days.
                  </p>
                  <div className="bg-gray-900/70 border border-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2 font-medium">What happens next:</p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-0.5" />
                        Our team will verify your company information
                      </li>
                      {employer.documents?.length > 0 && (
                        <li className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-green-400 mt-0.5" />
                          We'll review your submitted documents
                        </li>
                      )}
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-0.5" />
                        You'll receive an email once approved
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              {employer.verificationStatus === "tier1_verified" && (
                <div className="text-gray-300">
                  <p className="mb-3">
                    Your account is verified! You can now access student profiles and post job
                    opportunities.
                  </p>
                  {(!employer.documents || employer.documents.length === 0) && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-sm text-blue-300">
                        <strong>Get Premium Verification:</strong> Upload business documents to get a
                        premium badge and 3x more visibility.{" "}
                        <button
                          onClick={() => navigate("/employer/verification")}
                          className="underline hover:text-blue-200 font-medium"
                        >
                          Upload now
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              )}
              {employer.verificationStatus === "tier2_verified" && (
                <p className="text-gray-300">
                  You have premium verification! Your profile gets priority placement and 3x more
                  views from students.
                </p>
              )}
              {employer.verificationStatus === "rejected" && (
                <div className="text-gray-300">
                  <p className="mb-3">
                    Your verification was not approved. Please review the reason below and resubmit.
                  </p>
                  <div className="bg-gray-900/70 border border-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2 font-medium">Reason:</p>
                    <p className="text-sm text-gray-300">
                      {employer.rejectionReason ||
                        "Please contact support for more information."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Users className="text-blue-400" size={24} />
              </div>
              <TrendingUp className="text-green-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white mb-1">0</p>
            <p className="text-gray-400 text-sm">Profile Views</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <FileText className="text-purple-400" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">0</p>
            <p className="text-gray-400 text-sm">Active Job Posts</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-500/20">
                <Users className="text-green-400" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">0</p>
            <p className="text-gray-400 text-sm">Student Matches</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/employer/browse-students")}
              disabled={employer.verificationStatus === "pending"}
              className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-b from-gray-900 via-gray-950 to-black hover:bg-gray-800 border border-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Users className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="font-semibold text-white">Browse Students</p>
                <p className="text-sm text-gray-400">Find talented IT students</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/employer/saved-students")}
              disabled={employer.verificationStatus === "pending"}
              className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-b from-gray-900 via-gray-950 to-black hover:bg-gray-800 border border-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div className="p-3 rounded-lg bg-red-500/20">
                <Heart className="text-red-400" size={24} />
              </div>
              <div>
                <p className="font-semibold text-white">Saved Students</p>
                <p className="text-sm text-gray-400">View your bookmarked students</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/employer/settings")}
              className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-b from-gray-900 via-gray-950 to-black hover:bg-gray-800 border border-gray-800 transition-colors text-left"
            >
              <div className="p-3 rounded-lg bg-gray-700">
                <Settings className="text-gray-400" size={24} />
              </div>
              <div>
                <p className="font-semibold text-white">Company Settings</p>
                <p className="text-sm text-gray-400">Update your profile</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/employer/verification")}
              className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-b from-gray-900 via-gray-950 to-black hover:bg-gray-800 border border-gray-800 transition-colors text-left"
            >
              <div className="p-3 rounded-lg bg-green-500/20">
                <Shield className="text-green-400" size={24} />
              </div>
              <div>
                <p className="font-semibold text-white">Verification Status</p>
                <p className="text-sm text-gray-400">View verification details</p>
              </div>
            </button>
          </div>
        </div>

        {/* Company Profile */}
        <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-4">Company Profile</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1 font-medium">Email</p>
                <p className="text-white">{employer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1 font-medium">Company Size</p>
                <p className="text-white">{employer.companySize}</p>
              </div>
            </div>

            {employer.companyWebsite && (
              <div>
                <p className="text-sm text-gray-400 mb-1 font-medium">Website</p>
                <a
                  href={employer.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {employer.companyWebsite}
                </a>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1 font-medium">Contact Person</p>
                <p className="text-white">{employer.contactPerson}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1 font-medium">Contact Phone</p>
                <p className="text-white">{employer.contactPhone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
