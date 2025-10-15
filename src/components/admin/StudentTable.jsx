// src/components/admin/StudentTable.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";

export default function StudentTable({ students, loading }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter students
  const filteredStudents = students
    .filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || student.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch(sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "overall":
          comparison = a.overallAvg - b.overallAvg;
          break;
        case "completion":
          comparison = a.completionRate - b.completionRate;
          break;
        case "attempts":
          comparison = a.totalAttempts - b.totalAttempts;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      excellent: {
        icon: <CheckCircle size={16} />,
        text: "Excellent",
        color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30"
      },
      active: {
        icon: <TrendingUp size={16} />,
        text: "Active",
        color: "text-blue-400 bg-blue-500/20 border-blue-500/30"
      },
      struggling: {
        icon: <AlertCircle size={16} />,
        text: "Struggling",
        color: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
      },
      inactive: {
        icon: <XCircle size={16} />,
        text: "Inactive",
        color: "text-gray-400 bg-gray-500/20 border-gray-500/30"
      }
    };
    return badges[status] || badges.active;
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  if (loading) {
    return (
      <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary-500 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="excellent">Excellent</option>
              <option value="active">Active</option>
              <option value="struggling">Struggling</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900/70 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Student
                    <SortIcon field="name" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("overall")}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Overall
                    <SortIcon field="overall" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Academic
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Technical
                </th>
                <th
                  onClick={() => handleSort("completion")}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Completion
                    <SortIcon field="completion" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student, index) => {
                  const badge = getStatusBadge(student.status);
                  // Cap completion rate at 100%
                  const displayCompletionRate = Math.min(100, student.completionRate);
                  
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{student.name}</div>
                          <div className="text-sm text-gray-400">{student.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-semibold text-lg">{student.overallAvg}%</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-blue-400 font-semibold">{student.academicAvg}%</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-purple-400 font-semibold">{student.technicalAvg}%</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2 w-24 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-primary-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${displayCompletionRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400 font-medium min-w-[45px] text-right">
                            {displayCompletionRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${badge.color}`}>
                          {badge.icon}
                          {badge.text}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/admin/student/${student.id}`)}
                          className="flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors hover:underline"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    No students found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-800 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        currentPage === pageNum
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}