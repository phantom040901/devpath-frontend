import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthContext";
import DashNav from "../components/dashboard/DashboardNav";
import DashboardFooter from "../components/dashboard/DashboardFooter";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../components/icons/Logo";
import Chart from 'chart.js/auto';
import ApiLoadingState from "../components/loading/ApiLoadingState";
import useApiWithColdStart from "../hooks/useApiWithColdStart";
import {
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle2,
  CheckCircle,
  Target,
  Brain,
  Code,
  MessageSquare,
  BarChart3,
  Download,
  Loader2,
  Sparkles,
  PieChart,
  Activity,
  User,
  Calendar,
  GraduationCap,
  Briefcase,
  Zap,
  BookOpen,
  Users,
  Trophy,
  Lock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Shield,
  TrendingDown,
  Route,
  Lightbulb,
  X
} from "lucide-react";

// ==================== REUSABLE COMPONENTS ====================

// Info Item Component for Student Details
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-gray-900/30 rounded-xl p-4 border border-gray-700/30">
      <div className="p-2 rounded-lg bg-primary-500/20 text-primary-400">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// Readiness Card Component
function ReadinessCard({ icon, label, value, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 dark:from-gray-800/90 dark:to-gray-900/90 border-2 border-gray-700/50 hover:border-primary-500/70 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300 group backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-primary-500/20 group-hover:bg-primary-500/30 border border-primary-500/30 group-hover:border-primary-500/50 transition-all">
          {icon}
        </div>
      </div>
      <div className="text-xs font-black text-primary-400 dark:text-primary-300/90 group-hover:text-primary-500 dark:group-hover:text-primary-200 uppercase tracking-widest mb-1 transition-colors">{label}</div>
      <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-1 sm:mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors drop-shadow-sm">{value}</div>
      <div className="text-xs text-primary-500 dark:text-primary-400/70 group-hover:text-primary-600 dark:group-hover:text-primary-300/90 font-bold transition-colors">{subtitle}</div>
    </motion.div>
  );
}

