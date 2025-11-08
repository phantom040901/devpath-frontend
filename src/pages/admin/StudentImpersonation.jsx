// src/pages/admin/StudentImpersonation.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import AdminNav from "../../components/admin/AdminNav";
import { ArrowLeft, ClipboardList, User, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentImpersonation() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [assessments, setAssessments] = useState({
    academic: [],
    technical: [],
    personal: []
  });
  const [results, setResults] = useState({});

  useEffect(() => {
    loadStudentData();
  }, [studentId]);

  const loadStudentData = async () => {
    try {
      // Load student info
      const studentDoc = await getDoc(doc(db, "users", studentId));
      if (!studentDoc.exists()) {
        alert("Student not found");
        navigate("/admin/students");
        return;
      }

      setStudent({ id: studentDoc.id, ...studentDoc.data() });

      // Load all assessments
      const [academicSnap, technicalSnap, personalSnap] = await Promise.all([
        getDocs(collection(db, "assessments")),
        getDocs(collection(db, "technicalAssessments")),
        getDocs(collection(db, "personalAssessments"))
      ]);

      setAssessments({
        academic: academicSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        technical: technicalSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        personal: personalSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      });

      // Load student's results
      const resultsSnap = await getDocs(collection(db, "users", studentId, "results"));
      const resultsMap = {};
      resultsSnap.docs.forEach(d => {
        const data = d.data();
        if (data.assessmentId) {
          resultsMap[data.assessmentId] = { id: d.id, ...data };
        }
      });
      setResults(resultsMap);

    } catch (error) {
      console.error("Error loading student data:", error);
      alert("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  const handleTakeAssessment = (assessment, type) => {
    // Store impersonation data in sessionStorage
    sessionStorage.setItem('adminImpersonation', JSON.stringify({
      studentId: studentId,
      studentName: `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.email,
      returnUrl: `/admin/students/impersonate/${studentId}`
    }));

    // Navigate to assessment based on type
    if (type === 'academic') {
      navigate(`/assessments/${assessment.id}?impersonate=${studentId}`);
    } else if (type === 'technical') {
      if (assessment.mode === 'survey') {
        navigate(`/technical-survey/${assessment.id}?impersonate=${studentId}`);
      } else {
        navigate(`/technical-assessments/${assessment.id}?impersonate=${studentId}`);
      }
    } else if (type === 'personal') {
      navigate(`/personal-survey/${assessment.id}?impersonate=${studentId}`);
    }
  };

  const getCompletionStatus = (assessmentId) => {
    if (results[assessmentId]) {
      return {
        completed: true,
        score: results[assessmentId].score || 'N/A',
        date: results[assessmentId].completedAt
      };
    }
    return { completed: false };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-400" size={48} />
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/students")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Students
          </button>

          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-full bg-primary-500/20">
              <User className="text-primary-400" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Take Assessments for {student.firstName} {student.lastName}
              </h1>
              <p className="text-gray-400">{student.email}</p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
            <p className="text-blue-300 text-sm">
              <AlertCircle className="inline mr-2" size={16} />
              You are taking assessments on behalf of this student. Results will be saved to their account.
            </p>
          </div>
        </div>

        {/* Academic Assessments */}
        <AssessmentSection
          title="Academic Assessments"
          assessments={assessments.academic}
          type="academic"
          onTakeAssessment={handleTakeAssessment}
          getCompletionStatus={getCompletionStatus}
        />

        {/* Technical Assessments */}
        <AssessmentSection
          title="Technical Assessments"
          assessments={assessments.technical}
          type="technical"
          onTakeAssessment={handleTakeAssessment}
          getCompletionStatus={getCompletionStatus}
        />

        {/* Personal Assessments */}
        <AssessmentSection
          title="Personal Assessments"
          assessments={assessments.personal}
          type="personal"
          onTakeAssessment={handleTakeAssessment}
          getCompletionStatus={getCompletionStatus}
        />
      </main>
    </div>
  );
}

function AssessmentSection({ title, assessments, type, onTakeAssessment, getCompletionStatus }) {
  if (assessments.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assessments.map((assessment, index) => {
          const status = getCompletionStatus(assessment.id);

          return (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 hover:border-primary-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/20">
                    <ClipboardList className="text-primary-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{assessment.title || assessment.name}</h3>
                    <p className="text-sm text-gray-400">
                      {assessment.questions?.length || assessment.sections?.flatMap(s => s.questions).length || 0} questions
                    </p>
                  </div>
                </div>
                {status.completed && (
                  <CheckCircle className="text-green-400" size={20} />
                )}
              </div>

              {status.completed && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 text-sm font-medium">
                    Completed - Score: {status.score}%
                  </p>
                  {status.date && (
                    <p className="text-green-300/60 text-xs mt-1">
                      {new Date(status.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={() => onTakeAssessment(assessment, type)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  status.completed
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
                }`}
              >
                {status.completed ? 'Retake Assessment' : 'Take Assessment'}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
