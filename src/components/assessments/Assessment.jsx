// src/components/assessments/Assessment.jsx
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import ResultCard from "./ResultCard";
import { useAuth } from "../AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Home, AlertTriangle, Clock } from "lucide-react";

export default function Assessment({
  subjectId: propSubjectId,
  collectionName = "assessments",
}) {
  const { subjectId: routeSubjectId } = useParams();
  const subjectId = propSubjectId || routeSubjectId;

  const ASSESSMENT_DURATION = 900; // 15 mins

  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [startAt, setStartAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(ASSESSMENT_DURATION);
  const [attemptsUsed, setAttemptsUsed] = useState(0);

  const [showWarning, setShowWarning] = useState(false);
  const [showPassage, setShowPassage] = useState(false);
  const [passageTimeLeft, setPassageTimeLeft] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showBackWarning, setShowBackWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const { user } = useAuth() || {};
  const navigate = useNavigate();

  const getStorageKey = () =>
    `assessment-progress:${collectionName}:${user?.uid || "guest"}:${subjectId}`;

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // Fetch assessment
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      try {
        const ref = doc(db, collectionName, subjectId);
        const snap = await getDoc(ref);

        if (cancelled) return;
        if (!snap.exists()) {
          console.warn(`No assessment found in ${collectionName}/${subjectId}`);
          setAssessment(null);
          return;
        }

        const data = snap.data();
        setAssessment(data);

        if (user?.uid) {
          const attemptsRef = collection(db, "users", user.uid, "results");
          const snaps = await getDocs(attemptsRef);
          const attempts = snaps.docs.filter((d) =>
            d.id.startsWith(`${collectionName}_${subjectId}`)
          ).length;

          setAttemptsUsed(attempts);
          if (attempts >= 2) {
            alert("You have used all attempts for this assessment.");
            navigate("/dashboard");
            return;
          }
        }

        const key = getStorageKey();
        const savedRaw = localStorage.getItem(key);
        if (savedRaw) {
          try {
            const saved = JSON.parse(savedRaw);
            if (saved?.subjectId === subjectId && saved?.questions?.length) {
              const startedAt = saved.startedAt || Date.now();
              const elapsed = Math.floor((Date.now() - startedAt) / 1000);
              const remaining = (saved.duration || ASSESSMENT_DURATION) - elapsed;

              setQuestions(saved.questions);
              setAnswers(saved.answers || {});
              setIndex(saved.index || 0);
              setStartAt(startedAt);
              setTimeLeft(Math.max(0, remaining));

              if (remaining <= 0) {
                setTimeout(() => {
                  handleSubmit(true, saved.questions, saved.answers).catch((e) =>
                    console.error("Auto-submit failed:", e)
                  );
                }, 0);
              }
              return;
            }
          } catch (err) {
            console.warn("Failed to parse saved progress:", err);
          }
        }

        const qset = shuffle(data.questions || [])
          .slice(0, 10)
          .map((q, i) => ({
            id: q.id || `q${i + 1}`,
            number: i + 1,
            question: q.question || q.prompt,
            options: shuffle(q.options),
            answer: q.answer,
            image: q.image || null,
          }));

        const now = Date.now();
        setQuestions(qset);
        setAnswers({});
        setIndex(0);
        setStartAt(now);
        setTimeLeft(ASSESSMENT_DURATION);

        localStorage.setItem(
          key,
          JSON.stringify({
            subjectId,
            questions: qset,
            answers: {},
            index: 0,
            startedAt: now,
            duration: ASSESSMENT_DURATION,
          })
        );

        if (data.passage?.text) {
          setShowWarning(true);
        }

      } catch (err) {
        console.error("Failed to fetch assessment:", err);
        setAssessment(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (subjectId) fetchData();
    return () => (cancelled = true);
  }, [subjectId, user?.uid, navigate, collectionName]);

  // Persist session
  useEffect(() => {
    if (!questions?.length || submitted || !startAt) return;
    try {
      localStorage.setItem(
        getStorageKey(),
        JSON.stringify({
          subjectId,
          questions,
          answers,
          index,
          startedAt: startAt,
          duration: ASSESSMENT_DURATION,
        })
      );
    } catch (err) {
      console.warn("Failed to persist progress:", err);
    }
  }, [questions, answers, index, startAt, submitted]);

  // Timer
  useEffect(() => {
    if (submitted || !startAt) return;
    const tick = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startAt) / 1000);
      const remaining = ASSESSMENT_DURATION - elapsed;
      setTimeLeft(Math.max(0, remaining));

      if (remaining <= 0) {
        clearInterval(tick);
        handleSubmit(true).catch((e) => console.error(e));
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [startAt, submitted]);

  // Prevent browser back button and handle navigation
  useEffect(() => {
    if (submitted) return;

    // Prevent accidental page closure/reload
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    // Handle browser back button
    const handlePopState = (e) => {
      e.preventDefault();
      setShowBackWarning(true);
      // Push a new state to keep user on the page
      window.history.pushState(null, '', window.location.pathname);
    };

    // Push initial state
    window.history.pushState(null, '', window.location.pathname);

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [submitted]);

  const handleSelect = (qId, option) =>
    setAnswers((prev) => ({ ...prev, [qId]: option }));

  const goNext = () => {
    const currentQuestion = questions[index];
    if (!answers[currentQuestion.id]) {
      alert("Please select an answer before continuing.");
      return;
    }
    setIndex((i) => Math.min(i + 1, questions.length - 1));
  };

  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  const formatTime = (secs) =>
    `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, "0")}`;

  const handleSubmit = async (
    force = false,
    overrideQuestions = null,
    overrideAnswers = null
  ) => {
    const qList = overrideQuestions || questions;
    const ans = overrideAnswers || answers;
    if (!qList?.length) return;

    if (!force) {
      const lastQ = qList[index];
      if (!ans[lastQ.id]) {
        alert("Please answer the last question before submitting.");
        return;
      }
    }

    let correct = 0;
    for (const q of qList) {
      if (ans[q.id] === q.answer) correct++;
    }
    const pct = Math.round((correct / qList.length) * 100);
    const result = { correct, total: qList.length, pct };

    setScore(result);
    setSubmitted(true);
    localStorage.removeItem(getStorageKey());

    if (user?.uid) {
      try {
        const attemptsRef = collection(db, "users", user.uid, "results");
        const snaps = await getDocs(attemptsRef);
        const attempts = snaps.docs.filter((d) =>
          d.id.startsWith(`${collectionName}_${subjectId}`)
        ).length;

        if (attempts >= 2) {
          alert("Maximum attempts reached.");
          navigate("/dashboard");
          return;
        }

        const attemptNum = attempts + 1;
        const resultRef = doc(
          db,
          "users",
          user.uid,
          "results",
          `${collectionName}_${subjectId}_${attemptNum}`
        );

        await setDoc(resultRef, {
          assessmentId: subjectId,
          collection: collectionName,
          title: assessment?.title ?? "",
          score: pct,
          correct,
          total: qList.length,
          answers: ans,
          attempt: attemptNum,
          submittedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Failed to save result:", err);
      }
    }
    return result;
  };

  const handleRetry = () => {
    if (attemptsUsed >= 2) {
      alert("No attempts left.");
      navigate("/dashboard");
      return;
    }
    localStorage.removeItem(getStorageKey());

    if (assessment?.questions) {
      const qset = shuffle(assessment.questions)
        .slice(0, 10)
        .map((q, i) => ({
          id: `q${i + 1}`,
          number: i + 1,
          question: q.question || q.prompt,
          options: shuffle(q.options),
          answer: q.answer,
          image: q.image || null,
        }));

      const now = Date.now();
      setQuestions(qset);
      setAnswers({});
      setIndex(0);
      setSubmitted(false);
      setScore(null);
      setStartAt(now);
      setTimeLeft(ASSESSMENT_DURATION);

      localStorage.setItem(
        getStorageKey(),
        JSON.stringify({
          subjectId,
          questions: qset,
          answers: {},
          index: 0,
          startedAt: now,
          duration: ASSESSMENT_DURATION,
        })
      );
    }
  };

  const handleExitConfirm = async () => {
    await handleSubmit(true);
    navigate("/dashboard");
  };

  const handleBackConfirm = async () => {
    // Submit the assessment and lose one attempt
    await handleSubmit(true);
    setShowBackWarning(false);
    // Navigate back
    navigate(-1);
  };

  const handleBackCancel = () => {
    setShowBackWarning(false);
    setPendingNavigation(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-1400 via-primary-1500 to-black text-gray-300 animate-pulse">
        Loading assessment...
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-1400 via-primary-1500 to-black text-gray-400">
        Assessment not found
      </div>
    );
  }

  if (submitted && score) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black px-6 py-12">
        <ResultCard
          title={assessment.title}
          score={score}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  const currentQuestion = questions[index];
  const progress = ((index + 1) / questions.length) * 100;
  const isLastQuestion = index === questions.length - 1;

  return (
    <section className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 mt-8 sm:mt-12"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-primary-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent mb-4">
          {assessment.title}
        </h1>
        <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto mb-4">
          {assessment.description || "Answer the questions to the best of your ability"}
        </p>

        {/* Timer */}
        <div className="flex items-center justify-center gap-2 text-primary-400">
          <Clock size={20} />
          <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
        </div>

        {/* Progress indicator */}
        <div className="mt-6 max-w-2xl mx-auto">
          <ProgressBar current={index + 1} total={questions.length} pct={Math.round(progress)} />
        </div>
      </motion.div>

      {/* Question Card */}
      <div className="m-auto max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard
              question={currentQuestion}
              selected={answers[currentQuestion?.id]}
              onSelect={(opt) => handleSelect(currentQuestion.id, opt)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => setShowExitModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-800/70 text-gray-300 font-semibold hover:bg-gray-700 transition border border-gray-600"
          >
            <Home size={20} />
            Exit Assessment
          </button>

          <div className="flex gap-3">
            <button
              onClick={goPrev}
              disabled={index === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition ${
                index === 0
                  ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-800/70 text-white hover:bg-gray-700 border border-gray-600'
              }`}
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={() => handleSubmit(false)}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary-500 to-emerald-400 text-primary-1300 font-semibold shadow-lg hover:shadow-primary-500/50 transition-all hover:scale-105"
              >
                Submit Assessment
              </button>
            ) : (
              <button
                onClick={goNext}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary-500 text-primary-1300 font-semibold hover:bg-primary-400 transition shadow-lg hover:shadow-primary-500/50"
              >
                Next
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="text-center p-4 rounded-xl bg-gray-800/60 border border-gray-700/40">
            <div className="text-xs text-gray-400 mb-1">Progress</div>
            <div className="text-xl font-bold text-white">{index + 1}/{questions.length}</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-gray-800/60 border border-gray-700/40">
            <div className="text-xs text-gray-400 mb-1">Answered</div>
            <div className="text-xl font-bold text-white">{Object.keys(answers).length}</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-gray-800/60 border border-gray-700/40">
            <div className="text-xs text-gray-400 mb-1">Attempts</div>
            <div className="text-xl font-bold text-white">{attemptsUsed}/2</div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
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
                <h3 className="text-xl font-bold text-white">Exit Assessment?</h3>
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

      {/* Back Button Warning Modal */}
      <AnimatePresence>
        {showBackWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full border-2 border-yellow-500/40 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                  <AlertTriangle className="text-yellow-400" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white">Navigation Warning</h3>
              </div>

              <div className="mb-6">
                <p className="text-gray-200 mb-4 leading-relaxed text-lg">
                  Going back will exit the assessment and your progress will be lost.
                </p>
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-300 font-semibold text-center">
                    This will count as <span className="text-red-400 font-black text-xl">1 attempt</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleBackCancel}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-emerald-400 text-gray-900 font-bold hover:scale-105 transition-all shadow-lg"
                >
                  Continue Assessment
                </button>
                <button
                  onClick={handleBackConfirm}
                  className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-gray-300 font-semibold hover:bg-gray-600 transition"
                >
                  Exit & Lose Attempt
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning Modal */}
      {showWarning && assessment?.passage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="max-w-lg mx-4 text-center bg-gray-900/95 border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4">
              Important Notice
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              You will be shown a passage for a limited time. Please read it carefully, once the timer starts, you cannot pause or go back.
            </p>
            <button
              onClick={() => {
                setShowWarning(false);
                setShowPassage(true);
                const displaySeconds = assessment.passage.displayTime || 20;
                setPassageTimeLeft(displaySeconds);

                const passageTimer = setInterval(() => {
                  setPassageTimeLeft((prev) => {
                    if (prev <= 1) {
                      clearInterval(passageTimer);
                      setShowPassage(false);
                    }
                    return prev - 1;
                  });
                }, 1000);
              }}
              className="mt-6 px-6 py-3 rounded-full bg-primary-500 text-primary-1300 font-semibold hover:bg-primary-400 transition"
            >
              Okay, I Understand
            </button>
          </div>
        </div>
      )}

      {/* Passage Modal */}
      {showPassage && assessment?.passage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="max-w-3xl mx-4 text-center bg-gray-900/90 border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-400 mb-4">
              Memory Passage
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-line">
              {assessment.passage.text}
            </p>
            <p className="mt-6 text-sm text-gray-400">
              Disappearing in <span className="font-bold">{passageTimeLeft}</span> seconds...
            </p>
          </div>
        </div>
      )}
    </section>
  );
}