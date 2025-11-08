// src/pages/employer/StudentDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEmployer } from "../../contexts/EmployerContext";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  FileText,
  Download,
  Heart,
  MessageSquare,
  Loader2,
  CheckCircle,
  Target,
  TrendingUp,
  BookOpen,
  X,
} from "lucide-react";
import { db } from "../../lib/firebase";
import { doc, getDoc, collection, getDocs, setDoc, deleteDoc, query, where } from "firebase/firestore";

// Helper function to display student name based on privacy settings and contact request status
function getDisplayName(student, contactRequest) {
  // If contact request is approved, always show full name
  if (contactRequest?.status === "approved") {
    return `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Student';
  }

  // If student allows full name to be shown, display it
  if (student.privacy?.showFullNameToEmployers) {
    return `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Student';
  }

  // Otherwise show initials only
  const firstInitial = student.firstName?.[0] || '';
  const lastInitial = student.lastName?.[0] || '';
  return firstInitial && lastInitial
    ? `${firstInitial}.${lastInitial}.`
    : `${student.course || 'IT'} Student`;
}

// Helper function to check if full name should be shown
function shouldShowFullName(student, contactRequest) {
  return contactRequest?.status === "approved" || student.privacy?.showFullNameToEmployers;
}

// Helper function to get enrollment status badge
function getEnrollmentBadge(student) {
  const status = student.enrollmentStatus || "current_pwc";

  const badges = {
    current_pwc: {
      text: student.yearLevel ? `PWC Student - ${student.yearLevel}` : "PWC Student",
      color: "bg-green-500/20 text-green-400 border-green-500/30"
    },
    pwc_alumni: {
      text: student.graduationYear ? `PWC Alumni '${student.graduationYear}` : "PWC Alumni",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    external: {
      text: "External User",
      color: "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  };

  return badges[status] || badges.current_pwc;
}

export default function StudentDetail() {
  const { id } = useParams();
  const { employer } = useEmployer();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [careerPrediction, setCareerPrediction] = useState(null);
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [contactRequest, setContactRequest] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    if (!employer) {
      navigate("/employer/login");
      return;
    }

    // Check if employer is verified
    if (
      employer.verificationStatus !== "tier1_verified" &&
      employer.verificationStatus !== "tier2_verified"
    ) {
      navigate("/employer/dashboard");
      return;
    }

    fetchStudentDetails();
    checkContactRequest();
    checkSavedStatus();
  }, [id, employer, navigate]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);

      // Fetch student data
      const studentDoc = await getDoc(doc(db, "users", id));
      if (!studentDoc.exists()) {
        console.error("Student not found");
        navigate("/employer/browse-students");
        return;
      }

      const studentData = { id: studentDoc.id, ...studentDoc.data() };


      // Check if profile is visible to employers
      if (!studentData.profileVisibleToEmployers) {
        console.error("Student profile not visible");
        navigate("/employer/browse-students");
        return;
      }

      setStudent(studentData);

      // Fetch career prediction - Check selected career first, then predictions
      try {
        // First, check for locked-in selected career
        const selectedCareerDoc = await getDoc(
          doc(db, "users", id, "selectedCareer", "current")
        );

        if (selectedCareerDoc.exists()) {
          const selectedCareerData = selectedCareerDoc.data();

          // Transform selected career data to match prediction format
          // Parse matchScore string (e.g., "95%") to number
          const matchScore = selectedCareerData.matchScore
            ? parseFloat(selectedCareerData.matchScore.replace('%', ''))
            : 0;

          const transformedData = {
            topCareers: [{
              career: selectedCareerData.jobRole,
              confidence: matchScore / 100,
              field: selectedCareerData.category,
              description: selectedCareerData.description || `Career in ${selectedCareerData.category}`
            }],
            predictedAt: selectedCareerData.selectedAt,
            isLockedIn: true
          };

          setCareerPrediction(transformedData);
        } else {
          // Fall back to predictions if no selected career
          const predictionDoc = await getDoc(
            doc(db, "users", id, "predictions", "careerPrediction")
          );

          if (predictionDoc.exists()) {
            const predictionData = predictionDoc.data();
            setCareerPrediction(predictionData);
          }
        }
      } catch (error) {
        console.error("Error fetching career data:", error);
      }

      // Fetch assessment results if student allows
      if (studentData.privacy?.showAssessmentScores) {
        try {
          const resultsRef = collection(db, "users", id, "results");
          const resultsSnapshot = await getDocs(resultsRef);

          // Fetch assessment details for each result
          const resultsWithDetails = await Promise.all(
            resultsSnapshot.docs.map(async (resultDoc) => {
              const resultData = resultDoc.data();
              let assessmentTitle = "Assessment";

              // Try to fetch assessment title from the assessments collection
              if (resultData.assessmentId) {
                try {
                  const assessmentDoc = await getDoc(
                    doc(db, "assessments", resultData.assessmentId)
                  );
                  if (assessmentDoc.exists()) {
                    assessmentTitle = assessmentDoc.data().title || assessmentTitle;
                  }
                } catch (err) {
                  // Try technical assessments
                  try {
                    const techAssessmentDoc = await getDoc(
                      doc(db, "technicalAssessments", resultData.assessmentId)
                    );
                    if (techAssessmentDoc.exists()) {
                      assessmentTitle = techAssessmentDoc.data().title || assessmentTitle;
                    }
                  } catch (err2) {
                    // Try personal assessments
                    try {
                      const personalAssessmentDoc = await getDoc(
                        doc(db, "personalAssessments", resultData.assessmentId)
                      );
                      if (personalAssessmentDoc.exists()) {
                        assessmentTitle = personalAssessmentDoc.data().title || assessmentTitle;
                      }
                    } catch (err3) {
                      console.log("Assessment details not found");
                    }
                  }
                }
              }

              return {
                id: resultDoc.id,
                ...resultData,
                assessmentTitle,
              };
            })
          );

          setAssessmentResults(resultsWithDetails);
        } catch (error) {
          console.log("No assessment results found");
        }
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkSavedStatus = async () => {
    if (!employer?.uid || !id) return;

    try {
      const savedDocRef = doc(db, `employers/${employer.uid}/savedStudents`, id);
      const savedDoc = await getDoc(savedDocRef);
      setIsSaved(savedDoc.exists());
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const toggleSave = async () => {
    console.log("toggleSave called");
    console.log("employer.uid:", employer?.uid);
    console.log("student id:", id);
    console.log("current isSaved:", isSaved);

    if (!employer?.uid || !id) {
      console.log("Missing employer.uid or student id");
      return;
    }

    const savedDocRef = doc(db, `employers/${employer.uid}/savedStudents`, id);

    try {
      if (isSaved) {
        console.log("Removing from saved...");
        await deleteDoc(savedDocRef);
        setIsSaved(false);
        alert("Student removed from saved list");
      } else {
        console.log("Adding to saved...");
        await setDoc(savedDocRef, {
          savedAt: new Date().toISOString(),
          studentId: id,
        });
        setIsSaved(true);
        alert("Student saved!");
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const checkContactRequest = async () => {
    if (!employer?.uid || !id) return;

    try {
      // Check for existing contact request from this employer to this student
      const requestsRef = collection(db, "contactRequests");
      const q = query(
        requestsRef,
        where("employerId", "==", employer.uid),
        where("studentId", "==", id)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setContactRequest(snapshot.docs[0].data());
      }
    } catch (error) {
      console.error("Error checking contact request:", error);
    }
  };

  const sendContactRequest = async () => {
    console.log("sendContactRequest called");
    console.log("employer:", employer);
    console.log("student id:", id);
    console.log("student:", student);

    if (!employer?.uid || !id || !student) {
      console.log("Missing required data");
      return;
    }

    try {
      setSendingRequest(true);
      console.log("Creating contact request...");

      // Create contact request
      const requestRef = doc(collection(db, "contactRequests"));
      const requestData = {
        employerId: employer.uid,
        employerName: employer.companyName,
        employerEmail: employer.email,
        studentId: id,
        studentName: `${student.firstName} ${student.lastName}`,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await setDoc(requestRef, requestData);
      console.log("Contact request created");

      // Create notification for student
      const notificationRef = doc(collection(db, "notifications"));
      await setDoc(notificationRef, {
        userId: id,
        type: "contact_request",
        title: "New Contact Request",
        message: `${employer.companyName} wants to connect with you`,
        employerId: employer.uid,
        employerName: employer.companyName,
        requestId: requestRef.id,
        read: false,
        createdAt: new Date().toISOString(),
      });
      console.log("Notification created");

      setContactRequest(requestData);
      alert("Contact request sent successfully!");
    } catch (error) {
      console.error("Error sending contact request:", error);
      alert(`Failed to send contact request: ${error.message}`);
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-400" size={48} />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white mb-4">Student not found</p>
          <button
            onClick={() => navigate("/employer/browse-students")}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/70 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/employer/browse-students")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 hover:bg-gray-800 text-gray-300 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Browse
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  isSaved
                    ? "bg-red-500/20 border-red-500/40 text-red-400"
                    : "bg-gray-900/70 border-gray-700 text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Heart size={18} className={isSaved ? "fill-current" : ""} />
                {isSaved ? "Saved" : "Save Student"}
              </button>

              <button
                onClick={sendContactRequest}
                disabled={!!contactRequest || sendingRequest}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  contactRequest?.status === "approved"
                    ? "bg-green-500/20 border border-green-500/40 text-green-400"
                    : contactRequest?.status === "pending"
                    ? "bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 cursor-not-allowed"
                    : contactRequest?.status === "declined"
                    ? "bg-red-500/20 border border-red-500/40 text-red-400 cursor-not-allowed"
                    : sendingRequest
                    ? "bg-gray-700 border border-gray-600 text-gray-400 cursor-wait"
                    : "bg-blue-500 hover:bg-blue-700 text-white"
                }`}
              >
                <MessageSquare size={18} />
                {sendingRequest
                  ? "Sending..."
                  : contactRequest?.status === "approved"
                  ? "Request Approved"
                  : contactRequest?.status === "pending"
                  ? "Request Pending"
                  : contactRequest?.status === "declined"
                  ? "Request Declined"
                  : "Send Contact Request"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Student Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8 mb-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
              {student.firstName?.charAt(0)}
              {student.lastName?.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                {getDisplayName(student, contactRequest)}
                {!shouldShowFullName(student, contactRequest) && (
                  <span className="text-sm px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-normal">
                    Anonymous Profile
                  </span>
                )}
              </h1>

              <div className="flex flex-wrap gap-4 text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap size={18} />
                  <span>{student.course}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{student.yearLevel}</span>
                </div>
              </div>

              {/* Enrollment Status Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${getEnrollmentBadge(student).color}`}>
                  {getEnrollmentBadge(student).text}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-gray-400 mb-4">
                {contactRequest?.status === "approved" && student.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={18} />
                    <a href={`mailto:${student.email}`} className="text-blue-400 hover:underline">
                      {student.email}
                    </a>
                  </div>
                )}
                {contactRequest?.status === "approved" && student.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={18} />
                    <a href={`tel:${student.phone}`} className="text-blue-400 hover:underline">
                      {student.phone}
                    </a>
                  </div>
                )}
              </div>

              {student.bio && (
                <p className="text-gray-300 leading-relaxed">{student.bio}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Privacy Notice for Anonymous Profiles */}
        {!shouldShowFullName(student, contactRequest) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <MessageSquare className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-yellow-400 font-semibold mb-1">Anonymous Profile</h3>
                <p className="text-sm text-gray-300">
                  This student has chosen to keep their identity private. Send a contact request to reveal their full name and contact information.
                  {contactRequest?.status === "pending" && " Your contact request is pending approval."}
                  {contactRequest?.status === "declined" && " Your previous contact request was declined."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Career Prediction */}
            {student.privacy?.showCareerPath && careerPrediction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="text-blue-400" size={24} />
                  Career Match
                </h2>

                <div className="space-y-4">
                  {careerPrediction.topCareers?.slice(0, 3).map((career, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-b from-gray-900 via-gray-950 to-black/50 rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                            {idx + 1}
                          </div>
                          <h3 className="text-lg font-semibold text-white">
                            {career.career}
                          </h3>
                        </div>
                        <span className="text-2xl font-bold text-blue-400">
                          {Math.round(career.confidence * 100)}%
                        </span>
                      </div>

                      {/* Confidence Bar */}
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${career.confidence * 100}%` }}
                        ></div>
                      </div>

                      <p className="text-sm text-gray-400">{career.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Skills */}
            {student.privacy?.showSkills && student.skills && student.skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Code className="text-blue-400" size={24} />
                  Skills & Technologies
                </h2>

                <div className="flex flex-wrap gap-3">
                  {student.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Assessment Results */}
            {student.privacy?.showAssessmentScores && assessmentResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="text-blue-400" size={24} />
                  Assessment Scores
                </h2>

                {/* Average Score - Top */}
                <div className="mb-6 p-5 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Average Score</p>
                      <p className="text-gray-300 font-medium">
                        Based on {assessmentResults.length} assessment{assessmentResults.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-4xl font-bold text-blue-400">
                      {(() => {
                        const validScores = assessmentResults
                          .map(r => Number(r.score))
                          .filter(score => !isNaN(score) && score !== null && score !== undefined);

                        if (validScores.length === 0) return 'N/A';

                        const avg = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
                        return Math.round(avg) + '%';
                      })()}
                    </div>
                  </div>
                </div>

                {/* Assessment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assessmentResults.slice(0, 10).map((result, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-lg bg-gradient-to-b from-gray-900 via-gray-950 to-black/50 border border-gray-700 hover:border-blue-500/50 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 pr-3">
                          <h3 className="text-white font-semibold text-base mb-1 line-clamp-2">
                            {result.assessmentTitle || "Assessment"}
                          </h3>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(result.submittedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl font-bold text-blue-400">
                            {Number(result.score) || 0}%
                          </div>
                          <div className={`text-xs font-medium mt-1 ${
                            Number(result.score) >= 80
                              ? 'text-green-400'
                              : Number(result.score) >= 70
                              ? 'text-blue-400'
                              : Number(result.score) >= 60
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}>
                            {Number(result.score) >= 80
                              ? 'Excellent'
                              : Number(result.score) >= 70
                              ? 'Good'
                              : Number(result.score) >= 60
                              ? 'Average'
                              : 'Needs Work'}
                          </div>
                        </div>
                      </div>
                      {/* Progress bar with label */}
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            Number(result.score) >= 80
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : Number(result.score) >= 70
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                              : Number(result.score) >= 60
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                              : 'bg-gradient-to-r from-red-500 to-rose-500'
                          }`}
                          style={{ width: `${Number(result.score) || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {assessmentResults.length > 10 && (
                  <p className="text-center text-sm text-gray-400 mt-4">
                    Showing 10 of {assessmentResults.length} assessments
                  </p>
                )}
              </motion.div>
            )}
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/70 border border-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="text-blue-400" size={24} />
                Quick Info
              </h2>

              <div className="space-y-4">
                {/* Top Career Match */}
                {careerPrediction && careerPrediction.topCareers?.[0] && (
                  <div className="pb-4 border-b border-gray-700">
                    <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                      <Target size={14} />
                      Top Career Match
                    </p>
                    <p className="text-white font-semibold text-lg mb-1">
                      {careerPrediction.topCareers[0].career}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${careerPrediction.topCareers[0].confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-blue-400 font-bold text-sm">
                        {Math.round(careerPrediction.topCareers[0].confidence * 100)}%
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-400 mb-1">Year Level</p>
                  <p className="text-white font-semibold">{student.yearLevel}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Course</p>
                  <p className="text-white font-semibold">{student.course}</p>
                </div>

                {student.university && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">University</p>
                    <p className="text-white font-semibold">{student.university}</p>
                  </div>
                )}

                {student.expectedGraduation && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Expected Graduation</p>
                    <p className="text-white font-semibold">
                      {student.expectedGraduation}
                    </p>
                  </div>
                )}

                {student.skills && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Skills</p>
                    <p className="text-white font-semibold">{student.skills.length}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Privacy Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/70 border border-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">
                Shared Information
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {student.privacy?.showCareerPath ? (
                    <CheckCircle className="text-green-400" size={18} />
                  ) : (
                    <X className="text-gray-400" size={18} />
                  )}
                  <span
                    className={
                      student.privacy?.showCareerPath
                        ? "text-gray-300"
                        : "text-gray-400"
                    }
                  >
                    Career Path
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {student.privacy?.showSkills ? (
                    <CheckCircle className="text-green-400" size={18} />
                  ) : (
                    <X className="text-gray-400" size={18} />
                  )}
                  <span
                    className={
                      student.privacy?.showSkills ? "text-gray-300" : "text-gray-400"
                    }
                  >
                    Skills
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {student.privacy?.showAssessmentScores ? (
                    <CheckCircle className="text-green-400" size={18} />
                  ) : (
                    <X className="text-gray-400" size={18} />
                  )}
                  <span
                    className={
                      student.privacy?.showAssessmentScores
                        ? "text-gray-300"
                        : "text-gray-400"
                    }
                  >
                    Assessment Scores
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {student.privacy?.showContactInfo ? (
                    <CheckCircle className="text-green-400" size={18} />
                  ) : (
                    <X className="text-gray-400" size={18} />
                  )}
                  <span
                    className={
                      student.privacy?.showContactInfo
                        ? "text-gray-300"
                        : "text-gray-400"
                    }
                  >
                    Contact Information
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-xs text-blue-400">
                  This student has chosen to share the information marked with a
                  checkmark.
                </p>
              </div>
            </motion.div>

            {/* Download Resume */}
            {student.resumeUrl && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <a
                  href={student.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors"
                >
                  <Download size={18} />
                  Download Resume
                </a>
              </motion.div>
            )}

            {/* Contact Information - Only visible if request approved */}
            {contactRequest?.status === "approved" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-900/70 border border-gray-800 rounded-xl p-6"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Mail className="text-green-400" size={24} />
                  Contact Information
                </h2>

                <div className="space-y-3">
                  {student.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="text-blue-400" size={18} />
                      <a
                        href={`mailto:${student.email}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {student.email}
                      </a>
                    </div>
                  )}

                  {student.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="text-blue-400" size={18} />
                      <a
                        href={`tel:${student.phone}`}
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {student.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-xs text-green-400">
                    Your contact request was approved! You can now reach out to this student directly.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
