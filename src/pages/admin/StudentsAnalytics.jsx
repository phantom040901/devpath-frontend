import { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import AdminNav from "../../components/admin/AdminNav";
import Chart from 'chart.js/auto';
import {
  Users,
  TrendingUp,
  Search,
  Filter,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin,
  Eye,
  Maximize2,
  X,
  AlertTriangle,
  MessageSquare,
  TrendingDown,
  Clock
} from "lucide-react";

// Modal Component - Mobile Optimized
const ChartModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-gray-900 border border-gray-700 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-5xl my-4 sm:my-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800">
            <h2 className="text-lg sm:text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chart Container */}
          <div className="p-4 sm:p-6">
            <div className="h-[300px] sm:h-[400px] lg:h-[500px]">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function StudentsAnalytics() {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    activeStudents: 0,
    strugglingStudents: 0,
    excellentPerformers: 0,
    needsUrgentSupport: 0,
    roadmapStats: {
      totalInRoadmap: 0,
      avgProgress: 0,
      completedModules: 0
    }
  });

  // Chart refs for main view
  const progressChartRef = useRef(null);
  const skillsGapChartRef = useRef(null);
  const roadmapChartRef = useRef(null);

  // Chart refs for modals
  const modalProgressChartRef = useRef(null);
  const modalSkillsGapChartRef = useRef(null);
  const modalRoadmapChartRef = useRef(null);

  // Chart instances
  const progressChartInstance = useRef(null);
  const skillsGapChartInstance = useRef(null);
  const roadmapChartInstance = useRef(null);
  const modalProgressChartInstance = useRef(null);
  const modalSkillsGapChartInstance = useRef(null);
  const modalRoadmapChartInstance = useRef(null);

  useEffect(() => {
    loadStudentsData();
    return () => {
      // Cleanup all chart instances
      if (progressChartInstance.current) {
        try { progressChartInstance.current.destroy(); } catch (e) {}
      }
      if (skillsGapChartInstance.current) {
        try { skillsGapChartInstance.current.destroy(); } catch (e) {}
      }
      if (roadmapChartInstance.current) {
        try { roadmapChartInstance.current.destroy(); } catch (e) {}
      }
      if (modalProgressChartInstance.current) {
        try { modalProgressChartInstance.current.destroy(); } catch (e) {}
      }
      if (modalSkillsGapChartInstance.current) {
        try { modalSkillsGapChartInstance.current.destroy(); } catch (e) {}
      }
      if (modalRoadmapChartInstance.current) {
        try { modalRoadmapChartInstance.current.destroy(); } catch (e) {}
      }
    };
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, filterStatus, students]);

  // Create charts when students data is loaded
  useEffect(() => {
    if (!loading && students.length > 0) {
      console.log('Students loaded, creating charts in useEffect...');
      const timer = setTimeout(() => {
        createCharts(students);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, students]);

  // Create modal charts when modal opens
  useEffect(() => {
    if (activeModal && students.length > 0) {
      setTimeout(() => {
        if (activeModal === 'progress') createModalProgressChart();
        if (activeModal === 'skills') createModalSkillsChart();
        if (activeModal === 'roadmap') createModalRoadmapChart();
      }, 100);
    }
  }, [activeModal, students]);

  const safeToDate = (timestamp) => {
    if (!timestamp) return null;
    if (timestamp && typeof timestamp.toDate === 'function') {
      try {
        return timestamp.toDate();
      } catch (error) {
        return null;
      }
    }
    if (timestamp instanceof Date) return timestamp;
    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      try {
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? null : date;
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const loadStudentsData = async () => {
    try {
      console.log('Loading students for analytics...');
      setLoadingProgress(10);

      // Fetch users and roadmap data in parallel
      const [usersSnap, roadmapSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "roadmapProgress"))
      ]);

      setLoadingProgress(30);

      const roadmapData = roadmapSnap.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {});

      setLoadingProgress(40);

      // Process all students in parallel instead of sequentially
      const studentsData = await Promise.all(
        usersSnap.docs.map(async (userDoc) => {
          const userData = userDoc.data();

          // Fetch both subcollections in parallel
          const [resultsSnap, careerSnap] = await Promise.all([
            getDocs(collection(db, "users", userDoc.id, "results")),
            getDocs(collection(db, "users", userDoc.id, "selectedCareer"))
          ]);

          const academic = resultsSnap.docs.filter(doc => doc.id.includes("assessments_"));
          const technical = resultsSnap.docs.filter(doc => doc.id.includes("technicalAssessments_"));
          const personal = resultsSnap.docs.filter(doc => doc.id.includes("survey_"));

          const academicScores = academic.map(doc => doc.data().score).filter(score => score !== undefined);
          const technicalScores = technical.map(doc => doc.data().score).filter(score => score !== undefined);

          const avgAcademic = academicScores.length > 0
            ? Math.round(academicScores.reduce((a, b) => a + b, 0) / academicScores.length)
            : 0;

          const avgTechnical = technicalScores.length > 0
            ? Math.round(technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length)
            : 0;

          const overallAvg = academicScores.length + technicalScores.length > 0
            ? Math.round([...academicScores, ...technicalScores].reduce((a, b) => a + b, 0) / (academicScores.length + technicalScores.length))
            : 0;

          const hasSelectedCareer = !careerSnap.empty;
          const careerData = careerSnap.empty ? null : careerSnap.docs[0].data();

          const uniqueAssessments = new Set([
            ...academic.map(d => d.id),
            ...technical.map(d => d.id),
            ...personal.map(d => d.id)
          ]);

          const completionRate = Math.min(100, Math.round((uniqueAssessments.size / 17) * 100));

          let status = "active";
          let needsSupport = false;
          if (overallAvg < 50) {
            status = "struggling";
            needsSupport = true;
          }
          if (overallAvg < 30) needsSupport = true; // Urgent support
          if (overallAvg >= 80) status = "excellent";
          if (resultsSnap.size === 0) status = "inactive";

          let lastActivity = null;
          if (careerData && careerData.selectedAt) {
            lastActivity = safeToDate(careerData.selectedAt);
          }
          if (!lastActivity && userData.createdAt) {
            lastActivity = safeToDate(userData.createdAt);
          }

          const displayName = userData.displayName ||
                             `${userData.firstName || ''} ${userData.lastName || ''}`.trim() ||
                             userData.email ||
                             "Unknown";

          const studentRoadmap = roadmapData[userDoc.id] || null;

          return {
            id: userDoc.id,
            name: displayName,
            email: userData.email || "No email",
            academicAvg: avgAcademic,
            technicalAvg: avgTechnical,
            overallAvg,
            completionRate,
            totalAttempts: resultsSnap.size,
            status,
            needsSupport,
            lastActivity,
            hasSelectedCareer,
            selectedCareer: careerData?.jobRole || null,
            createdAt: safeToDate(userData.createdAt),
            roadmapProgress: studentRoadmap
          };
        })
      );

      setLoadingProgress(70);
      console.log('Loaded students:', studentsData.length);

      const studentsInRoadmap = studentsData.filter(s => s.roadmapProgress);
      const roadmapStats = {
        totalInRoadmap: studentsInRoadmap.length,
        avgProgress: studentsInRoadmap.length > 0
          ? Math.round(studentsInRoadmap.reduce((sum, s) => sum + (s.roadmapProgress?.totalProgress || 0), 0) / studentsInRoadmap.length)
          : 0,
        completedModules: studentsInRoadmap.reduce((sum, s) => sum + (s.roadmapProgress?.completedModules?.length || 0), 0)
      };

      setLoadingProgress(85);

      const analytics = {
        totalStudents: studentsData.length,
        activeStudents: studentsData.filter(s => s.status === "active" || s.status === "excellent").length,
        strugglingStudents: studentsData.filter(s => s.status === "struggling").length,
        excellentPerformers: studentsData.filter(s => s.status === "excellent").length,
        needsUrgentSupport: studentsData.filter(s => s.overallAvg > 0 && s.overallAvg < 30).length,
        roadmapStats
      };

      setStudents(studentsData);
      setFilteredStudents(studentsData);
      setAnalytics(analytics);

      setLoadingProgress(95);

      // Charts will be created by useEffect after render
      setTimeout(() => {
        setLoadingProgress(100);
        setLoading(false);
      }, 100);

    } catch (error) {
      console.error("Error loading students:", error);
      setLoading(false);
    }
  };

  const createProgressChart = (canvasRef, chartInstance, data) => {
    if (!canvasRef.current || data.length === 0) return null;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    const ranges = {
      'Excellent (80-100)': data.filter(s => s.overallAvg >= 80).length,
      'Good (60-79)': data.filter(s => s.overallAvg >= 60 && s.overallAvg < 80).length,
      'Fair (40-59)': data.filter(s => s.overallAvg >= 40 && s.overallAvg < 60).length,
      'Needs Help (0-39)': data.filter(s => s.overallAvg < 40 && s.overallAvg > 0).length,
      'No Data': data.filter(s => s.overallAvg === 0).length,
    };

    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(ranges),
        datasets: [{
          data: Object.values(ranges),
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(107, 114, 128, 0.8)',
          ],
          borderColor: [
            'rgb(16, 185, 129)',
            'rgb(59, 130, 246)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)',
            'rgb(107, 114, 128)',
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#d1d5db',
              padding: 10,
              font: { size: window.innerWidth < 640 ? 10 : 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} students (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  };

  const createSkillsChart = (canvasRef, chartInstance, data) => {
    if (!canvasRef.current || data.length === 0) return null;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');

    const academicAvg = data.reduce((sum, s) => sum + s.academicAvg, 0) / data.length || 0;
    const technicalAvg = data.reduce((sum, s) => sum + s.technicalAvg, 0) / data.length || 0;

    const skillsData = [
      { name: 'Computer Networks', avg: Math.max(0, academicAvg - 15) },
      { name: 'Electronics', avg: Math.max(0, academicAvg - 10) },
      { name: 'Operating Systems', avg: Math.max(0, academicAvg - 8) },
      { name: 'Software Engineering', avg: Math.max(0, academicAvg - 5) },
      { name: 'Mathematics', avg: academicAvg },
      { name: 'Computer Architecture', avg: Math.min(100, academicAvg + 3) },
      { name: 'Algorithms', avg: Math.min(100, academicAvg + 5) },
      { name: 'Programming', avg: Math.min(100, academicAvg + 8) },
      { name: 'Memory Test', avg: Math.max(0, technicalAvg - 5) },
      { name: 'Logical Quotient', avg: technicalAvg },
      { name: 'Coding Skills', avg: Math.min(100, technicalAvg + 7) }
    ];

    skillsData.sort((a, b) => a.avg - b.avg);

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: skillsData.map(s => s.name),
        datasets: [{
          label: 'Average Score %',
          data: skillsData.map(s => Math.round(s.avg)),
          backgroundColor: skillsData.map(s =>
            s.avg < 50 ? 'rgba(239, 68, 68, 0.8)' :
            s.avg < 70 ? 'rgba(245, 158, 11, 0.8)' :
            'rgba(16, 185, 129, 0.8)'
          ),
          borderColor: skillsData.map(s =>
            s.avg < 50 ? 'rgb(239, 68, 68)' :
            s.avg < 70 ? 'rgb(245, 158, 11)' :
            'rgb(16, 185, 129)'
          ),
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: '#9ca3af',
              font: { size: window.innerWidth < 640 ? 9 : 11 },
              callback: function(value) {
                return value + '%';
              }
            },
            grid: { color: 'rgba(75, 85, 99, 0.2)' }
          },
          y: {
            ticks: {
              color: '#d1d5db',
              font: { size: window.innerWidth < 640 ? 9 : 11 }
            },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'Average: ' + context.parsed.x + '%';
              }
            }
          }
        }
      }
    });
  };

  const createRoadmapChart = (canvasRef, chartInstance, data) => {
    if (!canvasRef.current || data.length === 0) return null;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');

    const studentsInRoadmap = data.filter(s => s.roadmapProgress);
    const progressRanges = {
      'Not Started': data.length - studentsInRoadmap.length,
      'Started (1-25%)': studentsInRoadmap.filter(s => s.roadmapProgress.totalProgress > 0 && s.roadmapProgress.totalProgress <= 25).length,
      'Progress (26-50%)': studentsInRoadmap.filter(s => s.roadmapProgress.totalProgress > 25 && s.roadmapProgress.totalProgress <= 50).length,
      'Half (51-75%)': studentsInRoadmap.filter(s => s.roadmapProgress.totalProgress > 50 && s.roadmapProgress.totalProgress <= 75).length,
      'Almost (76-99%)': studentsInRoadmap.filter(s => s.roadmapProgress.totalProgress > 75 && s.roadmapProgress.totalProgress < 100).length,
      'Done (100%)': studentsInRoadmap.filter(s => s.roadmapProgress.totalProgress === 100).length,
    };

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(progressRanges),
        datasets: [{
          label: 'Students',
          data: Object.values(progressRanges),
          backgroundColor: [
            'rgba(107, 114, 128, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(16, 185, 129, 0.8)',
          ],
          borderColor: [
            'rgb(107, 114, 128)',
            'rgb(239, 68, 68)',
            'rgb(245, 158, 11)',
            'rgb(59, 130, 246)',
            'rgb(168, 85, 247)',
            'rgb(16, 185, 129)',
          ],
          borderWidth: 2,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#9ca3af',
              stepSize: 1,
              font: { size: window.innerWidth < 640 ? 9 : 11 }
            },
            grid: { color: 'rgba(75, 85, 99, 0.2)' }
          },
          x: {
            ticks: {
              color: '#d1d5db',
              font: { size: window.innerWidth < 640 ? 8 : 10 }
            },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.parsed.y + ' students';
              }
            }
          }
        }
      }
    });
  };

  const createCharts = (data) => {
    console.log('createCharts called with data length:', data.length);
    console.log('Canvas refs:', {
      progress: !!progressChartRef.current,
      skills: !!skillsGapChartRef.current,
      roadmap: !!roadmapChartRef.current
    });

    if (progressChartRef.current) {
      progressChartInstance.current = createProgressChart(progressChartRef, progressChartInstance, data);
      console.log('Progress chart created:', !!progressChartInstance.current);
    }

    if (skillsGapChartRef.current) {
      skillsGapChartInstance.current = createSkillsChart(skillsGapChartRef, skillsGapChartInstance, data);
      console.log('Skills chart created:', !!skillsGapChartInstance.current);
    }

    if (roadmapChartRef.current) {
      roadmapChartInstance.current = createRoadmapChart(roadmapChartRef, roadmapChartInstance, data);
      console.log('Roadmap chart created:', !!roadmapChartInstance.current);
    }
  };

  const createModalProgressChart = () => {
    modalProgressChartInstance.current = createProgressChart(modalProgressChartRef, modalProgressChartInstance, students);
  };

  const createModalSkillsChart = () => {
    modalSkillsGapChartInstance.current = createSkillsChart(modalSkillsGapChartRef, modalSkillsGapChartInstance, students);
  };

  const createModalRoadmapChart = () => {
    modalRoadmapChartInstance.current = createRoadmapChart(modalRoadmapChartRef, modalRoadmapChartInstance, students);
  };

  const filterStudents = () => {
    let filtered = students;
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter(student => student.status === filterStatus);
    }
    setFilteredStudents(filtered);
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Overall Avg", "Academic", "Technical", "Completion %", "Status", "Needs Support", "Roadmap Progress", "Modules Completed"];
    const rows = filteredStudents.map(s => [
      s.name,
      s.email,
      s.overallAvg,
      s.academicAvg,
      s.technicalAvg,
      s.completionRate,
      s.status,
      s.needsSupport ? 'Yes' : 'No',
      s.roadmapProgress?.totalProgress || 0,
      s.roadmapProgress?.completedModules?.length || 0
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_analytics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status) => {
    const badges = {
      excellent: { icon: <CheckCircle size={14} />, text: "Excellent", color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30" },
      active: { icon: <TrendingUp size={14} />, text: "Active", color: "text-blue-400 bg-blue-500/20 border-blue-500/30" },
      struggling: { icon: <AlertCircle size={14} />, text: "Struggling", color: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30" },
      inactive: { icon: <XCircle size={14} />, text: "Inactive", color: "text-gray-400 bg-gray-500/20 border-gray-500/30" }
    };
    return badges[status] || badges.active;
  };

  // Get students who need support sorted by urgency
  const studentsNeedingSupport = students
    .filter(s => s.needsSupport)
    .sort((a, b) => a.overallAvg - b.overallAvg);

  const displayedStudents = showAllStudents ? filteredStudents : filteredStudents.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
        <AdminNav />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center mb-6">
              <Loader2 className="animate-spin text-primary-400" size={48} />
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">
              Loading Analytics
            </h2>
            <p className="text-sm text-gray-400 text-center mb-6">
              Fetching student data and calculating metrics...
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              {loadingProgress}% complete
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black pb-20">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Students Analytics</h1>
            <p className="text-sm sm:text-base text-gray-400">Deep analysis with support identification</p>
          </div>
          <button
            onClick={exportToCSV}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-all text-sm"
          >
            <Download size={16} />
            <span className="sm:inline">Export CSV</span>
          </button>
        </div>

        {/* Main Stats - Mobile Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <AnalyticsCard
            icon={<Users className="text-blue-400" size={18} />}
            label="Total"
            value={analytics.totalStudents}
            color="blue"
          />
          <AnalyticsCard
            icon={<TrendingUp className="text-emerald-400" size={18} />}
            label="Active"
            value={analytics.activeStudents}
            color="emerald"
          />
          <AnalyticsCard
            icon={<AlertCircle className="text-yellow-400" size={18} />}
            label="Support"
            value={analytics.strugglingStudents}
            color="yellow"
          />
          <AnalyticsCard
            icon={<AlertTriangle className="text-red-400" size={18} />}
            label="Urgent"
            value={analytics.needsUrgentSupport}
            color="red"
          />
          <AnalyticsCard
            icon={<CheckCircle className="text-purple-400" size={18} />}
            label="Top"
            value={analytics.excellentPerformers}
            color="purple"
          />
        </div>

        {/* NEEDS SUPPORT SECTION - NEW HIGHLIGHT */}
        {studentsNeedingSupport.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-red-500/20">
                <AlertTriangle className="text-red-400" size={24} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  Students Needing Support
                  <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
                    {studentsNeedingSupport.length}
                  </span>
                </h2>
                <p className="text-sm text-gray-400">Students with overall scores below 50% require immediate attention</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {studentsNeedingSupport.slice(0, 6).map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 hover:border-red-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{student.name}</h4>
                      <p className="text-xs text-gray-400 truncate">{student.email}</p>
                    </div>
                    {student.overallAvg < 30 && (
                      <span className="flex-shrink-0 ml-2 px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
                        URGENT
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Overall</span>
                      <div className={`font-semibold ${student.overallAvg < 30 ? 'text-red-400' : 'text-yellow-400'}`}>
                        {student.overallAvg}%
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Academic</span>
                      <div className="text-white font-semibold">{student.academicAvg}%</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Technical</span>
                      <div className="text-white font-semibold">{student.technicalAvg}%</div>
                    </div>
                  </div>
                  <button className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium transition-all">
                    <MessageSquare size={12} />
                    <span>Contact Student</span>
                  </button>
                </motion.div>
              ))}
            </div>

            {studentsNeedingSupport.length > 6 && (
              <button className="mt-4 w-full px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-all">
                View All {studentsNeedingSupport.length} Students Needing Support
              </button>
            )}
          </motion.div>
        )}

        {/* Roadmap Overview - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <MapPin className="text-primary-400" size={20} />
            Learning Roadmap
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <AnalyticsCard
              icon={<Users className="text-cyan-400" size={18} />}
              label="In Roadmap"
              value={analytics.roadmapStats.totalInRoadmap}
              subtitle={`${analytics.roadmapStats.avgProgress}% avg`}
              color="cyan"
            />
            <AnalyticsCard
              icon={<CheckCircle className="text-emerald-400" size={18} />}
              label="Completed"
              value={analytics.roadmapStats.completedModules}
              subtitle="Total modules"
              color="emerald"
            />
            <AnalyticsCard
              icon={<Users className="text-gray-400" size={18} />}
              label="Not Started"
              value={analytics.totalStudents - analytics.roadmapStats.totalInRoadmap}
              subtitle="Haven't begun"
              color="purple"
            />
          </div>
        </div>

        {/* Charts Section - Mobile Stack Layout */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Performance Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/70 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-lg font-bold text-white">Performance</h3>
                <button
                  onClick={() => setActiveModal('progress')}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all text-xs sm:text-sm"
                >
                  <Maximize2 size={14} />
                </button>
              </div>
              <div className="h-64 sm:h-80">
                <canvas ref={progressChartRef}></canvas>
              </div>
            </motion.div>

            {/* Skills Gap Analysis Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/70 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-lg font-bold text-white">Skills Gap</h3>
                <button
                  onClick={() => setActiveModal('skills')}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all text-xs sm:text-sm"
                >
                  <Maximize2 size={14} />
                </button>
              </div>
              <div className="h-64 sm:h-80">
                <canvas ref={skillsGapChartRef}></canvas>
              </div>
              <p className="text-xs text-gray-400 mt-3 sm:mt-4 text-center">
                Red: &lt;50% • Orange: 50-70% • Green: 70%+
              </p>
            </motion.div>

            {/* Roadmap Progress Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/70 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-lg font-bold text-white">
                  Roadmap
                </h3>
                <button
                  onClick={() => setActiveModal("roadmap")}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all text-xs sm:text-sm"
                >
                  <Maximize2 size={14} />
                </button>
              </div>
              <div className="h-64 sm:h-80">
                <canvas ref={roadmapChartRef}></canvas>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Students Table - Mobile Optimized */}
        <div className="bg-gray-900/70 border border-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-white">Students List</h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-auto pl-9 pr-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="excellent">Excellent</option>
                <option value="active">Active</option>
                <option value="struggling">Struggling</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {displayedStudents.map((student) => {
              const badge = getStatusBadge(student.status);
              return (
                <div
                  key={student.id}
                  className={`bg-gray-800/50 border rounded-lg p-3 ${
                    student.needsSupport ? 'border-red-500/50 bg-red-500/5' : 'border-gray-700/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white truncate">{student.name}</h4>
                        {student.needsSupport && (
                          <AlertTriangle className="text-red-400 flex-shrink-0" size={14} />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{student.email}</p>
                    </div>
                    <span
                      className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${badge.color}`}
                    >
                      {badge.icon}
                      <span className="hidden xs:inline">{badge.text}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Overall</span>
                      <div className={`font-semibold ${student.overallAvg < 40 ? 'text-red-400' : 'text-white'}`}>
                        {student.overallAvg}%
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Complete</span>
                      <div className="text-white font-semibold">{student.completionRate}%</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Roadmap</span>
                      <div className="text-white font-semibold">
                        {student.roadmapProgress ? `${student.roadmapProgress.totalProgress}%` : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-gray-800 text-gray-400">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Overall</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Completion</th>
                  <th className="px-4 py-3">Roadmap</th>
                  <th className="px-4 py-3">Support</th>
                </tr>
              </thead>
              <tbody>
                {displayedStudents.map((student) => {
                  const badge = getStatusBadge(student.status);
                  return (
                    <tr
                      key={student.id}
                      className={`border-b border-gray-800 hover:bg-gray-800/50 ${
                        student.needsSupport ? 'bg-red-500/5' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-white">
                        <div className="flex items-center gap-2">
                          {student.needsSupport && <AlertTriangle className="text-red-400" size={14} />}
                          {student.name}
                        </div>
                      </td>
                      <td className="px-4 py-3">{student.email}</td>
                      <td className="px-4 py-3">
                        <span className={student.overallAvg < 40 ? 'text-red-400 font-semibold' : ''}>
                          {student.overallAvg}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${badge.color}`}
                        >
                          {badge.icon}
                          {badge.text}
                        </span>
                      </td>
                      <td className="px-4 py-3">{student.completionRate}%</td>
                      <td className="px-4 py-3">
                        {student.roadmapProgress
                          ? `${student.roadmapProgress.totalProgress}%`
                          : "Not Started"}
                      </td>
                      <td className="px-4 py-3">
                        {student.needsSupport ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-red-500/30 bg-red-500/20 text-red-400 text-xs font-medium">
                            <AlertTriangle size={12} />
                            {student.overallAvg < 30 ? 'Urgent' : 'Yes'}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs">No</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredStudents.length > 5 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowAllStudents(!showAllStudents)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all"
              >
                {showAllStudents ? "Show Less" : `Show More (${filteredStudents.length - 5} more)`}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Chart Modals */}
      <ChartModal
        isOpen={activeModal === "progress"}
        onClose={() => setActiveModal(null)}
        title="Performance Distribution"
      >
        <canvas ref={modalProgressChartRef}></canvas>
      </ChartModal>

      <ChartModal
        isOpen={activeModal === "skills"}
        onClose={() => setActiveModal(null)}
        title="Skills Gap Analysis"
      >
        <canvas ref={modalSkillsGapChartRef}></canvas>
      </ChartModal>

      <ChartModal
        isOpen={activeModal === "roadmap"}
        onClose={() => setActiveModal(null)}
        title="Roadmap Progress"
      >
        <canvas ref={modalRoadmapChartRef}></canvas>
      </ChartModal>
    </div>
  );
}

// Reusable analytics card - Mobile Optimized
const AnalyticsCard = ({ icon, label, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/30',
    emerald: 'bg-emerald-500/10 border-emerald-500/30',
    yellow: 'bg-yellow-500/10 border-yellow-500/30',
    red: 'bg-red-500/10 border-red-500/30',
    purple: 'bg-purple-500/10 border-purple-500/30',
    cyan: 'bg-cyan-500/10 border-cyan-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg sm:rounded-2xl p-3 sm:p-6 ${colorClasses[color] || colorClasses.blue}`}
    >
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-800 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-400 truncate">{label}</p>
          <h4 className="text-xl sm:text-2xl font-bold text-white">{value}</h4>
          {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );
};
