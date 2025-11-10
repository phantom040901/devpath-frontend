import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav';
import {
  ArrowLeft,
  Download,
  Database,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Filter,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function DatasetViewer() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isCareerPathExpanded, setIsCareerPathExpanded] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    withAssessments: 0,
    averageScore: 0,
    dataQuality: 0,
    careerPathDistribution: {}
  });

  useEffect(() => {
    loadDataset();
  }, []);

  useEffect(() => {
    // Filter students based on search term
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.id.toString().includes(searchTerm) ||
        (student.futureCareer && student.futureCareer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.interestedDomain && student.interestedDomain.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.major && student.major.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredStudents(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, students]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim() || '';
      });
      return obj;
    });
  };

  const loadDataset = async () => {
    try {
      setLoading(true);

      // Fetch the CS students CSV file
      const response = await fetch('/cs_students.csv');
      const csvText = await response.text();
      const csvData = parseCSV(csvText);

      // Keep only the raw CSV data
      const studentData = csvData.map((row, index) => {
        return {
          id: row['Student ID'] || (index + 1),
          gender: row.Gender || '',
          age: row.Age || '',
          gpa: row.GPA || '',
          major: row.Major || '',
          interestedDomain: row['Interested Domain'] || '',
          projects: row.Projects || '',
          futureCareer: row['Future Career'] || '',
          python: row.Python || '',
          sql: row.SQL || '',
          java: row.Java || ''
        };
      });

      // Calculate statistics
      const totalStudents = studentData.length;
      const withProjects = studentData.filter(s => s.projects).length;
      const gpas = studentData
        .map(s => parseFloat(s.gpa))
        .filter(gpa => !isNaN(gpa) && gpa > 0);
      const averageGPA = gpas.length > 0
        ? (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(2)
        : 0;

      // Calculate data quality (students with complete information)
      const completeProfiles = studentData.filter(
        s => s.interestedDomain && s.futureCareer && s.python && s.sql && s.java
      ).length;
      const dataQuality = totalStudents > 0
        ? Math.round((completeProfiles / totalStudents) * 100)
        : 0;

      // Career path distribution
      const careerPathDistribution = studentData.reduce((acc, student) => {
        const path = student.futureCareer || 'Unknown';
        acc[path] = (acc[path] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalStudents,
        withAssessments: withProjects,
        averageScore: averageGPA,
        dataQuality,
        careerPathDistribution
      });

      setStudents(studentData);
      setFilteredStudents(studentData);
    } catch (error) {
      console.error('Error loading dataset:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportDataset = () => {
    if (filteredStudents.length === 0) {
      alert('No data to export');
      return;
    }

    // Create CSV header
    const header = [
      'Student ID',
      'Name',
      'Email',
      'Career Path',
      'Assessments Completed',
      'Average Score (%)',
      'Skills',
      'Interests',
      'Complete Profile',
      'Created At'
    ];

    // Create CSV rows
    const rows = filteredStudents.map(student => [
      student.id,
      student.name,
      student.email,
      student.careerPath,
      student.assessmentsCompleted,
      student.averageScore,
      student.skills.join('; '),
      student.interests.join('; '),
      student.hasCompleteProfile ? 'Yes' : 'No',
      student.createdAt.toISOString().split('T')[0]
    ]);

    // Combine and create CSV
    const csvContent = [
      header.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `devpath_dataset_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary-400 mx-auto mb-4" size={48} />
          <p className="text-gray-400">Loading dataset...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Back Button */}
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dataset Viewer</h1>
            <p className="text-gray-400">
              Student data collected for ML model training
            </p>
          </div>
          <button
            onClick={exportDataset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02]"
          >
            <Download size={20} />
            Export Dataset
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="text-blue-400" size={24} />}
            label="Total Students"
            value={stats.totalStudents.toLocaleString()}
            color="blue"
          />
          <StatCard
            icon={<FileText className="text-emerald-400" size={24} />}
            label="With Assessments"
            value={stats.withAssessments.toLocaleString()}
            color="emerald"
          />
          <StatCard
            icon={<TrendingUp className="text-purple-400" size={24} />}
            label="Avg. Score"
            value={`${stats.averageScore}%`}
            color="purple"
          />
          <StatCard
            icon={
              stats.dataQuality >= 85
                ? <CheckCircle2 className="text-emerald-400" size={24} />
                : <AlertCircle className="text-yellow-400" size={24} />
            }
            label="Data Quality"
            value={`${stats.dataQuality}%`}
            color={stats.dataQuality >= 85 ? "emerald" : "yellow"}
          />
        </div>

        {/* Career Path Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="text-primary-400" size={24} />
              Career Path Distribution
            </h2>
            <button
              onClick={() => setIsCareerPathExpanded(!isCareerPathExpanded)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              aria-label={isCareerPathExpanded ? "Collapse career paths" : "Expand career paths"}
            >
              {isCareerPathExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          <AnimatePresence>
            {isCareerPathExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.entries(stats.careerPathDistribution)
                    .sort(([, a], [, b]) => b - a)
                    .map(([path, count]) => (
                      <div
                        key={path}
                        className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="text-2xl font-bold text-white mb-1">{count}</div>
                        <div className="text-xs text-gray-400 line-clamp-2">{path}</div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by ID, career, domain, or major..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900/70 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-400 mt-2">
              Showing {filteredStudents.length} of {students.length} students
            </p>
          )}
        </div>

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/70 border border-gray-800 rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Gender</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Age</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">GPA</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Major</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Interested Domain</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Projects</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Future Career</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Python</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">SQL</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Java</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {currentStudents.length > 0 ? (
                  currentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-white font-mono">{student.id}</td>
                      <td className="px-4 py-3 text-gray-300">{student.gender}</td>
                      <td className="px-4 py-3 text-gray-300">{student.age}</td>
                      <td className="px-4 py-3 text-emerald-400 font-semibold">{student.gpa}</td>
                      <td className="px-4 py-3 text-gray-300">{student.major}</td>
                      <td className="px-4 py-3 text-blue-400">{student.interestedDomain}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{student.projects}</td>
                      <td className="px-4 py-3 text-purple-400">{student.futureCareer}</td>
                      <td className="px-4 py-3 text-gray-300">{student.python}</td>
                      <td className="px-4 py-3 text-gray-300">{student.sql}</td>
                      <td className="px-4 py-3 text-gray-300">{student.java}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="px-6 py-12 text-center text-gray-400">
                      No students found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredStudents.length > rowsPerPage && (
            <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-400">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} records
                </p>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-1 bg-gray-800 text-white rounded-lg text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <Database className="text-blue-400 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="text-blue-400 font-semibold mb-1">Dataset Information</h4>
              <p className="text-gray-300 text-sm">
                This dataset contains student profiles, assessment results, and interaction data
                collected during the cosine similarity phase. This data will be used to train
                the AdaBoost machine learning model for improved career recommendations.
                All data is anonymized and stored securely in Firebase.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900/70 border border-gray-800 rounded-xl p-5"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-${color}-500/10 border border-${color}-500/30`}>
          {icon}
        </div>
        <div className="text-sm font-medium text-gray-400">{label}</div>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </motion.div>
  );
}