// Career Match Card with job-specific insights
function CareerMatchCard({ match, reportData, rank, explanation, isExpanded, onToggle }) {
  const isSelected = match.isSelected || false;

  // Get readiness badge styling
  const getReadinessBadge = (readiness) => {
    const badges = {
      "READY": {
        color: "bg-green-500",
        text: "text-green-300",
        border: "border-green-500/50",
        icon: "✓",
        label: "Ready Now",
        desc: "You're qualified for this role"
      },
      "READY_WITH_GROWTH": {
        color: "bg-blue-500",
        text: "text-blue-300",
        border: "border-blue-500/50",
        icon: "↗",
        label: "Almost Ready",
        desc: "Strong foundation, minor improvements needed"
      },
      "CONDITIONAL": {
        color: "bg-yellow-500",
        text: "text-yellow-300",
        border: "border-yellow-500/50",
        icon: "⚠",
        label: "Needs Improvement",
        desc: "Important skills to develop first"
      },
      "NOT_READY": {
        color: "bg-red-500",
        text: "text-red-300",
        border: "border-red-500/50",
        icon: "✗",
        label: "Not Ready Yet",
        desc: "Significant preparation required"
      }
    };
    return badges[readiness] || null;
  };

  // Generate job-specific insights without percentages
  const generateJobInsights = () => {
    const jobRole = match.job_role.toLowerCase();
    const category = match.category.toLowerCase();
    const insights = [];
    
    // Get relevant skills for this job
    const hasStrongProgramming = reportData.academic.prog_perc >= 70;
    const hasStrongAlgorithms = reportData.academic.algo_perc >= 70;
    const hasStrongCoding = reportData.technical.coding_skills >= 70;
    const hasStrongLogic = reportData.technical.logical_quotient >= 70;
    const hasStrongNetworks = reportData.academic.cn_perc >= 70;
    const hasStrongSoftEng = reportData.academic.se_perc >= 70;
    
    // Mobile App Developer
    if (jobRole.includes('mobile')) {
      if (hasStrongProgramming || hasStrongCoding) {
        insights.push({
          icon: <Code size={14} />,
          text: "Your programming abilities align well with mobile development frameworks and native app creation"
        });
      } else {
        insights.push({
          icon: <Code size={14} />,
          text: "Mobile development builds on your programming foundation with platform-specific skills"
        });
      }
      
      insights.push({
        icon: <Brain size={14} />,
        text: "Cross-platform development experience will complement your technical skillset effectively"
      });
      
      insights.push({
        icon: <Sparkles size={14} />,
        text: "User interface design and mobile UX principles are key growth areas in this field"
      });
    }
    
    // Software Developer
    else if (jobRole.includes('software developer') && !jobRole.includes('web')) {
      if (hasStrongSoftEng) {
        insights.push({
          icon: <Code size={14} />,
          text: "Your software engineering knowledge provides a solid foundation for enterprise development"
        });
      } else {
        insights.push({
          icon: <Code size={14} />,
          text: "Software development practices will enhance your existing technical capabilities"
        });
      }
      
      if (hasStrongAlgorithms || hasStrongLogic) {
        insights.push({
          icon: <Brain size={14} />,
          text: "Strong problem-solving skills are essential for tackling complex software challenges"
        });
      } else {
        insights.push({
          icon: <Brain size={14} />,
          text: "Developing algorithmic thinking will strengthen your software development approach"
        });
      }
      
      insights.push({
        icon: <Sparkles size={14} />,
        text: "Version control and collaborative coding are integral to modern software teams"
      });
    }
    
    // Web Developer
    else if (jobRole.includes('web')) {
      if (hasStrongProgramming) {
        insights.push({
          icon: <Code size={14} />,
          text: "Your programming skills translate directly to full-stack web development"
        });
      } else {
        insights.push({
          icon: <Code size={14} />,
          text: "Web development leverages your technical foundation with modern frameworks"
        });
      }
      
      if (hasStrongNetworks) {
        insights.push({
          icon: <Brain size={14} />,
          text: "Understanding of networking concepts supports backend and API development"
        });
      } else {
        insights.push({
          icon: <Brain size={14} />,
          text: "Learning web protocols and APIs will enhance your development capabilities"
        });
      }
      
      insights.push({
        icon: <Sparkles size={14} />,
        text: "Responsive design and frontend frameworks are valuable specializations to pursue"
      });
    }
    
    // Data Scientist
    else if (jobRole.includes('data scientist')) {
      if (hasStrongAlgorithms) {
        insights.push({
          icon: <Brain size={14} />,
          text: "Your algorithmic thinking is crucial for machine learning model development"
        });
      } else {
        insights.push({
          icon: <Brain size={14} />,
          text: "Building statistical and algorithmic skills will strengthen your data science foundation"
        });
      }
      
      insights.push({
        icon: <Code size={14} />,
        text: "Python and R programming are essential tools for data analysis and modeling"
      });
      
      insights.push({
        icon: <Sparkles size={14} />,
        text: "Statistical analysis and visualization skills are key differentiators in this role"
      });
    }
    
    // DevOps Engineer
    else if (jobRole.includes('devops')) {
      if (hasStrongNetworks) {
        insights.push({
          icon: <Brain size={14} />,
          text: "Your networking knowledge is fundamental for infrastructure and deployment pipelines"
        });
      } else {
        insights.push({
          icon: <Brain size={14} />,
          text: "Understanding system architecture will enhance your DevOps capabilities"
        });
      }
      
      insights.push({
        icon: <Code size={14} />,
        text: "Automation scripting and CI/CD tools are core competencies for this career path"
      });
      
      insights.push({
        icon: <Sparkles size={14} />,
        text: "Cloud platforms and containerization are rapidly growing areas in DevOps"
      });
    }
    
    // System Administrator
    else if (jobRole.includes('system') || jobRole.includes('admin')) {
      if (hasStrongNetworks) {
        insights.push({
          icon: <Brain size={14} />,
          text: "Network administration skills are essential for managing enterprise systems"
        });
      } else {
        insights.push({
          icon: <Brain size={14} />,
          text: "System configuration and network management are foundational to this role"
        });
      }
      
      insights.push({
        icon: <Code size={14} />,
        text: "Shell scripting and automation improve efficiency in system operations"
      });
      
      insights.push({
        icon: <Sparkles size={14} />,
        text: "Security practices and backup strategies are critical responsibilities"
      });
    }
    
    // Default for other roles
    else {
      if (hasStrongCoding || hasStrongProgramming) {
        insights.push({
          icon: <Code size={14} />,
          text: `Your technical skills provide a strong foundation for ${match.job_role} responsibilities`
        });
      } else {
        insights.push({
          icon: <Code size={14} />,
          text: `Building technical proficiency will support your growth in ${match.job_role}`
        });
      }
      
      insights.push({
        icon: <Brain size={14} />,
        text: `Analytical thinking and problem-solving are valued in ${category} roles`
      });
      
      insights.push({
        icon: <Sparkles size={14} />,
        text: "Continuous learning and adaptability are key to long-term success in tech"
      });
    }
    
    return insights.slice(0, 3);
  };
  
  const jobInsights = generateJobInsights();
  
  const getBadgeStyles = () => {
    if (isSelected) return { bg: "bg-primary-500/30", text: "text-primary-300", ring: "ring-primary-500/50" };
    return { bg: "bg-gray-600/20", text: "text-gray-400", ring: "ring-gray-600/30" };
  };
  
  const badgeStyles = getBadgeStyles();
  
  return (
    <div className={`rounded-xl p-4 sm:p-5 border transition-all ${
      isSelected
        ? 'bg-gradient-to-br from-primary-500/10 via-emerald-500/5 to-transparent border-primary-500/60 ring-2 ring-primary-500/40 shadow-lg shadow-primary-500/20'
        : 'bg-gray-800/40 border-gray-700/30 hover:bg-gray-800/50 hover:border-gray-600/40'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${badgeStyles.bg} ring-2 ${badgeStyles.ring}`}>
            {isSelected ? (
              <CheckCircle2 className={`${badgeStyles.text}`} size={20} />
            ) : (
              <span className={`text-base font-bold ${badgeStyles.text}`}>#{rank}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
              <h3 className={`text-base sm:text-lg font-bold ${isSelected ? 'text-primary-300' : 'text-white'} break-words`}>
                {match.job_role}
              </h3>
              {isSelected && (
                <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-primary-500/30 border border-primary-500/50 flex-shrink-0">
                  <span className="text-xs font-bold text-primary-300 whitespace-nowrap">Your Selected Path</span>
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">{match.category}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`text-xl sm:text-2xl font-bold ${isSelected ? 'text-primary-400' : 'text-gray-400'}`}>
            {match.match_score}
          </div>
          <div className="text-xs text-gray-500">Match</div>
        </div>
      </div>

      {/* Match Score Bar */}
      <div className="mb-4">
        <div className={`w-full rounded-full h-2 ${isSelected ? 'bg-gray-800/50' : 'bg-gray-900/50'}`}>
          <div 
            className={`h-2 rounded-full transition-all duration-700 ${
              isSelected 
                ? 'bg-gradient-to-r from-primary-500 via-emerald-400 to-cyan-400' 
                : 'bg-gradient-to-r from-gray-600 to-gray-500'
            }`}
            style={{ width: match.match_score }}
          />
        </div>
      </div>

      {/* Readiness Badge (if available) */}
      {explanation?.readiness && (
        <div className="mb-4">
          {(() => {
            const badge = getReadinessBadge(explanation.readiness);
            if (!badge) return null;
            return (
              <div className={`inline-flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 px-3 py-2 sm:py-1.5 rounded-lg sm:rounded-full ${badge.color}/20 border ${badge.border}`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{badge.icon}</span>
                  <span className={`text-xs font-bold ${badge.text}`}>{badge.label}</span>
                </div>
                <span className="text-xs text-gray-400 sm:before:content-['•'] sm:before:mr-2">{badge.desc}</span>
              </div>
            );
          })()}
        </div>
      )}

      {/* Why This Career */}
      <div className={`border rounded-lg p-4 mb-4 ${
        isSelected
          ? 'bg-primary-500/10 border-primary-500/30'
          : 'bg-gray-900/40 border-gray-700/30'
      }`}>
        <h4 className={`text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-2 ${
          isSelected ? 'text-primary-300' : 'text-gray-300'
        }`}>
          <Sparkles size={14} className={isSelected ? 'text-primary-400' : 'text-gray-400'} />
          Why This Matches Your Profile
        </h4>
        <div className="space-y-2">
          {jobInsights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className={isSelected ? 'text-primary-400' : 'text-gray-500'}>
                {insight.icon}
              </span>
              <span className="text-xs text-gray-300 leading-relaxed">{insight.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible Readiness Details */}
      {explanation && (explanation.skill_gaps?.length > 0 || explanation.growth_areas?.length > 0 || explanation.top_strengths?.length > 0 || explanation.alternative_roles?.length > 0) && (
        <div className="border-t border-gray-700/30 pt-4">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wide text-gray-300 hover:text-white transition-colors mb-3"
          >
            <span className="flex items-center gap-2">
              <Shield size={14} className="text-primary-400" />
              Readiness Details
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0
            }}
            transition={{
              height: { duration: 0.3, ease: "easeInOut" },
              opacity: { duration: 0.2, ease: "easeInOut" }
            }}
            style={{ overflow: "hidden" }}
          >
            <div className="space-y-3 pb-2">
              {/* Critical Skill Gaps (Red) */}
              {explanation.skill_gaps && explanation.skill_gaps.length > 0 && (
                <div className="bg-red-50 dark:bg-red-500/10 border-l-4 border-l-red-500 border border-red-200 dark:border-red-500/30 rounded-lg p-3 shadow-sm">
                  <h5 className="text-xs font-bold text-red-700 dark:text-red-300 mb-2 flex items-center gap-1.5">
                    <AlertCircle size={12} className="text-red-600 dark:text-red-400" />
                    Skills You Need to Build
                  </h5>
                  <ul className="space-y-1">
                    {explanation.skill_gaps.map((gap, idx) => {
                      // Handle both string and object formats
                      const gapText = typeof gap === 'string'
                        ? gap
                        : `${gap.skill}: ${gap.current} → needs ${gap.required}+ (ideal: ${gap.ideal})`;
                      return (
                        <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
                          <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                          <span>{gapText}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Readiness Warnings (Yellow) */}
              {explanation.readiness_warnings && explanation.readiness_warnings.length > 0 && (
                <div className="bg-amber-50 dark:bg-yellow-500/10 border-l-4 border-l-amber-500 border border-amber-200 dark:border-yellow-500/30 rounded-lg p-3 shadow-sm">
                  <h5 className="text-xs font-bold text-amber-700 dark:text-yellow-300 mb-2 flex items-center gap-1.5">
                    <AlertCircle size={12} className="text-amber-600 dark:text-yellow-400" />
                    Areas to Improve
                  </h5>
                  <ul className="space-y-1">
                    {explanation.readiness_warnings.map((warning, idx) => {
                      // Handle both string and object formats
                      const warningText = typeof warning === 'string' ? warning : JSON.stringify(warning);
                      return (
                        <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
                          <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                          <span>{warningText}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Alternative Roles (Blue) */}
              {explanation.alternative_roles && explanation.alternative_roles.length > 0 && (
                <div className="bg-blue-50 dark:bg-gray-800/40 border-l-4 border-l-blue-500 dark:border-l-blue-400 border border-blue-200 dark:border-gray-600/30 rounded-lg p-3 shadow-sm">
                  <h5 className="text-xs font-bold text-blue-800 dark:text-gray-200 mb-2 flex items-center gap-1.5">
                    <TrendingDown size={12} className="text-blue-600 dark:text-blue-400" />
                    Better Starting Options
                  </h5>
                  <ul className="space-y-1">
                    {explanation.alternative_roles.map((role, idx) => {
                      const roleText = typeof role === 'string' ? role : JSON.stringify(role);
                      return (
                        <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
                          <span>{roleText}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Recommended Career Path (Purple) */}
              {explanation.recommended_career_path && (
                <div className="bg-purple-50 dark:bg-gray-800/40 border-l-4 border-l-purple-500 dark:border-l-purple-400 border border-purple-200 dark:border-gray-600/30 rounded-lg p-3 shadow-sm">
                  <h5 className="text-xs font-bold text-purple-800 dark:text-gray-200 mb-2 flex items-center gap-1.5">
                    <Route size={12} className="text-purple-600 dark:text-purple-400" />
                    Your Career Path
                  </h5>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {typeof explanation.recommended_career_path === 'string'
                      ? explanation.recommended_career_path
                      : JSON.stringify(explanation.recommended_career_path)}
                  </p>
                </div>
              )}

              {/* Top Strengths (Green) */}
              {explanation.top_strengths && explanation.top_strengths.length > 0 && (
                <div className="bg-green-50 dark:bg-gray-800/40 border-l-4 border-l-green-500 dark:border-l-green-400 border border-green-200 dark:border-gray-600/30 rounded-lg p-3 shadow-sm">
                  <h5 className="text-xs font-bold text-green-800 dark:text-gray-200 mb-2 flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-green-600 dark:text-green-400" />
                    Your Strengths
                  </h5>
                  <ul className="space-y-1">
                    {explanation.top_strengths.map((strength, idx) => {
                      const strengthText = typeof strength === 'string' ? strength : JSON.stringify(strength);
                      return (
                        <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                          <span>{strengthText}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Growth Areas (Gray) */}
              {explanation.growth_areas && explanation.growth_areas.length > 0 && (
                <div className="bg-indigo-50 dark:bg-gray-800/40 border-l-4 border-l-indigo-500 dark:border-l-indigo-400 border border-indigo-200 dark:border-gray-600/30 rounded-lg p-3 shadow-sm">
                  <h5 className="text-xs font-bold text-indigo-800 dark:text-gray-200 mb-2 flex items-center gap-1.5">
                    <Lightbulb size={12} className="text-indigo-600 dark:text-blue-400" />
                    Ways to Grow
                  </h5>
                  <ul className="space-y-1">
                    {explanation.growth_areas.map((area, idx) => {
                      // Handle both string and object formats properly
                      let areaText;
                      if (typeof area === 'string') {
                        areaText = area;
                      } else if (area && typeof area === 'object') {
                        // If it's an object with skill property, format it nicely
                        if (area.skill) {
                          areaText = `${area.skill}: ${area.current} → needs ${area.required}+ (ideal: ${area.ideal})`;
                        } else {
                          // Last resort: convert to readable string
                          areaText = JSON.stringify(area);
                        }
                      } else {
                        areaText = String(area);
                      }
                      return (
                        <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
                          <span className="text-gray-600 dark:text-gray-400 mt-0.5">▸</span>
                          <span>{areaText}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Assessment Item Component
function AssessmentItem({ icon, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-primary-500/20 text-primary-400 mt-0.5">
        {icon}
      </div>
      <span className="text-gray-300 text-sm leading-relaxed">{text}</span>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function CareerReports() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasSelectedCareer, setHasSelectedCareer] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [detailedExplanations, setDetailedExplanations] = useState([]);
  const [validation, setValidation] = useState(null);
  const [diversityInfo, setDiversityInfo] = useState(null);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [expandedCards, setExpandedCards] = useState({ 0: true }); // First card expanded by default
  const [selectedForComparison, setSelectedForComparison] = useState([]); // Careers selected for comparison
  const [showComparisonModal, setShowComparisonModal] = useState(false); // Show comparison modal
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false); // Toggle for advanced details
  const reportRef = useRef(null);

  // API cold start detection hook
  const { isLoading: isApiLoading, execute: executeApiCall } = useApiWithColdStart();

  // Chart refs
  const skillsRadarRef = useRef(null);
  const performanceBarRef = useRef(null);
  const matchDoughnutRef = useRef(null);
  const skillsChartInstance = useRef(null);
  const performanceChartInstance = useRef(null);
  const matchChartInstance = useRef(null);

  useEffect(() => {
    if (!user) return;
    checkCareerSelection();
  }, [user]);

  useEffect(() => {
    return () => {
      if (skillsChartInstance.current) skillsChartInstance.current.destroy();
      if (performanceChartInstance.current) performanceChartInstance.current.destroy();
      if (matchChartInstance.current) matchChartInstance.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (reportData && predictions && hasSelectedCareer) {
      createCharts();
    }
  }, [reportData, predictions, hasSelectedCareer, showAdvancedDetails]);

  // Close all expanded cards when entering advanced mode
  useEffect(() => {
    if (showAdvancedDetails) {
      setExpandedCards({}); // Close all cards
    }
  }, [showAdvancedDetails]);

  const checkCareerSelection = async () => {
    setLoading(true);
    try {
      const selectedCareerDocRef = doc(db, "users", user.uid, "selectedCareer", "current");
      const selectedCareerDoc = await getDoc(selectedCareerDocRef);
      
      if (selectedCareerDoc.exists()) {
        setHasSelectedCareer(true);
        await fetchReportData();
      } else {
        setHasSelectedCareer(false);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error checking career selection:", err);
      setHasSelectedCareer(false);
      setLoading(false);
    }
  };

  const fetchReportData = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let selectedCareerInfo = null;
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        const selectedCareerDocRef = doc(db, "users", user.uid, "selectedCareer", "current");
        const selectedCareerDoc = await getDoc(selectedCareerDocRef);
        
        if (selectedCareerDoc.exists()) {
          const careerData = selectedCareerDoc.data();
          selectedCareerInfo = {
            jobRole: careerData.jobRole,
            category: careerData.category,
            matchScore: careerData.matchScore
          };
        }
        
        setStudentInfo({
          firstName: userData.firstName || "Student",
          lastName: userData.lastName || "",
          email: userData.email || user.email,
          course: userData.course || "BS Information Technology",
          yearLevel: userData.yearLevel || "4th Year",
          studentId: user.uid.substring(0, 8).toUpperCase(),
          careerCategory: selectedCareerInfo?.category || "Software Development",
          selectedCareer: selectedCareerInfo?.jobRole || "Software Engineer",
          matchScore: selectedCareerInfo?.matchScore || "85%",
          dateOfBirth: userData.dateOfBirth || ""
        });
      }

      const resultsRef = collection(db, "users", user.uid, "results");
      const snapshot = await getDocs(resultsRef);
      
      const resultsMap = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const baseId = doc.id.replace(/_\d+$/, '');
        if (!resultsMap[baseId] || (data.score > (resultsMap[baseId].score || 0))) {
          resultsMap[baseId] = { id: doc.id, ...data };
        }
      });

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

      const academicScores = {
        os_perc: resultsMap["assessments_operating_systems"]?.score || 0,
        algo_perc: resultsMap["assessments_algorithms"]?.score || 0,
        prog_perc: resultsMap["assessments_programming"]?.score || 0,
        se_perc: resultsMap["assessments_software_engineering"]?.score || 0,
        cn_perc: resultsMap["assessments_computer_networks"]?.score || 0,
        es_perc: resultsMap["assessments_electronics"]?.score || 0,
        ca_perc: resultsMap["assessments_computer_architecture"]?.score || 0,
        math_perc: resultsMap["assessments_mathematics"]?.score || 0,
        comm_perc: resultsMap["assessments_communication"]?.score || 0,
      };

      const technicalSkills = {
        coding_skills: resultsMap["technicalAssessments_coding_skills"]?.score || 0,
        logical_quotient: resultsMap["technicalAssessments_logical_quotient"]?.score || 0,
        memory_score: resultsMap["technicalAssessments_memory_test"]?.score || 0,
      };

      const payload = {
        courses: "BSIT",
        ...academicScores,
        coding_skills: Math.round(technicalSkills.coding_skills / 20),
        logical_quotient: Math.round(technicalSkills.logical_quotient / 20),
        memory_score: Math.round(technicalSkills.memory_score / 10),
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

      // Wrap API call with cold start detection
      const data = await executeApiCall(async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }

        return await response.json();
      });

      if (data) {
        console.log("Full API Response for Career Reports:", data); // For debugging
        console.log("Detailed Explanations:", data.recommendations?.detailed_explanations);
        console.log("Validation:", data.recommendations?.validation);
        console.log("Diversity Info:", {
          strategy: data.recommendations?.diversity_strategy,
          note: data.recommendations?.diversity_note
        });

        let topMatches = data.recommendations?.job_matches?.slice(0, 3) || [];

        if (selectedCareerInfo && selectedCareerInfo.jobRole) {
          topMatches = topMatches.map(match => ({
            ...match,
            isSelected: match.job_role === selectedCareerInfo.jobRole
          }));
        }

        setPredictions({
          job_matches: topMatches
        });

        // Capture enhanced API data with safe defaults
        setDetailedExplanations(data.recommendations?.detailed_explanations || []);
        setValidation(data.recommendations?.validation || null);
        setDiversityInfo({
          strategy: data.recommendations?.diversity_strategy || null,
          note: data.recommendations?.diversity_note || null
        });
      } else {
        // Fallback to dummy data if API call fails
        console.error("API call failed, using fallback data");
        setPredictions({
          job_matches: [
            { job_role: "Mobile Applications Developer", category: "Software Development", match_score: "92.15%" },
            { job_role: "Software Developer", category: "Software Development", match_score: "87.3%" },
            { job_role: "Web Developer", category: "Software Development", match_score: "82.5%" }
          ]
        });
      }

      setReportData({
        academic: academicScores,
        technical: technicalSkills,
        resultsMap,
        payload
      });
    } catch (err) {
      console.error("Error fetching report data:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCharts = () => {
    if (skillsChartInstance.current) skillsChartInstance.current.destroy();
    if (performanceChartInstance.current) performanceChartInstance.current.destroy();
    if (matchChartInstance.current) matchChartInstance.current.destroy();

    if (skillsRadarRef.current && reportData) {
      const ctx = skillsRadarRef.current.getContext('2d');
      const radarData = [
        reportData.academic.os_perc || 0,
        reportData.academic.algo_perc || 0,
        reportData.academic.prog_perc || 0,
        reportData.academic.cn_perc || 0,
        reportData.academic.math_perc || 0,
        reportData.academic.comm_perc || 0
      ];
      
      skillsChartInstance.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['OS', 'Algorithms', 'Programming', 'Networks', 'Math', 'Communication'],
          datasets: [{
            label: 'Your Skills',
            data: radarData,
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(99, 102, 241)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(99, 102, 241)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: { stepSize: 20, color: '#9ca3af' },
              grid: { color: 'rgba(75, 85, 99, 0.3)' },
              pointLabels: { color: '#d1d5db', font: { size: 11 } }
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    }

    if (performanceBarRef.current && reportData) {
      const ctx = performanceBarRef.current.getContext('2d');
      const allScores = [
        { name: 'Coding', score: reportData.technical.coding_skills || 0 },
        { name: 'Logic', score: reportData.technical.logical_quotient || 0 },
        { name: 'Memory', score: reportData.technical.memory_score || 0 },
        { name: 'Soft Eng', score: reportData.academic.se_perc || 0 },
        { name: 'Prog', score: reportData.academic.prog_perc || 0 },
        { name: 'Algo', score: reportData.academic.algo_perc || 0 }
      ];

      performanceChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: allScores.map(s => s.name),
          datasets: [{
            label: 'Score %',
            data: allScores.map(s => s.score),
            backgroundColor: [
              'rgba(139, 92, 246, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(236, 72, 153, 0.8)'
            ],
            borderColor: [
              'rgb(139, 92, 246)',
              'rgb(59, 130, 246)',
              'rgb(16, 185, 129)',
              'rgb(245, 158, 11)',
              'rgb(239, 68, 68)',
              'rgb(236, 72, 153)'
            ],
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: { color: '#9ca3af' },
              grid: { color: 'rgba(75, 85, 99, 0.2)' }
            },
            x: {
              ticks: { color: '#d1d5db' },
              grid: { display: false }
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    }

    if (matchDoughnutRef.current && predictions?.job_matches?.[0]) {
      const ctx = matchDoughnutRef.current.getContext('2d');
      const matchScoreStr = predictions.job_matches[0].match_score;
      const topMatch = parseFloat(matchScoreStr.replace('%', ''));
      
      matchChartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Match Score', 'Gap'],
          datasets: [{
            data: [topMatch, 100 - topMatch],
            backgroundColor: [
              'rgba(99, 102, 241, 0.8)',
              'rgba(31, 41, 55, 0.3)'
            ],
            borderColor: [
              'rgb(99, 102, 241)',
              'rgba(31, 41, 55, 0.5)'
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + context.parsed + '%';
                }
              }
            }
          }
        }
      });
    }
  };

  const handleDownloadReport = () => {
    window.print();
  };

  const calculateAverages = () => {
    if (!reportData) return { academic: 0, technical: 0, communication: 0 };
    
    const academic = Object.values(reportData.academic).filter(v => v > 0);
    const academicAvg = academic.length > 0 ? academic.reduce((a, b) => a + b, 0) / academic.length : 0;
    
    const technical = Object.values(reportData.technical).filter(v => v > 0);
    const technicalAvg = technical.length > 0 ? technical.reduce((a, b) => a + b, 0) / technical.length : 0;
    
    return {
      academic: Math.round(academicAvg),
      technical: Math.round(technicalAvg),
      communication: reportData.academic.comm_perc || 0
    };
  };

  const identifyStrengthsWeaknesses = () => {
    if (!reportData) return { strengths: [], weaknesses: [] };
    
    const allScores = [
      { name: "Operating Systems", score: reportData.academic.os_perc, category: "academic" },
      { name: "Algorithms", score: reportData.academic.algo_perc, category: "academic" },
      { name: "Programming", score: reportData.academic.prog_perc, category: "academic" },
      { name: "Software Engineering", score: reportData.academic.se_perc, category: "academic" },
      { name: "Computer Networks", score: reportData.academic.cn_perc, category: "academic" },
      { name: "Communication", score: reportData.academic.comm_perc, category: "academic" },
      { name: "Coding Skills", score: reportData.technical.coding_skills, category: "technical" },
      { name: "Logical Quotient", score: reportData.technical.logical_quotient, category: "technical" },
      { name: "Memory Test", score: reportData.technical.memory_score, category: "technical" },
    ].filter(item => item.score > 0);

    const sorted = allScores.sort((a, b) => b.score - a.score);
    const strengths = sorted.slice(0, 3);
    const weaknesses = sorted.slice(-3).reverse();

    return { strengths, weaknesses };
  };

  const getReadinessLevel = () => {
    const averages = calculateAverages();
    const overallScore = (averages.academic + averages.technical + averages.communication) / 3;
    if (overallScore >= 80) return { level: "Excellent", color: "emerald", description: "Career Ready" };
    if (overallScore >= 65) return { level: "Strong", color: "primary", description: "Well Prepared" };
    if (overallScore >= 50) return { level: "Good", color: "blue", description: "On Track" };
    return { level: "Developing", color: "yellow", description: "Building Skills" };
  };

  // Show locked state if career not selected
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-1400 via-primary-1500 to-black">
        <Loader2 className="animate-spin text-primary-400" size={48} />
      </div>
    );
  }

  if (!hasSelectedCareer) {
    return (
      <div className="min-h-screen flex flex-col overflow-x-hidden w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black text-primary-50">
        <DashNav />

        <main className="flex items-center justify-center flex-1 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full"
          >
            <div className="bg-gray-900/70 border border-gray-700/40 rounded-3xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-yellow-500/20 border-2 border-yellow-500/30 mb-6">
                <Lock className="text-yellow-400" size={48} />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                Career Report Locked
              </h1>
              
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                You need to select a career path before accessing your personalized career assessment report. 
                Complete your career matching process to unlock this feature.
              </p>
              
              <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-6 mb-8">
                <h3 className="text-white font-semibold mb-3 flex items-center justify-center gap-2">
                  <CheckCircle className="text-primary-400" size={20} />
                  Steps to Unlock
                </h3>
                <ol className="text-left text-gray-300 space-y-3 max-w-md mx-auto">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-sm font-bold">1</span>
                    <span>Complete all assessments (Academic, Technical, Personal)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-sm font-bold">2</span>
                    <span>View your career matches based on your results</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-sm font-bold">3</span>
                    <span>Select your preferred career path</span>
                  </li>
                </ol>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/career-matches')}
                  className="px-8 py-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Go to Career Matches</span>
                  <ArrowRight size={20} />
                </button>
                
                <button
                  onClick={() => navigate('/assessments')}
                  className="px-8 py-4 rounded-xl bg-gray-800/70 hover:bg-gray-800 text-white font-semibold transition-all border border-gray-700/40 hover:border-gray-600"
                >
                  View Assessments
                </button>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <DashboardFooter />
      </div>
    );
  }

  const averages = calculateAverages();
  const { strengths, weaknesses } = identifyStrengthsWeaknesses();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const readiness = getReadinessLevel();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black text-primary-50">
      {/* API Loading State with Cold Start Detection */}
      <ApiLoadingState
        isLoading={isApiLoading}
        initialMessage="Loading your career report..."
        fullScreen={true}
      />

      <DashNav />

      <main ref={reportRef} className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12 w-full flex-1 space-y-4 sm:space-y-6">

        {/* PRINT ONLY - Horizontal Header with Logo */}
        <div className="hidden print:block print-header">
          <div className="flex items-center justify-between mb-2" style={{ borderBottom: '2pt solid #1f2937', paddingBottom: '6pt' }}>
            <div className="flex items-center gap-3">
              <Logo width={2} className="print-logo" />
              <div>
                <h1 style={{ fontSize: '14pt', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  DevPath
                </h1>
                <p style={{ fontSize: '7pt', color: '#6b7280', margin: 0 }}>
                  Career Assessment Report
                </p>
              </div>
            </div>
            {studentInfo && (
              <div className="flex gap-4" style={{ fontSize: '7pt', color: '#1f2937' }}>
                <span><strong>Student:</strong> {studentInfo.firstName} {studentInfo.lastName}</span>
                <span>•</span>
                <span><strong>Course:</strong> {studentInfo.course}</span>
                <span>•</span>
                <span><strong>Year:</strong> {studentInfo.yearLevel}</span>
                <span>•</span>
                <span><strong>Date:</strong> {currentDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Report Header with Student Info - SCREEN ONLY */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="print:hidden bg-gray-900/70 border border-gray-700/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary-500/20 border border-primary-500/30">
                  <GraduationCap className="text-primary-400" size={28} />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
                    Career Assessment Report
                  </h1>
                  <p className="text-gray-400 text-sm mt-1">
                    AI-Powered Career Matching Analysis
                  </p>
                </div>
              </div>
              
              {studentInfo && (
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <InfoItem 
                    icon={<User size={16} />} 
                    label="Student Name" 
                    value={`${studentInfo.firstName} ${studentInfo.lastName}`} 
                  />
                  <InfoItem 
                    icon={<GraduationCap size={16} />} 
                    label="Course" 
                    value={studentInfo.course} 
                  />
                  <InfoItem 
                    icon={<Calendar size={16} />} 
                    label="Year Level" 
                    value={studentInfo.yearLevel} 
                  />
                  <InfoItem 
                    icon={<Briefcase size={16} />} 
                    label="Report Date" 
                    value={currentDate} 
                  />
                </div>
              )}
            </div>
            
            <button 
              onClick={handleDownloadReport}
              className="print:hidden px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-3 whitespace-nowrap"
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>
        </motion.div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ReadinessCard
            icon={<Trophy className="text-primary-400" size={24} />}
            label="Career Readiness"
            value={readiness.level}
            subtitle={readiness.description}
          />
          <ReadinessCard
            icon={<BookOpen className="text-primary-400" size={24} />}
            label="Core Knowledge"
            value={strengths.length > 0 ? strengths[0].name.split(' ')[0] : "N/A"}
            subtitle="Top Strength Area"
          />
          <ReadinessCard
            icon={<Zap className="text-primary-400" size={24} />}
            label="Skills Mastered"
            value={strengths.filter(s => s.score >= 75).length + "/9"}
            subtitle="Advanced Proficiency"
          />
          <ReadinessCard
            icon={<Users className="text-primary-400" size={24} />}
            label="Team Fit"
            value={reportData?.payload?.team_exp === "yes" ? "High" : "Developing"}
            subtitle="Collaboration Ready"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Career Matches */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            
            {/* Quick Summary Banner */}
            {validation && (() => {
              try {
                const confScore = validation.confidence_score || 0;
                const getMessage = () => {
                  if (confScore >= 85) return {
                    emoji: '🎉',
                    text: 'Awesome! These matches are spot-on for your skills!',
                    color: 'from-emerald-500/20 to-cyan-500/10 border-emerald-500/40'
                  };
                  if (confScore >= 70) return {
                    emoji: '👍',
                    text: 'Great matches! You\'re on the right track!',
                    color: 'from-blue-500/20 to-primary-500/10 border-blue-500/40'
                  };
                  return {
                    emoji: '💡',
                    text: 'Good starting point! Keep building your skills!',
                    color: 'from-yellow-500/20 to-orange-500/10 border-yellow-500/40'
                  };
                };
                const msg = getMessage();

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className={`bg-gradient-to-r ${msg.color} border rounded-xl p-4`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{msg.emoji}</span>
                      <p className="text-sm font-semibold text-white">{msg.text}</p>
                    </div>
                  </motion.div>
                );
              } catch (error) {
                console.error("Error rendering validation banner:", error, validation);
                return null;
              }
            })()}

            {/* Top 3 Career Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black bg-gradient-to-r from-gray-900 to-primary-600 dark:from-white dark:to-primary-200 bg-clip-text text-transparent flex items-center gap-2">
                  <Target className="text-primary-400 dark:text-primary-400" size={22} />
                  <span>Top 3 Career Matches</span>
                </h2>
                <span className="text-xs text-primary-600 dark:text-primary-300/80 font-bold bg-gray-100 dark:bg-gray-800/70 px-3 py-1 rounded-full border border-primary-300/30 dark:border-primary-500/20">
                  Based on your assessment
                </span>
              </div>

              <div className="space-y-5">
                {predictions?.job_matches && predictions.job_matches.length > 0 ? (
                  predictions.job_matches.map((match, idx) => {
                    // Find corresponding explanation for this match
                    const explanation = detailedExplanations.find(exp => exp.job_role === match.job_role);
                    return (
                      <CareerMatchCard
                        key={idx}
                        match={match}
                        reportData={reportData}
                        rank={idx + 1}
                        explanation={explanation}
                        isExpanded={expandedCardIndex === idx}
                        onToggle={() => setExpandedCardIndex(expandedCardIndex === idx ? null : idx)}
                      />
                    );
                  })
                ) : (
                  <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/30 text-center">
                    <div className="text-gray-400 mb-2">
                      <AlertCircle className="mx-auto mb-3" size={48} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No Career Matches Found</h3>
                    <p className="text-sm text-gray-400">
                      Please complete all assessments to view your personalized career recommendations.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Why These Careers Section - ADVANCED ONLY */}
            {showAdvancedDetails && detailedExplanations && detailedExplanations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 border border-primary-500/20 rounded-2xl p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary-500/20">
                      <Sparkles className="text-primary-400" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black dark:text-white light:text-gray-900">
                        🎯 Why These Careers?
                      </h2>
                      <p className="text-xs sm:text-sm dark:text-gray-400 light:text-gray-600">Tap any career to learn more</p>
                    </div>
                  </div>

                  {/* Compare Button - Mobile Optimized */}
                  {selectedForComparison.length >= 2 && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => setShowComparisonModal(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2.5 bg-gradient-to-r from-primary-500 to-cyan-500 hover:from-primary-600 hover:to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Compare ({selectedForComparison.length})
                    </motion.button>
                  )}
                </div>

                {/* Comparison Helper Text */}
                {predictions?.job_matches?.length > 1 && selectedForComparison.length === 0 && (
                  <div className="mb-4 p-3 bg-blue-500/10 dark:bg-blue-500/10 light:bg-blue-100 border border-blue-500/30 dark:border-blue-500/30 light:border-blue-300 rounded-lg">
                    <p className="text-xs dark:text-blue-300 light:text-blue-800 flex items-center gap-2">
                      <Lightbulb size={14} />
                      💡 <strong>Tip:</strong> Select 2-3 careers using the checkboxes to compare them side-by-side!
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {detailedExplanations.map((explanation, idx) => {
                    const match = predictions.job_matches[idx];
                    if (!match) return null;

                    const isDetailsOpen = expandedCards[idx] || false;

                    const toggleDetails = () => {
                      setExpandedCards(prev => {
                        // If this card is already open, close it
                        if (prev[idx]) {
                          return { ...prev, [idx]: false };
                        }
                        // Otherwise, close all cards and open only this one
                        return { [idx]: true };
                      });
                    };

                    // Get top 3 factors
                    const topFactors = explanation.top_contributing_factors?.slice(0, 3) || [];

                    // Check if this career is selected for comparison
                    const isSelected = selectedForComparison.includes(idx);

                    // Handle comparison selection
                    const toggleSelection = () => {
                      setSelectedForComparison(prev => {
                        if (prev.includes(idx)) {
                          // Remove from selection
                          return prev.filter(i => i !== idx);
                        } else {
                          // Add to selection (max 3)
                          if (prev.length >= 3) {
                            return prev; // Don't add if already 3 selected
                          }
                          return [...prev, idx];
                        }
                      });
                    };

                    return (
                      <div key={idx} className={`rounded-xl overflow-hidden transition-all ${
                        match.isSelected
                          ? 'bg-gradient-to-br from-primary-500/20 to-emerald-500/10 dark:from-primary-500/20 dark:to-emerald-500/10 light:from-primary-100 light:to-emerald-100 border-2 border-primary-500/60 dark:border-primary-500/60 light:border-primary-400 shadow-lg dark:shadow-primary-500/20 light:shadow-primary-200/50'
                          : 'bg-gray-800/40 dark:bg-gray-800/40 light:bg-gray-50/50 border dark:border-2 light:border-0 border-gray-700/30 dark:border-gray-700/30 light:border-transparent hover:border-gray-600/50 dark:hover:border-gray-600/50 light:hover:bg-gray-100/50'
                      }`}>

                        {/* ALWAYS VISIBLE: Job Header + Match Score */}
                        <div className="p-4 sm:p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3 flex-1">
                              {/* Comparison Checkbox */}
                              <button
                                onClick={toggleSelection}
                                className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-primary-500 border-primary-500'
                                    : 'border-gray-600 dark:border-gray-600 light:border-gray-400 hover:border-primary-400'
                                }`}
                                title={isSelected ? 'Remove from comparison' : 'Add to comparison'}
                              >
                                {isSelected && (
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>

                              <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${
                                match.isSelected
                                  ? 'bg-primary-500/30 dark:bg-primary-500/30 light:bg-primary-100 ring-2 ring-primary-500/50 dark:ring-primary-500/50 light:ring-primary-400'
                                  : 'bg-gray-700/50 dark:bg-gray-700/50 light:bg-gray-200'
                              }`}>
                                <span className="text-lg font-bold dark:text-white light:text-gray-900">#{idx + 1}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg sm:text-xl font-bold dark:text-white light:text-gray-700 truncate">{match.job_role}</h3>
                                <p className="text-xs dark:text-gray-400 light:text-gray-500">{match.category}</p>
                              </div>
                            </div>
                            <div className="flex-shrink-0 text-right ml-3">
                              <div className={`text-3xl sm:text-4xl font-black ${match.isSelected ? 'text-primary-400 dark:text-primary-400 light:text-primary-500' : 'dark:text-gray-400 light:text-gray-500'}`}>
                                {match.match_score}
                              </div>
                              <div className="text-xs dark:text-gray-500 light:text-gray-500">Match</div>
                            </div>
                          </div>

                          {/* ALWAYS VISIBLE: Top 3 Strengths as Simple Tags */}
                          {explanation.your_strengths && explanation.your_strengths.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-2">
                                {explanation.your_strengths.slice(0, 3).map((strength, sIdx) => (
                                  <span key={sIdx} className="inline-flex items-center gap-1 text-xs bg-emerald-500/20 dark:bg-emerald-500/20 light:bg-emerald-50 text-emerald-300 dark:text-emerald-300 light:text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-500/30 dark:border-emerald-500/30 light:border-emerald-200">
                                    <span className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600">✓</span> {strength}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Toggle Button */}
                          <button
                            onClick={toggleDetails}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-primary-500/20 to-blue-500/10 dark:from-primary-500/20 dark:to-blue-500/10 light:from-primary-50 light:to-blue-50 hover:from-primary-500/30 hover:to-blue-500/20 dark:hover:from-primary-500/30 dark:hover:to-blue-500/20 light:hover:from-primary-100 light:hover:to-blue-100 border border-primary-500/30 dark:border-primary-500/30 light:border-primary-200 hover:border-primary-500/50 dark:hover:border-primary-500/50 light:hover:border-primary-300 transition-all group"
                          >
                            <span className="text-sm font-bold dark:text-white light:text-gray-700 flex items-center gap-2">
                              {isDetailsOpen ? '🔼 Got it, close' : '📖 Show me why'}
                            </span>
                            <motion.div
                              animate={{ rotate: isDetailsOpen ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown size={18} className="text-primary-400 dark:text-primary-400 light:text-primary-500" />
                            </motion.div>
                          </button>
                        </div>

                        {/* COLLAPSIBLE: Simple Breakdown */}
                        <motion.div
                          className="career-details-collapse"
                          initial={false}
                          animate={{
                            height: isDetailsOpen ? "auto" : 0,
                            opacity: isDetailsOpen ? 1 : 0
                          }}
                          transition={{
                            height: { duration: 0.3, ease: "easeInOut" },
                            opacity: { duration: 0.2, ease: "easeInOut" }
                          }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-gray-700/30 dark:border-gray-700/30 light:border-gray-200">

                            {/* Simple Explanation First */}
                            <div className="bg-blue-500/10 dark:bg-blue-500/10 light:bg-blue-50/50 border border-blue-500/30 dark:border-blue-500/30 light:border-blue-200 rounded-lg p-4 mb-4">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 dark:bg-blue-500/20 light:bg-blue-100 flex items-center justify-center">
                                  <Lightbulb size={16} className="text-blue-400 dark:text-blue-400 light:text-blue-500" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-bold dark:text-blue-300 light:text-blue-700 mb-1">
                                    Why this career matches you
                                  </h4>
                                  <p className="text-xs dark:text-gray-300 light:text-gray-600 leading-relaxed">
                                    Based on your skills and test scores, this career is a great fit!
                                    The skills below had the biggest impact on your match.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Top 3 Skills - SIMPLE */}
                            {topFactors.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="text-sm font-bold dark:text-white light:text-gray-700 flex items-center gap-2">
                                  <span>🌟</span> Your Top Matching Skills
                                </h4>
                                {topFactors.map((factor, factorIdx) => {
                                  const percentage = factor.contribution_percentage || 0;

                                  return (
                                    <div key={factorIdx} className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-gray-50/50 rounded-lg p-4 border border-gray-700/30 dark:border-gray-700/30 light:border-gray-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold dark:text-white light:text-gray-700">{factor.feature}</span>
                                        <span className="text-lg font-black text-emerald-400 dark:text-emerald-400 light:text-emerald-500">
                                          {percentage.toFixed(0)}%
                                        </span>
                                      </div>
                                      <div className="w-full bg-gray-800/80 dark:bg-gray-800/80 light:bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${Math.min(percentage, 100)}%` }}
                                          transition={{ duration: 1, delay: factorIdx * 0.15 }}
                                          className="h-3 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-primary-400"
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                                <p className="text-xs dark:text-gray-500 light:text-gray-500 italic text-center mt-2">
                                  💡 Higher percentage = stronger match!
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Advanced Details Toggle Button - Bottom of Default View */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <button
                onClick={() => setShowAdvancedDetails(!showAdvancedDetails)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                  showAdvancedDetails
                    ? 'dark:bg-gray-800/60 light:bg-white dark:hover:bg-gray-800/80 light:hover:bg-gray-100 dark:text-gray-300 light:text-gray-900 dark:shadow-none light:shadow-md'
                    : 'dark:bg-gray-800/40 light:bg-white dark:hover:bg-gray-800/60 light:hover:bg-gray-100 dark:text-gray-400 light:text-gray-900 dark:hover:text-gray-300 light:hover:text-gray-900 dark:shadow-none light:shadow-md'
                }`}
              >
                {showAdvancedDetails ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span>Hide Advanced Details</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span>Show Advanced Details</span>
                  </>
                )}
              </button>

              {/* Helper Text */}
              {!showAdvancedDetails && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-xs dark:text-gray-500 light:text-gray-500 mt-2"
                >
                  View detailed career breakdowns, skills radar, and performance metrics
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Right Sidebar - Charts & Stats */}
          <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">

            {/* How Confident Are We? Card */}
            {validation && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 border-2 border-primary-500/30 rounded-2xl p-5 shadow-lg"
              >
                <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                  <Shield className="text-primary-400" size={20} />
                  🎓 How Good Are These Matches?
                </h3>

                {/* Confidence Score - Big Display */}
                <div className="mb-4 p-5 bg-gradient-to-br from-primary-500/20 to-emerald-500/10 border-2 border-primary-500/40 rounded-xl text-center">
                  <div className="text-5xl font-black text-primary-400 mb-2">
                    {validation.confidence_score || 'N/A'}%
                  </div>
                  <div className="text-sm font-bold text-white mb-1">
                    {validation.confidence_level || 'N/A'} Confidence!
                  </div>
                  <div className="text-xs text-gray-400">
                    {validation.confidence_score >= 80 ? '🎉 Super reliable matches!' :
                     validation.confidence_score >= 65 ? '👍 Great matches for you!' :
                     '💡 Good starting point!'}
                  </div>
                </div>

                {/* Quick Stats - Simplified */}
                {validation.metrics && (
                  <div className="space-y-2 mb-4">
                    <div className="bg-gray-800/40 border border-gray-700/30 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-sm text-gray-300">Average Match Score</span>
                      <span className="text-lg font-bold text-white">
                        {validation.metrics.average_score ?? 'N/A'}%
                      </span>
                    </div>
                    <div className="bg-gray-800/40 border border-gray-700/30 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-sm text-gray-300">Your Strong Skills</span>
                      <span className="text-lg font-bold text-emerald-400">
                        {validation.metrics.strong_profile_features || 'N/A'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Simple Explanation */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    <span className="font-bold text-blue-300">💡 What does this mean?</span><br />
                    {validation.confidence_score >= 80
                      ? "We're very confident these careers are perfect for you based on your assessment results!"
                      : validation.confidence_score >= 65
                      ? "These careers match your skills well. Keep developing your strengths!"
                      : "These are good starting points. Focus on building key skills for your chosen path!"}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Top Match Analysis */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-5"
            >
              <h3 className="text-lg font-black bg-gradient-to-r from-gray-900 to-primary-600 dark:from-white dark:to-primary-200 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                <PieChart className="text-primary-400 dark:text-primary-400" size={20} />
                <span>Top Match</span>
              </h3>
              <div className="relative h-48 mb-4">
                <canvas ref={matchDoughnutRef}></canvas>
                {predictions?.job_matches?.[0] && (
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="text-3xl font-bold text-primary-400">
                      {predictions.job_matches[0].match_score}
                    </div>
                    <div className="text-xs text-gray-400">Match</div>
                  </div>
                )}
              </div>
              {predictions?.job_matches?.[0] && (
                <div className="text-center">
                  <p className="text-sm font-bold text-white mb-1">
                    {predictions.job_matches[0].job_role}
                  </p>
                  <p className="text-xs text-gray-400">
                    {predictions.job_matches[0].category}
                  </p>
                </div>
              )}
            </motion.div>

            {/* ADVANCED DETAILS - Skills Radar */}
            {showAdvancedDetails && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-5"
              >
                <h3 className="text-lg font-black bg-gradient-to-r from-gray-900 to-primary-600 dark:from-white dark:to-primary-200 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                  <Activity className="text-primary-400 dark:text-primary-400" size={20} />
                  <span>Skills Radar</span>
                </h3>
                <div className="h-64">
                  <canvas ref={skillsRadarRef}></canvas>
                </div>
              </motion.div>
            )}

            {/* ADVANCED DETAILS - Performance Bar */}
            {showAdvancedDetails && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
                className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-5"
              >
                <h3 className="text-lg font-black bg-gradient-to-r from-gray-900 to-primary-600 dark:from-white dark:to-primary-200 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                  <BarChart3 className="text-primary-400 dark:text-primary-400" size={20} />
                  <span>Performance Metrics</span>
                </h3>
                <div className="h-64">
                  <canvas ref={performanceBarRef}></canvas>
                </div>
              </motion.div>
            )}

            {/* Strengths - Always Visible */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/70 border border-emerald-500/30 rounded-2xl p-5"
            >
              <h3 className="text-lg font-black bg-gradient-to-r from-gray-900 to-emerald-600 dark:from-white dark:to-emerald-200 bg-clip-text text-transparent mb-3 flex items-center gap-2">
                <Award className="text-emerald-500 dark:text-emerald-400" size={20} />
                <span>Top Strengths</span>
              </h3>
              <div className="space-y-2">
                {strengths.slice(0, 3).map((strength, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10">
                    <span className="text-sm text-white font-medium truncate">{strength.name}</span>
                    <span className="text-sm text-emerald-400 font-bold ml-2">{strength.score}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Growth Areas - Always Visible */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-gray-900/70 border border-yellow-500/30 rounded-2xl p-5"
            >
              <h3 className="text-lg font-black bg-gradient-to-r from-gray-900 to-yellow-600 dark:from-white dark:to-yellow-200 bg-clip-text text-transparent mb-3 flex items-center gap-2">
                <AlertCircle className="text-yellow-500 dark:text-yellow-400" size={20} />
                <span>Growth Areas</span>
              </h3>
              <div className="space-y-2">
                {weaknesses.slice(0, 3).map((weakness, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-yellow-500/10">
                    <span className="text-sm text-white font-medium truncate">{weakness.name}</span>
                    <span className="text-sm text-yellow-400 font-bold ml-2">{weakness.score}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Download Button */}
            <button 
              onClick={handleDownloadReport}
              className="print:hidden w-full py-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-semibold hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2">
              <Download size={18} />
              Download Report
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <DashboardFooter />

      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 1cm;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            box-shadow: none !important;
          }

          html, body, body > div, #root {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Hide non-essential elements */
          .print\\:hidden,
          nav, footer, button, canvas,
          .lg\\:col-span-1,
          [class*="Advanced"],
          [class*="Compare"] {
            display: none !important;
          }

          main {
            max-width: 100% !important;
            padding: 0.3cm !important;
            background: white !important;
          }

          /* Remove ALL colored backgrounds */
          * {
            background-image: none !important;
          }

          [class*="bg-"],
          [class*="from-"],
          [class*="to-"],
          [class*="via-"],
          .bg-gradient-to-b,
          .bg-gradient-to-r,
          .bg-gradient-to-br,
          .bg-gradient-to-l {
            background: white !important;
            background-color: white !important;
          }

          /* Specific overrides for blue sections */
          .bg-blue-500,
          .bg-blue-400,
          .bg-cyan-500,
          .bg-cyan-400,
          .bg-primary-500,
          .bg-primary-400 {
            background: white !important;
            color: #1f2937 !important;
          }

          /* Typography - Compact */
          h1 { font-size: 14pt !important; margin: 2pt 0 !important; color: #1f2937 !important; }
          h2 { font-size: 11pt !important; margin: 2pt 0 !important; color: #374151 !important; }
          h3 { font-size: 9pt !important; margin: 1pt 0 !important; color: #4b5563 !important; }
          p, span, div { font-size: 7pt !important; line-height: 1.1 !important; color: #1f2937 !important; }

          /* Text colors - all dark */
          .text-white,
          .text-gray-100,
          .text-gray-200,
          .text-gray-300,
          .text-gray-400,
          .text-primary-400,
          .text-blue-400,
          .text-cyan-400 {
            color: #1f2937 !important;
          }

          .text-emerald-400, .text-emerald-500 { color: #059669 !important; }
          .text-yellow-400, .text-yellow-500 { color: #d97706 !important; }

          /* Borders */
          [class*="border"] {
            border-color: #d1d5db !important;
            border-width: 0.5pt !important;
          }

          .rounded-xl, .rounded-2xl, .rounded-lg, .rounded-full {
            border-radius: 3pt !important;
            padding: 4pt !important;
            margin: 2pt 0 !important;
          }

          /* Compact spacing */
          .p-6, .p-5, .p-4, .p-3 { padding: 4pt !important; }
          .m-6, .m-5, .m-4, .m-3 { margin: 2pt !important; }
          .mb-6, .mb-5, .mb-4, .mb-3 { margin-bottom: 2pt !important; }
          .mt-6, .mt-5, .mt-4, .mt-3 { margin-top: 2pt !important; }
          .gap-6, .gap-4, .gap-3, .gap-2 { gap: 2pt !important; }
          .space-y-6 > *, .space-y-4 > *, .space-y-3 > * { margin: 2pt 0 !important; }

          /* Grid - 4 columns for summary */
          .grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4 {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 3pt !important;
          }

          .lg\\:col-span-2 {
            width: 100% !important;
          }

          /* Icons */
          svg { width: 8pt !important; height: 8pt !important; }

          /* Match scores */
          [class*="text-5xl"], [class*="text-4xl"], [class*="text-3xl"] {
            font-size: 12pt !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
          }

          [class*="text-2xl"] { font-size: 10pt !important; }
          [class*="text-xl"] { font-size: 9pt !important; }
          [class*="text-lg"] { font-size: 8pt !important; }
          [class*="text-sm"], [class*="text-xs"] { font-size: 6.5pt !important; }

          /* Progress bars - grayscale */
          [class*="bg-gradient"] {
            background: #9ca3af !important;
          }

          /* Show only top 3 careers */
          .space-y-4 > div:nth-child(n+4) {
            display: none !important;
          }

          /* Force expand career details in print */
          .career-details-collapse {
            height: auto !important;
            opacity: 1 !important;
            overflow: visible !important;
            display: block !important;
          }

          /* Hide "Show me why" toggle buttons */
          button[class*="rounded-lg"][class*="from-primary"] {
            display: none !important;
          }

          /* Hide comparison checkboxes */
          button[title*="comparison"] {
            display: none !important;
          }

          /* Hide animations */
          [class*="motion"], .motion-div {
            animation: none !important;
            transform: none !important;
          }

          /* Professional header border */
          .motion-div:first-of-type {
            border-bottom: 1.5pt solid #374151 !important;
            padding-bottom: 4pt !important;
            margin-bottom: 6pt !important;
          }

          /* PRINT HEADER with Logo - Show only this */
          .print-header {
            display: block !important;
            padding: 0 !important;
            margin-bottom: 8pt !important;
          }

          .print-header .flex {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
          }

          .print-header .gap-3 {
            gap: 6pt !important;
          }

          .print-header .gap-4 {
            gap: 8pt !important;
          }

          /* Logo styling */
          .print-logo {
            width: 32pt !important;
            height: auto !important;
          }

          .print-logo path {
            stroke: #1f2937 !important;
          }

          /* Hide OLD screen header completely */
          .print\\:hidden {
            display: none !important;
          }

          /* Page break control */
          .lg\\:grid-cols-3 { display: block !important; }
          * { page-break-inside: avoid !important; }
        }
      `}</style>

      {/* Career Comparison Modal - Mobile Optimized */}
      <AnimatePresence>
        {showComparisonModal && selectedForComparison.length >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 sm:p-4"
            onClick={() => setShowComparisonModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border-2 border-primary-500/30 rounded-xl sm:rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header - Mobile Optimized */}
              <div className="flex items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-700/50">
                <div className="flex-1 pr-2">
                  <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="hidden sm:inline">Comparing Your Career Options</span>
                    <span className="sm:hidden">Compare Careers</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1 hidden sm:block">Side-by-side comparison to help you decide</p>
                </div>
                <button
                  onClick={() => setShowComparisonModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                >
                  <X size={20} className="sm:w-6 sm:h-6 text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Modal Body - Scrollable & Mobile Optimized */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-6">
                <div className={`grid gap-3 sm:gap-6 ${
                  selectedForComparison.length === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 lg:grid-cols-3 md:grid-cols-2'
                }`}>
                  {selectedForComparison.map((careerIdx) => {
                    const match = predictions.job_matches[careerIdx];
                    const explanation = detailedExplanations[careerIdx];
                    if (!match || !explanation) return null;

                    return (
                      <div key={careerIdx} className="bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl p-4 sm:p-5">
                        {/* Career Header - Mobile Optimized */}
                        <div className="text-center mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-primary-500/20 flex items-center justify-center">
                            <span className="text-lg sm:text-xl font-bold text-primary-400">#{careerIdx + 1}</span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-white mb-1">{match.job_role}</h3>
                          <p className="text-xs text-gray-400">{match.category}</p>
                        </div>

                        {/* Match Score - Mobile Optimized */}
                        <div className="bg-gradient-to-br from-primary-500/20 to-emerald-500/10 border border-primary-500/30 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                          <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-black text-primary-400 mb-1">{match.match_score}</div>
                            <div className="text-xs text-gray-400">Match Score</div>
                          </div>
                          <div className="mt-2 sm:mt-3 bg-gray-800/50 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-primary-400"
                              style={{ width: match.match_score }}
                            />
                          </div>
                        </div>

                        {/* Your Strengths - Mobile Optimized */}
                        {explanation.your_strengths && explanation.your_strengths.length > 0 && (
                          <div className="mb-3 sm:mb-4">
                            <h4 className="text-xs sm:text-sm font-bold text-emerald-300 mb-2 flex items-center gap-1.5">
                              <Award size={12} className="sm:w-3.5 sm:h-3.5" />
                              Your Strengths
                            </h4>
                            <div className="space-y-1.5">
                              {explanation.your_strengths.slice(0, 3).map((strength, sIdx) => (
                                <div key={sIdx} className="flex items-start gap-2 text-xs text-gray-300">
                                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                                  <span className="leading-relaxed">{strength}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skill Gaps - Mobile Optimized */}
                        {explanation.skill_gaps && explanation.skill_gaps.length > 0 && (
                          <div className="mb-3 sm:mb-4">
                            <h4 className="text-xs sm:text-sm font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                              <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5" />
                              Skills to Learn
                            </h4>
                            <div className="space-y-1.5">
                              {explanation.skill_gaps.slice(0, 3).map((gap, gIdx) => {
                                // Handle both string and object formats
                                const gapText = typeof gap === 'string'
                                  ? gap
                                  : `${gap.skill}: ${gap.current} → needs ${gap.required}+ (ideal: ${gap.ideal})`;
                                return (
                                  <div key={gIdx} className="flex items-start gap-2 text-xs text-gray-300">
                                    <span className="text-amber-400 mt-0.5 flex-shrink-0">•</span>
                                    <span className="leading-relaxed">{gapText}</span>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              {explanation.skill_gaps.length} gap{explanation.skill_gaps.length !== 1 ? 's' : ''} total
                            </div>
                          </div>
                        )}

                        {/* Readiness - Mobile Optimized */}
                        <div className="border-t border-gray-700/50 pt-3 sm:pt-4">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-300 mb-2">Readiness Level</h4>
                          <div className={`px-3 py-2 rounded-lg text-center text-xs sm:text-sm font-bold ${
                            match.readiness === 'READY'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : match.readiness === 'ALMOST_READY'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {match.readiness === 'READY' ? '🟢 Ready to Start' :
                             match.readiness === 'ALMOST_READY' ? '🟡 Almost Ready' :
                             '🟠 Build Skills First'}
                          </div>
                        </div>

                        {/* Top Contributing Factors - Mobile Optimized */}
                        {explanation.top_contributing_factors && explanation.top_contributing_factors.length > 0 && (
                          <div className="border-t border-gray-700/50 pt-3 sm:pt-4 mt-3 sm:mt-4">
                            <h4 className="text-xs sm:text-sm font-bold text-gray-300 mb-2 flex items-center gap-1.5">
                              <Sparkles size={12} className="sm:w-3.5 sm:h-3.5 text-yellow-400" />
                              Top Match Factors
                            </h4>
                            <div className="space-y-2">
                              {explanation.top_contributing_factors.slice(0, 3).map((factor, fIdx) => (
                                <div key={fIdx} className="text-xs">
                                  <div className="flex items-center justify-between mb-1 gap-2">
                                    <span className="text-gray-300 truncate flex-1">{factor.feature}</span>
                                    <span className="text-primary-400 font-bold flex-shrink-0">{factor.contribution_percentage?.toFixed(0) || 0}%</span>
                                  </div>
                                  <div className="bg-gray-700/50 rounded-full h-1.5 sm:h-1">
                                    <div
                                      className="h-1.5 sm:h-1 rounded-full bg-gradient-to-r from-primary-500 to-cyan-400"
                                      style={{ width: `${factor.contribution_percentage || 0}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer - Mobile Optimized */}
              <div className="border-t border-gray-700/50 p-3 sm:p-4 bg-gray-900/50">
                <button
                  onClick={() => setShowComparisonModal(false)}
                  className="w-full px-4 py-2.5 sm:py-3 bg-gray-800 hover:bg-gray-700 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors"
                >
                  Close Comparison
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}