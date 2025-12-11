// src/components/assessments/ResultCard.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Target, CheckCircle, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../AuthContext";

export default function ResultCard({ title, score }) {
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const [nextAssessment, setNextAssessment] = useState(null);
  const [loadingNext, setLoadingNext] = useState(true);

  if (!score) return null;

  const completedAt = new Date().toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Extract category from title to decide which tab to open
  let tab = "academic";
  let currentAssessmentType = "academic";
  if (title.toLowerCase().includes("technical") || title.toLowerCase().includes("coding") || title.toLowerCase().includes("logical") || title.toLowerCase().includes("memory")) {
    tab = "technical";
    currentAssessmentType = "technical";
  }
  if (title.toLowerCase().includes("personal")) {
    tab = "personal";
    currentAssessmentType = "personal";
  }

  const backPath = `/assessments?tab=${tab}`;

  // Determine grade and color based on score
  const getGrade = (pct) => {
    if (pct >= 90) return { grade: "A+", color: "text-emerald-400", bg: "bg-emerald-500" };
    if (pct >= 80) return { grade: "A", color: "text-emerald-400", bg: "bg-emerald-500" };
    if (pct >= 70) return { grade: "B", color: "text-blue-400", bg: "bg-blue-500" };
    if (pct >= 60) return { grade: "C", color: "text-yellow-400", bg: "bg-yellow-500" };
    return { grade: "D", color: "text-orange-400", bg: "bg-orange-500" };
  };

  const gradeInfo = getGrade(score.pct);

  // Fetch next available assessment
  useEffect(() => {
    async function findNextAssessment() {
      if (!user) {
        setLoadingNext(false);
        return;
      }

      try {
        // Only fetch assessments from the same category as the current one
        let assessmentsToCheck = [];

        if (currentAssessmentType === "academic") {
          const academicRef = collection(db, "assessments");
          const academicSnap = await getDocs(academicRef);
          assessmentsToCheck = academicSnap.docs.map((doc) => ({
            id: doc.id,
            type: "academic",
            mode: "mcq",
            collectionName: "assessments",
            ...doc.data(),
          }));
        } else if (currentAssessmentType === "technical") {
          const techRef = collection(db, "technicalAssessments");
          const techSnap = await getDocs(techRef);
          assessmentsToCheck = techSnap.docs.map((doc) => ({
            id: doc.id,
            type: "technical",
            mode: doc.data().mode || "mcq",
            collectionName: "technicalAssessments",
            ...doc.data(),
          }));
        } else if (currentAssessmentType === "personal") {
          const personalRef = collection(db, "personalAssessments");
          const personalSnap = await getDocs(personalRef);
          assessmentsToCheck = personalSnap.docs.map((doc) => ({
            id: doc.id,
            type: "personal",
            mode: doc.data().mode || "survey",
            collectionName: "personalAssessments",
            ...doc.data(),
          }));
        }

        // Use only assessments from the same category
        const allAssessments = assessmentsToCheck;

        // Fetch user's results to check what's been completed
        const resultsRef = collection(db, "users", user.uid, "results");
        const resultsSnap = await getDocs(resultsRef);
        const results = resultsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        const resultsByAssessment = {};
        results.forEach((r) => {
          if (!r.assessmentId) return;
          if (!resultsByAssessment[r.assessmentId]) {
            resultsByAssessment[r.assessmentId] = [];
          }
          resultsByAssessment[r.assessmentId].push(r);
        });

        // Find the next assessment that hasn't been started yet
        const nextAvailable = allAssessments.find((assessment) => {
          const attempts = resultsByAssessment[assessment.id] || [];
          // Only show assessments that have NOT been started (0 attempts)
          return attempts.length === 0;
        });

        setNextAssessment(nextAvailable);
      } catch (err) {
        console.error("Failed to find next assessment:", err);
      } finally {
        setLoadingNext(false);
      }
    }

    findNextAssessment();
  }, [user, currentAssessmentType]);

  const handleNextAssessment = () => {
    if (!nextAssessment) return;

    // Clear any existing assessment progress from localStorage before navigating
    const storageKeys = Object.keys(localStorage);
    storageKeys.forEach((key) => {
      if (key.startsWith('assessment-progress:')) {
        localStorage.removeItem(key);
      }
    });

    let targetUrl = '';
    if (nextAssessment.mode === "survey") {
      if (nextAssessment.type === "personal") {
        targetUrl = `/survey/personal/${nextAssessment.id}`;
      } else {
        targetUrl = `/survey/technical/${nextAssessment.id}`;
      }
    } else if (nextAssessment.type === "technical") {
      targetUrl = `/technical-assessments/${nextAssessment.id}`;
    } else {
      targetUrl = `/assessments/${nextAssessment.id}`;
    }

    // Use window.location.href for full page reload to ensure fresh assessment load
    window.location.href = targetUrl;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-gray-700/40 
      p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)] 
      max-w-3xl mx-auto w-full"
    >
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="p-4 rounded-full bg-primary-500/20">
          <CheckCircle className="text-primary-400" size={48} />
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary-400 to-emerald-300 bg-clip-text text-transparent mb-3">
          Assessment Complete!
        </h2>
        <p className="text-lg text-white font-semibold mb-2">{title}</p>
        <p className="text-gray-400 text-sm">
          Completed on {completedAt}
        </p>
      </div>

      {/* Score Display */}
      <div className="flex items-center justify-center gap-8 mb-10">
        {/* Score Circle */}
        <div className="relative">
          <div
            className={`rounded-full ${gradeInfo.bg} w-32 h-32 sm:w-40 sm:h-40 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(0,255,200,0.3)] border-4 border-gray-800`}
          >
            <span className="text-4xl sm:text-5xl font-extrabold text-gray-900">
              {score.pct}%
            </span>
            <span className="text-sm text-gray-800 font-semibold mt-1">
              Grade: {gradeInfo.grade}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Trophy className="text-primary-400" size={24} />
            <div>
              <div className="text-xs text-gray-400">Correct Answers</div>
              <div className="text-2xl font-bold text-white">{score.correct}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Target className="text-blue-400" size={24} />
            <div>
              <div className="text-xs text-gray-400">Total Questions</div>
              <div className="text-2xl font-bold text-white">{score.total}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl bg-gray-800/60 backdrop-blur-lg border border-gray-700/30 p-5 text-center hover:bg-gray-800/80 transition">
          <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider mb-1">
            Accuracy
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-primary-400">
            {score.pct}%
          </div>
        </div>
        <div className="rounded-2xl bg-gray-800/60 backdrop-blur-lg border border-gray-700/30 p-5 text-center hover:bg-gray-800/80 transition">
          <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider mb-1">
            Performance
          </div>
          <div className={`text-2xl sm:text-3xl font-bold ${gradeInfo.color}`}>
            {gradeInfo.grade}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        {/* Next Assessment Button - Show prominently if available */}
        {!loadingNext && nextAssessment && (
          <div className="relative">
            <button
              onClick={handleNextAssessment}
              className="w-full px-4 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 text-white font-bold
                         hover:from-emerald-400 hover:to-cyan-300 transition shadow-lg hover:shadow-emerald-500/50
                         flex items-center justify-center gap-2 text-sm sm:text-base group"
            >
              <span className="text-center leading-tight">
                Next Assessment:<br className="sm:hidden" />
                <span className="sm:ml-1">{nextAssessment.title}</span>
              </span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </button>
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-yellow-500 text-xs font-bold shadow-lg">
              <span className="animate-pulse">→</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(backPath)}
            className="flex-1 px-6 py-3 rounded-full bg-primary-500 text-primary-1300 font-semibold
                       hover:bg-primary-400 transition shadow-lg hover:shadow-primary-500/50"
          >
            ← Back to Assessments
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 px-6 py-3 rounded-full bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </motion.div>
  );
}