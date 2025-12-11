// src/components/AssessmentFlowController.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";
import { Loader2 } from "lucide-react";

/**
 * AssessmentFlowController
 *
 * Checks if user has completed the new assessment flow and redirects accordingly:
 * - New users → /profile-survey
 * - Users who completed profile but not academic → /academic-tests
 * - Users who completed academic but not technical → /technical-assessments
 * - Users who completed everything → /dashboard (existing students)
 *
 * Usage: Wrap protected routes or use in dashboard
 */
export default function AssessmentFlowController({ children, checkOnMount = true }) {
  const { user } = useAuth() || {};
  const navigate = useNavigate();
  const [checking, setChecking] = useState(checkOnMount);
  const [flowStatus, setFlowStatus] = useState(null);

  useEffect(() => {
    if (checkOnMount && user) {
      checkAssessmentStatus();
    }
  }, [user, checkOnMount]);

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
      const hasAcademic = academicSnap.exists() && academicSnap.data().completed;

      // Check technical assessments
      const technicalRef = doc(db, "users", user.uid, "assessments", "technical");
      const technicalSnap = await getDoc(technicalRef);
      const hasTechnical = technicalSnap.exists() && technicalSnap.data().completed;

      // Check if user has old-style career matches (existing students)
      const resultsRef = doc(db, "users", user.uid, "results", "career-matches");
      const resultsSnap = await getDoc(resultsRef);
      const hasExistingResults = resultsSnap.exists();

      const status = {
        hasProfile,
        hasAcademic,
        hasTechnical,
        hasExistingResults,
        isComplete: hasProfile && hasAcademic && hasTechnical,
        isExistingStudent: hasExistingResults && !hasProfile, // Has results but no new profile
      };

      setFlowStatus(status);

      // Only redirect if checking on mount
      if (checkOnMount) {
        handleRedirect(status);
      }
    } catch (err) {
      console.error("Failed to check assessment status:", err);
    } finally {
      setChecking(false);
    }
  };

  const handleRedirect = (status) => {
    // Existing students who already have results - let them access dashboard normally
    if (status.isExistingStudent) {
      console.log("Existing student detected - allowing dashboard access");
      return;
    }

    // New students must complete profile survey first
    if (!status.hasProfile) {
      console.log("No profile found - redirecting to profile survey");
      navigate("/profile-survey");
    }
    // After profile completion, allow dashboard access
    // Academic and technical tests are now optional and can be done from dashboard
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-1400 via-primary-1500 to-black">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-400 mx-auto mb-4" size={48} />
          <p className="text-gray-300">Checking your progress...</p>
        </div>
      </div>
    );
  }

  return children;
}

/**
 * Hook version for use in components
 */
export function useAssessmentFlow() {
  const { user } = useAuth() || {};
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkStatus();
    }
  }, [user]);

  const checkStatus = async () => {
    if (!user) return;

    try {
      const profileRef = doc(db, "users", user.uid, "profile", "survey");
      const academicRef = doc(db, "users", user.uid, "assessments", "academic");
      const technicalRef = doc(db, "users", user.uid, "assessments", "technical");
      const resultsRef = doc(db, "users", user.uid, "results", "career-matches");

      const [profileSnap, academicSnap, technicalSnap, resultsSnap] = await Promise.all([
        getDoc(profileRef),
        getDoc(academicRef),
        getDoc(technicalRef),
        getDoc(resultsRef),
      ]);

      const hasProfile = profileSnap.exists();
      const hasAcademic = academicSnap.exists() && academicSnap.data().completed;
      const hasTechnical = technicalSnap.exists() && technicalSnap.data().completed;
      const hasExistingResults = resultsSnap.exists();

      setStatus({
        hasProfile,
        hasAcademic,
        hasTechnical,
        hasExistingResults,
        isComplete: hasProfile && hasAcademic && hasTechnical,
        isExistingStudent: hasExistingResults && !hasProfile,
      });
    } catch (err) {
      console.error("Failed to check status:", err);
    } finally {
      setLoading(false);
    }
  };

  return { status, loading, refetch: checkStatus };
}
