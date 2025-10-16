// src/pages/StudentDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthContext";
import { motion } from "framer-motion";

import { useNotifications } from '../hooks/useNotifications';
import DashboardNav from "../components/dashboard/DashboardNav";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import ResumeCard from "../components/dashboard/ResumeCard";
import DashboardFooter from "../components/dashboard/DashboardFooter";
import {
  ArrowRight,
  Target,
  BookOpen,
  TrendingUp,
  Award,
  Calendar,
  Zap,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  Briefcase,
  Activity,
  FileText,
  ChevronRight,
  MapPin,
  Trophy,
  Sparkles,
  Rocket,
  Flame
} from "lucide-react";

export default function StudentDashboard() {
  useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [progressSummary, setProgressSummary] = useState(null);
  const [roadmapProgress, setRoadmapProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scroll to top when component mounts (especially important for mobile after login)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (!user) return;
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const careerDocRef = doc(db, "users", user.uid, "selectedCareer", "current");
      const careerDoc = await getDoc(careerDocRef);

      if (careerDoc.exists()) {
        setSelectedCareer(careerDoc.data());
      }

      // Load roadmap progress
      const roadmapProgressDoc = await getDoc(doc(db, 'roadmapProgress', user.uid));
      if (roadmapProgressDoc.exists()) {
        setRoadmapProgress(roadmapProgressDoc.data());
      }

      const resultsRef = collection(db, "users", user.uid, "results");
      const resultsSnap = await getDocs(resultsRef);
      
      const results = resultsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const academic = results.filter(r => r.id.includes("assessments_"));
      const technical = results.filter(r => r.id.includes("technicalAssessments_"));
      const personal = results.filter(r => r.id.includes("survey_"));

      const academicScores = academic.filter(r => r.score !== undefined).map(r => r.score);
      const technicalScores = technical.filter(r => r.score !== undefined).map(r => r.score);

      const avgAcademic = academicScores.length > 0 
        ? Math.round(academicScores.reduce((a, b) => a + b, 0) / academicScores.length)
        : 0;
      
      const avgTechnical = technicalScores.length > 0 
        ? Math.round(technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length)
        : 0;

      const datesSet = new Set(results.map(r => {
        const date = r.submittedAt?.toDate ? r.submittedAt.toDate() : new Date(r.submittedAt);
        return date.toDateString();
      }));

      const sortedDates = Array.from(datesSet).sort((a, b) => new Date(b) - new Date(a));
      let currentStreak = 0;
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < sortedDates.length; i++) {
        const date = new Date(sortedDates[i]);
        const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === i) {
          currentStreak++;
        } else {
          break;
        }
      }

      const [academicSnap, technicalSnap, personalSnap] = await Promise.all([
        getDocs(collection(db, "assessments")),
        getDocs(collection(db, "technicalAssessments")),
        getDocs(collection(db, "personalAssessments"))
      ]);

      const totalAssessments = academicSnap.size + technicalSnap.size + personalSnap.size;
      const completedAssessments = [...new Set([
        ...academic.map(r => r.assessmentId),
        ...technical.map(r => r.assessmentId),
        ...personal.map(r => r.assessmentId)
      ])].length;

      setProgressSummary({
        totalCompleted: completedAssessments,
        totalAssessments,
        academicAvg: avgAcademic,
        technicalAvg: avgTechnical,
        currentStreak,
        activeDays: datesSet.size,
        recentActivity: results.length
      });

    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCareerDescription = (jobRole) => {
    const descriptions = {
      "Network Security Engineer": "Protect organizational systems and networks from cyber threats. Design and implement security measures, monitor network traffic, and respond to security incidents.",
      "Software Engineer": "Design, develop, and maintain software applications. Work with various programming languages and frameworks to create efficient, scalable solutions.",
      "Database Administrator": "Manage and maintain database systems. Ensure data integrity, optimize performance, and implement backup and recovery procedures.",
      "Web Developer": "Create and maintain websites and web applications. Work with front-end and back-end technologies to deliver responsive user experiences.",
      "Data Scientist": "Analyze complex data sets to extract insights and support decision-making. Use statistical methods, machine learning, and data visualization.",
      "DevOps Engineer": "Bridge development and operations teams. Automate workflows, manage infrastructure, and ensure continuous integration and deployment.",
      "Mobile App Developer": "Design and develop applications for mobile platforms. Create user-friendly interfaces and optimize performance for mobile devices.",
      "Cloud Solutions Architect": "Design and implement cloud infrastructure solutions. Help organizations migrate to and optimize cloud platforms.",
      "AI/ML Engineer": "Develop artificial intelligence and machine learning models. Apply algorithms to solve complex problems and create intelligent systems.",
      "Cybersecurity Analyst": "Monitor and protect systems from security threats. Conduct vulnerability assessments and implement security protocols."
    };

    return descriptions[jobRole] || "Explore this exciting career opportunity and develop the skills needed to excel in this field.";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-1400 via-primary-1500 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black text-primary-50">
      <DashboardNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 w-full flex-1">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <WelcomeBanner />
        </motion.div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<BookOpen className="text-primary-400" size={20} />}
            label="Assessments"
            value={`${progressSummary?.totalCompleted || 0}/${progressSummary?.totalAssessments || 0}`}
            subtitle="Completed"
            gradient="from-primary-500/20 to-cyan-600/20"
            border="border-primary-500/30"
            onClick={() => navigate("/assessments")}
          />
          <StatCard
            icon={<TrendingUp className="text-primary-400" size={20} />}
            label="Academic"
            value={`${progressSummary?.academicAvg || 0}%`}
            subtitle="Average score"
            gradient="from-primary-500/20 to-cyan-600/20"
            border="border-primary-500/30"
            onClick={() => navigate("/student/progress")}
          />
          <StatCard
            icon={<Flame className="text-primary-400" size={20} />}
            label="Study Streak 🔥"
            value={`${progressSummary?.currentStreak || 0}`}
            subtitle="Days active"
            gradient="from-primary-500/20 to-cyan-600/20"
            border="border-primary-500/30"
            onClick={() => navigate("/student/progress")}
          />
          <StatCard
            icon={<Award className="text-primary-400" size={20} />}
            label="Technical"
            value={`${progressSummary?.technicalAvg || 0}%`}
            subtitle="Average score"
            gradient="from-primary-500/20 to-cyan-600/20"
            border="border-primary-500/30"
            onClick={() => navigate("/student/progress")}
          />
        </div>

        {/* Main Content Grid - FIXED LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
          {/* Left Column - Career Path & Roadmap Progress */}
          <div className="lg:col-span-2 space-y-6 h-full">
            {/* Selected Career Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-6"
            >
              {selectedCareer ? (
                <>
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-primary-500/20 border border-primary-500/30">
                        <Briefcase className="text-primary-400" size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Your Career Path</h2>
                        <p className="text-sm text-gray-400">AI-recommended match</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary-400">{selectedCareer.matchScore}</div>
                      <div className="text-xs text-gray-400">Match Score</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-2xl text-white font-bold mb-1">
                      {selectedCareer.jobRole}
                    </h3>
                    <p className="text-primary-400 font-medium mb-3">{selectedCareer.category}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {getCareerDescription(selectedCareer.jobRole)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Growth Potential</div>
                      <div className="text-sm font-semibold text-emerald-400">High Demand</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Experience Level</div>
                      <div className="text-sm font-semibold text-blue-400">Entry-Mid Level</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Work Mode</div>
                      <div className="text-sm font-semibold text-purple-400">Hybrid/Remote</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => navigate("/career-roadmap")}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-all"
                    >
                      <MapPin size={18} />
                      View Learning Roadmap
                    </button>
                    <button
                      onClick={() => navigate("/career-matches")}
                      className="px-4 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold transition-all"
                    >
                      Change Career
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/30 mb-4">
                    <Target className="text-primary-400" size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Start Your Career Journey</h3>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto leading-relaxed">
                    Complete your assessments to receive personalized AI-powered career recommendations tailored to your skills and interests.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => navigate("/assessments")}
                      className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2 justify-center"
                    >
                      <BookOpen size={18} />
                      Take Assessments
                    </button>
                    <button
                      onClick={() => navigate("/career-matches")}
                      className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-semibold transition-all inline-flex items-center gap-2 justify-center"
                    >
                      View Career Options <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Roadmap Progress Summary / Getting Started Guide */}
            {roadmapProgress ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MapPin className="text-primary-400" size={20} />
                    Roadmap Progress
                  </h3>
                  <button
                    onClick={() => navigate("/career-roadmap")}
                    className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium"
                  >
                    View Full Roadmap <ChevronRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Trophy size={14} className="text-yellow-400" />
                      <div className="text-xs text-gray-400">Completed</div>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {roadmapProgress.completedModules?.length || 0}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Target size={14} className="text-blue-400" />
                      <div className="text-xs text-gray-400">Current</div>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {roadmapProgress.currentModule || 1}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 col-span-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Activity size={14} className="text-emerald-400" />
                      <div className="text-xs text-gray-400">Overall Progress</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${roadmapProgress.totalProgress || 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-white">{roadmapProgress.totalProgress || 0}%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/career-roadmap")}
                  className="w-full py-2.5 bg-primary-500/20 border border-primary-500/30 text-primary-300 rounded-lg hover:bg-primary-500/30 transition-all font-semibold text-sm flex items-center justify-center gap-2"
                >
                  Continue Learning
                  <ChevronRight size={16} />
                </button>
              </motion.div>
            ) : selectedCareer ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <MapPin className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Learning Roadmap Available</h3>
                    <p className="text-sm text-gray-400">Your personalized path is ready</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  Access your customized learning roadmap designed specifically for your chosen career path. Follow structured modules to build the skills you need.
                </p>
                <button
                  onClick={() => navigate("/career-roadmap")}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  Start Learning Roadmap
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-gradient-to-br from-purple-500/10 via-primary-500/10 to-emerald-500/10 border border-purple-500/30 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-primary-500/20">
                    <Rocket className="text-purple-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">How DevPath Works</h3>
                    <p className="text-sm text-gray-400">Your journey to success</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex gap-3 items-start p-3 rounded-lg bg-gray-800/40 border border-gray-700/30">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                      <span className="text-blue-400 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-1">Complete Assessments</h4>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        Take academic, technical, and personal assessments to evaluate your skills and interests.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start p-3 rounded-lg bg-gray-800/40 border border-gray-700/30">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
                      <span className="text-emerald-400 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-1">Get AI Recommendations</h4>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        Receive personalized career matches based on your assessment results and strengths.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start p-3 rounded-lg bg-gray-800/40 border border-gray-700/30">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                      <span className="text-purple-400 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-1">Follow Your Roadmap</h4>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        Access personalized learning paths and resources to achieve your career goals.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/assessments")}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-500 via-primary-500 to-emerald-500 hover:from-purple-600 hover:via-primary-600 hover:to-emerald-600 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  Get Started Now
                </button>
              </motion.div>
            )}

            {/* Learning Progress - EXPANDED */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="text-primary-400" size={20} />
                  Assessment Progress
                </h3>
                <button
                  onClick={() => navigate("/student/progress")}
                  className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium"
                >
                  View Details <ChevronRight size={16} />
                </button>
              </div>

              {/* Overview Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <ProgressItem
                  icon={<BookOpen size={16} className="text-blue-400" />}
                  label="Academic Assessments"
                  progress={progressSummary?.academicAvg || 0}
                  color="blue"
                />
                <ProgressItem
                  icon={<Award size={16} className="text-purple-400" />}
                  label="Technical Skills"
                  progress={progressSummary?.technicalAvg || 0}
                  color="purple"
                />
                <ProgressItem
                  icon={<Calendar size={16} className="text-emerald-400" />}
                  label="Active Days"
                  value={`${progressSummary?.activeDays || 0} days`}
                  color="emerald"
                />
                <ProgressItem
                  icon={<Clock size={16} className="text-yellow-400" />}
                  label="Recent Activity"
                  value={`${progressSummary?.recentActivity || 0} attempts`}
                  color="yellow"
                />
              </div>

              {/* Overall Completion Rate */}
              <div className="bg-gray-800/40 rounded-xl p-4 mb-4 border border-gray-700/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-emerald-400" size={18} />
                    <span className="text-white font-semibold text-sm">Overall Completion Rate</span>
                  </div>
                  <span className="text-white font-bold text-lg">
                    {progressSummary?.totalAssessments > 0
                      ? Math.round((progressSummary.totalCompleted / progressSummary.totalAssessments) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500 relative overflow-hidden"
                    style={{
                      width: `${progressSummary?.totalAssessments > 0
                        ? (progressSummary.totalCompleted / progressSummary.totalAssessments) * 100
                        : 0}%`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    {progressSummary?.totalCompleted || 0} of {progressSummary?.totalAssessments || 0} completed
                  </span>
                  <span className="text-gray-400">
                    {progressSummary?.totalAssessments > 0
                      ? progressSummary.totalAssessments - progressSummary.totalCompleted
                      : 0} remaining
                  </span>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Academic Performance */}
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <BookOpen className="text-blue-400" size={16} />
                      </div>
                      <span className="text-white font-semibold text-sm">Academic</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-400">
                      {progressSummary?.academicAvg || 0}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {progressSummary?.academicAvg >= 70 ? (
                      <>
                        <TrendingUp className="text-emerald-400" size={14} />
                        <span className="text-xs text-emerald-400 font-medium">Strong Performance</span>
                      </>
                    ) : progressSummary?.academicAvg >= 50 ? (
                      <>
                        <Activity className="text-yellow-400" size={14} />
                        <span className="text-xs text-yellow-400 font-medium">Room for Improvement</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="text-red-400" size={14} />
                        <span className="text-xs text-red-400 font-medium">Needs Focus</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Technical Performance */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <Award className="text-purple-400" size={16} />
                      </div>
                      <span className="text-white font-semibold text-sm">Technical</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-400">
                      {progressSummary?.technicalAvg || 0}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {progressSummary?.technicalAvg >= 70 ? (
                      <>
                        <TrendingUp className="text-emerald-400" size={14} />
                        <span className="text-xs text-emerald-400 font-medium">Excellent Skills</span>
                      </>
                    ) : progressSummary?.technicalAvg >= 50 ? (
                      <>
                        <Activity className="text-yellow-400" size={14} />
                        <span className="text-xs text-yellow-400 font-medium">Developing Skills</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="text-red-400" size={14} />
                        <span className="text-xs text-red-400 font-medium">Needs Practice</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Study Streak Section */}
              {progressSummary?.currentStreak > 0 && (
                <div className="mt-4 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-yellow-500/20">
                        <Zap className="text-yellow-400" size={20} />
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg">
                          {progressSummary.currentStreak} Day Streak! 🔥
                        </div>
                        <div className="text-xs text-gray-400">Keep up the amazing work!</div>
                      </div>
                    </div>
                    <Trophy className="text-yellow-400" size={28} />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => navigate("/assessments")}
                className="w-full mt-4 py-3 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 rounded-lg text-white font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Rocket size={18} />
                Continue Learning Journey
              </button>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-5"
            >
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <ActionButton
                  icon={<BookOpen size={18} />}
                  label="Take Assessments"
                  description="Continue learning"
                  onClick={() => navigate("/assessments")}
                  color="blue"
                />
                <ActionButton
                  icon={<BarChart3 size={18} />}
                  label="View Progress"
                  description="Check your stats"
                  onClick={() => navigate("/student/progress")}
                  color="emerald"
                />
                <ActionButton
                  icon={<FileText size={18} />}
                  label="Career Report"
                  description="Download insights"
                  onClick={() => navigate("/student/reports")}
                  color="purple"
                />
                <ActionButton
                  icon={<MapPin size={18} />}
                  label="Learning Roadmap"
                  description="Follow your path"
                  onClick={() => navigate("/career-roadmap")}
                  color="yellow"
                />
              </div>
            </motion.div>

            {/* Resume Builder Card */}
            <ResumeCard />

            {/* Keep Learning Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-primary-500/10 to-emerald-500/10 border border-primary-500/30 rounded-2xl p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary-500/20">
                  <CheckCircle className="text-primary-400" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    {progressSummary?.totalCompleted > 0 ? "Keep Learning!" : "Welcome to DevPath!"}
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {progressSummary?.currentStreak > 0
                      ? `Great job! You're on a ${progressSummary.currentStreak}-day streak. Keep it up!`
                      : progressSummary?.totalCompleted > 0
                      ? "Start your learning journey today. Complete an assessment to begin tracking your progress."
                      : "Begin by taking assessments to discover your strengths and get personalized career recommendations."
                    }
                  </p>
                </div>
              </div>

              {progressSummary?.totalAssessments > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700/40">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Overall Progress</span>
                    <span className="text-white font-semibold">
                      {progressSummary.totalCompleted || 0} / {progressSummary.totalAssessments} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5 shadow-inner">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-primary-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${progressSummary.totalAssessments > 0 ? (progressSummary.totalCompleted / progressSummary.totalAssessments) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {progressSummary.totalCompleted === 0
                      ? "Start your first assessment to begin your journey"
                      : `${progressSummary.totalAssessments - progressSummary.totalCompleted} assessments remaining`
                    }
                  </p>
                </div>
              )}
            </motion.div>

            {/* Recommended Next Steps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-5"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="text-yellow-400" size={20} />
                Recommended Next Steps
              </h3>
              <div className="space-y-3 text-sm">
                {!selectedCareer && (
                  <RecommendationItem
                    text="Complete all assessments to unlock career recommendations"
                    priority="high"
                  />
                )}
                {progressSummary?.academicAvg < 70 && (
                  <RecommendationItem
                    text="Focus on improving academic assessment scores"
                    priority="medium"
                  />
                )}
                {progressSummary?.currentStreak === 0 && (
                  <RecommendationItem
                    text="Start building a daily learning habit"
                    priority="medium"
                  />
                )}
                {!roadmapProgress && selectedCareer && (
                  <RecommendationItem
                    text="Start your learning roadmap to build career skills"
                    priority="high"
                  />
                )}
                <RecommendationItem
                  text="Explore your learning path for skill development"
                  priority="low"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}

function StatCard({ icon, label, value, subtitle, gradient, border, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} border ${border} rounded-xl p-4 cursor-pointer hover:scale-105 transition-transform`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-gray-900/50">
          {icon}
        </div>
        <div className="text-xs font-medium text-gray-400 uppercase">{label}</div>
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-xs text-gray-400">{subtitle}</div>
    </motion.div>
  );
}

function ProgressItem({ icon, label, progress, value, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-400',
    purple: 'from-purple-500 to-pink-400',
    emerald: 'from-emerald-500 to-teal-400',
    yellow: 'from-yellow-500 to-orange-400'
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      {progress !== undefined ? (
        <>
          <div className="text-xl font-bold text-white mb-1">{progress}%</div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      ) : (
        <div className="text-lg font-bold text-white">{value}</div>
      )}
    </div>
  );
}

function ActionButton({ icon, label, description, onClick, color }) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 hover:border-blue-500/50 text-blue-400',
    emerald: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:border-purple-500/50 text-purple-400',
    yellow: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30 hover:border-yellow-500/50 text-yellow-400'
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} border transition-all group`}
    >
      <div className="flex items-center gap-3">
        <div className={`${colorClasses[color].split(' ')[4]}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm group-hover:text-white transition-colors">
            {label}
          </div>
          <div className="text-xs text-gray-400 truncate">{description}</div>
        </div>
        <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
      </div>
    </button>
  );
}

function RecommendationItem({ text, priority }) {
  const priorityColors = {
    high: 'border-red-500/30 bg-red-500/10',
    medium: 'border-yellow-500/30 bg-yellow-500/10',
    low: 'border-blue-500/30 bg-blue-500/10'
  };

  return (
    <div className={`p-3 rounded-lg border ${priorityColors[priority]}`}>
      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
        </div>
        <p className="text-gray-300 flex-1 text-sm">{text}</p>
      </div>
    </div>
  );
}