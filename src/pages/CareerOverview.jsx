// src/pages/StudentProgress.jsx
import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import DashNav from "../components/dashboard/DashboardNav";
import DashboardFooter from "../components/dashboard/DashboardFooter";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Award,
  Target,
  BookOpen,
  Code,
  Brain,
  Clock,
  Calendar,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowUp,
  ArrowDown,
  Zap,
  Trophy,
  Star,
  Users,
  Activity,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function StudentProgress() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  // Helper function to get readiness level label
  const getReadinessLabel = (level) => {
    const labels = {
      "READY": "Market Ready",
      "READY_WITH_GROWTH": "Ready with growth areas",
      "CONDITIONAL": "Needs improvement",
      "NOT_READY": "Building foundations",
      "NOT_ASSESSED": "Complete assessments"
    };
    return labels[level] || "Not assessed";
  };

  // Helper function to get readiness level color
  const getReadinessColor = (level) => {
    const colors = {
      "READY": "text-emerald-400",
      "READY_WITH_GROWTH": "text-blue-400",
      "CONDITIONAL": "text-yellow-400",
      "NOT_READY": "text-orange-400",
      "NOT_ASSESSED": "text-gray-400"
    };
    return colors[level] || "text-gray-400";
  };

  useEffect(() => {
    if (!user) return;
    loadProgressData();
  }, [user]);

  const loadProgressData = async () => {
    setLoading(true);
    try {
      // Fetch all assessment results
      const resultsRef = collection(db, "users", user.uid, "results");
      const resultsSnap = await getDocs(resultsRef);

      const results = resultsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Also fetch technical assessments from assessments/technical
      const technicalAssessmentsRef = doc(db, "users", user.uid, "assessments", "technical");
      const technicalAssessmentsDoc = await getDoc(technicalAssessmentsRef);
      const technicalAssessments = technicalAssessmentsDoc.exists() ? technicalAssessmentsDoc.data() : {};

      // Fetch all assessments to get total counts
      const [academicSnap, technicalSnap, personalSnap] = await Promise.all([
        getDocs(collection(db, "assessments")),
        getDocs(collection(db, "technicalAssessments")),
        getDocs(collection(db, "personalAssessments"))
      ]);

      const totalAssessments = {
        academic: academicSnap.size,
        technical: technicalSnap.size,
        personal: 0, // Personal assessments not counted
        total: academicSnap.size + technicalSnap.size
      };

      // Fetch user profile for additional info
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.exists() ? userDoc.data() : {};

      // Fetch career recommendations (if available) for detailed readiness
      const careerRecsRef = doc(db, "users", user.uid, "careerData", "latestRecommendations");
      const careerRecsDoc = await getDoc(careerRecsRef);
      const careerRecommendations = careerRecsDoc.exists() ? careerRecsDoc.data() : null;

      // Calculate comprehensive progress metrics
      const metrics = calculateProgressMetrics(results, totalAssessments, userData, careerRecommendations, technicalAssessments);
      setProgressData(metrics);

    } catch (err) {
      console.error("Error loading progress data:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgressMetrics = (results, totalAssessments, userData, careerRecommendations, technicalAssessments = {}) => {
    // Group results by assessment type
    const academic = results.filter(r => r.id.includes("assessments_"));
    const technical = results.filter(r => r.id.includes("technicalAssessments_"));
    const personal = results.filter(r => r.id.includes("survey_"));

    // Get unique assessments (handle multiple attempts)
    const uniqueAcademic = [...new Set(academic.map(r => r.assessmentId))];
    const uniqueTechnical = [...new Set(technical.map(r => r.assessmentId))];
    const uniquePersonal = [...new Set(personal.map(r => r.assessmentId))];

    // For technical assessments from assessments/technical document
    const technicalScoresFromDoc = Object.values(technicalAssessments).filter(score => typeof score === 'number');
    const uniqueTechnicalCount = Object.keys(technicalAssessments).length;

    // Calculate scores
    const academicScores = academic.filter(r => r.score !== undefined).map(r => r.score);
    const technicalScoresFromResults = technical.filter(r => r.score !== undefined).map(r => r.score);

    // Combine technical scores from both sources and convert 1-9 scale to percentage
    const allTechnicalScores = [...technicalScoresFromResults, ...technicalScoresFromDoc].map(score => {
      // Technical assessments use 1-9 scale, convert to 0-100 percentage
      if (score >= 1 && score <= 9) {
        return ((score - 1) / 8) * 100; // Convert 1-9 to 0-100
      }
      return score; // Already a percentage
    });

    const avgAcademic = academicScores.length > 0
      ? academicScores.reduce((a, b) => a + b, 0) / academicScores.length
      : 0;
    const avgTechnical = allTechnicalScores.length > 0
      ? allTechnicalScores.reduce((a, b) => a + b, 0) / allTechnicalScores.length
      : 0;

    // Calculate completion percentages (cap at 100%)
    const academicCompletion = totalAssessments.academic > 0 ? Math.min((uniqueAcademic.length / totalAssessments.academic) * 100, 100) : 0;
    const technicalCompletionCount = Math.max(uniqueTechnical.length, uniqueTechnicalCount);
    const technicalCompletion = totalAssessments.technical > 0 ? Math.min((technicalCompletionCount / totalAssessments.technical) * 100, 100) : 0;
    const personalCompletion = totalAssessments.personal > 0 ? Math.min((uniquePersonal.length / totalAssessments.personal) * 100, 100) : 0;

    // Overall completion - don't count personal assessments (cap at 100%)
    const totalCompleted = Math.min(
      uniqueAcademic.length + technicalCompletionCount,
      totalAssessments.total
    );
    const overallCompletion = totalAssessments.total > 0 ? Math.min((totalCompleted / totalAssessments.total) * 100, 100) : 0;

    // Calculate improvement trends (compare first vs latest attempt)
    const improvements = calculateImprovements(results);

    // Study analytics
    const studyAnalytics = calculateStudyAnalytics(results);

    // Performance breakdown by subject
    const subjectBreakdown = calculateSubjectBreakdown(academic, technical);

    // Enhanced Career Readiness Calculation
    const readinessData = calculateCareerReadiness(
      avgAcademic,
      avgTechnical,
      overallCompletion,
      careerRecommendations
    );

    return {
      overview: {
        totalCompleted,
        totalAssessments: totalAssessments.total,
        overallCompletion,
        careerReadiness: readinessData.score,
        careerReadinessLevel: readinessData.level,
        careerReadinessBreakdown: readinessData.breakdown,
        memberSince: userData.createdAt || new Date().toISOString()
      },
      assessments: {
        academic: {
          completed: uniqueAcademic.length,
          total: totalAssessments.academic,
          completion: academicCompletion,
          averageScore: avgAcademic
        },
        technical: {
          completed: uniqueTechnical.length,
          total: totalAssessments.technical,
          completion: technicalCompletion,
          averageScore: avgTechnical
        },
        personal: {
          completed: uniquePersonal.length,
          total: totalAssessments.personal,
          completion: personalCompletion
        }
      },
      performance: {
        improvements,
        subjectBreakdown,
        recentScores: [...academicScores, ...allTechnicalScores].slice(-5),
        highestScore: Math.max(...academicScores, ...allTechnicalScores, 0),
        lowestScore: Math.min(...academicScores.filter(s => s > 0), ...allTechnicalScores.filter(s => s > 0), 100)
      },
      studyAnalytics,
      careerMatches: careerRecommendations?.job_matches || []
    };
  };

  const calculateCareerReadiness = (avgAcademic, avgTechnical, overallCompletion, careerRecommendations) => {
    // Component scores (0-100)
    const academicScore = avgAcademic; // Already 0-100
    const technicalScore = avgTechnical; // Already 0-100
    const completionScore = overallCompletion; // Already 0-100

    // Weighted overall score (40% academic, 40% technical, 20% completion)
    const baseScore = Math.round(
      (academicScore * 0.4) +
      (technicalScore * 0.4) +
      (completionScore * 0.2)
    );

    // Determine readiness level from API recommendations if available
    let level = "NOT_ASSESSED";
    if (careerRecommendations?.detailed_explanations?.length > 0) {
      // Use the readiness level from the top career match
      const topMatch = careerRecommendations.detailed_explanations[0];
      level = topMatch.readiness || "NOT_ASSESSED";
    } else {
      // Fallback: Calculate level based on scores
      if (baseScore >= 85 && completionScore === 100) {
        level = "READY";
      } else if (baseScore >= 70 && completionScore >= 80) {
        level = "READY_WITH_GROWTH";
      } else if (baseScore >= 50 && completionScore >= 60) {
        level = "CONDITIONAL";
      } else {
        level = "NOT_READY";
      }
    }

    return {
      score: baseScore,
      level,
      breakdown: {
        academic: {
          score: Math.round(academicScore),
          weight: 40,
          contribution: Math.round(academicScore * 0.4)
        },
        technical: {
          score: Math.round(technicalScore),
          weight: 40,
          contribution: Math.round(technicalScore * 0.4)
        },
        completion: {
          score: Math.round(completionScore),
          weight: 20,
          contribution: Math.round(completionScore * 0.2)
        }
      }
    };
  };

  const calculateImprovements = (results) => {
    const assessmentAttempts = {};
    
    results.forEach(r => {
      if (!r.assessmentId || r.score === undefined) return;
      
      if (!assessmentAttempts[r.assessmentId]) {
        assessmentAttempts[r.assessmentId] = [];
      }
      assessmentAttempts[r.assessmentId].push({
        score: r.score,
        date: r.submittedAt
      });
    });

    const improvements = [];
    Object.entries(assessmentAttempts).forEach(([id, attempts]) => {
      if (attempts.length < 2) return;
      
      attempts.sort((a, b) => new Date(a.date) - new Date(b.date));
      const improvement = attempts[attempts.length - 1].score - attempts[0].score;
      
      if (improvement !== 0) {
        improvements.push({
          assessment: id.replace(/assessments_|technicalAssessments_/g, '').replace(/_/g, ' '),
          improvement,
          attempts: attempts.length
        });
      }
    });

    return improvements.sort((a, b) => Math.abs(b.improvement) - Math.abs(a.improvement)).slice(0, 5);
  };

  const calculateStudyAnalytics = (results) => {
    const totalAttempts = results.length;
    const datesSet = new Set(results.map(r => {
      const date = r.submittedAt?.toDate ? r.submittedAt.toDate() : new Date(r.submittedAt);
      return date.toDateString();
    }));
    
    const activeDays = datesSet.size;
    
    // Calculate streak
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

    return {
      totalAttempts,
      activeDays,
      currentStreak,
      averagePerDay: activeDays > 0 ? (totalAttempts / activeDays).toFixed(1) : 0
    };
  };

  const calculateSubjectBreakdown = (academic, technical) => {
    const breakdown = {};
    
    academic.forEach(r => {
      if (!r.assessmentId || r.score === undefined) return;
      const subject = r.assessmentId.replace('assessments_', '').replace(/_/g, ' ');
      
      if (!breakdown[subject]) {
        breakdown[subject] = { scores: [], type: 'academic' };
      }
      breakdown[subject].scores.push(r.score);
    });

    technical.forEach(r => {
      if (!r.assessmentId || r.score === undefined) return;
      const subject = r.assessmentId.replace('technicalAssessments_', '').replace(/_/g, ' ');
      
      if (!breakdown[subject]) {
        breakdown[subject] = { scores: [], type: 'technical' };
      }
      breakdown[subject].scores.push(r.score);
    });

    // Calculate averages
    Object.keys(breakdown).forEach(subject => {
      const scores = breakdown[subject].scores;
      breakdown[subject].average = scores.reduce((a, b) => a + b, 0) / scores.length;
      breakdown[subject].attempts = scores.length;
      breakdown[subject].best = Math.max(...scores);
    });

    return breakdown;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-1400 via-primary-1500 to-black">
        <Loader2 className="animate-spin text-primary-400" size={48} />
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-1400 via-primary-1500 to-black">
        <div className="text-center">
          <AlertCircle className="text-yellow-400 mx-auto mb-4" size={48} />
          <p className="text-gray-300">Unable to load progress data</p>
        </div>
      </div>
    );
  }

  const { overview, assessments, performance, studyAnalytics } = progressData;

  // Sort subjects by average score
  const sortedSubjects = Object.entries(performance.subjectBreakdown)
    .sort((a, b) => b[1].average - a[1].average);

  // Show only top 4 subjects by default
  const displayedSubjects = showAllSubjects ? sortedSubjects : sortedSubjects.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black text-primary-50">
      <DashNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 w-full flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent mb-2">
            Learning Progress Dashboard
          </h1>
          <p className="text-gray-400">Comprehensive overview of your academic journey</p>
        </motion.div>

        {/* Key Metrics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={<Target className="text-primary-400" size={24} />}
            label="Overall Progress"
            value={`${Math.round(overview.overallCompletion)}%`}
            subtitle={`${overview.totalCompleted}/${overview.totalAssessments} completed`}
          />

          <MetricCard
            icon={<Trophy className="text-primary-400" size={24} />}
            label="Career Readiness"
            value={`${overview.careerReadiness}%`}
            subtitle={getReadinessLabel(overview.careerReadinessLevel)}
            level={overview.careerReadinessLevel}
          />

          <MetricCard
            icon={<Activity className="text-primary-400" size={24} />}
            label="Study Streak"
            value={`${studyAnalytics.currentStreak} days`}
            subtitle={`${studyAnalytics.activeDays} active days`}
          />

          <MetricCard
            icon={<Star className="text-primary-400" size={24} />}
            label="Best Score"
            value={`${performance.highestScore}%`}
            subtitle="Personal best"
          />
        </div>

        {/* Career Readiness Detailed Breakdown */}
        {overview.careerReadinessBreakdown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-2 border-primary-500/30 rounded-2xl p-6 mb-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Trophy className="text-primary-400" size={28} />
                  Career Readiness Analysis
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Comprehensive assessment of your market readiness
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary-400 mb-1">
                  {overview.careerReadiness}%
                </div>
                <div className={`text-sm font-semibold ${getReadinessColor(overview.careerReadinessLevel)}`}>
                  {getReadinessLabel(overview.careerReadinessLevel)}
                </div>
              </div>
            </div>

            {/* Component Breakdown */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* Academic Component */}
              <div className="bg-gray-800/50 border border-gray-700/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-blue-400" size={18} />
                    <span className="text-white font-semibold text-sm">Academic</span>
                  </div>
                  <span className="text-gray-400 text-xs">40% weight</span>
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {overview.careerReadinessBreakdown.academic.score}%
                </div>
                <div className="w-full bg-gray-900/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${overview.careerReadinessBreakdown.academic.score}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Contributes {overview.careerReadinessBreakdown.academic.contribution}% to total
                </div>
              </div>

              {/* Technical Component */}
              <div className="bg-gray-800/50 border border-gray-700/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code className="text-purple-400" size={18} />
                    <span className="text-white font-semibold text-sm">Technical</span>
                  </div>
                  <span className="text-gray-400 text-xs">40% weight</span>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {overview.careerReadinessBreakdown.technical.score}%
                </div>
                <div className="w-full bg-gray-900/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${overview.careerReadinessBreakdown.technical.score}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Contributes {overview.careerReadinessBreakdown.technical.contribution}% to total
                </div>
              </div>

              {/* Completion Component */}
              <div className="bg-gray-800/50 border border-gray-700/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="text-emerald-400" size={18} />
                    <span className="text-white font-semibold text-sm">Completion</span>
                  </div>
                  <span className="text-gray-400 text-xs">20% weight</span>
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  {overview.careerReadinessBreakdown.completion.score}%
                </div>
                <div className="w-full bg-gray-900/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${overview.careerReadinessBreakdown.completion.score}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Contributes {overview.careerReadinessBreakdown.completion.contribution}% to total
                </div>
              </div>
            </div>

            {/* Readiness Level Description */}
            <div className={`p-4 rounded-xl border ${
              overview.careerReadinessLevel === "READY" ? "bg-emerald-500/10 border-emerald-500/30" :
              overview.careerReadinessLevel === "READY_WITH_GROWTH" ? "bg-blue-500/10 border-blue-500/30" :
              overview.careerReadinessLevel === "CONDITIONAL" ? "bg-yellow-500/10 border-yellow-500/30" :
              "bg-orange-500/10 border-orange-500/30"
            }`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {overview.careerReadinessLevel === "READY" && <CheckCircle className="text-emerald-400" size={24} />}
                  {overview.careerReadinessLevel === "READY_WITH_GROWTH" && <CheckCircle className="text-blue-400" size={24} />}
                  {overview.careerReadinessLevel === "CONDITIONAL" && <AlertCircle className="text-yellow-400" size={24} />}
                  {(overview.careerReadinessLevel === "NOT_READY" || overview.careerReadinessLevel === "NOT_ASSESSED") && <AlertCircle className="text-orange-400" size={24} />}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-1">
                    {overview.careerReadinessLevel === "READY" && "Excellent! You're Market Ready"}
                    {overview.careerReadinessLevel === "READY_WITH_GROWTH" && "Strong Foundation with Growth Opportunities"}
                    {overview.careerReadinessLevel === "CONDITIONAL" && "Making Progress - Focus on Key Areas"}
                    {overview.careerReadinessLevel === "NOT_READY" && "Building Your Foundation"}
                    {overview.careerReadinessLevel === "NOT_ASSESSED" && "Complete Assessments to Get Evaluated"}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {overview.careerReadinessLevel === "READY" && "You have demonstrated excellent proficiency across all areas. You're well-prepared to enter the job market and pursue your chosen career path with confidence."}
                    {overview.careerReadinessLevel === "READY_WITH_GROWTH" && "You have a solid foundation with some areas for improvement. Continue developing your skills through practice and focused learning to maximize your career potential."}
                    {overview.careerReadinessLevel === "CONDITIONAL" && "You're making progress but need to strengthen core competencies. Focus on completing assessments and improving scores in your weaker areas to enhance your career readiness."}
                    {overview.careerReadinessLevel === "NOT_READY" && "You're at the beginning of your journey. Continue taking assessments and building your skills systematically. Each completed assessment brings you closer to career readiness."}
                    {overview.careerReadinessLevel === "NOT_ASSESSED" && "Complete all assessments to receive a comprehensive career readiness evaluation based on your academic performance, technical skills, and profile completion."}
                  </p>
                </div>
              </div>
            </div>

            {/* Career Matches from API (if available) */}
            {progressData.careerMatches && progressData.careerMatches.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-700/40">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="text-primary-400" size={20} />
                  Top Career Matches
                </h3>
                <div className="grid md:grid-cols-3 gap-3">
                  {progressData.careerMatches.slice(0, 3).map((match, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800/50 border border-gray-700/40 hover:border-primary-500/50 rounded-lg p-4 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl font-bold text-primary-400">
                          #{idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold text-sm line-clamp-1">
                            {match.job_role}
                          </div>
                          <div className="text-xs text-gray-400">
                            {match.category}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/40">
                        <span className="text-xs text-gray-400">Match Score</span>
                        <span className="text-lg font-bold text-primary-400">
                          {match.match_score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/career-matches")}
                  className="mt-4 w-full py-2.5 bg-primary-500/20 border border-primary-500/30 text-primary-300 rounded-lg hover:bg-primary-500/30 transition-all font-semibold text-sm"
                >
                  View Detailed Career Analysis
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Assessment Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assessment Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="text-primary-400" size={24} />
                Assessment Categories
              </h2>

              <div className="space-y-6">
                <AssessmentCategory
                  icon={<BookOpen className="text-primary-400" size={20} />}
                  title="Academic Assessments"
                  completed={assessments.academic.completed}
                  total={assessments.academic.total}
                  completion={assessments.academic.completion}
                  averageScore={assessments.academic.averageScore}
                />

                <AssessmentCategory
                  icon={<Code className="text-primary-400" size={20} />}
                  title="Technical Assessments"
                  completed={assessments.technical.completed}
                  total={assessments.technical.total}
                  completion={assessments.technical.completion}
                  averageScore={assessments.technical.averageScore}
                />

                <AssessmentCategory
                  icon={<Brain className="text-primary-400" size={20} />}
                  title="Personal Assessments"
                  completed={assessments.personal.completed}
                  total={assessments.personal.total}
                  completion={assessments.personal.completion}
                  hideScore
                />
              </div>
            </motion.div>

            {/* Subject Performance Breakdown - UPDATED LAYOUT */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="text-primary-400" size={24} />
                  Performance by Subject
                </h2>
                {sortedSubjects.length > 4 && (
                  <button
                    onClick={() => setShowAllSubjects(!showAllSubjects)}
                    className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors font-medium"
                  >
                    {showAllSubjects ? (
                      <>Show Less <ChevronUp size={16} /></>
                    ) : (
                      <>Show All ({sortedSubjects.length}) <ChevronDown size={16} /></>
                    )}
                  </button>
                )}
              </div>

              {/* Fixed Height Grid Layout for Subject Cards */}
              <div className="grid md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/50">
                {displayedSubjects.map(([subject, data]) => (
                  <SubjectPerformanceCard
                    key={subject}
                    subject={subject}
                    average={data.average}
                    best={data.best}
                    attempts={data.attempts}
                    type={data.type}
                  />
                ))}
              </div>

              {sortedSubjects.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <BookOpen className="mx-auto mb-3 opacity-50" size={48} />
                  <p>No assessment data available yet</p>
                  <p className="text-sm mt-1">Complete some assessments to see your performance</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Study Analytics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="text-primary-400" size={20} />
                Study Analytics
              </h2>

              <div className="space-y-4">
                <AnalyticItem
                  icon={<Calendar className="text-primary-400" size={16} />}
                  label="Total Attempts"
                  value={studyAnalytics.totalAttempts}
                />
                <AnalyticItem
                  icon={<Activity className="text-primary-400" size={16} />}
                  label="Active Days"
                  value={studyAnalytics.activeDays}
                />
                <AnalyticItem
                  icon={<TrendingUp className="text-primary-400" size={16} />}
                  label="Avg. Per Day"
                  value={studyAnalytics.averagePerDay}
                />
                <AnalyticItem
                  icon={<Zap className="text-primary-400" size={16} />}
                  label="Current Streak"
                  value={`${studyAnalytics.currentStreak} days`}
                />
              </div>
            </motion.div>

            {/* Performance Improvements */}
            {performance.improvements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="text-emerald-400" size={20} />
                  Top Improvements
                </h2>

                <div className="space-y-3">
                  {performance.improvements.map((imp, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white capitalize truncate">
                          {imp.assessment}
                        </p>
                        <p className="text-xs text-gray-400">{imp.attempts} attempts</p>
                      </div>
                      <div className={`flex items-center gap-1 font-bold ml-2 flex-shrink-0 ${
                        imp.improvement > 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {imp.improvement > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        <span>{Math.abs(imp.improvement)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/assessments")}
                  className="w-full py-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-semibold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <BookOpen size={18} />
                  Take Assessments
                </button>
                <button
                  onClick={() => navigate("/student/learning-path")}
                  className="w-full py-3 rounded-lg bg-gray-800/70 hover:bg-gray-800 border border-gray-700/40 hover:border-gray-600 text-gray-300 font-semibold transition flex items-center justify-center gap-2"
                >
                  <Target size={18} />
                  Learning Path
                </button>
                <button
                  onClick={() => navigate("/student/reports")}
                  className="w-full py-3 rounded-lg bg-gray-800/70 hover:bg-gray-800 border border-gray-700/40 hover:border-gray-600 text-gray-300 font-semibold transition flex items-center justify-center gap-2"
                >
                  <BarChart3 size={18} />
                  View Reports
                </button>
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

// Component: Metric Card
function MetricCard({ icon, label, value, subtitle, level }) {
  // Get readiness color for Career Readiness card
  const getReadinessColor = (lvl) => {
    const colors = {
      "READY": "text-emerald-400",
      "READY_WITH_GROWTH": "text-blue-400",
      "CONDITIONAL": "text-yellow-400",
      "NOT_READY": "text-orange-400",
      "NOT_ASSESSED": "text-gray-400"
    };
    return colors[lvl] || "text-primary-400";
  };

  const subtitleColor = level ? getReadinessColor(level) : "text-gray-400";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-2 border-gray-700/50 hover:border-primary-500/70 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300 group backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-primary-500/20 group-hover:bg-primary-500/30 border border-primary-500/30 group-hover:border-primary-500/50 transition-all">
          {icon}
        </div>
        <div className="text-xs font-bold text-gray-300 group-hover:text-gray-200 uppercase tracking-wider transition-colors">{label}</div>
      </div>
      <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1 sm:mb-2 group-hover:text-primary-400 transition-colors">{value}</div>
      <div className={`text-xs font-semibold ${subtitleColor}`}>{subtitle}</div>
    </motion.div>
  );
}

// Component: Assessment Category
function AssessmentCategory({ icon, title, completed, total, completion, averageScore, hideScore }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-white font-semibold">{title}</h3>
        </div>
        <span className="text-gray-400 text-sm font-medium">
          {completed}/{total}
        </span>
      </div>

      <div className="mb-3">
        <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
          <div
            className="h-full transition-all duration-500 bg-primary-500"
            style={{ width: `${completion}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{Math.round(completion)}% complete</span>
          {!hideScore && averageScore > 0 && (
            <span className="text-xs font-semibold text-gray-300">
              Avg: {Math.round(averageScore)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Component: Subject Performance Card - COMPACT VERSION
function SubjectPerformanceCard({ subject, average, best, attempts, type }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-primary-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/40 hover:border-primary-500/50 transition-all duration-300 shadow-md hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm mb-1 truncate capitalize">
            {subject}
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="px-2 py-0.5 rounded-full bg-gray-900/70 capitalize">
              {type}
            </span>
            <span>{attempts} attempt{attempts > 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`text-2xl font-bold ${getScoreColor(average)}`}>
            {Math.round(average)}%
          </div>
          <div className="text-xs text-gray-500">average</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700/40 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs">
          <Trophy size={14} className="text-primary-400" />
          <span className="text-gray-400">Best:</span>
          <span className="font-bold text-white">{Math.round(best)}%</span>
        </div>

        {/* Mini progress bar */}
        <div className="w-16 h-1.5 bg-gray-900/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500"
            style={{ width: `${average}%` }}
          />
        </div>
      </div>
    </div>
  );

}


// Component: Analytic Item
function AnalyticItem({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}

