// src/pages/admin/CareerAnalytics.jsx
import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminNav from "../../components/admin/AdminNav";
import {
  Briefcase,
  Users,
  TrendingUp,
  Loader2,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  GraduationCap,
  Target,
  Award,
  Search
} from "lucide-react";

export default function CareerAnalytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [careerData, setCareerData] = useState([]);
  const [expandedCareer, setExpandedCareer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    loadCareerData();
  }, []);

  const loadCareerData = async () => {
    try {
      console.log("📊 Loading career analytics data...");

      // Get all users
      const usersSnap = await getDocs(collection(db, "users"));
      console.log(`Found ${usersSnap.size} total users`);

      // Create a map to store career selections
      const careerMap = new Map();

      for (const userDoc of usersSnap.docs) {
        const userData = userDoc.data();

        // Get selected career for this user
        const selectedCareerRef = doc(db, "users", userDoc.id, "selectedCareer", "current");
        const selectedCareerDoc = await getDoc(selectedCareerRef);

        if (selectedCareerDoc.exists()) {
          const careerData = selectedCareerDoc.data();
          const jobRole = careerData.jobRole;
          const category = careerData.category || "Uncategorized";
          const matchScore = careerData.matchScore || "N/A";

          // Create unique key for job role
          if (!careerMap.has(jobRole)) {
            careerMap.set(jobRole, {
              jobRole,
              category,
              students: [],
              count: 0
            });
          }

          // Add student to this career
          careerMap.get(jobRole).students.push({
            id: userDoc.id,
            firstName: userData.firstName || "Unknown",
            lastName: userData.lastName || "",
            email: userData.email || "No email",
            course: userData.course || "N/A",
            yearLevel: userData.yearLevel || "N/A",
            matchScore: matchScore
          });

          careerMap.get(jobRole).count++;
        }
      }

      // Convert map to array and sort by student count
      const careerArray = Array.from(careerMap.values())
        .sort((a, b) => b.count - a.count);

      console.log(`✅ Found ${careerArray.length} different career paths`);
      setCareerData(careerArray);
    } catch (error) {
      console.error("❌ Error loading career data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories for filter
  const categories = ["all", ...new Set(careerData.map(c => c.category))];

  // Filter careers based on search and category
  const filteredCareers = careerData.filter(career => {
    const matchesSearch =
      career.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === "all" || career.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate total stats
  const totalStudents = careerData.reduce((sum, career) => sum + career.count, 0);
  const totalCareers = careerData.length;
  const avgStudentsPerCareer = totalStudents > 0 ? (totalStudents / totalCareers).toFixed(1) : 0;

  // Get most popular career
  const mostPopular = careerData.length > 0 ? careerData[0] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-400" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Career Path Analytics</h1>
          <p className="text-gray-400">
            View which careers students have selected and track career preferences
          </p>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Students</p>
                <p className="text-3xl font-bold">{totalStudents}</p>
              </div>
              <Users className="text-blue-400" size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Career Paths</p>
                <p className="text-3xl font-bold">{totalCareers}</p>
              </div>
              <Briefcase className="text-emerald-400" size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Avg per Career</p>
                <p className="text-3xl font-bold">{avgStudentsPerCareer}</p>
              </div>
              <TrendingUp className="text-purple-400" size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Most Popular</p>
                <p className="text-lg font-bold truncate">
                  {mostPopular ? mostPopular.jobRole.substring(0, 20) : "N/A"}
                </p>
                <p className="text-yellow-400 text-sm">{mostPopular?.count || 0} students</p>
              </div>
              <Award className="text-yellow-400" size={32} />
            </div>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search careers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Career List */}
        <div className="space-y-4">
          {filteredCareers.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
              <Briefcase className="mx-auto mb-4 text-gray-600" size={48} />
              <p className="text-gray-400">No careers found</p>
            </div>
          ) : (
            filteredCareers.map((career, index) => (
              <motion.div
                key={career.jobRole}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all"
              >
                {/* Career Header */}
                <button
                  onClick={() => setExpandedCareer(expandedCareer === career.jobRole ? null : career.jobRole)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-800/70 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-500/20 rounded-lg">
                      <Briefcase className="text-primary-400" size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-white">{career.jobRole}</h3>
                      <p className="text-sm text-gray-400">{career.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-400">{career.count}</p>
                      <p className="text-xs text-gray-400">
                        {career.count === 1 ? "student" : "students"}
                      </p>
                    </div>
                    {expandedCareer === career.jobRole ? (
                      <ChevronUp className="text-gray-400" size={24} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={24} />
                    )}
                  </div>
                </button>

                {/* Expanded Student List */}
                {expandedCareer === career.jobRole && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-700 bg-gray-900/50"
                  >
                    <div className="p-6">
                      <h4 className="text-sm font-semibold text-gray-400 mb-4">
                        Students who selected this career:
                      </h4>

                      <div className="space-y-3">
                        {career.students.map((student, idx) => (
                          <div
                            key={student.id}
                            className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-primary-500/50 transition-all cursor-pointer"
                            onClick={() => navigate(`/admin/student/${student.id}`)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold">
                                {student.firstName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-white">
                                  {student.firstName} {student.lastName}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Mail size={14} />
                                    {student.email}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <GraduationCap size={14} />
                                    {student.course}
                                  </span>
                                  <span>{student.yearLevel}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <Target className="text-primary-400" size={16} />
                                <span className="text-primary-400 font-semibold">
                                  {student.matchScore}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400">Match Score</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
