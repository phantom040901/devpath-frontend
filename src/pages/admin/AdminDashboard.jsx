// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AdminNav from "../../components/admin/AdminNav";
import OnlineUsersWidget from "../../components/admin/OnlineUsersWidget";
import MigrationProgressCard from "../../components/admin/MigrationProgressCard";
import Chart from 'chart.js/auto';
import { useRef } from "react";
import {
  Users,
  TrendingUp,
  BookOpen,
  Award,
  Activity,
  Target,
  Loader2,
  ArrowUp,
  FileText,
  Download
} from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalAssessments: 0,
    averageCompletion: 0,
    totalAttempts: 0,
    averageScore: 0,
  });
  const [topPerformers, setTopPerformers] = useState([]);
  const [allStudentData, setAllStudentData] = useState([]);
  
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    loadDashboardData();
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  // Helper function to safely convert timestamp to Date
  const safeToDate = (timestamp) => {
    if (!timestamp) return null;
    
    if (timestamp && typeof timestamp.toDate === 'function') {
      try {
        return timestamp.toDate();
      } catch (error) {
        return null;
      }
    }
    
    if (timestamp instanceof Date) {
      return timestamp;
    }
    
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

  const loadDashboardData = async () => {
    try {
      // Get all users and assessments in parallel
      const [usersSnap, academicSnap, technicalSnap, personalSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "assessments")),
        getDocs(collection(db, "technicalAssessments")),
        getDocs(collection(db, "personalAssessments"))
      ]);

      const totalStudents = usersSnap.size;
      const totalAssessments = academicSnap.size + technicalSnap.size; // Academic + Technical only

      // Calculate active students (students with results in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Process all students in parallel
      const studentResults = await Promise.all(
        usersSnap.docs.map(async (userDoc) => {
          const userData = userDoc.data();
          const resultsSnap = await getDocs(collection(db, "users", userDoc.id, "results"));

          if (resultsSnap.size === 0) {
            return null;
          }

          // Check for recent activity using safe date conversion
          const recentResults = resultsSnap.docs.filter(doc => {
            const data = doc.data();
            const timestamp = safeToDate(data.submittedAt);

            // If no timestamp, consider as recent (fallback)
            if (!timestamp) return true;

            return timestamp >= thirtyDaysAgo;
          });

          const isActive = recentResults.length > 0 || resultsSnap.docs.some(doc => !doc.data().submittedAt);

          // Calculate student average
          const scores = resultsSnap.docs
            .map(doc => doc.data().score)
            .filter(score => score !== undefined && score !== null);

          if (scores.length === 0) {
            return { isActive, attempts: resultsSnap.size };
          }

          const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
          const displayName = userData.displayName ||
                             `${userData.firstName || ''} ${userData.lastName || ''}`.trim() ||
                             userData.email?.split('@')[0] ||
                             "Unknown";

          return {
            isActive,
            attempts: resultsSnap.size,
            scores,
            performance: {
              name: displayName,
              score: Math.round(avgScore),
              attempts: scores.length
            }
          };
        })
      );

      // Aggregate results
      const activeStudents = studentResults.filter(r => r?.isActive).length;
      const totalAttempts = studentResults.reduce((sum, r) => sum + (r?.attempts || 0), 0);
      const totalScores = studentResults.flatMap(r => r?.scores || []);
      const studentPerformance = studentResults
        .filter(r => r?.performance)
        .map(r => r.performance);

      // Calculate average score
      const averageScore = totalScores.length > 0
        ? Math.round(totalScores.reduce((a, b) => a + b, 0) / totalScores.length)
        : 0;

      // Calculate average completion rate - cap at 100%
      const averageCompletion = totalStudents > 0 && totalAssessments > 0
        ? Math.min(100, Math.round((totalAttempts / (totalStudents * totalAssessments)) * 100))
        : 0;

      // Sort top performers
      const topPerformers = studentPerformance
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setStats({
        totalStudents,
        activeStudents,
        totalAssessments,
        averageCompletion,
        totalAttempts,
        averageScore,
      });

      setTopPerformers(topPerformers);

      // Store all student data for export
      setAllStudentData(studentPerformance);

      // Create chart after a short delay to ensure DOM is ready
      setTimeout(() => createPerformanceChart(studentPerformance), 100);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createPerformanceChart = (studentData) => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartRef.current && studentData.length > 0) {
      const ctx = chartRef.current.getContext('2d');

      // Categorize students by career readiness based on score
      const readinessLevels = {
        'Career Ready': 0,           // 80-100: Exceptional - Ready for mid-senior roles
        'Industry Ready': 0,          // 70-79: Strong - Ready for professional roles
        'Job Ready': 0,               // 60-69: Competent - Ready for entry-level
        'Needs Development': 0,       // 50-59: Basic - Needs targeted training
        'Foundation Level': 0         // 0-49: Developing - Building core skills
      };

      studentData.forEach(student => {
        const score = student.score;
        if (score >= 80) readinessLevels['Career Ready']++;
        else if (score >= 70) readinessLevels['Industry Ready']++;
        else if (score >= 60) readinessLevels['Job Ready']++;
        else if (score >= 50) readinessLevels['Needs Development']++;
        else readinessLevels['Foundation Level']++;
      });

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(readinessLevels),
          datasets: [{
            label: 'Number of Students',
            data: Object.values(readinessLevels),
            backgroundColor: [
              'rgba(16, 185, 129, 0.8)',   // Career Ready - Green
              'rgba(59, 130, 246, 0.8)',   // Industry Ready - Blue
              'rgba(139, 92, 246, 0.8)',   // Job Ready - Purple
              'rgba(245, 158, 11, 0.8)',   // Needs Training - Orange
              'rgba(239, 68, 68, 0.8)'     // Foundation Building - Red
            ],
            borderColor: [
              'rgb(16, 185, 129)',
              'rgb(59, 130, 246)',
              'rgb(139, 92, 246)',
              'rgb(245, 158, 11)',
              'rgb(239, 68, 68)'
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
              ticks: {
                color: '#9ca3af',
                stepSize: 1
              },
              grid: {
                color: 'rgba(75, 85, 99, 0.2)'
              }
            },
            x: {
              ticks: {
                color: '#d1d5db',
                font: {
                  size: 11
                }
              },
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                  return context.parsed.y + ' students (' + percentage + '%)';
                }
              }
            }
          }
        }
      });
    }
  };

  const exportToCSV = () => {
    if (allStudentData.length === 0) {
      alert('No data available to export');
      return;
    }

    // Helper function to determine readiness level
    const getReadinessLevel = (score) => {
      if (score >= 80) return 'Career Ready';
      if (score >= 70) return 'Industry Ready';
      if (score >= 60) return 'Job Ready';
      if (score >= 50) return 'Needs Development';
      return 'Foundation Level';
    };

    // Helper function to get readiness description
    const getReadinessDescription = (score) => {
      if (score >= 80) return 'Ready for mid-senior roles';
      if (score >= 70) return 'Ready for professional roles';
      if (score >= 60) return 'Ready for entry-level positions';
      if (score >= 50) return 'Needs targeted training';
      return 'Building core skills';
    };

    // Create CSV header
    const header = ['Student Name', 'Average Score (%)', 'Number of Assessments', 'Readiness Level', 'Description'];
    
    // Create CSV rows
    const rows = allStudentData
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .map(student => [
        student.name,
        student.score,
        student.attempts,
        getReadinessLevel(student.score),
        getReadinessDescription(student.score)
      ]);

    // Combine header and rows
    const csvContent = [
      header.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `career_readiness_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-400" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Overview of system performance and student analytics</p>
            </div>
            <Link
              to="/admin/resources"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors whitespace-nowrap"
            >
              <FileText size={20} />
              <span>Manage Resources</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="text-blue-400" size={24} />}
            label="Total Students"
            value={stats.totalStudents}
            change={`${stats.activeStudents} active`}
            positive={true}
          />
          <StatCard
            icon={<BookOpen className="text-emerald-400" size={24} />}
            label="Total Assessments"
            value={stats.totalAssessments}
            change={`${stats.totalAttempts} attempts`}
            positive={true}
          />
          <StatCard
            icon={<TrendingUp className="text-purple-400" size={24} />}
            label="Avg. Score"
            value={`${stats.averageScore}%`}
            change={stats.averageScore >= 70 ? "Good performance" : "Needs improvement"}
            positive={stats.averageScore >= 70}
          />
          <StatCard
            icon={<Target className="text-yellow-400" size={24} />}
            label="Avg. Completion"
            value={`${stats.averageCompletion}%`}
            change={stats.averageCompletion >= 60 ? "On track" : "Below target"}
            positive={stats.averageCompletion >= 60}
          />
        </div>

        {/* Migration Progress Card */}
        <div className="mb-6">
          <MigrationProgressCard />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Performance Distribution Chart */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  Career Readiness Analysis
                </h2>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm"
                >
                  <Download size={18} />
                  Export CSV
                </button>
              </div>
              <div className="h-80">
                <canvas ref={chartRef}></canvas>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-gray-400">Career Ready (80-100%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-400">Industry Ready (70-79%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-gray-400">Job Ready (60-69%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-400">Needs Training (50-59%)</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - Top Performers */}
          <div>
            {/* Top Performers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="text-yellow-400" size={24} />
                Top Performers
              </h2>
              <div className="space-y-3">
                {topPerformers.length > 0 ? (
                  topPerformers.map((student, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">
                            {student.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {student.attempts} assessments
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-400">
                          {student.score}%
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No performance data available
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Floating Online Users Widget */}
      <OnlineUsersWidget />
    </div>
  );
}

function StatCard({ icon, label, value, change, positive }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900/70 border border-gray-800 rounded-xl p-5"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-gray-800">
          {icon}
        </div>
        <div className="text-sm font-medium text-gray-400">{label}</div>
      </div>
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      <div className={`text-xs flex items-center gap-1 ${positive ? 'text-emerald-400' : 'text-yellow-400'}`}>
        {positive ? <ArrowUp size={14} /> : <Activity size={14} />}
        {change}
      </div>
    </motion.div>
  );
}