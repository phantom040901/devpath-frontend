// src/pages/AcademicTestsList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthContext";
import { motion } from "framer-motion";
import DashNav from "../components/dashboard/DashboardNav";
import { BookOpen, CheckCircle2, SkipForward, Clock, AlertCircle } from "lucide-react";

export default function AcademicTestsList() {
  const { user } = useAuth() || {};
  const navigate = useNavigate();

  const [completedTests, setCompletedTests] = useState({});
  const [loading, setLoading] = useState(true);

  const academicSubjects = [
    {
      id: "operating-systems",
      title: "Operating Systems",
      description: "Test your knowledge of OS concepts, processes, and memory management",
      icon: "💻",
      field: "Acedamic percentage in Operating Systems",
    },
    {
      id: "algorithms",
      title: "Algorithms",
      description: "Assess your understanding of data structures and algorithmic thinking",
      icon: "🔄",
      field: "percentage in Algorithms",
    },
    {
      id: "programming-concepts",
      title: "Programming Concepts",
      description: "Evaluate your grasp of programming fundamentals and paradigms",
      icon: "💡",
      field: "Percentage in Programming Concepts",
    },
    {
      id: "software-engineering",
      title: "Software Engineering",
      description: "Test your knowledge of SDLC, design patterns, and best practices",
      icon: "🛠️",
      field: "Percentage in Software Engineering",
    },
    {
      id: "computer-networks",
      title: "Computer Networks",
      description: "Assess your understanding of networking protocols and architecture",
      icon: "🌐",
      field: "Percentage in Computer Networks",
    },
    {
      id: "electronics",
      title: "Electronics Subjects",
      description: "Test your knowledge of digital electronics and circuits",
      icon: "⚡",
      field: "Percentage in Electronics Subjects",
    },
    {
      id: "computer-architecture",
      title: "Computer Architecture",
      description: "Evaluate your understanding of hardware organization and design",
      icon: "🖥️",
      field: "Percentage in Computer Architecture",
    },
    {
      id: "mathematics",
      title: "Mathematics",
      description: "Test your mathematical reasoning and problem-solving skills",
      icon: "📐",
      field: "Percentage in Mathematics",
    },
    {
      id: "communication-skills",
      title: "Communication Skills",
      description: "Assess your written and verbal communication abilities",
      icon: "💬",
      field: "Percentage in Communication skills",
    },
  ];

  useEffect(() => {
    loadProgress();
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, "users", user.uid, "assessments", "academic");
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

  const handleSkip = async (subject) => {
    if (!user) return;

    const confirmed = confirm(
      `Skip ${subject.title}? A default score of 70% will be assigned.`
    );

    if (!confirmed) return;

    try {
      const updatedTests = {
        ...completedTests,
        [subject.field]: 70, // Default score for skipped test
      };

      await setDoc(
        doc(db, "users", user.uid, "assessments", "academic"),
        updatedTests
      );

      setCompletedTests(updatedTests);
    } catch (err) {
      console.error("Failed to skip test:", err);
      alert("Failed to skip test. Please try again.");
    }
  };

  const handleTakeTest = (subject) => {
    // Navigate to actual test (to be implemented later)
    alert(
      `Test for ${subject.title} is not yet implemented. This is a placeholder.`
    );
    // For now, just mark as skipped
    handleSkip(subject);
  };

  const handleContinue = async () => {
    const allCompleted = academicSubjects.every(
      (subject) => completedTests[subject.field] !== undefined
    );

    if (!allCompleted) {
      alert("Please complete or skip all tests before continuing.");
      return;
    }

    // Save completed flag
    try {
      await setDoc(
        doc(db, "users", user.uid, "assessments", "academic"),
        { ...completedTests, completed: true },
        { merge: true }
      );

      navigate("/technical-assessments");
    } catch (err) {
      console.error("Failed to save progress:", err);
      alert("Failed to save progress. Please try again.");
    }
  };

  const completedCount = Object.keys(completedTests).filter((key) =>
    academicSubjects.some((s) => s.field === key)
  ).length;
  const progress = (completedCount / academicSubjects.length) * 100;

  if (loading) {
    return (
      <section className="min-h-screen w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
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
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-green-300 to-cyan-400 bg-clip-text text-transparent mb-4">
            📚 Academic Tests
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Complete or skip each subject test. You can skip tests to proceed faster.
          </p>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">
                {completedCount} / {academicSubjects.length} completed
              </span>
              <span className="text-sm text-emerald-400 font-medium">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto mb-8 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg flex items-start gap-3"
        >
          <AlertCircle className="text-blue-400 flex-shrink-0 mt-1" size={20} />
          <div className="text-sm text-gray-300">
            <p className="font-medium text-white mb-1">Skip tests to save time</p>
            <p>
              Each test takes about 10 minutes. You can skip any test and a default
              score of 70% will be assigned. You can always retake tests later from
              your dashboard.
            </p>
          </div>
        </motion.div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {academicSubjects.map((subject, index) => {
            const isCompleted = completedTests[subject.field] !== undefined;
            const score = completedTests[subject.field];

            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-gradient-to-br from-gray-800/80 to-gray-900/90 border rounded-2xl p-6 shadow-lg ${
                  isCompleted
                    ? "border-emerald-400/50"
                    : "border-gray-700 hover:border-emerald-400/30"
                }`}
              >
                {/* Completed Badge */}
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="text-emerald-400" size={24} />
                  </div>
                )}

                <div className="mb-4">
                  <div className="text-4xl mb-3">{subject.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {subject.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {subject.description}
                  </p>

                  {isCompleted && (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                      <CheckCircle2 size={16} />
                      <span>Score: {score}%</span>
                    </div>
                  )}
                </div>

                {!isCompleted && (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleTakeTest(subject)}
                      className="w-full px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition flex items-center justify-center gap-2 font-medium"
                    >
                      <BookOpen size={18} />
                      Take Test
                      <Clock size={16} className="opacity-70" />
                      10 min
                    </button>
                    <button
                      onClick={() => handleSkip(subject)}
                      className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2 text-sm"
                    >
                      <SkipForward size={16} />
                      Skip (Default: 70%)
                    </button>
                  </div>
                )}

                {isCompleted && (
                  <button
                    onClick={() => handleTakeTest(subject)}
                    className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition text-sm"
                  >
                    Retake Test
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Continue Button */}
        {completedCount === academicSubjects.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={handleContinue}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-lg font-bold rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition shadow-lg"
            >
              Continue to Technical Assessments →
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
