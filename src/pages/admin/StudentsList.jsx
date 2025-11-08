// src/pages/admin/StudentsList.jsx
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../lib/firebase";
import AdminNav from "../../components/admin/AdminNav";
import StudentTable from "../../components/admin/StudentTable";
import { Users, TrendingUp, AlertCircle, CheckCircle, Loader2, GraduationCap } from "lucide-react";

export default function StudentsList() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    struggling: 0,
    excellent: 0
  });

  useEffect(() => {
    loadStudents();
  }, []);

  // Helper function to safely convert timestamp to Date
  const safeToDate = (timestamp) => {
    if (!timestamp) return null;
    
    // Check if it's a Firestore Timestamp with toDate method
    if (timestamp && typeof timestamp.toDate === 'function') {
      try {
        return timestamp.toDate();
      } catch (error) {
        console.error('Error converting timestamp:', error);
        return null;
      }
    }
    
    // Check if it's already a Date object
    if (timestamp instanceof Date) {
      return timestamp;
    }
    
    // Try to convert string or number to Date
    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      try {
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? null : date;
      } catch (error) {
        console.error('Error parsing date:', error);
        return null;
      }
    }
    
    return null;
  };

  const loadStudents = async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));

      // Process all students in parallel using Promise.all
      const studentsData = await Promise.all(
        usersSnap.docs.map(async (userDoc) => {
          const userData = userDoc.data();

          // Fetch results and career in parallel
          const [resultsSnap, careerSnap] = await Promise.all([
            getDocs(collection(db, "users", userDoc.id, "results")),
            getDocs(collection(db, "users", userDoc.id, "selectedCareer"))
          ]);

          // Calculate statistics
          const academic = resultsSnap.docs.filter(doc => doc.id.includes("assessments_"));
          const technical = resultsSnap.docs.filter(doc => doc.id.includes("technicalAssessments_"));
          const personal = resultsSnap.docs.filter(doc => doc.id.includes("survey_"));

          const academicScores = academic
            .map(doc => doc.data().score)
            .filter(score => score !== undefined && score !== null);

          const technicalScores = technical
            .map(doc => doc.data().score)
            .filter(score => score !== undefined && score !== null);

          const avgAcademic = academicScores.length > 0
            ? Math.round(academicScores.reduce((a, b) => a + b, 0) / academicScores.length)
            : 0;

          const avgTechnical = technicalScores.length > 0
            ? Math.round(technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length)
            : 0;

          const overallAvg = academicScores.length + technicalScores.length > 0
            ? Math.round([...academicScores, ...technicalScores].reduce((a, b) => a + b, 0) / (academicScores.length + technicalScores.length))
            : 0;

          // Career data
          const hasSelectedCareer = !careerSnap.empty;
          const careerData = careerSnap.empty ? null : careerSnap.docs[0].data();

          // Calculate completion - total of 17 assessments
          const uniqueAssessments = new Set([
            ...academic.map(d => d.id),
            ...technical.map(d => d.id),
            ...personal.map(d => d.id)
          ]);

          const completionRate = Math.round((uniqueAssessments.size / 17) * 100);

          // Determine status
          let status = "active";
          if (overallAvg < 50) status = "struggling";
          if (overallAvg >= 80) status = "excellent";
          if (resultsSnap.size === 0) status = "inactive";

          // Last activity
          let lastActivity = null;
          if (careerData?.selectedAt) {
            lastActivity = safeToDate(careerData.selectedAt);
          } else if (userData.createdAt) {
            lastActivity = safeToDate(userData.createdAt);
          }

          return {
            id: userDoc.id,
            name: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email || "Unknown",
            email: userData.email || "No email",
            academicAvg: avgAcademic,
            technicalAvg: avgTechnical,
            overallAvg,
            completionRate,
            totalAttempts: resultsSnap.size,
            status,
            lastActivity,
            hasSelectedCareer,
            selectedCareer: careerData?.jobRole || null,
            createdAt: safeToDate(userData.createdAt),
            enrollmentStatus: userData.enrollmentStatus || "current_pwc",
            isEnrolled: userData.isEnrolled !== undefined ? userData.isEnrolled : true
          };
        })
      );

      // Calculate stats
      const stats = {
        total: studentsData.length,
        active: studentsData.filter(s => s.status === "active" || s.status === "excellent").length,
        struggling: studentsData.filter(s => s.status === "struggling").length,
        excellent: studentsData.filter(s => s.status === "excellent").length,
        pwc_students: studentsData.filter(s => s.enrollmentStatus === "current_pwc").length,
        pwc_alumni: studentsData.filter(s => s.enrollmentStatus === "pwc_alumni").length,
        external: studentsData.filter(s => s.enrollmentStatus === "external").length
      };

      console.log('Stats:', stats);

      setStudents(studentsData);
      setStats(stats);

    } catch (error) {
      console.error("Error loading students:", error);
      console.error("Error details:", error.message, error.stack);
    } finally {
      setLoading(false);
    }
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Students Management</h1>
          <p className="text-gray-400">View and manage all registered students</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="text-blue-400" size={20} />}
            label="Total Students"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon={<TrendingUp className="text-emerald-400" size={20} />}
            label="Active Students"
            value={stats.active}
            color="emerald"
          />
          <StatCard
            icon={<AlertCircle className="text-yellow-400" size={20} />}
            label="Needs Support"
            value={stats.struggling}
            color="yellow"
          />
          <StatCard
            icon={<CheckCircle className="text-purple-400" size={20} />}
            label="Top Performers"
            value={stats.excellent}
            color="purple"
          />
        </div>

        {/* Student Table */}
        <StudentTable students={students} loading={loading} />
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color, compact }) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-cyan-600/20 border-blue-500/30',
    emerald: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/30',
    yellow: 'from-yellow-500/20 to-orange-600/20 border-yellow-500/30',
    purple: 'from-purple-500/20 to-pink-600/20 border-purple-500/30'
  };

  if (compact) {
    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg p-3`}>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-gray-900/50">
            {icon}
          </div>
          <div className="text-[10px] font-medium text-gray-400 uppercase">{label}</div>
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-5`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-lg bg-gray-900/50">
          {icon}
        </div>
        <div className="text-xs font-medium text-gray-400 uppercase">{label}</div>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}