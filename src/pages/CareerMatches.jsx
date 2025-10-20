// src/pages/CareerMatches.jsx
import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashNav from "../components/dashboard/DashboardNav";
import { createNotification } from '../services/notificationService';
import {
  CheckCircle,
  XCircle,
  Loader2,
  TrendingUp,
  Briefcase,
  Target,
  Star,
  Lock,
  AlertTriangle,
  Award,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Rocket,
  Check,
  Brain,
  Code,
  BarChart3
} from "lucide-react";

export default function CareerMatches() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [hasSelectedCareer, setHasSelectedCareer] = useState(false);
  const [selectedCareerData, setSelectedCareerData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [careerToSelect, setCareerToSelect] = useState(null);
  const [completion, setCompletion] = useState({
    academic: { completed: 0, total: 9 },
    technical: { completed: 0, total: 5 },
    personal: { completed: 0, total: 3 },
  });
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    checkCompletion();
    checkExistingSelection();
  }, [user]);

  const checkExistingSelection = async () => {
    try {
      const careerDocRef = doc(db, "users", user.uid, "selectedCareer", "current");
      const careerDoc = await getDoc(careerDocRef);
      
      if (careerDoc.exists()) {
        setHasSelectedCareer(true);
        setSelectedCareerData(careerDoc.data());
      }
    } catch (err) {
      console.error("Error checking existing selection:", err);
    }
  };

  const checkCompletion = async () => {
    setLoading(true);
    try {
      const resultsRef = collection(db, "users", user.uid, "results");
      const snapshot = await getDocs(resultsRef);
      
      const completedIds = new Set(
        snapshot.docs.map(doc => doc.id.replace(/_\d+$/, ''))
      );

      const required = {
        academic: [
          'assessments_algorithms',
          'assessments_programming', 
          'assessments_operating_systems',
          'assessments_software_engineering',
          'assessments_computer_networks',
          'assessments_electronics',
          'assessments_computer_architecture',
          'assessments_mathematics',
          'assessments_communication'
        ],
        technical: [
          'technicalAssessments_coding_skills',
          'technicalAssessments_logical_quotient',
          'technicalAssessments_memory_test',
          'survey_hackathons',
          'survey_hours_working'
        ],
        personal: [
          'survey_career_preferences',
          'survey_personal_interests',
          'survey_personality_workstyle'
        ]
      };

      setCompletion({
        academic: {
          completed: required.academic.filter(id => completedIds.has(id)).length,
          total: required.academic.length
        },
        technical: {
          completed: required.technical.filter(id => completedIds.has(id)).length,
          total: required.technical.length
        },
        personal: {
          completed: required.personal.filter(id => completedIds.has(id)).length,
          total: required.personal.length
        }
      });
    } catch (err) {
      console.error("Error checking completion:", err);
    } finally {
      setLoading(false);
    }
  };

  const aggregateUserData = async () => {
    const resultsRef = collection(db, "users", user.uid, "results");
    const snapshot = await getDocs(resultsRef);
    
    const resultsMap = {};
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const docId = doc.id;
      const baseId = docId.replace(/_\d+$/, '');
      
      if (!resultsMap[baseId] || 
          (data.score > (resultsMap[baseId].score || 0)) ||
          (data.timestamp > (resultsMap[baseId].timestamp || 0))) {
        resultsMap[baseId] = {
          id: docId,
          ...data
        };
      }
    });

    const getScore = (assessmentId) => {
      return resultsMap[assessmentId]?.score || 0;
    };

    const getSurveyValue = (surveyId, questionId = null) => {
      const result = resultsMap[surveyId];
      if (!result) return null;

      if (result.answers) {
        if (questionId) {
          const answer = result.answers[questionId];
          return answer?.value ?? answer?.label ?? null;
        }
        const firstAnswer = Object.values(result.answers)[0];
        return firstAnswer?.value ?? firstAnswer?.label ?? null;
      }
      
      return result.modelValue ?? result.value ?? null;
    };

    const payload = {
      courses: "BSIT",
      os_perc: getScore("assessments_operating_systems"),
      algo_perc: getScore("assessments_algorithms"),
      prog_perc: getScore("assessments_programming"),
      se_perc: getScore("assessments_software_engineering"),
      cn_perc: getScore("assessments_computer_networks"),
      es_perc: getScore("assessments_electronics"),
      ca_perc: getScore("assessments_computer_architecture"),
      math_perc: getScore("assessments_mathematics"),
      comm_perc: getScore("assessments_communication"),
      coding_skills: Math.round((getScore("technicalAssessments_coding_skills") / 100) * 5) || 3,
      logical_quotient: Math.round((getScore("technicalAssessments_logical_quotient") / 100) * 5) || 3,
      memory_score: Math.round((getScore("technicalAssessments_memory_test") / 100) * 10) || 5,
      hours_working: parseInt(getSurveyValue("survey_hours_working", "q1")) || 6,
      hackathons: parseInt(getSurveyValue("survey_hackathons", "q1")) || 0,
      interested_subjects: getSurveyValue("survey_career_preferences", "q1") || "Software Engineering",
      career_area: getSurveyValue("survey_career_preferences", "q2") || "system developer",
      company_type: getSurveyValue("survey_career_preferences", "q3") || "Product based",
      management_tech: getSurveyValue("survey_career_preferences", "q4") || "Technical",
      books: getSurveyValue("survey_personal_interests", "q1") || "Technical",
      gaming_interest: getSurveyValue("survey_personal_interests", "q2") || "no",
      public_speaking: parseInt(getSurveyValue("survey_personal_interests", "q3")) || 3,
      work_style: getSurveyValue("survey_personal_interests", "q4") || "smart worker",
      behavior: getSurveyValue("survey_personality_workstyle", "q1") || "gentle",
      introvert: getSurveyValue("survey_personality_workstyle", "q2") || "no",
      relationship: getSurveyValue("survey_personality_workstyle", "q3") || "no",
      team_exp: getSurveyValue("survey_personality_workstyle", "q4") || "yes",
      seniors_input: getSurveyValue("survey_personality_workstyle", "q5") || "yes",
      salary_work: getSurveyValue("survey_personality_workstyle", "q6") || "work",
    };

    return payload;
  };

  const handlePredict = async () => {
    setPredicting(true);
    setError(null);

    try {
      const payload = await aggregateUserData();

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${errorText}`);
      }
      
      const data = await response.json();
      setPredictions(data.recommendations);
    } catch (err) {
      console.error("Prediction error:", err);
      setError("Failed to get predictions. Make sure the FastAPI server is running.");
    } finally {
      setPredicting(false);
    }
  };

  const handleSelectCareerClick = (job) => {
    setCareerToSelect(job);
    setShowConfirmModal(true);
  };

  // Find the confirmSelectCareer function (around line 260) and replace it with this:

const confirmSelectCareer = async () => {
  if (!careerToSelect) return;

  try {
    const careerData = {
      jobRole: careerToSelect.job_role,
      category: careerToSelect.category,
      matchScore: careerToSelect.match_score,
      selectedAt: new Date().toISOString(),
    };

    // Save to selectedCareer subcollection
    const careerDocRef = doc(db, "users", user.uid, "selectedCareer", "current");
    await setDoc(careerDocRef, careerData);

    // ✨ NEW: Save careerCategory to main user document
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      careerCategory: careerToSelect.category, // This is the key field for roadmap!
      selectedCareerJobRole: careerToSelect.job_role,
      selectedCareerMatchScore: careerToSelect.match_score,
      careerSelectedAt: new Date().toISOString()
    }, { merge: true }); // merge: true keeps existing user data

    setHasSelectedCareer(true);
    setSelectedCareerData(careerData);
    setShowConfirmModal(false);


    await createNotification(user.uid, {
      title: "🎉 Congratulations on Your Career Selection!",
      message: `You've selected ${careerData.job_role} as your career path! This is an exciting first step towards your future. We'll now provide personalized learning resources and a roadmap to help you achieve your goals.`,
      type: "career_selection",
      priority: "high",
      link: "/career-roadmap", // Takes them to their roadmap
      icon: "🎯"
    });
    
    // Navigate to dashboard
    navigate("/dashboard");
  } catch (err) {
    console.error("Error selecting career:", err);
  }
};

  const isAllComplete = 
    completion.academic.completed === completion.academic.total &&
    completion.technical.completed === completion.technical.total &&
    completion.personal.completed === completion.personal.total;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-1400 via-primary-1500 to-black">
        <Loader2 className="animate-spin text-primary-400" size={48} />
      </div>
    );
  }

  // Already selected career view
  if (hasSelectedCareer && selectedCareerData) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black dark:from-primary-1400 dark:via-primary-1500 dark:to-black light:from-gray-50 light:via-white light:to-gray-100 px-4 sm:px-6 py-12">
        <DashNav />

        <div className="max-w-4xl mx-auto mt-20 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/70 dark:bg-gray-900/70 light:bg-white border border-primary-500/40 dark:border-primary-500/40 light:border-gray-200 rounded-3xl p-6 sm:p-8 text-center shadow-2xl"
          >
            <div className="inline-flex p-3 sm:p-4 rounded-full bg-primary-500/20 dark:bg-primary-500/20 light:bg-primary-100 mb-4 sm:mb-6">
              <Shield className="text-primary-400 dark:text-primary-400 light:text-primary-600" size={40} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white dark:text-white light:text-gray-900 mb-3 sm:mb-4">
              Career Path Locked
            </h2>

            <div className="bg-primary-500/10 dark:bg-primary-500/10 light:bg-primary-50 border border-primary-500/30 dark:border-primary-500/30 light:border-primary-200 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">Your Selected Career</div>
              <h3 className="text-xl sm:text-2xl font-bold text-primary-400 dark:text-primary-400 light:text-primary-600 mb-1">
                {selectedCareerData.jobRole}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 dark:text-gray-300 light:text-gray-700 mb-3">{selectedCareerData.category}</p>
              <div className="flex items-center justify-center gap-2">
                <Star className="text-yellow-400 dark:text-yellow-400 light:text-yellow-500" size={20} />
                <span className="text-lg sm:text-xl font-bold text-white dark:text-white light:text-gray-900">{selectedCareerData.matchScore}</span>
                <span className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">Match Score</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-300 dark:text-gray-300 light:text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
              You have already selected your career path. This is a permanent decision to help you focus on your learning journey. Continue building your skills and following your personalized learning path.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 border-4 border-cyan-900/80"
              >
                Go to Dashboard <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/student/learning-path")}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold transition-all shadow-2xl hover:shadow-slate-500/50 hover:scale-105 border-4 border-slate-900/80"
              >
                View Learning Path
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black dark:from-primary-1400 dark:via-primary-1500 dark:to-black light:from-gray-50 light:via-white light:to-gray-100 px-4 sm:px-6 py-12">
      <DashNav />

      <div className="max-w-7xl mx-auto mt-20 sm:mt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative"
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-500/20 via-emerald-500/20 to-cyan-500/20 dark:from-primary-500/20 dark:via-emerald-500/20 dark:to-cyan-500/20 light:from-primary-100 light:via-emerald-100 light:to-cyan-100 border border-primary-500/40 dark:border-primary-500/40 light:border-primary-300 mb-6 backdrop-blur-sm"
          >
            <Brain className="text-primary-400 dark:text-primary-400 light:text-primary-600" size={18} />
            <span className="text-primary-300 dark:text-primary-300 light:text-primary-700 text-sm font-bold tracking-wide">INTELLIGENT CAREER MATCHING</span>
            <Sparkles className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600" size={16} />
          </motion.div>

          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-primary-300 via-emerald-300 to-cyan-300 dark:from-primary-300 dark:via-emerald-300 dark:to-cyan-300 light:from-primary-600 light:via-emerald-600 light:to-cyan-600 bg-clip-text text-transparent mb-6 leading-tight"
          >
            Discover Your
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-primary-400 to-emerald-400 dark:from-yellow-300 dark:via-primary-400 dark:to-emerald-400 light:from-yellow-600 light:via-primary-600 light:to-emerald-600 bg-clip-text text-transparent">
              Perfect Career Path
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Complete all assessments to unlock personalized career recommendations
            <br className="hidden sm:block" />
            <span className="text-primary-400 dark:text-primary-400 light:text-primary-600 font-semibold">powered by advanced data-driven matching technology</span>
          </motion.p>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-8 mt-8 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-400 light:bg-emerald-500 animate-pulse"></div>
              <span className="text-gray-400 dark:text-gray-400 light:text-gray-600">17 Total Assessments</span>
            </div>
            <div className="w-px h-4 bg-gray-700 dark:bg-gray-700 light:bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-400 dark:text-yellow-400 light:text-yellow-600" size={14} />
              <span className="text-gray-400 dark:text-gray-400 light:text-gray-600">Top 3 Matches Generated</span>
            </div>
            <div className="w-px h-4 bg-gray-700 dark:bg-gray-700 light:bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Target className="text-primary-400 dark:text-primary-400 light:text-primary-600" size={14} />
              <span className="text-gray-400 dark:text-gray-400 light:text-gray-600">95%+ Accuracy</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 dark:from-yellow-500/10 dark:via-orange-500/10 dark:to-red-500/10 light:from-yellow-50 light:via-orange-50 light:to-red-50 border border-yellow-500/40 dark:border-yellow-500/40 light:border-yellow-300 rounded-2xl p-6 mb-12 max-w-4xl mx-auto backdrop-blur-sm overflow-hidden"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 blur-xl"></div>

          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-xl bg-yellow-500/20 dark:bg-yellow-500/20 light:bg-yellow-100 border border-yellow-500/30 dark:border-yellow-500/30 light:border-yellow-300">
              <AlertTriangle className="text-yellow-400 dark:text-yellow-400 light:text-yellow-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-yellow-300 dark:text-yellow-300 light:text-yellow-700 font-bold text-lg mb-2 flex items-center gap-2">
                Important Decision Ahead
                <Lock size={16} className="text-yellow-400 dark:text-yellow-400 light:text-yellow-600" />
              </h3>
              <p className="text-gray-200 dark:text-gray-200 light:text-gray-700 leading-relaxed">
                Career selection is <span className="text-yellow-300 dark:text-yellow-300 light:text-yellow-700 font-bold">permanent and cannot be changed</span>.
                Choose carefully from your top 3 AI-matched careers. This commitment helps you stay focused on a clear,
                structured learning path tailored to your selected career.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Completion Progress */}
        <div className="grid md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
          <CompletionCard
            title="Academic Assessments"
            completed={completion.academic.completed}
            total={completion.academic.total}
            icon={<Award className="text-blue-400" size={24} />}
            link="/assessments?tab=academic"
            color="blue"
          />
          <CompletionCard
            title="Technical Skills"
            completed={completion.technical.completed}
            total={completion.technical.total}
            icon={<Briefcase className="text-purple-400" size={24} />}
            link="/assessments?tab=technical"
            color="purple"
          />
          <CompletionCard
            title="Personal Profile"
            completed={completion.personal.completed}
            total={completion.personal.total}
            icon={<Target className="text-emerald-400" size={24} />}
            link="/assessments?tab=personal"
            color="emerald"
          />
        </div>

        {/* Predict Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-16"
        >
          <motion.button
            onClick={handlePredict}
            disabled={!isAllComplete || predicting}
            whileHover={isAllComplete && !predicting ? { scale: 1.05 } : {}}
            whileTap={isAllComplete && !predicting ? { scale: 0.95 } : {}}
            className={`relative px-12 py-5 rounded-2xl font-black text-lg transition-all inline-flex items-center gap-3 overflow-hidden ${
              isAllComplete && !predicting
                ? "bg-gradient-to-r from-primary-500 via-emerald-400 to-cyan-400 text-gray-900 shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/60"
                : "bg-gray-800/50 border-2 border-gray-700/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isAllComplete && !predicting && (
              <motion.div
                animate={{ x: [-1000, 1000] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            )}

            {predicting ? (
              <>
                <Loader2 className="animate-spin relative z-10" size={24} />
                <span className="relative z-10">Analyzing Your Profile...</span>
              </>
            ) : (
              <>
                <Rocket className="relative z-10" size={24} />
                <span className="relative z-10 tracking-wide">GENERATE CAREER MATCHES</span>
                <Sparkles className="relative z-10" size={24} />
              </>
            )}
          </motion.button>

          {!isAllComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30"
            >
              <Lock size={18} className="text-yellow-400" />
              <span className="text-yellow-300 font-semibold text-sm">
                Complete all {completion.academic.total + completion.technical.total + completion.personal.total} assessments to unlock career matching
              </span>
            </motion.div>
          )}

          {isAllComplete && !predictions && !predicting && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 text-emerald-400 text-sm font-semibold flex items-center gap-2 justify-center"
            >
              <CheckCircle size={18} />
              All assessments completed! Ready to discover your matches
            </motion.p>
          )}
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 mb-8 text-center max-w-2xl mx-auto"
          >
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Predictions */}
        {predictions && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12 relative"
            >
              {/* Background decoration */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <div className="w-96 h-96 bg-gradient-to-r from-primary-500/10 via-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
              </div>

              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 dark:bg-emerald-500/20 light:bg-emerald-100 border border-emerald-500/40 dark:border-emerald-500/40 light:border-emerald-400 mb-4"
              >
                <Sparkles className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600" size={16} />
                <span className="text-emerald-300 dark:text-emerald-300 light:text-emerald-700 text-sm font-bold">ANALYSIS COMPLETE</span>
              </motion.div>

              <h2 className="text-4xl sm:text-5xl font-black text-white dark:text-white light:text-gray-900 mb-4 relative z-10">
                Your Top 3{" "}
                <span className="bg-gradient-to-r from-primary-400 via-emerald-400 to-cyan-400 dark:from-primary-400 dark:via-emerald-400 dark:to-cyan-400 light:from-primary-600 light:via-emerald-600 light:to-cyan-600 bg-clip-text text-transparent">
                  Career Matches
                </span>
              </h2>

              <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-lg max-w-2xl mx-auto relative z-10">
                Based on your comprehensive assessment results, our matching system has identified these
                <span className="text-primary-400 dark:text-primary-400 light:text-primary-600 font-semibold"> perfect career paths </span>
                for you
              </p>

              {/* Selection instruction */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500/10 dark:bg-primary-500/10 light:bg-primary-100 border border-primary-500/30 dark:border-primary-500/30 light:border-primary-300"
              >
                <Target className="text-primary-400 dark:text-primary-400 light:text-primary-600" size={16} />
                <span className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-sm font-semibold">
                  Select ONE career to unlock your personalized learning roadmap
                </span>
              </motion.div>
            </motion.div>

            {/* Career Cards Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {predictions.job_matches?.slice(0, 3).map((match, idx) => (
                <CareerCard
                  key={idx}
                  match={match}
                  rank={idx + 1}
                  onSelect={() => handleSelectCareerClick(match)}
                />
              ))}
            </div>

            {/* Info Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 text-center"
            >
              <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-500 light:text-gray-600 text-sm">
                <Shield size={14} />
                <span>Your selection is permanent and helps maintain a focused learning path</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="inline-flex p-4 rounded-full bg-yellow-500/20 mb-4">
                  <AlertTriangle className="text-yellow-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Confirm Career Selection
                </h3>
                <p className="text-gray-400 text-sm">
                  This decision is permanent and cannot be changed
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
                <div className="text-sm text-gray-400 mb-1">You are selecting:</div>
                <h4 className="text-xl font-bold text-primary-400 mb-1">
                  {careerToSelect?.job_role}
                </h4>
                <p className="text-gray-300 text-sm mb-2">{careerToSelect?.category}</p>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400" size={16} />
                  <span className="text-white font-semibold">{careerToSelect?.match_score}</span>
                  <span className="text-gray-400 text-sm">Match Score</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSelectCareer}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-emerald-400 text-white font-semibold hover:scale-105 transition-all"
                >
                  Confirm Selection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Completion Card Component
function CompletionCard({ title, completed, total, icon, link, color }) {
  const navigate = useNavigate();
  const isComplete = completed === total;
  const percentage = (completed / total) * 100;

  const colorClasses = {
    blue: {
      gradient: 'from-blue-500/20 via-cyan-500/10 to-blue-600/20',
      border: 'border-blue-500/40',
      glow: 'group-hover:shadow-blue-500/20',
      progress: 'from-blue-500 via-cyan-400 to-blue-500',
      icon: 'bg-blue-500/20 border-blue-500/30'
    },
    purple: {
      gradient: 'from-purple-500/20 via-pink-500/10 to-purple-600/20',
      border: 'border-purple-500/40',
      glow: 'group-hover:shadow-purple-500/20',
      progress: 'from-purple-500 via-pink-400 to-purple-500',
      icon: 'bg-purple-500/20 border-purple-500/30'
    },
    emerald: {
      gradient: 'from-emerald-500/20 via-teal-500/10 to-emerald-600/20',
      border: 'border-emerald-500/40',
      glow: 'group-hover:shadow-emerald-500/20',
      progress: 'from-emerald-500 via-teal-400 to-emerald-500',
      icon: 'bg-emerald-500/20 border-emerald-500/30'
    }
  };

  const styles = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => navigate(link)}
      className={`group relative bg-gradient-to-br ${styles.gradient} dark:${styles.gradient} light:from-white light:to-gray-50 ${styles.border} dark:${styles.border} light:border-gray-300 border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${styles.glow} shadow-lg hover:shadow-2xl overflow-hidden`}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <div className={`p-3 rounded-xl ${styles.icon} dark:${styles.icon} light:bg-gray-100 border backdrop-blur-sm`}>
            {icon}
          </div>
          {isComplete ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="p-2 rounded-full bg-emerald-500/20 dark:bg-emerald-500/20 light:bg-emerald-100 border border-emerald-500/40 dark:border-emerald-500/40 light:border-emerald-400"
            >
              <CheckCircle className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600" size={20} />
            </motion.div>
          ) : (
            <div className="p-2 rounded-full bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-200 border border-gray-700/30 dark:border-gray-700/30 light:border-gray-300">
              <XCircle className="text-gray-500 dark:text-gray-500 light:text-gray-400" size={20} />
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-white dark:text-white light:text-gray-900 mb-2 group-hover:text-primary-300 dark:group-hover:text-primary-300 light:group-hover:text-primary-600 transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
            <span className="text-white dark:text-white light:text-gray-900 font-bold text-lg">{completed}</span>
            <span className="text-gray-500 dark:text-gray-500 light:text-gray-400 mx-1">/</span>
            <span className="text-gray-400 dark:text-gray-400 light:text-gray-600">{total}</span>
          </p>
          <span className="text-xs font-semibold text-primary-400 dark:text-primary-400 light:text-primary-600 bg-primary-500/20 dark:bg-primary-500/20 light:bg-primary-100 px-2 py-1 rounded-full">
            {Math.round(percentage)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-900/60 dark:bg-gray-900/60 light:bg-gray-200 rounded-full overflow-hidden border border-gray-700/30 dark:border-gray-700/30 light:border-gray-300">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${styles.progress} rounded-full`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </motion.div>
        </div>

        {/* Click hint */}
        <div className="flex items-center justify-center gap-1 mt-4 text-xs text-gray-500 dark:text-gray-500 light:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Click to view</span>
          <ArrowRight size={12} />
        </div>
      </div>
    </motion.div>
  );
}

// Career Card Component
function CareerCard({ match, rank, onSelect }) {
  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Rocket className="text-yellow-400" size={20} />;
      case 2: return <Zap className="text-blue-400" size={20} />;
      case 3: return <Target className="text-emerald-400" size={20} />;
      default: return null;
    }
  };

  const getRankBadge = (rank) => {
    const badges = {
      1: {
        text: 'BEST MATCH',
        gradient: 'from-yellow-500/30 via-orange-500/20 to-yellow-500/30',
        border: 'border-yellow-500/50',
        textColor: 'text-yellow-300',
        glow: 'shadow-yellow-500/30',
        ring: 'ring-yellow-500/20'
      },
      2: {
        text: '2ND MATCH',
        gradient: 'from-blue-500/30 via-cyan-500/20 to-blue-500/30',
        border: 'border-blue-500/50',
        textColor: 'text-blue-300',
        glow: 'shadow-blue-500/30',
        ring: 'ring-blue-500/20'
      },
      3: {
        text: '3RD MATCH',
        gradient: 'from-emerald-500/30 via-teal-500/20 to-emerald-500/30',
        border: 'border-emerald-500/50',
        textColor: 'text-emerald-300',
        glow: 'shadow-emerald-500/30',
        ring: 'ring-emerald-500/20'
      }
    };
    return badges[rank];
  };

  const badge = getRankBadge(rank);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: rank * 0.15, type: "spring", stiffness: 100 }}
      whileHover={{ y: -12, scale: 1.02 }}
      className={`group relative bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/80 dark:from-gray-900/80 dark:via-gray-900/60 dark:to-gray-900/80 light:from-white light:to-gray-50 border-2 ${badge.border} dark:${badge.border} light:border-gray-300 rounded-3xl p-7 transition-all duration-300 hover:${badge.glow} shadow-xl hover:shadow-2xl overflow-hidden backdrop-blur-sm`}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${badge.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

      {/* Rank number watermark */}
      <div className="absolute top-4 right-4 text-8xl font-black text-white/5 dark:text-white/5 light:text-gray-900/5 select-none">
        {rank}
      </div>

      <div className="relative z-10">
        {/* Rank Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${badge.gradient} border-2 ${badge.border} dark:${badge.border} light:border-gray-400 text-xs font-black tracking-wider mb-5 ring-4 ${badge.ring}`}>
          {getRankIcon(rank)}
          <span className={`${badge.textColor} dark:${badge.textColor} light:text-gray-800`}>{badge.text}</span>
        </div>

        {/* Job Title */}
        <h3 className="text-2xl font-black text-white dark:text-white light:text-gray-900 mb-3 group-hover:text-primary-300 dark:group-hover:text-primary-300 light:group-hover:text-primary-600 transition-colors leading-tight">
          {match.job_role}
        </h3>

        {/* Category */}
        <div className="flex items-center gap-2 mb-6">
          <div className="px-3 py-1 rounded-full bg-gray-800/60 dark:bg-gray-800/60 light:bg-gray-200 border border-gray-700/50 dark:border-gray-700/50 light:border-gray-300">
            <p className="text-xs font-semibold text-gray-300 dark:text-gray-300 light:text-gray-700">{match.category}</p>
          </div>
        </div>

        {/* Match Score Display */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 dark:from-gray-800/80 dark:to-gray-900/80 light:from-gray-100 light:to-gray-200 border border-gray-700/50 dark:border-gray-700/50 light:border-gray-300 rounded-2xl p-5 mb-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-500 light:text-gray-600 mb-1 uppercase tracking-wide font-semibold">Match Score</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black bg-gradient-to-r from-primary-400 to-emerald-400 dark:from-primary-400 dark:to-emerald-400 light:from-primary-600 light:to-emerald-600 bg-clip-text text-transparent">
                  {match.match_score}
                </span>
                <BarChart3 className="text-primary-400 dark:text-primary-400 light:text-primary-600" size={20} />
              </div>
            </div>
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-lg opacity-20"
              ></motion.div>
              <Star className="text-yellow-400 dark:text-yellow-400 light:text-yellow-500 relative z-10" size={40} fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Key Highlights */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-400 light:text-gray-600">
            <Code size={14} className="text-primary-400 dark:text-primary-400 light:text-primary-600" />
            <span>Tech Skills</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-400 light:text-gray-600">
            <Brain size={14} className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600" />
            <span>Data Matched</span>
          </div>
        </div>

        {/* Select Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSelect}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 via-emerald-400 to-cyan-400 text-gray-900 font-black text-sm hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group/btn"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
          <Check size={18} className="relative z-10" />
          <span className="relative z-10">SELECT THIS CAREER</span>
          <ArrowRight size={18} className="relative z-10" />
        </motion.button>
      </div>
    </motion.div>
  );
}