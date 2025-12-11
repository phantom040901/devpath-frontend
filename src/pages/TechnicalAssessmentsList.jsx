// src/pages/TechnicalAssessmentsList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthContext";
import { motion } from "framer-motion";
import DashNav from "../components/dashboard/DashboardNav";
import { Brain, Code, Mic, Gamepad2, PenTool, CheckCircle2, SkipForward, Clock, AlertCircle, Sparkles, Users } from "lucide-react";

export default function TechnicalAssessmentsList() {
  const { user } = useAuth() || {};
  const navigate = useNavigate();

  const [completedTests, setCompletedTests] = useState({});
  const [loading, setLoading] = useState(true);

  const technicalAssessments = [
    {
      id: "logical-quotient",
      title: "Logical Quotient Test",
      description: "15 MCQ questions testing patterns, sequences, and logical reasoning",
      icon: <Brain className="text-purple-400" size={32} />,
      field: "Logical quotient rating",
      duration: "15 minutes",
      defaultScore: 5, // 1-9 scale, default middle
      color: "purple",
    },
    {
      id: "coding-challenge",
      title: "Coding Challenge",
      description: "3 programming problems: Easy, Medium, and Hard",
      icon: <Code className="text-blue-400" size={32} />,
      field: "coding skills rating",
      duration: "30 minutes",
      defaultScore: 5,
      color: "blue",
    },
    {
      id: "public-speaking",
      title: "Public Speaking Assessment",
      description: "Rate your communication and presentation skills",
      icon: <Users className="text-pink-400" size={32} />,
      field: "public speaking points",
      duration: "5 minutes",
      defaultScore: 5,
      color: "pink",
    },
    {
      id: "reading-writing",
      title: "Reading & Writing Skills",
      description: "Assess your written communication and comprehension abilities",
      icon: <PenTool className="text-orange-400" size={32} />,
      field: "reading and writing skills",
      duration: "10 minutes",
      defaultScore: "medium", // poor/medium/excellent
      color: "orange",
    },
    {
      id: "memory-game",
      title: "Memory Passage Test",
      description: "Test your short-term memory and recall ability",
      icon: <Gamepad2 className="text-green-400" size={32} />,
      field: "Memory Passage Test",
      duration: "5 minutes",
      defaultScore: 5, // 1-9 scale
      color: "green",
    },
  ];

  useEffect(() => {
    loadProgress();
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, "users", user.uid, "assessments", "technical");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCompletedTests(docSnap.data());
      }
    } catch (err) {
      console.error("Failed to load progress:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async (assessment) => {
    if (!user) return;

    const confirmed = confirm(
      `Skip ${assessment.title}? A default score will be assigned.`
    );

    if (!confirmed) return;

    try {
      const updatedTests = {
        ...completedTests,
        [assessment.field]: assessment.defaultScore,
      };

      await setDoc(
        doc(db, "users", user.uid, "assessments", "technical"),
        updatedTests
      );

      setCompletedTests(updatedTests);
    } catch (err) {
      console.error("Failed to skip test:", err);
      alert("Failed to skip test. Please try again.");
    }
  };

  const handleTakeTest = (assessment) => {
    // Navigate to placeholder assessment
    navigate(`/technical-assessment/${assessment.id}`);
  };

  const handleFinish = async () => {
    const allCompleted = technicalAssessments.every(
      (assessment) => completedTests[assessment.field] !== undefined
    );

    if (!allCompleted) {
      alert("Please complete or skip all assessments before finishing.");
      return;
    }

    // Save completed flag and call backend for recommendations
    try {
      await setDoc(
        doc(db, "users", user.uid, "assessments", "technical"),
        { ...completedTests, completed: true },
        { merge: true }
      );

      // Navigate to results/recommendations
      navigate("/career-matches");
    } catch (err) {
      console.error("Failed to save progress:", err);
      alert("Failed to save progress. Please try again.");
    }
  };

  const completedCount = Object.keys(completedTests).filter((key) =>
    technicalAssessments.some((a) => a.field === key)
  ).length;
  const progress = (completedCount / technicalAssessments.length) * 100;

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
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400 bg-clip-text text-transparent mb-4">
            🚀 Technical Assessments
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Complete hands-on assessments or skip to proceed. These tests evaluate your practical skills.
          </p>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">
                {completedCount} / {technicalAssessments.length} completed
              </span>
              <span className="text-sm text-cyan-400 font-medium">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto mb-8 p-4 bg-purple-500/10 border border-purple-400/30 rounded-lg flex items-start gap-3"
        >
          <Sparkles className="text-purple-400 flex-shrink-0 mt-1" size={20} />
          <div className="text-sm text-gray-300">
            <p className="font-medium text-white mb-1">Placeholder Assessments</p>
            <p>
              These are simplified placeholder assessments. Click "Take Assessment" to see
              the placeholder interface. You can skip any assessment to proceed faster.
            </p>
          </div>
        </motion.div>

        {/* Assessments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {technicalAssessments.map((assessment, index) => {
            const isCompleted = completedTests[assessment.field] !== undefined;
            const score = completedTests[assessment.field];

            return (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-gradient-to-br from-gray-800/80 to-gray-900/90 border rounded-2xl p-6 shadow-lg ${
                  isCompleted
                    ? `border-${assessment.color}-400/50`
                    : "border-gray-700 hover:border-cyan-400/30"
                }`}
              >
                {/* Completed Badge */}
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className={`text-${assessment.color}-400`} size={24} />
                  </div>
                )}

                <div className="mb-4">
                  <div className="mb-3">{assessment.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {assessment.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {assessment.description}
                  </p>

                  {isCompleted && (
                    <div className={`mt-3 px-4 py-2.5 bg-${assessment.color}-500/20 border border-${assessment.color}-400/50 rounded-lg`}>
                      <div className={`flex items-center gap-2 text-${assessment.color}-400 font-bold`}>
                        <CheckCircle2 size={18} />
                        <span className="text-base">
                          Score: {typeof score === "number" ? `${score}/9` : score.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {!isCompleted && (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleTakeTest(assessment)}
                      className={`w-full px-4 py-3 bg-${assessment.color}-500 text-white rounded-lg hover:bg-${assessment.color}-600 transition flex items-center justify-center gap-2 font-medium`}
                    >
                      {assessment.icon}
                      Take Assessment
                      <Clock size={16} className="opacity-70" />
                      {assessment.duration}
                    </button>
                    <button
                      onClick={() => handleSkip(assessment)}
                      className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2 text-sm"
                    >
                      <SkipForward size={16} />
                      Skip (Default: {typeof assessment.defaultScore === "number" ? `${assessment.defaultScore}/9` : assessment.defaultScore})
                    </button>
                  </div>
                )}

                {isCompleted && (
                  <button
                    onClick={() => handleTakeTest(assessment)}
                    className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition text-sm"
                  >
                    Retake Assessment
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Finish Button */}
        {completedCount === technicalAssessments.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={handleFinish}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-lg font-bold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition shadow-lg flex items-center gap-3 mx-auto"
            >
              <Sparkles size={24} />
              Finish & Get Career Recommendations
              <Sparkles size={24} />
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
