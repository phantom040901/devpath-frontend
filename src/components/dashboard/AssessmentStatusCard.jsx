// src/components/dashboard/AssessmentStatusCard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../AuthContext";
import { motion } from "framer-motion";
import {
  ClipboardList,
  BookOpen,
  Code,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertCircle
} from "lucide-react";

/**
 * AssessmentStatusCard
 *
 * Shows assessment completion status and provides quick access to continue
 * - New students: Show "Start Assessment" button
 * - In-progress students: Show completion status with "Continue" button
 * - Existing students: Don't show anything (they already have results)
 */
export default function AssessmentStatusCard() {
  const { user } = useAuth() || {};
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAssessmentStatus();
    }
  }, [user]);

  const checkAssessmentStatus = async () => {
    if (!user) return;

    try {
      // Check profile survey
      const profileRef = doc(db, "users", user.uid, "profile", "survey");
      const profileSnap = await getDoc(profileRef);
      const hasProfile = profileSnap.exists();

      // Check academic tests
      const academicRef = doc(db, "users", user.uid, "assessments", "academic");
      const academicSnap = await getDoc(academicRef);
      const academicData = academicSnap.data() || {};
      const hasAcademic = academicSnap.exists() && academicData.completed;

      // Check technical assessments
      const technicalRef = doc(db, "users", user.uid, "assessments", "technical");
      const technicalSnap = await getDoc(technicalRef);
      const technicalData = technicalSnap.data() || {};
      const hasTechnical = technicalSnap.exists() && technicalData.completed;

      // Check if user has old-style results (existing student)
      const resultsRef = doc(db, "users", user.uid, "results", "career-matches");
      const resultsSnap = await getDoc(resultsRef);
      const hasExistingResults = resultsSnap.exists();

      // Calculate progress
      let completedSteps = 0;
      if (hasProfile) completedSteps++;
      if (hasAcademic) completedSteps++;
      if (hasTechnical) completedSteps++;

      const progress = (completedSteps / 3) * 100;

      setStatus({
        hasProfile,
        hasAcademic,
        hasTechnical,
        hasExistingResults,
        isComplete: completedSteps === 3,
        isExistingStudent: hasExistingResults && !hasProfile,
        progress,
        completedSteps,
        totalSteps: 3,
      });
    } catch (err) {
      console.error("Failed to check assessment status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    // After profile is complete, navigate to assessments based on what's not done
    if (!status.hasAcademic) {
      navigate("/academic-tests");
    } else if (!status.hasTechnical) {
      navigate("/technical-assessments");
    } else {
      // All done, go to academic tests to retake if needed
      navigate("/academic-tests");
    }
  };

  // Don't show card for existing students who already have results
  if (loading) {
    return null;
  }

  if (status?.isExistingStudent || status?.isComplete) {
    return null;
  }

  // Show card for new students or those in progress
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-400/30 rounded-2xl p-6 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Sparkles className="text-purple-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {status?.completedSteps > 0 ? "Continue Your Assessments" : "Take Career Assessments"}
            </h3>
            <p className="text-sm text-gray-400">
              {status?.completedSteps > 0
                ? "Complete remaining assessments for better career matches"
                : "Optional: Improve your career recommendations"}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">
            {status?.completedSteps || 0} of {status?.totalSteps || 3} completed
          </span>
          <span className="text-sm text-purple-400 font-medium">
            {Math.round(status?.progress || 0)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${status?.progress || 0}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-purple-400 to-blue-400"
          />
        </div>
      </div>

      {/* Steps Checklist */}
      <div className="space-y-3 mb-6">
        <div className={`flex items-center gap-3 ${status?.hasProfile ? 'text-green-400' : 'text-gray-400'}`}>
          {status?.hasProfile ? (
            <CheckCircle2 size={20} className="flex-shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex-shrink-0" />
          )}
          <div className="flex items-center gap-2">
            <ClipboardList size={16} className="flex-shrink-0" />
            <span className="text-sm font-medium">Profile Survey (22 questions)</span>
          </div>
        </div>

        <div className={`flex items-center gap-3 ${status?.hasAcademic ? 'text-green-400' : 'text-gray-400'}`}>
          {status?.hasAcademic ? (
            <CheckCircle2 size={20} className="flex-shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex-shrink-0" />
          )}
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="flex-shrink-0" />
            <span className="text-sm font-medium">Academic Tests (9 subjects)</span>
          </div>
        </div>

        <div className={`flex items-center gap-3 ${status?.hasTechnical ? 'text-green-400' : 'text-gray-400'}`}>
          {status?.hasTechnical ? (
            <CheckCircle2 size={20} className="flex-shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex-shrink-0" />
          )}
          <div className="flex items-center gap-2">
            <Code size={16} className="flex-shrink-0" />
            <span className="text-sm font-medium">Technical Assessments (5 tests)</span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3 mb-4 flex items-start gap-2">
        <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
        <p className="text-xs text-gray-300">
          Complete these assessments to get more accurate career recommendations. You can skip individual tests if needed.
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={handleContinue}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition flex items-center justify-center gap-2"
      >
        {status?.completedSteps > 0 ? "Continue Assessments" : "Start Assessments"}
        <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}
