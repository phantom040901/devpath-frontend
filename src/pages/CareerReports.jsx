import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthContext";
import DashNav from "../components/dashboard/DashboardNav";
import DashboardFooter from "../components/dashboard/DashboardFooter";
import { motion } from "framer-motion";
import Chart from 'chart.js/auto';
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
  ArrowRight
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
function ReadinessCard({ icon, label, value, subtitle, gradient, border }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${gradient} border ${border} rounded-2xl p-5`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-lg bg-gray-900/50">
          {icon}
        </div>
      </div>
      <div className="text-xs font-bold text-gray-300 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-2xl font-extrabold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-400">{subtitle}</div>
    </motion.div>
  );
}

// Career Match Card with job-specific insights
function CareerMatchCard({ match, reportData, rank }) {
  const isSelected = match.isSelected || false;
  
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
    <div className={`rounded-xl p-5 border transition-all ${
      isSelected 
        ? 'bg-gradient-to-br from-primary-500/10 via-emerald-500/5 to-transparent border-primary-500/60 ring-2 ring-primary-500/40 shadow-lg shadow-primary-500/20' 
        : 'bg-gray-800/40 border-gray-700/30 hover:bg-gray-800/50 hover:border-gray-600/40'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${badgeStyles.bg} ring-2 ${badgeStyles.ring}`}>
            {isSelected ? (
              <CheckCircle2 className={`${badgeStyles.text}`} size={20} />
            ) : (
              <span className={`text-base font-bold ${badgeStyles.text}`}>#{rank}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className={`text-lg font-bold ${isSelected ? 'text-primary-300' : 'text-white'}`}>
                {match.job_role}
              </h3>
              {isSelected && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-500/30 border border-primary-500/50">
                  <span className="text-xs font-bold text-primary-300">Your Selected Path</span>
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">{match.category}</p>
          </div>
        </div>
        <div className="text-right ml-3">
          <div className={`text-2xl font-bold ${isSelected ? 'text-primary-400' : 'text-gray-400'}`}>
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

      {/* Why This Career */}
      <div className={`border rounded-lg p-4 ${
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
  const reportRef = useRef(null);
  
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
  }, [reportData, predictions, hasSelectedCareer]);

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

      try {
        const response = await fetch("https://devpath-backend.onrender.com/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          
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
        }
      } catch (err) {
        console.error("API call failed:", err);
        
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
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-emerald-400 text-primary-1300 font-bold hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Go to Career Matches</span>
                  <ArrowRight size={20} />
                </button>
                
                <button
                  onClick={() => navigate('/assessments')}
                  className="px-8 py-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-all border border-gray-700"
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
      <DashNav />

      <main ref={reportRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 w-full flex-1 space-y-6">
        
        {/* Report Header with Student Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-emerald-500/10 border border-primary-500/30 rounded-3xl p-6"
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
              className="print:hidden px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-emerald-400 text-primary-1300 font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-3 whitespace-nowrap"
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>
        </motion.div>

        {/* Executive Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <ReadinessCard
            icon={<Trophy className="text-yellow-400" size={24} />}
            label="Career Readiness"
            value={readiness.level}
            subtitle={readiness.description}
            gradient={`from-${readiness.color}-500/20 to-${readiness.color}-600/20`}
            border={`border-${readiness.color}-500/30`}
          />
          <ReadinessCard
            icon={<BookOpen className="text-blue-400" size={24} />}
            label="Core Knowledge"
            value={strengths.length > 0 ? strengths[0].name.split(' ')[0] : "N/A"}
            subtitle="Top Strength Area"
            gradient="from-blue-500/20 to-cyan-600/20"
            border="border-blue-500/30"
          />
          <ReadinessCard
            icon={<Zap className="text-purple-400" size={24} />}
            label="Skills Mastered"
            value={strengths.filter(s => s.score >= 75).length + "/9"}
            subtitle="Advanced Proficiency"
            gradient="from-purple-500/20 to-pink-600/20"
            border="border-purple-500/30"
          />
          <ReadinessCard
            icon={<Users className="text-emerald-400" size={24} />}
            label="Team Fit"
            value={reportData?.payload?.team_exp === "yes" ? "High" : "Developing"}
            subtitle="Collaboration Ready"
            gradient="from-emerald-500/20 to-teal-600/20"
            border="border-emerald-500/30"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column - Career Matches */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top 3 Career Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target className="text-primary-400" size={22} />
                  Top 3 Career Matches
                </h2>
                <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                  Based on your assessment
                </span>
              </div>

              <div className="space-y-5">
                {predictions?.job_matches && predictions.job_matches.length > 0 ? (
                  predictions.job_matches.map((match, idx) => (
                    <CareerMatchCard
                      key={idx}
                      match={match}
                      reportData={reportData}
                      rank={idx + 1}
                    />
                  ))
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

            {/* Match Score Doughnut */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <PieChart className="text-primary-400" size={20} />
                Top Match Analysis
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-64">
                  <canvas ref={matchDoughnutRef}></canvas>
                  {predictions?.job_matches?.[0] && (
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <div className="text-4xl font-bold text-primary-400">
                        {predictions.job_matches[0].match_score}
                      </div>
                      <div className="text-xs text-gray-400">Match Score</div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  {predictions?.job_matches?.[0] && (
                    <>
                      <p className="text-xl font-bold text-white mb-2">
                        {predictions.job_matches[0].job_role}
                      </p>
                      <p className="text-sm text-gray-400 mb-4">
                        {predictions.job_matches[0].category}
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        This career path shows the highest compatibility with your skills, interests, and career goals based on comprehensive assessment analysis.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - Charts & Stats */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Skills Radar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-5"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="text-primary-400" size={20} />
                Skills Radar
              </h3>
              <div className="h-64">
                <canvas ref={skillsRadarRef}></canvas>
              </div>
            </motion.div>

            {/* Performance Bar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-5"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="text-primary-400" size={20} />
                Performance Metrics
              </h3>
              <div className="h-64">
                <canvas ref={performanceBarRef}></canvas>
              </div>
            </motion.div>

            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/70 border border-emerald-500/30 rounded-2xl p-5"
            >
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Award className="text-emerald-400" size={20} />
                Top Strengths
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

            {/* Growth Areas */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-gray-900/70 border border-yellow-500/30 rounded-2xl p-5"
            >
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <AlertCircle className="text-yellow-400" size={20} />
                Growth Areas
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
              className="print:hidden w-full py-3 rounded-lg bg-gradient-to-r from-primary-500 to-emerald-400 text-primary-1300 font-semibold hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2">
              <Download size={18} />
              Download Report
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <DashboardFooter />

      <style jsx>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .bg-gradient-to-b,
          .bg-gradient-to-r,
          .bg-gray-900\\/70,
          .bg-gray-800\\/50 {
            background: white !important;
            border: 1px solid #e5e7eb !important;
          }
          .text-white,
          .text-gray-300,
          .text-gray-400 {
            color: #000 !important;
          }
          .border-primary-500\\/30,
          .border-gray-700\\/40 {
            border-color: #d1d5db !important;
          }
        }
      `}</style>
    </div>
  );
}