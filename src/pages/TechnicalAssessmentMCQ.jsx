// src/pages/TechnicalAssessmentMCQ.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import DashNav from "../components/dashboard/DashboardNav";
import { ArrowLeft, CheckCircle2, Circle, AlertCircle, Sparkles, Clock, XCircle } from "lucide-react";

export default function TechnicalAssessmentMCQ() {
  const { id } = useParams();
  const { user } = useAuth() || {};
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState(null);
  const [error, setError] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const timerRef = useRef(null);

  // Memory test specific states
  const [memoryPhase, setMemoryPhase] = useState('memorization'); // 'memorization' | 'recall'
  const [memorizationTime, setMemorizationTime] = useState(0);

  // Map assessment IDs to Firestore document IDs
  const assessmentIdMap = {
    "public-speaking": "public_speaking",
    "reading-writing": "reading_writing",
    "logical-quotient": "logical_quotient",
    "memory-game": "memory_game",
    "coding-challenge": "coding_challenge",
  };

  // Color mapping for UI
  const colorMap = {
    "public-speaking": "pink",
    "reading-writing": "orange",
    "logical-quotient": "purple",
    "memory-game": "green",
    "coding-challenge": "blue",
  };

  useEffect(() => {
    loadAssessment();
  }, [id]);

  // Block navigation using beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasStarted && !saving) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasStarted, saving]);

  // Timer effect
  useEffect(() => {
    if (hasStarted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [hasStarted, timeRemaining]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Memorization timer for memory tests
  useEffect(() => {
    if (hasStarted && id === "memory-game" && memoryPhase === 'memorization' && memorizationTime > 0) {
      const interval = setInterval(() => {
        setMemorizationTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // Transition to recall phase
            setMemoryPhase('recall');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [hasStarted, id, memoryPhase, memorizationTime]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      const firestoreId = assessmentIdMap[id];

      if (!firestoreId) {
        setError("Assessment not found");
        setLoading(false);
        return;
      }

      // Fetch assessment from Firestore first
      const docRef = doc(db, "technicalAssessments", firestoreId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError("Assessment not found in database");
        setLoading(false);
        return;
      }

      const assessmentInfo = docSnap.data();
      setAssessmentData({
        ...assessmentInfo,
        color: colorMap[id],
        duration: `${assessmentInfo.duration} minutes`,
        durationMinutes: assessmentInfo.duration,
      });
      setTimeRemaining(assessmentInfo.duration * 60); // Convert minutes to seconds

      // Now check if user has already attempted this assessment
      if (user) {
        const userDocRef = doc(db, "users", user.uid, "assessments", "technical");
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const assessmentField = assessmentInfo.field; // Use the field from assessment data

          // Check if this specific assessment has been completed
          if (userData[assessmentField]) {
            setHasAttempted(true);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load assessment:", err);
      setError("Failed to load assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = () => {
    setHasStarted(true);
    setShowWarning(false);

    // For memory tests, start with memorization phase
    if (id === "memory-game" && assessmentData?.memorizationTime) {
      setMemorizationTime(assessmentData.memorizationTime);
      setMemoryPhase('memorization');
    }
  };

  const handleStartRecall = () => {
    setMemoryPhase('recall');
    setMemorizationTime(0);
  };

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < assessmentData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleTimeExpired = async () => {
    // Auto-submit with current answers
    await submitAssessment();
  };

  const calculateScore = () => {
    const totalQuestions = assessmentData.questions.length;

    if (assessmentData.scoringType === "numeric") {
      // For public speaking and logical quotient: Handle differently based on data structure
      const responses = Object.values(answers);

      // Check if answers are already numeric (1-5 scale for public speaking)
      if (typeof responses[0] === 'number') {
        const sum = responses.reduce((acc, val) => acc + val, 0);
        const avg = sum / totalQuestions; // 1-5 scale
        const score = Math.round((avg / 5) * 9); // Map to 1-9
        return Math.max(1, Math.min(9, score)); // Clamp to 1-9
      } else {
        // For logical quotient: Count correct answers based on 'correct' field
        let correctCount = 0;
        assessmentData.questions.forEach(question => {
          const userAnswer = answers[question.id];
          const selectedOption = question.options.find(opt => opt.value === userAnswer);
          if (selectedOption && selectedOption.correct === true) {
            correctCount++;
          }
        });
        const percentage = (correctCount / totalQuestions) * 100;
        const score = Math.round((percentage / 100) * 9); // Map to 1-9
        return Math.max(1, Math.min(9, score)); // Clamp to 1-9
      }
    } else {
      // For reading/writing: Count correct answers based on 'correct' field
      let correctCount = 0;
      assessmentData.questions.forEach(question => {
        const userAnswer = answers[question.id];
        const selectedOption = question.options.find(opt => opt.value === userAnswer);
        if (selectedOption && selectedOption.correct === true) {
          correctCount++;
        }
      });
      const percentage = (correctCount / totalQuestions) * 100;

      if (percentage >= 80) return "excellent";
      if (percentage >= 60) return "medium";
      return "poor";
    }
  };

  const submitAssessment = async () => {
    if (!user) {
      alert("Please log in to save your progress.");
      return;
    }

    setSaving(true);

    try {
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      const score = calculateScore();

      // Load existing assessments
      const docRef = doc(db, "users", user.uid, "assessments", "technical");
      const docSnap = await getDoc(docRef);
      const existing = docSnap.exists() ? docSnap.data() : {};

      // Save with calculated score
      await setDoc(docRef, {
        ...existing,
        [assessmentData.field]: score,
      });

      // Navigate back to list
      navigate("/technical-assessments");
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save progress. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions answered
    if (Object.keys(answers).length < assessmentData.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    await submitAssessment();
  };

  // Format time remaining as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Check if timer is running low (less than 2 minutes)
  const isTimerCritical = () => timeRemaining > 0 && timeRemaining <= 120;

  // Already attempted state
  if (hasAttempted && !loading) {
    return (
      <section className="min-h-screen w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <XCircle className="text-red-400 mx-auto mb-4" size={64} />
          <h2 className="text-2xl text-white mb-4 font-bold">Assessment Already Completed</h2>
          <p className="text-gray-400 mb-6">
            You have already attempted this assessment. Each assessment can only be taken once.
          </p>
          <button
            onClick={() => navigate("/technical-assessments")}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
          >
            Back to Assessments
          </button>
        </div>
      </section>
    );
  }

  // Loading state
  if (loading) {
    return (
      <section className="min-h-screen w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4 mx-auto"></div>
          <p className="text-gray-400">Loading assessment...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !assessmentData) {
    return (
      <section className="min-h-screen w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">{error || "Assessment not found"}</h2>
          <button
            onClick={() => navigate("/technical-assessments")}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
          >
            Go Back
          </button>
        </div>
      </section>
    );
  }

  const progress = ((currentQuestion + 1) / assessmentData.questions.length) * 100;
  const currentQ = assessmentData.questions[currentQuestion];
  const allAnswered = Object.keys(answers).length === assessmentData.questions.length;

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black px-4 sm:px-6 lg:px-10 py-12">
      <DashNav />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mt-12"
      >
        {/* Back Button - Only show before starting */}
        {!hasStarted && (
          <button
            onClick={() => navigate("/technical-assessments")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
          >
            <ArrowLeft size={20} />
            Back to Assessments
          </button>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {assessmentData.title}
              </h1>
              <p className="text-gray-400">{assessmentData.description}</p>
              <p className="text-sm text-cyan-400 mt-2">Duration: {assessmentData.duration}</p>
            </div>
            {/* Timer Display */}
            {hasStarted && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${
                isTimerCritical()
                  ? "bg-red-500/20 border-red-500 animate-pulse"
                  : "bg-cyan-500/20 border-cyan-400"
              }`}>
                <Clock size={20} className={isTimerCritical() ? "text-red-400" : "text-cyan-400"} />
                <span className={`text-lg font-mono font-bold ${
                  isTimerCritical() ? "text-red-400" : "text-cyan-400"
                }`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Warning Dialog Before Start */}
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-2 border-orange-500/50 rounded-2xl p-8 mb-8 shadow-2xl"
          >
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className="text-orange-400 flex-shrink-0 mt-1" size={32} />
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Important Instructions</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>This assessment can only be taken <strong className="text-white">once</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>You have <strong className="text-white">{assessmentData.duration}</strong> to complete all questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>The assessment will <strong className="text-white">auto-submit</strong> when time expires</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>You <strong className="text-white">cannot go back</strong> to the dashboard once started</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Make sure you have a stable internet connection</span>
                  </li>
                </ul>
              </div>
            </div>
            <button
              onClick={handleStartAssessment}
              className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-bold text-lg transition shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles size={24} />
              I Understand - Start Assessment
            </button>
          </motion.div>
        )}

        {/* Progress Bar */}
        {hasStarted && (
          <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {assessmentData.questions.length}
            </span>
            <span className="text-sm text-cyan-400 font-medium">
              {progress.toFixed(0)}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full ${
                assessmentData.color === "purple" ? "bg-gradient-to-r from-purple-400 to-purple-600" :
                assessmentData.color === "pink" ? "bg-gradient-to-r from-pink-400 to-pink-600" :
                assessmentData.color === "orange" ? "bg-gradient-to-r from-orange-400 to-orange-600" :
                assessmentData.color === "blue" ? "bg-gradient-to-r from-blue-400 to-blue-600" :
                assessmentData.color === "green" ? "bg-gradient-to-r from-green-400 to-green-600" :
                "bg-gradient-to-r from-cyan-400 to-cyan-600"
              }`}
            />
          </div>
        </div>
        )}

        {/* Reading Passage (for reading-writing only) */}
        {hasStarted && id === "reading-writing" && assessmentData.passage && currentQuestion === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/80 border border-gray-700 rounded-lg p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-cyan-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Reading Passage</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{assessmentData.passage}</p>
          </motion.div>
        )}

        {/* Memorization Phase (for memory-game only) */}
        {hasStarted && id === "memory-game" && memoryPhase === 'memorization' && assessmentData.passage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-900/20 to-gray-900/90 border border-green-400/50 rounded-2xl p-8 shadow-2xl"
          >
            {/* Memorization Timer */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="text-green-400" size={24} />
                <h2 className="text-2xl font-bold text-white">📚 Memorization Phase</h2>
              </div>
              <div className="px-4 py-2 bg-green-500/20 border border-green-400/50 rounded-lg">
                <span className="text-lg font-mono font-bold text-green-400">
                  {Math.floor(memorizationTime / 60)}:{String(memorizationTime % 60).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Instruction */}
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 mb-6">
              <p className="text-green-300 text-sm font-medium">
                ⏱️ Read and memorize the passage below. You won't be able to see it during the questions phase.
              </p>
            </div>

            {/* Passage */}
            <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-6 mb-6">
              <p className="text-gray-200 leading-relaxed text-lg whitespace-pre-wrap">{assessmentData.passage}</p>
            </div>

            {/* Ready Button */}
            <div className="flex justify-center">
              <button
                onClick={handleStartRecall}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white text-lg font-bold rounded-lg hover:from-green-600 hover:to-cyan-600 transition shadow-lg flex items-center gap-2"
              >
                <CheckCircle2 size={24} />
                I'm Ready - Start Questions
              </button>
            </div>
          </motion.div>
        )}

        {/* Question Card */}
        {hasStarted && (id !== "memory-game" || memoryPhase === 'recall') && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-cyan-400/30 rounded-2xl p-8 shadow-2xl mb-8"
          >
          <h2 className="text-xl font-semibold text-white mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = answers[currentQ.id] !== undefined && answers[currentQ.id] === option.value;
              const optionLabel = String.fromCharCode(65 + index); // A, B, C, D, E

              // Get color classes based on assessment type
              const getColorClasses = () => {
                if (!isSelected) return "border-gray-700 bg-gray-800/50 hover:border-gray-600";

                switch(assessmentData.color) {
                  case "purple":
                    return "border-purple-400 bg-purple-500/20";
                  case "pink":
                    return "border-pink-400 bg-pink-500/20";
                  case "orange":
                    return "border-orange-400 bg-orange-500/20";
                  case "blue":
                    return "border-blue-400 bg-blue-500/20";
                  case "green":
                    return "border-green-400 bg-green-500/20";
                  default:
                    return "border-cyan-400 bg-cyan-500/20";
                }
              };

              const getIconColor = () => {
                switch(assessmentData.color) {
                  case "purple":
                    return "text-purple-400";
                  case "pink":
                    return "text-pink-400";
                  case "orange":
                    return "text-orange-400";
                  case "blue":
                    return "text-blue-400";
                  case "green":
                    return "text-green-400";
                  default:
                    return "text-cyan-400";
                }
              };

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQ.id, option.value)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${getColorClasses()}`}
                >
                  <div className="flex items-center gap-3">
                    {isSelected ? (
                      <CheckCircle2 className={`${getIconColor()} flex-shrink-0`} size={24} />
                    ) : (
                      <Circle className="text-gray-500 flex-shrink-0" size={24} />
                    )}
                    <span className={`font-medium ${isSelected ? "text-white" : "text-gray-400"} mr-2`}>
                      {optionLabel}.
                    </span>
                    <span className={isSelected ? "text-white" : "text-gray-300"}>
                      {option.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
        )}

        {/* Navigation Buttons */}
        {hasStarted && (
          <div className="flex gap-4 mb-8">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentQuestion < assessmentData.questions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={answers[currentQ.id] === undefined}
              className={`flex-1 px-6 py-3 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
                assessmentData.color === "purple" ? "bg-purple-500 hover:bg-purple-600" :
                assessmentData.color === "pink" ? "bg-pink-500 hover:bg-pink-600" :
                assessmentData.color === "orange" ? "bg-orange-500 hover:bg-orange-600" :
                assessmentData.color === "blue" ? "bg-blue-500 hover:bg-blue-600" :
                assessmentData.color === "green" ? "bg-green-500 hover:bg-green-600" :
                "bg-cyan-500 hover:bg-cyan-600"
              }`}
            >
              Next Question
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || saving}
              className={`flex-1 px-6 py-3 bg-gradient-to-r text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium ${
                assessmentData.color === "purple" ? "from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600" :
                assessmentData.color === "pink" ? "from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600" :
                assessmentData.color === "orange" ? "from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600" :
                assessmentData.color === "blue" ? "from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600" :
                assessmentData.color === "green" ? "from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600" :
                "from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
              }`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Submit Assessment
                </>
              )}
            </button>
          )}
          </div>
        )}

        {/* Answer Status */}
        {hasStarted && (
          <div className="flex justify-center gap-2">
            {assessmentData.questions.map((q, index) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = index === currentQuestion;

              const getCircleClasses = () => {
                if (!isAnswered) return "border-gray-700 bg-gray-800/50";

                switch(assessmentData.color) {
                  case "purple":
                    return "border-purple-400 bg-purple-500/30";
                  case "pink":
                    return "border-pink-400 bg-pink-500/30";
                  case "orange":
                    return "border-orange-400 bg-orange-500/30";
                  case "blue":
                    return "border-blue-400 bg-blue-500/30";
                  case "green":
                    return "border-green-400 bg-green-500/30";
                  default:
                    return "border-cyan-400 bg-cyan-500/30";
                }
              };

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${getCircleClasses()} ${
                    isCurrent ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-900" : ""
                  }`}
                  title={`Question ${index + 1}`}
                >
                  <span className="text-sm font-medium text-white">{index + 1}</span>
                </button>
              );
            })}
          </div>
        )}
      </motion.div>
    </section>
  );
}
