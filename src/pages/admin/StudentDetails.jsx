// src/pages/admin/StudentDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import AdminNav from "../../components/admin/AdminNav";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  BookOpen,
  Code,
  User,
  Target,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  MapPin,
  Trophy,
  Clock,
  ArrowRight,
  Shield,
  ShieldCheck
} from "lucide-react";

export default function StudentDetails() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [roadmapProgress, setRoadmapProgress] = useState(null);
  const [showAllAssessments, setShowAllAssessments] = useState(false);
  const [bypassMaintenance, setBypassMaintenance] = useState(false);
  const [updatingBypass, setUpdatingBypass] = useState(false);

  useEffect(() => {
    loadStudentData();
  }, [studentId]);

  const safeToDate = (timestamp) => {
    if (!timestamp) return null;
    if (timestamp && typeof timestamp.toDate === 'function') {
      try {
        return timestamp.toDate();
      } catch (error) {
        return null;
      }
    }
    if (timestamp instanceof Date) return timestamp;
    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      try {
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? null : date;
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const toggleBypassMaintenance = async () => {
    try {
      setUpdatingBypass(true);
      const userRef = doc(db, "users", studentId);
      const newValue = !bypassMaintenance;

      await updateDoc(userRef, {
        bypassMaintenance: newValue,
        bypassMaintenanceUpdatedAt: new Date().toISOString()
      });

      setBypassMaintenance(newValue);
      console.log(`Bypass maintenance ${newValue ? 'enabled' : 'disabled'} for user:`, studentId);
    } catch (error) {
      console.error("Error updating bypass maintenance:", error);
      alert("Failed to update bypass maintenance permission. Please try again.");
    } finally {
      setUpdatingBypass(false);
    }
  };

  const loadStudentData = async () => {
    try {
      console.log('Loading student data for:', studentId);
      
      const userDocRef = doc(db, "users", studentId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        console.error('Student not found');
        setLoading(false);
        return;
      }

      const userData = userDoc.data();

      // Set bypass maintenance permission
      setBypassMaintenance(userData.bypassMaintenance || false);

      // Get roadmap progress
      const roadmapDoc = await getDoc(doc(db, 'roadmapProgress', studentId));
      if (roadmapDoc.exists()) {
        setRoadmapProgress(roadmapDoc.data());
      }

      // Get all results
      const resultsRef = collection(db, "users", studentId, "results");
      const resultsSnap = await getDocs(resultsRef);

      // Get selected career
      const careerRef = collection(db, "users", studentId, "selectedCareer");
      const careerSnap = await getDocs(careerRef);
      const careerData = careerSnap.empty ? null : careerSnap.docs[0].data();

      // Process assessments
      const assessmentsList = [];
      const academic = [];
      const technical = [];
      const personal = [];

      resultsSnap.docs.forEach(doc => {
        const data = doc.data();
        const assessment = {
          id: doc.id,
          name: doc.id.replace('assessments_', '').replace('technicalAssessments_', '').replace('survey_', '').replace(/_/g, ' '),
          score: data.score || 0,
          assessmentId: data.assessmentId,
          type: doc.id.includes('technicalAssessments_') ? 'technical' : 
                doc.id.includes('assessments_') ? 'academic' : 'personal'
        };

        assessmentsList.push(assessment);

        if (assessment.type === 'academic') {
          academic.push(data.score || 0);
        } else if (assessment.type === 'technical') {
          technical.push(data.score || 0);
        } else {
          personal.push(data.score || 0);
        }
      });

      // Calculate averages
      const avgAcademic = academic.length > 0
        ? Math.round(academic.reduce((a, b) => a + b, 0) / academic.length)
        : 0;

      const avgTechnical = technical.length > 0
        ? Math.round(technical.reduce((a, b) => a + b, 0) / technical.length)
        : 0;

      const avgPersonal = personal.length > 0
        ? Math.round(personal.reduce((a, b) => a + b, 0) / personal.length)
        : 0;

      const overallAvg = [...academic, ...technical].length > 0
        ? Math.round([...academic, ...technical].reduce((a, b) => a + b, 0) / (academic.length + technical.length))
        : 0;

      // Determine status
      let status = "active";
      if (overallAvg < 50) status = "struggling";
      if (overallAvg >= 80) status = "excellent";
      if (resultsSnap.size === 0) status = "inactive";

      const completionRate = Math.min(100, Math.round((resultsSnap.size / 17) * 100));

      let lastActivity = null;
      if (careerData && careerData.selectedAt) {
        lastActivity = safeToDate(careerData.selectedAt);
      }
      if (!lastActivity && userData.createdAt) {
        lastActivity = safeToDate(userData.createdAt);
      }

      setStudent({
        id: studentId,
        name: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email || "Unknown",
        email: userData.email || "No email",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        course: userData.course || "Not specified",
        yearLevel: userData.yearLevel || "Not specified",
        academicAvg: avgAcademic,
        technicalAvg: avgTechnical,
        personalAvg: avgPersonal,
        overallAvg,
        completionRate,
        status,
        totalAssessments: resultsSnap.size,
        selectedCareer: careerData?.jobRole || "Not selected",
        lastActivity,
        createdAt: safeToDate(userData.createdAt)
      });

      setAssessments(assessmentsList);

    } catch (error) {
      console.error("Error loading student data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      excellent: {
        icon: <CheckCircle size={20} />,
        text: "Excellent Performance",
        color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30"
      },
      active: {
        icon: <TrendingUp size={20} />,
        text: "Active",
        color: "text-blue-400 bg-blue-500/20 border-blue-500/30"
      },
      struggling: {
        icon: <AlertCircle size={20} />,
        text: "Needs Support",
        color: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
      },
      inactive: {
        icon: <XCircle size={20} />,
        text: "Inactive",
        color: "text-gray-400 bg-gray-500/20 border-gray-500/30"
      }
    };
    return badges[status] || badges.active;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-400" size={48} />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
        <AdminNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Student Not Found</h1>
            <button
              onClick={() => navigate('/admin/students')}
              className="text-primary-400 hover:text-primary-300 flex items-center gap-2 mx-auto"
            >
              <ArrowLeft size={20} />
              Back to Students
            </button>
          </div>
        </div>
      </div>
    );
  }

  const badge = getStatusBadge(student.status);
  const moduleEntries = roadmapProgress ? Object.entries(roadmapProgress.modules || {}) : [];
  const startDate = roadmapProgress?.startedAt ? new Date(roadmapProgress.startedAt) : null;
  const daysSinceStart = startDate 
    ? Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24))
    : 0;

  // Get top 5 assessments by score
  const topAssessments = [...assessments]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Determine which assessments to display
  const displayedAssessments = showAllAssessments ? assessments : topAssessments;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{student.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    {student.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Joined {formatDate(student.createdAt)}
                  </div>
                </div>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${badge.color}`}>
              {badge.icon}
              {badge.text}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Award className="text-primary-400" size={24} />}
            label="Overall Average"
            value={`${student.overallAvg}%`}
            color="from-primary-500/20 to-purple-600/20 border-primary-500/30"
          />
          <StatCard
            icon={<BookOpen className="text-blue-400" size={24} />}
            label="Academic Average"
            value={`${student.academicAvg}%`}
            color="from-blue-500/20 to-cyan-600/20 border-blue-500/30"
          />
          <StatCard
            icon={<Code className="text-purple-400" size={24} />}
            label="Technical Average"
            value={`${student.technicalAvg}%`}
            color="from-purple-500/20 to-pink-600/20 border-purple-500/30"
          />
          <StatCard
            icon={<Target className="text-emerald-400" size={24} />}
            label="Completion Rate"
            value={`${student.completionRate}%`}
            color="from-emerald-500/20 to-teal-600/20 border-emerald-500/30"
          />
        </div>

        {/* Roadmap Progress Section */}
        {roadmapProgress && (
          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  <MapPin className="text-primary-400" size={24} />
                  Learning Roadmap Progress
                </h2>
                <p className="text-gray-400 text-sm">{roadmapProgress.category}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-400">
                  {roadmapProgress.totalProgress || 0}%
                </div>
                <div className="text-xs text-gray-400">Overall Progress</div>
              </div>
            </div>

            {/* Roadmap Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-emerald-400" size={16} />
                  <span className="text-xs text-gray-400">Completed</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {roadmapProgress.completedModules?.length || 0}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="text-blue-400" size={16} />
                  <span className="text-xs text-gray-400">Current</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  Module {roadmapProgress.currentModule || 1}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-purple-400" size={16} />
                  <span className="text-xs text-gray-400">Days Active</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {daysSinceStart}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-yellow-400" size={16} />
                  <span className="text-xs text-gray-400">Modules</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {moduleEntries.length}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Overall Progress</span>
                <span className="text-white font-semibold">
                  {roadmapProgress.totalProgress || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${roadmapProgress.totalProgress || 0}%` }}
                />
              </div>
            </div>

            {/* Module Details */}
            {moduleEntries.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Module Details</h3>
                <div className="space-y-3">
                  {moduleEntries
                    .sort((a, b) => {
                      const numA = parseInt(a[0].replace('module', ''));
                      const numB = parseInt(b[0].replace('module', ''));
                      return numA - numB;
                    })
                    .map(([moduleId, moduleData]) => {
                      const moduleNum = moduleId.replace('module', '');
                      const isCompleted = moduleData.completed;

                      return (
                        <div
                          key={moduleId}
                          className={`p-4 rounded-lg border ${
                            isCompleted 
                              ? 'bg-emerald-500/10 border-emerald-500/50' 
                              : 'bg-gray-800/50 border-gray-700/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                isCompleted 
                                  ? 'bg-emerald-500/20 text-emerald-400' 
                                  : 'bg-gray-700/50 text-gray-400'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle size={20} />
                                ) : (
                                  moduleNum
                                )}
                              </div>
                              <div>
                                <h4 className="text-white font-semibold">Module {moduleNum}</h4>
                                {moduleData.lastUpdated && (
                                  <p className="text-xs text-gray-400">
                                    Updated: {new Date(moduleData.lastUpdated).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            {isCompleted && (
                              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold border border-emerald-500/30">
                                Completed
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className={`p-3 rounded-lg ${
                              moduleData.quizCompleted 
                                ? 'bg-blue-500/10 border border-blue-500/30' 
                                : 'bg-gray-700/30 border border-gray-700/40'
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Award size={14} className={moduleData.quizCompleted ? 'text-blue-400' : 'text-gray-500'} />
                                <span className="text-xs text-gray-400">Quiz</span>
                              </div>
                              <div className={`text-lg font-bold ${
                                moduleData.quizCompleted ? 'text-blue-400' : 'text-gray-500'
                              }`}>
                                {moduleData.quizScore !== undefined ? `${moduleData.quizScore}%` : 'Not taken'}
                              </div>
                            </div>

                            <div className={`p-3 rounded-lg ${
                              moduleData.challengeCompleted 
                                ? 'bg-purple-500/10 border border-purple-500/30' 
                                : 'bg-gray-700/30 border border-gray-700/40'
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Target size={14} className={moduleData.challengeCompleted ? 'text-purple-400' : 'text-gray-500'} />
                                <span className="text-xs text-gray-400">Challenge</span>
                              </div>
                              <div className={`text-lg font-bold ${
                                moduleData.challengeCompleted ? 'text-purple-400' : 'text-gray-500'
                              }`}>
                                {moduleData.challengeCompleted ? 'Completed' : 'Pending'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Student Info */}
          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <User size={20} className="text-primary-400" />
              Student Information
            </h2>
            <div className="space-y-3">
              <InfoRow label="Course" value={student.course} />
              <InfoRow label="Year Level" value={student.yearLevel} />
              <InfoRow label="Total Assessments" value={student.totalAssessments} />
              <InfoRow label="Last Activity" value={formatDate(student.lastActivity)} />

              {/* Bypass Maintenance Permission */}
              <div className="pt-3 border-t border-gray-800">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    {bypassMaintenance ? (
                      <ShieldCheck size={18} className="text-emerald-400" />
                    ) : (
                      <Shield size={18} className="text-gray-400" />
                    )}
                    <div>
                      <span className="text-white font-medium text-sm block">Maintenance Bypass</span>
                      <span className="text-xs text-gray-400">
                        {bypassMaintenance ? 'Can access during maintenance' : 'Normal access restrictions'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={toggleBypassMaintenance}
                    disabled={updatingBypass}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                      bypassMaintenance
                        ? 'bg-emerald-500'
                        : 'bg-gray-700'
                    } ${updatingBypass ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        bypassMaintenance ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {bypassMaintenance && (
                  <div className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <p className="text-xs text-emerald-300 flex items-center gap-1.5">
                      <AlertCircle size={12} />
                      This student can access their dashboard even when the system is under maintenance.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Career Info */}
          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-emerald-400" />
              Career Path
            </h2>
            <div className="space-y-3">
              <InfoRow label="Selected Career" value={student.selectedCareer} />
              <div className="pt-3 border-t border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Assessment Progress</span>
                  <span className="text-white font-semibold">{student.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-emerald-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${student.completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessments Table */}
        <div className="bg-gray-900/70 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Assessment History</h2>
              <p className="text-sm text-gray-400">
                {showAllAssessments 
                  ? `Showing all ${assessments.length} assessments` 
                  : `Showing top 5 scored assessments (${assessments.length} total)`
                }
              </p>
            </div>
            {assessments.length > 5 && (
              <button
                onClick={() => setShowAllAssessments(!showAllAssessments)}
                className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-all text-sm flex items-center gap-2"
              >
                {showAllAssessments ? (
                  <>
                    <Award size={16} />
                    Show Top 5
                  </>
                ) : (
                  <>
                    <BookOpen size={16} />
                    View All ({assessments.length})
                  </>
                )}
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    {showAllAssessments ? 'Assessment Name' : 'Top Assessments'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Score
                  </th>
                  {!showAllAssessments && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                      Rank
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {displayedAssessments.length > 0 ? (
                  displayedAssessments.map((assessment, index) => (
                    <tr key={assessment.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium capitalize">
                          {assessment.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          assessment.type === 'academic' 
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : assessment.type === 'technical'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {assessment.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-lg font-bold ${
                          assessment.score >= 80 ? 'text-emerald-400' :
                          assessment.score >= 60 ? 'text-blue-400' :
                          assessment.score >= 40 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {assessment.score}%
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={showAllAssessments ? "3" : "4"} className="px-6 py-12 text-center text-gray-400">
                      No assessments completed yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Summary Footer */}
          {assessments.length > 0 && (
            <div className="p-4 bg-gray-800/30 border-t border-gray-800">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-gray-400">Highest Score: </span>
                    <span className="text-emerald-400 font-bold">
                      {Math.max(...assessments.map(a => a.score))}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Lowest Score: </span>
                    <span className="text-red-400 font-bold">
                      {Math.min(...assessments.map(a => a.score))}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Total Assessments: </span>
                    <span className="text-white font-bold">
                      {assessments.length}
                    </span>
                  </div>
                </div>
                {!showAllAssessments && assessments.length > 5 && (
                  <button
                    onClick={() => setShowAllAssessments(true)}
                    className="text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    View all {assessments.length} assessments
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} border rounded-xl p-5`}>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <div className="text-xs font-medium text-gray-400 uppercase">{label}</div>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-800">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}