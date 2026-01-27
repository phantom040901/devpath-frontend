// src/pages/AcademicAssessmentsList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthContext";
import { motion } from "framer-motion";
import DashNav from "../components/dashboard/DashboardNav";
import { BookOpen, Brain, Code, Network, Calculator, MessageSquare, Cpu, Radio, Sparkles, CheckCircle2, Clock, Lock, RefreshCw, Trophy } from "lucide-react";

export default function AcademicAssessmentsList() {
  const { user } = useAuth() || {};
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [completedTests, setCompletedTests] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Map of assessment IDs to icons - using consistent cyan/primary color scheme
  const assessmentConfig = {
    "operating_systems": {
      icon: <Cpu className="text-primary-400" size={32} />,
      color: "primary",
    },
    "algorithms": {
      icon: <Brain className="text-primary-400" size={32} />,
      color: "primary",
    },
    "programming": {
      icon: <Code className="text-primary-400" size={32} />,
      color: "primary",
    },
    "software_engineering": {
      icon: <BookOpen className="text-primary-400" size={32} />,
      color: "primary",
    },
    "computer_networks": {
      icon: <Network className="text-primary-400" size={32} />,
      color: "primary",
    },
    "communication": {
      icon: <MessageSquare className="text-primary-400" size={32} />,
      color: "primary",
    },
    "mathematics": {
      icon: <Calculator className="text-primary-400" size={32} />,
      color: "primary",
    },
    "electronics": {
      icon: <Radio className="text-primary-400" size={32} />,
      color: "primary",
    },
    "computer_architecture": {
      icon: <Cpu className="text-primary-400" size={32} />,
      color: "primary",
    },
  };

  useEffect(() => {
    loadAssessments();
  }, [user]);

  // Reload assessments when returning to the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        loadAssessments();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  const loadAssessments = async () => {
    try {
      // Fetch all academic assessments from Firestore
      const academicRef = collection(db, "assessments");
      const academicSnap = await getDocs(academicRef);
      const academicData = academicSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch user's results if logged in
      if (user) {
        const resultsRef = collection(db, "users", user.uid, "results");
        const resultsSnap = await getDocs(resultsRef);

        const completed = {};
        resultsSnap.docs.forEach((doc) => {
          const data = doc.data();
          const assessmentId = data.assessmentId;

          // Match assessments from the "assessments" collection
          // assessmentId can be either "assessment_id" or "assessments_assessment_id"
          if (assessmentId) {
            let baseId = assessmentId;

            // Remove "assessments_" prefix if it exists
            if (assessmentId.startsWith("assessments_")) {
              baseId = assessmentId.replace("assessments_", "");
            }

            // Only process if this is an academic assessment (not technical)
            if (data.collection === "assessments" || assessmentId.startsWith("assessments_")) {
              if (!completed[baseId] || data.score > (completed[baseId].score || 0)) {
                completed[baseId] = {
                  score: data.score,
                  submittedAt: data.submittedAt,
                  attempts: (completed[baseId]?.attempts || 0) + 1,
                };
              }
            }
          }
        });

        setCompletedTests(completed);
        console.log("✅ Loaded completed tests:", completed);
        console.log("📊 Completion count:", Object.keys(completed).length);
      }

      setAssessments(academicData);
      console.log("📚 Loaded assessments:", academicData.length);
    } catch (err) {
      console.error("❌ Failed to load assessments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeTest = (assessment) => {
    navigate(`/assessments/${assessment.id}`);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAssessments();
    setRefreshing(false);
  };

  const completedCount = Object.keys(completedTests).length;
  const progress = (completedCount / assessments.length) * 100 || 0;

  if (loading) {
    return (
      <section className="min-h-screen w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black px-4 sm:px-6 lg:px-10 py-12">
      <DashNav />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mt-12"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
              📚 Academic Assessments
            </h1>
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh assessments"
            >
              <RefreshCw
                size={20}
                className={`text-cyan-400 ${refreshing ? 'animate-spin' : ''}`}
              />
            </motion.button>
          </div>
          <p className="text-gray-300 text-lg mb-6">
            Test your knowledge across various computer science and engineering subjects
          </p>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">
                {completedCount} / {assessments.length} completed
              </span>
              <span className="text-sm text-cyan-400 font-medium">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                key={completedCount}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Bar Graph Visualization - Only show if there are completed assessments */}
        {completedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Trophy className="text-yellow-400" size={20} />
              Your Score Overview
            </h3>

            <div className="flex items-end justify-center gap-4 overflow-x-auto pb-4" style={{ minHeight: '220px' }}>
              {/* Sort assessments by score (highest first) */}
              {assessments
                .filter((assessment) => !!completedTests[assessment.id])
                .sort((a, b) => (completedTests[b.id]?.score || 0) - (completedTests[a.id]?.score || 0))
                .map((assessment, index) => {
                  const result = completedTests[assessment.id];
                  const score = result?.score || 0;

                  const barHeight = Math.max(score, 5);
                  const barColor = score >= 80 ? 'from-emerald-500 to-emerald-400' :
                                   score >= 60 ? 'from-cyan-500 to-cyan-400' :
                                   score >= 40 ? 'from-yellow-500 to-yellow-400' :
                                   'from-red-500 to-red-400';
                  const textColor = score >= 80 ? 'text-emerald-400' :
                                    score >= 60 ? 'text-cyan-400' :
                                    score >= 40 ? 'text-yellow-400' :
                                    'text-red-400';

                  // Get short name for display
                  const shortName = assessment.title
                    .replace('& ', '')
                    .split(' ')
                    .slice(0, 2)
                    .join(' ');

                  return (
                    <motion.div
                      key={assessment.id}
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      className="flex flex-col items-center min-w-[70px]"
                    >
                      {/* Rank badge for top 3 */}
                      {index < 3 && (
                        <span className={`text-xs font-bold mb-1 px-2 py-0.5 rounded-full ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          index === 1 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/30' :
                          'bg-amber-600/20 text-amber-500 border border-amber-600/30'
                        }`}>
                          #{index + 1}
                        </span>
                      )}

                      {/* Score percentage */}
                      <span className={`text-sm font-bold mb-2 ${textColor}`}>
                        {score}%
                      </span>

                      {/* Bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${barHeight * 1.5}px` }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
                        className={`w-12 rounded-t-lg bg-gradient-to-t ${barColor} shadow-lg`}
                      />

                      {/* Subject name */}
                      <div className="mt-3 text-center">
                        <span
                          className="text-xs text-gray-400 block max-w-[80px] leading-tight"
                          title={assessment.title}
                        >
                          {shortName}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mt-6 pt-4 border-t border-gray-700/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-gray-400">Excellent (80%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <span className="text-xs text-gray-400">Good (60-79%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-gray-400">Fair (40-59%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-400">Needs Work (&lt;40%)</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Assessments Table View */}
        <div className="bg-gray-900/70 border border-gray-700/40 rounded-2xl overflow-hidden mb-12">
          {/* Table Header */}
          <div className="bg-gray-800/80 border-b border-gray-700/50 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 items-center text-sm font-semibold text-gray-400 uppercase tracking-wider">
              <div className="col-span-4">Assessment</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-center">Score</div>
              <div className="col-span-2 text-center">Proficiency</div>
              <div className="col-span-2 text-center">Action</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-700/30">
            {assessments.map((assessment, index) => {
              const config = assessmentConfig[assessment.id] || {
                icon: <BookOpen className="text-primary-400" size={24} />,
                color: "primary",
              };

              const result = completedTests[assessment.id];
              const isCompleted = !!result;
              const score = result?.score;

              return (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-6 py-5 hover:bg-gray-800/30 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Assessment Name */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="flex-shrink-0">{config.icon}</div>
                      <div>
                        <h3 className="text-white font-semibold text-base">
                          {assessment.title}
                        </h3>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {assessment.duration || "15"} minutes
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 text-center">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-400 text-xs font-medium">
                          <CheckCircle2 size={14} />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-700/50 border border-gray-600 text-gray-400 text-xs font-medium">
                          <Clock size={14} />
                          Pending
                        </span>
                      )}
                    </div>

                    {/* Score */}
                    <div className="col-span-2 text-center">
                      {isCompleted ? (
                        <span className="text-2xl font-bold text-cyan-400">
                          {score}%
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">—</span>
                      )}
                    </div>

                    {/* Proficiency */}
                    <div className="col-span-2 text-center">
                      {isCompleted && score >= 70 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/50 text-yellow-400 text-xs font-medium">
                          <Trophy size={14} />
                          Achieved
                        </span>
                      ) : isCompleted ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/50 text-red-400 text-xs font-medium">
                          Not Yet
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">—</span>
                      )}
                    </div>

                    {/* Action */}
                    <div className="col-span-2 text-center">
                      {!isCompleted ? (
                        <button
                          onClick={() => handleTakeTest(assessment)}
                          className="px-4 py-2 bg-cyan-500 text-white text-sm font-medium rounded-lg hover:bg-cyan-600 transition"
                        >
                          Take Test
                        </button>
                      ) : score < 70 && result.attempts < 2 ? (
                        <button
                          onClick={() => handleTakeTest(assessment)}
                          className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition"
                        >
                          Retake ({result.attempts}/2)
                        </button>
                      ) : result.attempts >= 2 && score < 70 ? (
                        <span className="text-gray-500 text-xs">Max Attempts</span>
                      ) : (
                        <span className="text-emerald-400 text-sm font-medium">✓ Complete</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Finish Button */}
        {completedCount === assessments.length && assessments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={() => navigate("/career-matches")}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-lg font-bold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition shadow-lg flex items-center gap-3 mx-auto"
            >
              <Sparkles size={24} />
              View Career Recommendations
              <Sparkles size={24} />
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
