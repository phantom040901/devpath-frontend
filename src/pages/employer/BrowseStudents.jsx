// src/pages/employer/BrowseStudents.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployer } from "../../contexts/EmployerContext";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Users,
  Star,
  MapPin,
  Briefcase,
  Code,
  GraduationCap,
  X,
  Loader2,
  Heart,
  Eye,
  ChevronDown,
} from "lucide-react";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, where, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

export default function BrowseStudents() {
  const { employer } = useEmployer();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [savedStudents, setSavedStudents] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    career: "all",
    yearLevel: "all",
    skills: [],
    enrollmentStatus: [],
    minGPA: 0,
  });

  const careers = [
    "Software Engineer",
    "Full-Stack Developer",
    "Data Analyst",
    "Cybersecurity Specialist",
    "Network Administrator",
    "IT Support Specialist",
    "Database Administrator",
    "DevOps Engineer",
  ];

  const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"];

  const topSkills = [
    "JavaScript",
    "Python",
    "Java",
    "React",
    "Node.js",
    "SQL",
    "Git",
    "AWS",
    "Docker",
    "C++",
  ];

  useEffect(() => {
    if (!employer) {
      navigate("/employer/login");
      return;
    }

    // Check if employer is verified
    if (employer.verificationStatus !== "tier1_verified" &&
        employer.verificationStatus !== "tier2_verified") {
      navigate("/employer/dashboard");
      return;
    }

    fetchStudents();
    fetchSavedStudents();
  }, [employer, navigate]);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      // Fetch ALL users (students) - names will be conditionally hidden based on privacy settings
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);

      const studentsList = [];
      for (const doc of snapshot.docs) {
        const userData = doc.data();

        // Fetch career prediction if available
        let careerPrediction = null;
        try {
          const selectedCareerRef = collection(db, `users/${doc.id}/selectedCareer`);
          const careerSnapshot = await getDocs(selectedCareerRef);
          if (!careerSnapshot.empty) {
            careerPrediction = careerSnapshot.docs[0].data();
          }
        } catch (err) {
          console.error("Error fetching career:", err);
        }

        studentsList.push({
          id: doc.id,
          ...userData,
          careerPrediction,
        });
      }

      setStudents(studentsList);
      setFilteredStudents(studentsList);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedStudents = async () => {
    if (!employer?.uid) return;

    try {
      const savedRef = collection(db, `employers/${employer.uid}/savedStudents`);
      const snapshot = await getDocs(savedRef);
      const savedIds = snapshot.docs.map(doc => doc.id);
      setSavedStudents(savedIds);
    } catch (error) {
      console.error("Error fetching saved students:", error);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, students]);

  const applyFilters = () => {
    let filtered = [...students];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.course?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.careerPrediction?.career?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Career filter
    if (filters.career !== "all") {
      filtered = filtered.filter(
        (student) => student.careerPrediction?.career === filters.career
      );
    }

    // Year level filter
    if (filters.yearLevel !== "all") {
      filtered = filtered.filter((student) => student.yearLevel === filters.yearLevel);
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter((student) => {
        const studentSkills = student.skills || [];
        return filters.skills.some((skill) => studentSkills.includes(skill));
      });
    }

    // Enrollment status filter
    if (filters.enrollmentStatus.length > 0) {
      filtered = filtered.filter((student) => {
        const studentStatus = student.enrollmentStatus || "current_pwc";
        return filters.enrollmentStatus.includes(studentStatus);
      });
    }

    setFilteredStudents(filtered);
  };

  const toggleSkillFilter = (skill) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleEnrollmentStatusFilter = (status) => {
    setFilters((prev) => ({
      ...prev,
      enrollmentStatus: prev.enrollmentStatus.includes(status)
        ? prev.enrollmentStatus.filter((s) => s !== status)
        : [...prev.enrollmentStatus, status],
    }));
  };

  const toggleSaveStudent = async (studentId) => {
    if (!employer?.uid) return;

    const isSaved = savedStudents.includes(studentId);
    const savedDocRef = doc(db, `employers/${employer.uid}/savedStudents`, studentId);

    try {
      if (isSaved) {
        // Unsave - remove from Firestore
        await deleteDoc(savedDocRef);
        setSavedStudents((prev) => prev.filter((id) => id !== studentId));
      } else {
        // Save - add to Firestore with timestamp
        await setDoc(savedDocRef, {
          savedAt: new Date().toISOString(),
          studentId: studentId,
        });
        setSavedStudents((prev) => [...prev, studentId]);
      }
    } catch (error) {
      console.error("Error toggling save student:", error);
    }
  };

  const clearFilters = () => {
    setFilters({
      career: "all",
      yearLevel: "all",
      skills: [],
      enrollmentStatus: [],
      minGPA: 0,
    });
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-400" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/70 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/employer/dashboard")}
                className="px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 hover:bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-300 transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Browse Students</h1>
                <p className="text-sm text-gray-400">
                  {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/employer/saved-students")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-gray-800 transition-colors"
            >
              <Heart size={18} />
              Saved ({savedStudents.length})
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, course, or career..."
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-colors ${
                showFilters
                  ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                  : "bg-gray-900/70 border-gray-700 text-gray-300 hover:bg-gradient-to-b from-gray-900 via-gray-950 to-black"
              }`}
            >
              <Filter size={20} />
              Filters
              <ChevronDown
                size={16}
                className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-400 hover:text-blue-400 font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Career Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Career Path
                  </label>
                  <select
                    value={filters.career}
                    onChange={(e) => setFilters({ ...filters, career: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Careers</option>
                    {careers.map((career) => (
                      <option key={career} value={career}>
                        {career}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Year Level
                  </label>
                  <select
                    value={filters.yearLevel}
                    onChange={(e) => setFilters({ ...filters, yearLevel: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Years</option>
                    {yearLevels.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Enrollment Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Enrollment Status ({filters.enrollmentStatus.length} selected)
                  </label>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleEnrollmentStatusFilter("current_pwc")}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                        filters.enrollmentStatus.includes("current_pwc")
                          ? "bg-green-500/20 border border-green-500/40 text-green-400"
                          : "bg-gray-900/70 border border-gray-700 text-gray-400 hover:bg-gray-800"
                      }`}
                    >
                      <GraduationCap className="inline mr-2" size={14} />
                      PWC Students
                    </button>
                    <button
                      onClick={() => toggleEnrollmentStatusFilter("pwc_alumni")}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                        filters.enrollmentStatus.includes("pwc_alumni")
                          ? "bg-blue-500/20 border border-blue-500/40 text-blue-400"
                          : "bg-gray-900/70 border border-gray-700 text-gray-400 hover:bg-gray-800"
                      }`}
                    >
                      <GraduationCap className="inline mr-2" size={14} />
                      PWC Alumni
                    </button>
                    <button
                      onClick={() => toggleEnrollmentStatusFilter("external")}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                        filters.enrollmentStatus.includes("external")
                          ? "bg-gray-500/20 border border-gray-500/40 text-gray-300"
                          : "bg-gray-900/70 border border-gray-700 text-gray-400 hover:bg-gray-800"
                      }`}
                    >
                      <GraduationCap className="inline mr-2" size={14} />
                      External Users
                    </button>
                  </div>
                </div>

                {/* Skills Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Skills ({filters.skills.length} selected)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {topSkills.slice(0, 6).map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkillFilter(skill)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          filters.skills.includes(skill)
                            ? "bg-gray-800 border border-blue-500/40 text-blue-400"
                            : "bg-gradient-to-b from-gray-900 via-gray-950 to-black border border-gray-700 text-gray-400 hover:bg-gray-200"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/70 rounded-xl border border-gray-800">
            <Users className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-white mb-2">No students found</h3>
            <p className="text-gray-400 mb-4">
              {students.length === 0
                ? "No students have made their profiles visible yet."
                : "Try adjusting your filters or search query."}
            </p>
            {(searchQuery || filters.career !== "all" || filters.skills.length > 0 || filters.enrollmentStatus.length > 0) && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 rounded-lg bg-blue-500/200 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student, index) => (
              <StudentCard
                key={student.id}
                student={student}
                index={index}
                isSaved={savedStudents.includes(student.id)}
                onToggleSave={() => toggleSaveStudent(student.id)}
                onViewProfile={() => navigate(`/employer/student/${student.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to display student name based on privacy settings
function getDisplayName(student) {
  // If student allows full name to be shown, display it
  if (student.privacy?.showFullNameToEmployers) {
    return `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Student';
  }

  // Otherwise show initials only
  const firstInitial = student.firstName?.[0] || '';
  const lastInitial = student.lastName?.[0] || '';
  return firstInitial && lastInitial
    ? `${firstInitial}.${lastInitial}.`
    : `${student.course || 'IT'} Student`;
}

// Helper function to get initials for avatar
function getInitials(student) {
  return `${student.firstName?.[0] || '?'}${student.lastName?.[0] || '?'}`;
}

// Helper function to get enrollment status badge
function getEnrollmentBadge(student) {
  const status = student.enrollmentStatus || "current_pwc";

  const badges = {
    current_pwc: {
      text: student.yearLevel ? `PWC Student - ${student.yearLevel}` : "PWC Student",
      color: "bg-green-500/20 text-green-400 border-green-500/30"
    },
    pwc_alumni: {
      text: student.graduationYear ? `PWC Alumni '${student.graduationYear}` : "PWC Alumni",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    external: {
      text: "External User",
      color: "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  };

  return badges[status] || badges.current_pwc;
}

// Student Card Component
function StudentCard({ student, index, isSaved, onToggleSave, onViewProfile }) {
  const displayName = getDisplayName(student);
  const showFullName = student.privacy?.showFullNameToEmployers;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
            {getInitials(student)}
          </div>
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              {displayName}
              {!showFullName && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  Anonymous
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-400">{student.yearLevel || "Year N/A"}</p>
          </div>
        </div>

        <button
          onClick={onToggleSave}
          className={`p-2 rounded-lg transition-colors ${
            isSaved
              ? "bg-red-500/20 text-red-400"
              : "bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-400 hover:bg-gray-200"
          }`}
        >
          <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Course */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
        <GraduationCap size={16} />
        <span>{student.course || "Course not specified"}</span>
      </div>

      {/* Enrollment Status Badge */}
      <div className="mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getEnrollmentBadge(student).color}`}>
          {getEnrollmentBadge(student).text}
        </span>
      </div>

      {/* Career Match */}
      {student.careerPrediction && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={14} className="text-blue-400" />
            <span className="text-xs font-medium text-blue-400">Career Match</span>
          </div>
          <p className="text-sm font-medium text-white">{student.careerPrediction.career}</p>
          {student.careerPrediction.confidence && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500/200"
                  style={{ width: `${student.careerPrediction.confidence}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-300">
                {student.careerPrediction.confidence}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Skills */}
      {student.skills && student.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Code size={14} className="text-gray-500" />
            <span className="text-xs font-medium text-gray-400">Skills</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {student.skills.slice(0, 5).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded bg-gradient-to-b from-gray-900 via-gray-950 to-black text-xs text-gray-300 font-medium"
              >
                {skill}
              </span>
            ))}
            {student.skills.length > 5 && (
              <span className="px-2 py-1 rounded bg-gradient-to-b from-gray-900 via-gray-950 to-black text-xs text-gray-400">
                +{student.skills.length - 5}
              </span>
            )}
          </div>
        </div>
      )}

      {/* View Profile Button */}
      <button
        onClick={onViewProfile}
        className="w-full py-2 rounded-lg bg-blue-500/200 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Eye size={16} />
        View Profile
      </button>
    </motion.div>
  );
}
