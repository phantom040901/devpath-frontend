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

  // Map of assessment IDs to icons and colors
  const assessmentConfig = {
    "operating_systems": {
      icon: <Cpu className="text-blue-400" size={32} />,
      color: "blue",
    },
    "algorithms": {
      icon: <Brain className="text-purple-400" size={32} />,
      color: "purple",
    },
    "programming": {
      icon: <Code className="text-green-400" size={32} />,
      color: "green",
    },
    "software_engineering": {
      icon: <BookOpen className="text-cyan-400" size={32} />,
      color: "cyan",
    },
    "computer_networks": {
      icon: <Network className="text-pink-400" size={32} />,
      color: "pink",
    },
    "communication": {
      icon: <MessageSquare className="text-orange-400" size={32} />,
      color: "orange",
    },
    "mathematics": {
      icon: <Calculator className="text-yellow-400" size={32} />,
      color: "yellow",
    },
    "electronics": {
      icon: <Radio className="text-red-400" size={32} />,
      color: "red",
    },
    "computer_architecture": {
      icon: <Cpu className="text-indigo-400" size={32} />,
      color: "indigo",
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

        {/* Assessments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {assessments.map((assessment, index) => {
            const config = assessmentConfig[assessment.id] || {
              icon: <BookOpen className="text-gray-400" size={32} />,
              color: "gray",
            };

            const result = completedTests[assessment.id];
            const isCompleted = !!result;
            const score = result?.score;

            return (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-gradient-to-br from-gray-800/80 to-gray-900/90 border rounded-2xl p-6 shadow-lg ${
                  isCompleted
                    ? `border-${config.color}-400/50`
                    : "border-gray-700 hover:border-cyan-400/30"
                }`}
              >
                {/* Completed Badge */}
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className={`text-${config.color}-400`} size={24} />
                  </div>
                )}

                <div className="mb-4">
                  <div className="mb-3">{config.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {assessment.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {assessment.description}
                  </p>

                  {isCompleted && (
                    <div className={`mt-3 px-4 py-2.5 bg-${config.color}-500/20 border border-${config.color}-400/50 rounded-lg`}>
                      <div className={`flex items-center gap-2 text-${config.color}-400 font-bold`}>
                        <CheckCircle2 size={18} />
                        <span className="text-base">
                          Score: {score}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {!isCompleted && (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleTakeTest(assessment)}
                      className={`w-full px-4 py-3 bg-${config.color}-500 text-white rounded-lg hover:bg-${config.color}-600 transition flex items-center justify-center gap-2 font-medium`}
                    >
                      {config.icon}
                      Take Assessment
                      <Clock size={16} className="opacity-70" />
                      {assessment.duration || "15"} minutes
                    </button>
                  </div>
                )}

                {isCompleted && (
                  <div className="space-y-2">
                    {/* Check if score is already good (>= 70%) */}
                    {score >= 70 ? (
                      <div className="w-full px-4 py-2 bg-yellow-500/20 border border-yellow-400/50 rounded-lg text-center">
                        <div className="flex items-center justify-center gap-2 text-yellow-400 text-sm font-medium">
                          <Trophy size={16} />
                          <span>Proficiency Achieved!</span>
                        </div>
                      </div>
                    ) : result.attempts < 2 ? (
                      <button
                        onClick={() => handleTakeTest(assessment)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition flex items-center justify-center gap-2 font-medium"
                      >
                        Retake Assessment ({result.attempts}/2)
                      </button>
                    ) : (
                      <div className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-center">
                        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                          <Lock size={16} />
                          <span>Max attempts reached (2/2)</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
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
