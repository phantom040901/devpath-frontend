// src/pages/employer/SavedStudents.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployer } from "../../contexts/EmployerContext";
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  Briefcase,
  Code,
  GraduationCap,
  Loader2,
  Eye,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { db } from "../../lib/firebase";
import { collection, getDocs, doc, deleteDoc, getDoc } from "firebase/firestore";

export default function SavedStudents() {
  const { employer } = useEmployer();
  const navigate = useNavigate();

  const [savedStudents, setSavedStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employer) {
      navigate("/employer/login");
      return;
    }

    // Check if employer is verified
    if (employer.verificationStatus !== "tier1_verified" &&
        employer.verificationStatus !== "tier2_verified") {
      navigate("/employer/dashboard");
      return;
    }

    fetchSavedStudents();
  }, [employer, navigate]);

  const fetchSavedStudents = async () => {
    if (!employer?.uid) return;

    try {
      setLoading(true);

      // Fetch saved student IDs
      const savedRef = collection(db, `employers/${employer.uid}/savedStudents`);
      const snapshot = await getDocs(savedRef);

      const studentsList = [];
      for (const savedDoc of snapshot.docs) {
        const studentId = savedDoc.id;
        const savedData = savedDoc.data();

        // Fetch student details
        const studentDocRef = doc(db, "users", studentId);
        const studentSnapshot = await getDoc(studentDocRef);

        if (studentSnapshot.exists()) {
          const userData = studentSnapshot.data();

          // Fetch career prediction if available
          let careerPrediction = null;
          try {
            const selectedCareerRef = collection(db, `users/${studentId}/selectedCareer`);
            const careerSnapshot = await getDocs(selectedCareerRef);
            if (!careerSnapshot.empty) {
              careerPrediction = careerSnapshot.docs[0].data();
            }
          } catch (err) {
            console.error("Error fetching career:", err);
          }

          studentsList.push({
            id: studentId,
            ...userData,
            careerPrediction,
            savedAt: savedData.savedAt,
          });
        }
      }

      // Sort by savedAt (most recent first)
      studentsList.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

      setSavedStudents(studentsList);
    } catch (error) {
      console.error("Error fetching saved students:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedStudent = async (studentId) => {
    if (!employer?.uid) return;

    try {
      const savedDocRef = doc(db, `employers/${employer.uid}/savedStudents`, studentId);
      await deleteDoc(savedDocRef);
      setSavedStudents((prev) => prev.filter((student) => student.id !== studentId));
    } catch (error) {
      console.error("Error removing saved student:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-400" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/70 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/employer/browse-students")}
                className="px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 hover:bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-300 transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Heart className="text-red-400" size={28} />
                  Saved Students
                </h1>
                <p className="text-sm text-gray-400">
                  {savedStudents.length} student{savedStudents.length !== 1 ? "s" : ""} saved
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Empty State */}
        {savedStudents.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/70 rounded-xl border border-gray-800">
            <Heart className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-white mb-2">No saved students yet</h3>
            <p className="text-gray-400 mb-6">
              Start browsing students and save the ones you're interested in.
            </p>
            <button
              onClick={() => navigate("/employer/browse-students")}
              className="px-6 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-medium transition-colors border border-blue-500/30"
            >
              Browse Students
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedStudents.map((student, index) => (
              <SavedStudentCard
                key={student.id}
                student={student}
                index={index}
                onRemove={() => removeSavedStudent(student.id)}
                onViewProfile={() => navigate(`/employer/student/${student.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Saved Student Card Component
function SavedStudentCard({ student, index, onRemove, onViewProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
            {student.firstName?.[0]}{student.lastName?.[0]}
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-sm text-gray-400">{student.yearLevel || "Year N/A"}</p>
          </div>
        </div>

        <button
          onClick={onRemove}
          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          title="Remove from saved"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Course */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
        <GraduationCap size={16} />
        <span>{student.course || "Course not specified"}</span>
      </div>

      {/* Career Match */}
      {student.careerPrediction && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={14} className="text-blue-400" />
            <span className="text-xs font-medium text-blue-400">Career Match</span>
          </div>
          <p className="text-sm font-medium text-white">{student.careerPrediction.career}</p>
          {student.careerPrediction.confidence && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${student.careerPrediction.confidence}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-300">
                {student.careerPrediction.confidence}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Skills */}
      {student.skills && student.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Code size={14} className="text-gray-500" />
            <span className="text-xs font-medium text-gray-400">Skills</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {student.skills.slice(0, 5).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded bg-gradient-to-b from-gray-900 via-gray-950 to-black text-xs text-gray-300 font-medium"
              >
                {skill}
              </span>
            ))}
            {student.skills.length > 5 && (
              <span className="px-2 py-1 rounded bg-gradient-to-b from-gray-900 via-gray-950 to-black text-xs text-gray-400">
                +{student.skills.length - 5}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Saved Date */}
      <p className="text-xs text-gray-500 mb-3">
        Saved {new Date(student.savedAt).toLocaleDateString()}
      </p>

      {/* View Profile Button */}
      <button
        onClick={onViewProfile}
        className="w-full py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-medium transition-colors flex items-center justify-center gap-2 border border-blue-500/30"
      >
        <Eye size={16} />
        View Profile
      </button>
    </motion.div>
  );
}
