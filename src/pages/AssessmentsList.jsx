// src/pages/AssessmentsList.jsx
import { useEffect, useState, memo, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, Brain, ClipboardList, CheckCircle, Clock, X, FileText, Code, Award, TrendingUp, Trophy, Target, Timer, RefreshCw, Lock, Unlock, Zap } from "lucide-react";
import DashNav from "../components/dashboard/DashboardNav";
import { useAuth } from "../components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { checkAssessmentAccess, getUnlockMessage } from "../utils/assessmentUnlock";
import { identifyWeakAreas } from "../data/sections/learningResources";

export default function AssessmentsList() {
  const [academic, setAcademic] = useState([]);
  const [technical, setTechnical] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showQuickJump, setShowQuickJump] = useState(false);
  const [learningProgress, setLearningProgress] = useState({});
  const [weakAreas, setWeakAreas] = useState([]);
  const [userScores, setUserScores] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth() || {};

  const academicHeaderRef = useRef(null);
  const technicalHeaderRef = useRef(null);
  const personalHeaderRef = useRef(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const academicRef = collection(db, "assessments");
        const academicSnap = await getDocs(academicRef);
        const academicData = academicSnap.docs.map((doc) => ({
          id: doc.id,
          type: "academic",
          mode: "mcq",
          ...doc.data(),
        }));

        const techRef = collection(db, "technicalAssessments");
        const techSnap = await getDocs(techRef);
        const techData = techSnap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: "technical",
            mode: data.mode || "mcq",
            ...data,
          };
        });

        const personalRef = collection(db, "personalAssessments");
        const personalSnap = await getDocs(personalRef);
        const personalData = personalSnap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: "personal",
            mode: data.mode || "survey",
            ...data,
          };
        });

        if (!user) {
          setAcademic(academicData);
          setTechnical(techData);
          setPersonal(personalData);
          return;
        }

        // Fetch results
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

        // Fetch learning progress
        const progressRef = collection(db, "users", user.uid, "learningProgress");
        const progressSnapshot = await getDocs(progressRef);
        const progress = {};
        progressSnapshot.docs.forEach(doc => {
          progress[doc.id] = doc.data();
        });
        setLearningProgress(progress);

        // Calculate weak areas and scores from results
        const resultsMap = {};
        resultsSnap.docs.forEach(doc => {
          const data = doc.data();
          const baseId = doc.id.replace(/_\d+$/, '');
          if (!resultsMap[baseId] || (data.score > (resultsMap[baseId].score || 0))) {
            resultsMap[baseId] = { id: doc.id, ...data };
          }
        });

        const academicScores = {
          os_perc: resultsMap["assessments_operating_systems"]?.score || 0,
          algo_perc: resultsMap["assessments_algorithms"]?.score || 0,
          prog_perc: resultsMap["assessments_programming"]?.score || 0,
          se_perc: resultsMap["assessments_software_engineering"]?.score || 0,
          cn_perc: resultsMap["assessments_computer_networks"]?.score || 0,
          comm_perc: resultsMap["assessments_communication"]?.score || 0,
          math_perc: resultsMap["assessments_mathematics"]?.score || 0,
          es_perc: resultsMap["assessments_electronics"]?.score || 0,
          ca_perc: resultsMap["assessments_computer_architecture"]?.score || 0,
        };

        const technicalSkills = {
          coding_skills: Math.round((resultsMap["technicalAssessments_coding_skills"]?.score || 0) / 20),
          logical_quotient: Math.round((resultsMap["technicalAssessments_logical_quotient"]?.score || 0) / 20),
          memory_test: Math.round((resultsMap["technicalAssessments_memory_test"]?.score || 0) / 10),
        };

        const weak = identifyWeakAreas(academicScores, technicalSkills);
        setWeakAreas(weak);

        // Set user scores for access checking
        const scores = {
          ...academicScores,
          ...technicalSkills
        };
        setUserScores(scores);

        const mergeWithResults = (items) =>
          items.map((a) => {
            const attempts = resultsByAssessment[a.id] || [];
            if (attempts.length === 0) return { ...a, result: null };

            const sorted = attempts.sort(
              (x, y) =>
                new Date(y.submittedAt).getTime() - new Date(x.submittedAt).getTime()
            );

            return {
              ...a,
              result: sorted[0],
              attempts: attempts.length,
            };
          });

        setAcademic(mergeWithResults(academicData));
        setTechnical(mergeWithResults(techData));
        setPersonal(mergeWithResults(personalData));
      } catch (err) {
        console.error("Failed to fetch assessments:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 400;
      setShowQuickJump(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");

    if (!tab) return;

    const scrollToSection = () => {
      let targetRef = null;
      
      if (tab === "academic") {
        targetRef = academicHeaderRef;
      } else if (tab === "technical") {
        targetRef = technicalHeaderRef;
      } else if (tab === "personal") {
        targetRef = personalHeaderRef;
      }

      if (targetRef?.current) {
        targetRef.current.scrollIntoView({ 
          behavior: "smooth", 
          block: "start",
          inline: "nearest"
        });
      }
    };

    const timeoutId = setTimeout(scrollToSection, 600);
    
    return () => clearTimeout(timeoutId);
  }, [location.search, loading]);

  const handleStartTest = (assessment, accessStatus) => {
    // Surveys have no restrictions
    if (assessment.mode === "survey") {
      if (assessment.type === "personal") {
        navigate(`/survey/personal/${assessment.id}`);
      } else {
        navigate(`/survey/technical/${assessment.id}`);
      }
      return;
    }

    // Check access status
    if (!accessStatus.canAccess) {
      if (accessStatus.reason === "max_attempts") {
        setModalMessage("You have already reached the maximum of 2 attempts for this assessment.");
      } else if (accessStatus.reason === "threshold_met_incomplete_resources") {
        setModalMessage(accessStatus.message);
      } else if (accessStatus.reason === "locked") {
        setModalMessage(getUnlockMessage(accessStatus));
      }
      setShowModal(true);
      return;
    }

    // Navigate to assessment
    if (assessment.type === "technical") {
      navigate(`/technical-assessments/${assessment.id}`);
    } else {
      navigate(`/assessments/${assessment.id}`);
    }
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ 
      behavior: "smooth", 
      block: "start",
      inline: "nearest"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-1400 via-primary-1500 to-black dark:from-primary-1400 dark:via-primary-1500 dark:to-black light:from-gray-50 light:via-white light:to-gray-100">
        <div className="text-gray-700 dark:text-gray-300 light:text-gray-700 animate-pulse text-lg">Loading assessments...</div>
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black dark:from-primary-1400 dark:via-primary-1500 dark:to-black light:from-gray-50 light:via-white light:to-gray-100 px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
      <DashNav />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 sm:mb-16 lg:mb-20 mt-16 sm:mt-20 lg:mt-24 px-4"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-primary-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent mb-3 sm:mb-4">
          Assessments
        </h1>
        <p className="text-gray-600 dark:text-gray-300 light:text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Test your knowledge and track your progress across academic and technical skills
        </p>
      </motion.div>

      <div className="m-auto max-w-7xl space-y-16">
        <Section
          title="Academic Assessments"
          icon={<BookOpen size={32} />}
          items={academic}
          onStart={handleStartTest}
          headerRef={academicHeaderRef}
          learningProgress={learningProgress}
          weakAreas={weakAreas}
          userScores={userScores}
        />
        <Section
          title="Technical Assessments"
          icon={<Code size={32} />}
          items={technical}
          onStart={handleStartTest}
          headerRef={technicalHeaderRef}
          learningProgress={learningProgress}
          weakAreas={weakAreas}
          userScores={userScores}
        />
        <Section
          title="Personal Assessments"
          icon={<Award size={32} />}
          items={personal}
          onStart={handleStartTest}
          headerRef={personalHeaderRef}
          learningProgress={learningProgress}
          weakAreas={weakAreas}
          userScores={userScores}
        />
      </div>

      <AnimatePresence>
        {showQuickJump && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-6 top-1/2 -translate-y-1/2 z-40"
          >
            <div className="flex flex-col gap-2 md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(technicalHeaderRef)}
                className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                <Code size={18} />
                <span className="text-sm font-semibold">Technical</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(personalHeaderRef)}
                className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg hover:shadow-emerald-500/50 transition-all"
              >
                <Award size={18} />
                <span className="text-sm font-semibold">Personal</span>
              </motion.button>
            </div>

            <div className="hidden md:flex flex-col gap-4 bg-gray-900/80 dark:bg-gray-900/80 light:bg-white/90 backdrop-blur-sm border border-gray-700/50 dark:border-gray-700/50 light:border-gray-300 rounded-full p-3 shadow-xl">
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollToSection(academicHeaderRef)}
                className="group relative w-3 h-3 rounded-full bg-primary-400 hover:bg-primary-300 dark:bg-primary-400 dark:hover:bg-primary-300 light:bg-primary-600 light:hover:bg-primary-500 transition-all shadow-lg"
                title="Academic"
              >
                <span className="absolute right-6 top-1/2 -translate-y-1/2 bg-gray-900 dark:bg-gray-900 light:bg-white text-white dark:text-white light:text-gray-900 text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg border border-gray-700 dark:border-gray-700 light:border-gray-300">
                  Academic
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollToSection(technicalHeaderRef)}
                className="group relative w-3 h-3 rounded-full bg-purple-400 hover:bg-purple-300 dark:bg-purple-400 dark:hover:bg-purple-300 light:bg-purple-600 light:hover:bg-purple-500 transition-all shadow-lg"
                title="Technical"
              >
                <span className="absolute right-6 top-1/2 -translate-y-1/2 bg-gray-900 dark:bg-gray-900 light:bg-white text-white dark:text-white light:text-gray-900 text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg border border-gray-700 dark:border-gray-700 light:border-gray-300">
                  Technical
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollToSection(personalHeaderRef)}
                className="group relative w-3 h-3 rounded-full bg-emerald-400 hover:bg-emerald-300 dark:bg-emerald-400 dark:hover:bg-emerald-300 light:bg-emerald-600 light:hover:bg-emerald-500 transition-all shadow-lg"
                title="Personal"
              >
                <span className="absolute right-6 top-1/2 -translate-y-1/2 bg-gray-900 dark:bg-gray-900 light:bg-white text-white dark:text-white light:text-gray-900 text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg border border-gray-700 dark:border-gray-700 light:border-gray-300">
                  Personal
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 text-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full border border-yellow-500/30"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-yellow-500/20">
                  <Lock className="text-yellow-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Assessment Locked</h3>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4 whitespace-pre-line">{modalMessage}</p>
              <button
                onClick={() => {
                  setShowModal(false);
                  navigate('/learning-path');
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-400 text-primary-1300 rounded-xl font-semibold hover:scale-105 transition mb-2"
              >
                Go to Learning Path
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-6 py-2 bg-gray-800 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </section>
  );
}

