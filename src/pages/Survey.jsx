// src/pages/Survey.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import DashNav from "../components/dashboard/DashboardNav";
import { ChevronLeft, ChevronRight, Home, AlertTriangle } from "lucide-react";

export default function Survey({ collectionName = "technicalAssessments" }) {
  const { id } = useParams();
  const { user } = useAuth() || {};
  const navigate = useNavigate();

  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    async function fetchSurvey() {
      try {
        const ref = doc(db, collectionName, id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setSurvey({ id: snap.id, ...snap.data() });
        } else {
          console.warn("Survey not found");
          setSurvey(null);
        }
      } catch (err) {
        console.error("Failed to fetch survey:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchSurvey();
  }, [id, collectionName]);

  const handleChange = (qId, selectedOption) => {
    const answerData = typeof selectedOption === 'object' 
      ? { label: selectedOption.label, value: selectedOption.value }
      : { label: selectedOption, value: null };
    
    setAnswers((prev) => ({ ...prev, [qId]: answerData }));
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Please log in to submit your survey.");
      return;
    }

    const unanswered = survey.questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      alert(`Please answer all questions before submitting. ${unanswered.length} question(s) remaining.`);
      return;
    }

    try {
      const modelValue = extractModelValue(survey, answers);
      
      const resultsRef = collection(db, "users", user.uid, "results");
      const snaps = await getDocs(resultsRef);
      const attempts = snaps.docs.filter((d) =>
        d.id.startsWith(`survey_${id}`)
      ).length;

      if (attempts >= 2) {
        alert("Maximum attempts reached for this survey.");
        navigate("/dashboard");
        return;
      }

      const attemptNum = attempts + 1;
      const resultDocRef = doc(
        db,
        "users",
        user.uid,
        "results",
        `survey_${id}_${attemptNum}`
      );

      await setDoc(resultDocRef, {
        assessmentId: id,
        type: "survey",
        answers,
        modelValue,
        attempt: attemptNum,
        submittedAt: serverTimestamp(),
      });
      
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to save survey:", err);
    }
  };

  const extractModelValue = (survey, answers) => {
    if (!survey?.mappingKey) return null;
    const mappingQuestion = survey.questions?.find(q => q.mapToModel);
    if (!mappingQuestion) return null;
    const answer = answers[mappingQuestion.id];
    return answer?.value ?? null;
  };

  const handleNext = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleExitConfirm = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-1400 text-gray-300 animate-pulse">
        Loading survey...
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Survey not found
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-b from-primary-1400 via-primary-1500 to-black px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="mb-6 inline-block p-4 rounded-full bg-primary-500/20">
            <svg className="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-400 mb-4">Survey Submitted</h2>
          <p className="text-gray-300 mb-8 text-lg">Thank you for your response!</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/assessments")}
              className="px-6 py-3 rounded-full bg-primary-500 text-primary-1300 font-semibold hover:bg-primary-400 transition shadow-lg hover:shadow-primary-500/50"
            >
              Back to Assessments
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-full bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = survey.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;

  return (
    <section className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black px-4 sm:px-6 py-8">
      <DashNav />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 mt-20 sm:mt-24"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-primary-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent mb-4">
          {survey.title || "Survey"}
        </h1>
        <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">{survey.description}</p>
        
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestionIndex + 1} of {survey.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-primary-500 to-emerald-400"
            />
          </div>
        </div>
      </motion.div>

      <div className="m-auto max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8 rounded-3xl bg-gray-900/70 border border-white/10 shadow-2xl backdrop-blur-sm"
          >
            <p className="text-xl sm:text-2xl font-semibold text-white mb-6 leading-relaxed">
              {currentQuestion.prompt}
            </p>

            {currentQuestion.type === "single-choice" && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((opt, oIdx) => {
                  const optionLabel = typeof opt === 'string' ? opt : opt.label;
                  const optionValue = typeof opt === 'string' ? opt : opt;
                  const isSelected = answers[currentQuestion.id]?.label === optionLabel;

                  return (
                    <motion.label
                      key={oIdx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-primary-500/20 border-2 border-primary-400 shadow-lg shadow-primary-500/20'
                          : 'bg-gray-800/70 border-2 border-transparent hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${currentQuestion.id}`}
                        value={optionLabel}
                        checked={isSelected}
                        onChange={() => handleChange(currentQuestion.id, optionValue)}
                        className="w-5 h-5 accent-primary-500"
                      />
                      <span className="text-gray-200 text-base sm:text-lg">{optionLabel}</span>
                    </motion.label>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "multi-choice" && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((opt, oIdx) => {
                  const optionLabel = typeof opt === 'string' ? opt : opt.label;
                  const currentAnswers = answers[currentQuestion.id] || [];
                  const isChecked = currentAnswers.some(a => a.label === optionLabel);

                  return (
                    <motion.label
                      key={oIdx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-primary-500/20 border-2 border-primary-400 shadow-lg shadow-primary-500/20'
                          : 'bg-gray-800/70 border-2 border-transparent hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAnswers(prev => ({
                              ...prev,
                              [currentQuestion.id]: [...(prev[currentQuestion.id] || []), { label: optionLabel, value: opt.value || null }]
                            }));
                          } else {
                            setAnswers(prev => ({
                              ...prev,
                              [currentQuestion.id]: (prev[currentQuestion.id] || []).filter(a => a.label !== optionLabel)
                            }));
                          }
                        }}
                        className="w-5 h-5 accent-primary-500"
                      />
                      <span className="text-gray-200 text-base sm:text-lg">{optionLabel}</span>
                    </motion.label>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "text" && (
              <textarea
                value={answers[currentQuestion.id]?.label || ""}
                onChange={(e) => handleChange(currentQuestion.id, e.target.value)}
                className="w-full rounded-xl p-4 bg-gray-800/70 text-white border-2 border-gray-700 focus:border-primary-400 focus:outline-none transition"
                rows={4}
                placeholder="Write your answer..."
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => setShowExitModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-800/70 text-gray-300 font-semibold hover:bg-gray-700 transition border border-gray-600"
          >
            <Home size={20} />
            Exit Survey
          </button>

          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition ${
                currentQuestionIndex === 0
                  ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-800/70 text-white hover:bg-gray-700 border border-gray-600'
              }`}
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary-500 to-emerald-400 text-primary-1300 font-semibold shadow-lg hover:shadow-primary-500/50 transition-all hover:scale-105"
              >
                Submit Survey
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary-500 text-primary-1300 font-semibold hover:bg-primary-400 transition shadow-lg hover:shadow-primary-500/50"
              >
                Next
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
            onClick={() => setShowExitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-red-500/30 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-red-500/20">
                  <AlertTriangle className="text-red-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Exit Survey?</h3>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Are you sure you want to exit? Your progress will be lost and this will count as <span className="font-bold text-red-400">one attempt</span>.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 px-4 py-3 rounded-full bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExitConfirm}
                  className="flex-1 px-4 py-3 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                >
                  Exit Anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}