const Section = memo(function Section({ 
  title, 
  icon, 
  items, 
  onStart, 
  headerRef, 
  learningProgress, 
  weakAreas,
  userScores 
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div ref={headerRef} className="scroll-mt-24 sm:scroll-mt-32 mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="text-primary-400 scale-75 sm:scale-100">{icon}</div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-400 to-emerald-300 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-primary-400 to-transparent rounded-full"></div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 px-6 rounded-2xl bg-gray-800/40 dark:bg-gray-800/40 light:bg-gray-100 border border-gray-700/40 dark:border-gray-700/40 light:border-gray-300">
          <p className="text-gray-600 dark:text-gray-400 light:text-gray-600">No assessments available yet</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {items.map((a, idx) => (
            <AssessmentCard 
              key={a.id} 
              assessment={a} 
              index={idx} 
              onStart={onStart}
              learningProgress={learningProgress}
              weakAreas={weakAreas}
              userScores={userScores}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
});

const AssessmentCard = memo(function AssessmentCard({ 
  assessment, 
  index, 
  onStart, 
  learningProgress, 
  weakAreas,
  userScores 
}) {
  const cardIcons = [BookOpen, Brain, Code, ClipboardList, TrendingUp];
  const Icon = assessment.mode === "survey" ? FileText : cardIcons[index % cardIcons.length];
  
  const isCompleted = !!assessment.result;
  const isSurvey = assessment.mode === "survey";
  
  // Get access status using new unified function
  const accessStatus = checkAssessmentAccess(assessment, learningProgress, weakAreas, userScores);
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 60) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (score >= 40) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  return (
    <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm transition-all group flex flex-col h-full hover:-translate-y-1 relative overflow-hidden
      ${isCompleted
        ? 'bg-gray-900/70 dark:bg-gray-900/70 light:bg-gray-50 border-2 dark:border-emerald-500/50 light:border-black hover:border-emerald-400/70 shadow-xl dark:shadow-emerald-500/20 light:shadow-lg'
        : !accessStatus.canAccess && accessStatus.reason === 'threshold_met_incomplete_resources'
        ? 'bg-gray-900/70 dark:bg-gray-900/70 light:bg-gray-50 border-2 dark:border-yellow-500/50 light:border-black hover:border-yellow-400/70 shadow-xl dark:shadow-yellow-500/20 light:shadow-lg'
        : 'bg-gray-900/70 dark:bg-gray-900/70 light:bg-gray-50 border-2 dark:border-gray-700/40 light:border-black hover:border-primary-500/50 shadow-xl dark:shadow-black/40 light:shadow-lg'
      }`}
    >
      {/* Threshold Met Badge */}
      {!isCompleted && accessStatus.reason === 'threshold_met_incomplete_resources' && (
        <div className="absolute -top-1 -right-1 z-10">
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-bl-lg sm:rounded-bl-xl rounded-tr-lg sm:rounded-tr-xl font-bold text-[10px] sm:text-xs bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
            <Target size={12} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">THRESHOLD MET</span>
            <span className="sm:hidden">MET</span>
          </div>
        </div>
      )}

      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute -top-1 -right-1 z-10">
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-bl-lg sm:rounded-bl-xl rounded-tr-lg sm:rounded-tr-xl font-bold text-[10px] sm:text-xs bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
            <Trophy size={12} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">COMPLETED</span>
            <span className="sm:hidden">DONE</span>
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none rounded-2xl" />
      )}

      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition relative
          ${isCompleted
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20'
          }`}
        >
          <Icon size={24} className="sm:w-7 sm:h-7" />
          {isCompleted && (
            <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 rounded-full border-2 border-gray-900 animate-pulse" />
          )}
        </div>

        <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full
          ${isSurvey
            ? "bg-blue-500/20 text-blue-300 border border-blue-400/40"
            : "bg-purple-500/20 text-purple-300 border border-purple-400/40"
          }`}
        >
          {isSurvey ? "Survey" : "MCQ"}
        </span>
      </div>

      <h3 className={`text-lg sm:text-xl font-bold mb-2 transition line-clamp-2
        ${isCompleted
          ? 'text-emerald-300 dark:text-emerald-300 light:text-emerald-600 group-hover:text-emerald-200 dark:group-hover:text-emerald-200 light:group-hover:text-emerald-500'
          : 'text-gray-900 dark:text-white light:text-gray-900 group-hover:text-primary-600 dark:group-hover:text-primary-400 light:group-hover:text-primary-600'
        }`}
      >
        {assessment.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 light:text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">
        {assessment.description}
      </p>

      <div className="flex-1">
        {isCompleted ? (
          <div className="space-y-2 sm:space-y-3">
            {!isSurvey && assessment.result?.score !== undefined && (
              <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 ${getScoreColor(assessment.result.score)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium opacity-90">Your Score</span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-2xl sm:text-3xl font-bold">{assessment.result.score}</span>
                    <span className="text-base sm:text-lg opacity-75">%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Status for MCQ */}
            {!isSurvey && (
              <div className="space-y-2">
                {/* Attempts Progress */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600 dark:text-gray-400 light:text-gray-600 flex items-center gap-1.5 sm:gap-2">
                    <Target size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span>Attempts</span>
                  </span>
                  <span className="font-bold text-emerald-400">
                    {assessment.attempts ?? 0}/2
                  </span>
                </div>
                
                <div className="w-full bg-gray-800 dark:bg-gray-800 light:bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 bg-gradient-to-r from-emerald-500 to-cyan-400"
                    style={{ width: `${((assessment.attempts ?? 0) / 2) * 100}%` }}
                  />
                </div>

                {/* Status Cards */}
                {accessStatus.reason === "resources_completed" && (
                  <div className="p-2 sm:p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-400 text-xs sm:text-sm">
                      <Unlock size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="font-medium">Unlocked via learning!</span>
                    </div>
                  </div>
                )}

                {accessStatus.reason === "time_elapsed" && (
                  <div className="p-2 sm:p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-blue-400 text-xs sm:text-sm">
                      <Clock size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="font-medium">Unlocked via time</span>
                    </div>
                  </div>
                )}

                {accessStatus.reason === "locked" && (
                  <div className="p-2 sm:p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-yellow-400 text-xs sm:text-sm">
                        <Lock size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="font-medium">2nd Attempt Locked</span>
                      </div>

                      {/* Progress bars */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 light:text-gray-600">
                          <span className="truncate pr-1">Learning Progress</span>
                          <span className="text-yellow-400 font-bold whitespace-nowrap">
                            {accessStatus.completedResources || 0}/{accessStatus.requiredCompletion}
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 dark:bg-gray-800 light:bg-gray-200 rounded-full h-1.5">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-500 to-emerald-400 rounded-full transition-all"
                            style={{ width: `${accessStatus.completionPercentage}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 light:text-gray-600 pt-1">
                          <span className="truncate pr-1">Time Remaining</span>
                          <span className="text-blue-400 font-bold whitespace-nowrap">{accessStatus.daysRemaining}d</span>
                        </div>
                        <div className="w-full bg-gray-800 dark:bg-gray-800 light:bg-gray-200 rounded-full h-1.5">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                            style={{ width: `${((7 - accessStatus.daysRemaining) / 7) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {accessStatus.reason === "max_attempts" && (
                  <div className="p-2 sm:p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-red-400 text-xs sm:text-sm">
                      <X size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="font-medium">Max attempts reached</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Survey can be retaken anytime */}
            {isSurvey && (
              <div className="p-2 sm:p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-center gap-1.5 sm:gap-2 text-blue-400 text-xs sm:text-sm">
                  <RefreshCw size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="font-medium">Can update responses anytime</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600 dark:text-gray-500 light:text-gray-600 pt-1">
              <CheckCircle size={12} className="sm:w-3.5 sm:h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="truncate">
                {assessment.result?.submittedAt
                  ? (() => {
                      const date = assessment.result.submittedAt?.toDate
                        ? assessment.result.submittedAt.toDate()
                        : new Date(assessment.result.submittedAt);

                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    })()
                  : "Completed"}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {/* Not started yet - show threshold met status */}
            {accessStatus.reason === 'threshold_met_incomplete_resources' && (
              <div className="space-y-2">
                <div className="p-2 sm:p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-yellow-400 text-xs sm:text-sm mb-2">
                    <Trophy size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="font-medium">Threshold Already Met!</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 light:text-gray-600">
                    Score: {accessStatus.currentScore}% (Target: {accessStatus.threshold}%)
                  </p>
                </div>

                <div className="p-2 sm:p-3 rounded-lg bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-100 border border-gray-700/30 dark:border-gray-700/30 light:border-gray-300">
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 light:text-gray-600">
                      <span className="truncate pr-1">Complete Resources to Unlock</span>
                      <span className="text-yellow-400 font-bold whitespace-nowrap">
                        {accessStatus.completedResources}/{accessStatus.requiredCompletion}
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 dark:bg-gray-800 light:bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-emerald-400 rounded-full transition-all"
                        style={{ width: `${accessStatus.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {accessStatus.reason !== 'threshold_met_incomplete_resources' && (
              <div className="py-3 sm:py-4 px-3 sm:px-4 rounded-lg bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-100 border border-gray-700/30 dark:border-gray-700/30 light:border-gray-300">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 light:text-gray-600">
                  <Clock size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Not started yet</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => onStart(assessment, accessStatus)}
        className={`w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-lg transition-all mt-4 sm:mt-6 hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2 border-2
          ${!accessStatus.canAccess
            ? 'bg-gray-700 dark:bg-gray-700 light:bg-gray-300 border-gray-600 dark:border-gray-600 light:border-gray-500 text-gray-400 dark:text-gray-400 light:text-gray-700 cursor-not-allowed opacity-70'
            : isCompleted
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-500 dark:to-purple-500 light:from-gray-700 light:to-gray-800 border-blue-600 dark:border-blue-600 light:border-gray-900 text-white hover:shadow-blue-500/50'
            : 'bg-gradient-to-r from-primary-500 to-emerald-400 dark:from-primary-500 dark:to-emerald-400 light:from-gray-700 light:to-gray-800 border-primary-600 dark:border-primary-600 light:border-gray-900 text-white dark:text-primary-1300 light:text-white hover:shadow-primary-500/50'
          }`}
        disabled={!accessStatus.canAccess}
      >
        {!accessStatus.canAccess ? (
          <>
            <Lock size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="truncate">
              {accessStatus.reason === 'threshold_met_incomplete_resources'
                ? 'Complete Resources'
                : 'Locked'}
            </span>
          </>
        ) : isCompleted ? (
          <>
            {accessStatus.reason === "resources_completed" && <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />}
            <span className="truncate">{isSurvey ? "Update Responses" : "Retake Test"}</span>
          </>
        ) : (
          <span className="truncate">{isSurvey ? "Start Survey" : "Start Test"}</span>
        )}
      </button>
    </div>
  );
});