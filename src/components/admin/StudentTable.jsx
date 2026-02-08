// src/components/admin/StudentTable.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getSystemSettings } from "../../services/systemSettingsService";
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
  XCircle,
  GraduationCap,
  Edit2,
  Trash2,
  ClipboardList,
  Zap,
  BarChart3
} from "lucide-react";

export default function StudentTable({ students, loading }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterEnrollment, setFilterEnrollment] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [enrollmentChanges, setEnrollmentChanges] = useState({});
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [generatingFor, setGeneratingFor] = useState(null);
  const [assigningCareer, setAssigningCareer] = useState(null);
  const [assigningScores, setAssigningScores] = useState(null);
  const [advancedManagementEnabled, setAdvancedManagementEnabled] = useState(false);
  const itemsPerPage = 10;

  // Load system settings to check if advanced management is enabled
  useEffect(() => {
    const loadSettings = async () => {
      const result = await getSystemSettings();
      if (result.success && result.data) {
        setAdvancedManagementEnabled(result.data.enableAdvancedStudentManagement || false);
      }
    };
    loadSettings();
  }, []);

  // Performance level presets
  const performanceLevels = [
    {
      label: "Excellent (80-95%)",
      value: "excellent",
      academicRange: [80, 95],
      technicalRange: [80, 95],
      color: "text-emerald-400"
    },
    {
      label: "Good (65-79%)",
      value: "good",
      academicRange: [65, 79],
      technicalRange: [65, 79],
      color: "text-blue-400"
    },
    {
      label: "Average (50-64%)",
      value: "average",
      academicRange: [50, 64],
      technicalRange: [50, 64],
      color: "text-yellow-400"
    },
    {
      label: "Struggling (30-49%)",
      value: "struggling",
      academicRange: [30, 49],
      technicalRange: [30, 49],
      color: "text-orange-400"
    },
    {
      label: "Needs Help (15-29%)",
      value: "needs_help",
      academicRange: [15, 29],
      technicalRange: [15, 29],
      color: "text-red-400"
    }
  ];

  // Available career options - matching backend ML model
  const careerOptions = [
    // Software Development
    { jobRole: "Software Engineer", category: "Software Development" },
    { jobRole: "Software Developer", category: "Software Development" },
    { jobRole: "Applications Developer", category: "Software Development" },
    { jobRole: "Mobile Applications Developer", category: "Software Development" },
    { jobRole: "Web Developer", category: "Software Development" },
    { jobRole: "Programmer Analyst", category: "Software Development" },
    { jobRole: "UX Designer", category: "Software Development" },
    { jobRole: "Design & UX", category: "Software Development" },

    // Data & Analytics
    { jobRole: "Database Administrator", category: "Data & Analytics" },
    { jobRole: "Database Developer", category: "Data & Analytics" },
    { jobRole: "Database Manager", category: "Data & Analytics" },
    { jobRole: "Data Architect", category: "Data & Analytics" },
    { jobRole: "Business Intelligence Analyst", category: "Data & Analytics" },
    { jobRole: "E-Commerce Analyst", category: "Data & Analytics" },

    // Networking & Security
    { jobRole: "Network Security Engineer", category: "Networking & Security" },
    { jobRole: "Network Engineer", category: "Networking & Security" },
    { jobRole: "Network Security Administrator", category: "Networking & Security" },
    { jobRole: "Systems Security Administrator", category: "Networking & Security" },
    { jobRole: "Information Security Analyst", category: "Networking & Security" },

    // Quality Assurance & Testing
    { jobRole: "Quality Assurance Associate", category: "Quality Assurance & Testing" },
    { jobRole: "Software Quality Assurance (QA) / Testing", category: "Quality Assurance & Testing" },

    // IT Management
    { jobRole: "Project Manager", category: "IT Management" },
    { jobRole: "Information Technology Manager", category: "IT Management" },
    { jobRole: "CRM Business Analyst", category: "IT Management" },
    { jobRole: "Business Systems Analyst", category: "IT Management" },
    { jobRole: "Solutions Architect", category: "IT Management" },

    // Technical Support
    { jobRole: "Technical Support", category: "Technical Support" },
    { jobRole: "Technical Services/Help Desk/Tech Support", category: "Technical Support" },

    // Specialized
    { jobRole: "Information Technology Auditor", category: "Specialized" },
    { jobRole: "Portal Administrator", category: "Specialized" },
    { jobRole: "CRM Technical Developer", category: "Specialized" }
  ];

  // Filter students
  const filteredStudents = students
    .filter(student => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === "all" || student.status === filterStatus;

      const matchesEnrollment = filterEnrollment === "all" ||
        student.enrollmentStatus === filterEnrollment;

      return matchesSearch && matchesStatus && matchesEnrollment;
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

  // Calculate enrollment statistics
  const enrollmentStats = {
    total: students.length,
    pwc_students: students.filter(s => s.enrollmentStatus === "current_pwc").length,
    pwc_alumni: students.filter(s => s.enrollmentStatus === "pwc_alumni").length,
    external: students.filter(s => s.enrollmentStatus === "external").length
  };

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

  const getEnrollmentBadge = (student) => {
    const status = student.enrollmentStatus || "current_pwc";
    const badges = {
      current_pwc: {
        text: student.yearLevel ? `PWC - ${student.yearLevel}` : "PWC Student",
        color: "text-green-400 bg-green-500/20 border-green-500/30"
      },
      pwc_alumni: {
        text: student.graduationYear ? `Alumni '${student.graduationYear}` : "PWC Alumni",
        color: "text-blue-400 bg-blue-500/20 border-blue-500/30"
      },
      external: {
        text: "External",
        color: "text-gray-400 bg-gray-500/20 border-gray-500/30"
      }
    };
    return badges[status] || badges.current_pwc;
  };

  const handleEnrollmentChange = async (studentId, newStatus) => {
    try {
      console.log("Starting enrollment update:", { studentId, newStatus });
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('../../lib/firebase');

      const studentRef = doc(db, 'users', studentId);
      console.log("Updating document with:", {
        enrollmentStatus: newStatus,
        isEnrolled: newStatus === "current_pwc",
        updatedAt: new Date().toISOString()
      });

      await updateDoc(studentRef, {
        enrollmentStatus: newStatus,
        isEnrolled: newStatus === "current_pwc",
        updatedAt: new Date().toISOString()
      });

      console.log("Update successful!");

      // Update local state
      setEnrollmentChanges({ ...enrollmentChanges, [studentId]: newStatus });
      setEditingEnrollment(null);

      alert(`✓ Successfully updated enrollment status!`);

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Error updating enrollment status:", error);
      alert(`Failed to update enrollment status: ${error.message}`);
    }
  };

  const handleAssignScores = async (student, level) => {
    setAssigningScores(student.id);

    try {
      const { doc, setDoc, updateDoc, collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('../../lib/firebase');

      const timestamp = new Date().toISOString();

      // Helper function to generate random score in range
      const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      const randPercentage = (min, max) => {
        const minTens = Math.ceil(min / 10);
        const maxTens = Math.floor(max / 10);
        return randInt(minTens, maxTens) * 10;
      };

      // Fetch real assessments from Firestore
      const academicSnap = await getDocs(collection(db, "assessments"));
      const technicalSnap = await getDocs(collection(db, "technicalAssessments"));
      const personalSnap = await getDocs(collection(db, "personalAssessments"));

      const academicAssessments = academicSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const technicalAssessments = technicalSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const personalAssessments = personalSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Get the performance level ranges
      const [academicMin, academicMax] = level.academicRange;
      const [technicalMin, technicalMax] = level.technicalRange;

      // Create assessment results with scores in the specified range
      for (const assessment of academicAssessments) {
        const score = randPercentage(academicMin, academicMax);
        await setDoc(doc(db, "users", student.id, "results", `assessments_${assessment.id}_${Date.now()}`), {
          assessmentId: assessment.id,
          score: score,
          completedAt: timestamp,
          type: "academic"
        });
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      for (const assessment of technicalAssessments) {
        const score = randPercentage(technicalMin, technicalMax);
        await setDoc(doc(db, "users", student.id, "results", `technicalAssessments_${assessment.id}_${Date.now()}`), {
          assessmentId: assessment.id,
          score: score,
          completedAt: timestamp,
          type: "technical"
        });
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Create personal assessment responses
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
      for (const assessment of personalAssessments) {
        await setDoc(doc(db, "users", student.id, "results", `survey_${assessment.id}_${Date.now()}`), {
          assessmentId: assessment.id,
          completedAt: timestamp,
          type: "personal",
          responses: {
            behavior: pick(["stubborn", "gentle"]),
            introvert: pick(["yes", "no"]),
            work_style: pick(["hard worker", "smart worker"]),
            relationship: pick(["yes", "no"]),
            seniors_input: pick(["yes", "no"]),
            gaming_interest: pick(["yes", "no"]),
            management_tech: pick(["Technical", "Management"]),
            salary_work: pick(["salary", "work"]),
            team_exp: pick(["yes", "no"]),
            books: pick(["Technical", "Science fiction", "Self help", "Fantasy"]),
            interested_subjects: pick(["networks", "cloud computing", "Software Engineering", "Computer Architecture", "IOT", "Management"]),
            career_area: pick(["cloud computing", "data engineering", "system developer", "security", "testing"]),
            company_type: pick(["Product based", "Service Based", "Cloud Services", "Web Services"]),
            public_speaking: randInt(2, 5),
            logical_quotient: randInt(3, 5),
            coding_skills: randInt(3, 5),
            hackathons: randInt(0, 5),
            hours_working: randInt(4, 10),
            memory_score: randInt(6, 10)
          }
        });
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Update user document
      await updateDoc(doc(db, 'users', student.id), {
        assessmentCompleted: true,
        lastAssessmentDate: timestamp,
        updatedAt: timestamp
      });

      alert(`✓ Successfully assigned ${level.label} scores to ${student.name}!`);
      window.location.reload();

    } catch (error) {
      console.error("Error assigning scores:", error);
      alert(`Failed to assign scores: ${error.message}`);
    } finally {
      setAssigningScores(null);
    }
  };

  const handleDeleteStudent = async (student) => {
    if (deleteConfirmation !== student.email) {
      alert("Please type the student's email address to confirm deletion");
      return;
    }

    try {
      const { doc, deleteDoc, collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('../../lib/firebase');

      // Delete user document
      await deleteDoc(doc(db, 'users', student.id));

      // Delete all subcollections (results, selectedCareer, etc.)
      const subcollections = ['results', 'selectedCareer'];
      for (const subcollection of subcollections) {
        const subcollectionRef = collection(db, 'users', student.id, subcollection);
        const subcollectionSnap = await getDocs(subcollectionRef);
        for (const subDoc of subcollectionSnap.docs) {
          await deleteDoc(doc(db, 'users', student.id, subcollection, subDoc.id));
        }
      }

      // Reset state and reload
      setDeletingStudent(null);
      setDeleteConfirmation("");
      alert(`Successfully deleted student: ${student.name}`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting student:", error);
      alert(`Failed to delete student: ${error.message}`);
    }
  };

  const handleAssignCareer = async (student, career) => {
    setAssigningCareer(student.id);

    try {
      const { doc, setDoc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('../../lib/firebase');

      const timestamp = new Date().toISOString();
      const matchScore = Math.floor(Math.random() * (95 - 75 + 1)) + 75; // Random score between 75-95

      const careerData = {
        jobRole: career.jobRole,
        category: career.category,
        matchScore: matchScore,
        explanation: `Manually assigned career path`,
        selectedAt: timestamp,
        manuallyAssigned: true
      };

      // Save to selectedCareer subcollection
      await setDoc(doc(db, "users", student.id, "selectedCareer", "current"), careerData);

      // Update user document
      await updateDoc(doc(db, 'users', student.id), {
        careerPath: career.jobRole,
        selectedCareerJobRole: career.jobRole,
        selectedCareerCategory: career.category,
        selectedCareerMatchScore: matchScore,
        updatedAt: timestamp
      });

      alert(`✓ Successfully assigned ${career.jobRole} to ${student.name}!`);
      window.location.reload();

    } catch (error) {
      console.error("Error assigning career:", error);
      alert(`Failed to assign career: ${error.message}`);
    } finally {
      setAssigningCareer(null);
    }
  };

  const handleAutoGenerateAssessment = async (student) => {
    if (!confirm(`Auto-generate assessment results and career match for ${student.name}?\n\nThis will create realistic random scores and call the ML API for career prediction.`)) {
      return;
    }

    setGeneratingFor(student.id);

    try {
      const { doc, setDoc, updateDoc, collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('../../lib/firebase');

      // Fetch real assessments from Firestore
      const academicSnap = await getDocs(collection(db, "assessments"));
      const technicalSnap = await getDocs(collection(db, "technicalAssessments"));
      const personalSnap = await getDocs(collection(db, "personalAssessments"));

      const academicAssessments = academicSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const technicalAssessments = technicalSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const personalAssessments = personalSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Helper functions
      const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      const randPercentage = (min, max) => {
        const minTens = Math.ceil(min / 10);
        const maxTens = Math.floor(max / 10);
        return randInt(minTens, maxTens) * 10;
      };
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

      // Generate random profile
      const profile = {
        courses: "BSIT",
        os_perc: randPercentage(65, 95),
        algo_perc: randPercentage(65, 95),
        prog_perc: randPercentage(70, 95),
        se_perc: randPercentage(65, 95),
        cn_perc: randPercentage(60, 90),
        es_perc: randPercentage(60, 90),
        ca_perc: randPercentage(60, 90),
        math_perc: randPercentage(65, 90),
        comm_perc: randPercentage(70, 95),
        hours_working: randInt(4, 10),
        hackathons: randInt(0, 5),
        logical_quotient: randInt(3, 5),
        coding_skills: randInt(3, 5),
        public_speaking: randInt(2, 5),
        memory_score: randInt(6, 10),
        interested_subjects: pick(["networks", "cloud computing", "Software Engineering", "Computer Architecture", "IOT", "Management"]),
        career_area: pick(["cloud computing", "data engineering", "system developer", "security", "testing"]),
        company_type: pick(["Product based", "Service Based", "Cloud Services", "Web Services"]),
        books: pick(["Technical", "Science fiction", "Self help", "Fantasy"]),
        behavior: pick(["stubborn", "gentle"]),
        management_tech: pick(["Technical", "Management"]),
        salary_work: pick(["salary", "work"]),
        team_exp: pick(["yes", "no"]),
        work_style: pick(["hard worker", "smart worker"]),
        relationship: pick(["yes", "no"]),
        introvert: pick(["yes", "no"]),
        seniors_input: pick(["yes", "no"]),
        gaming_interest: pick(["yes", "no"])
      };

      // Call ML API for career prediction
      const API_URL = import.meta.env.VITE_API_URL || "https://devpath-backend.onrender.com";
      let data = null;

      try {
        const response = await fetch(`${API_URL}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        });

        if (response.ok) {
          data = await response.json();
          console.log("ML API Response:", data);
        } else {
          console.warn("ML API failed, using fallback career selection");
        }
      } catch (apiError) {
        console.warn("ML API not available, using fallback career selection:", apiError.message);
      }

      // Fallback career recommendations if API is not available
      if (!data || !data.recommendations || data.recommendations.length === 0) {
        const fallbackCareers = [
          { job_role: "Software Developer", category: "Software Development", match_score: randInt(75, 95), explanation: "Strong programming and problem-solving skills" },
          { job_role: "Web Developer", category: "Web Development", match_score: randInt(75, 95), explanation: "Good technical skills and creativity" },
          { job_role: "Database Administrator", category: "Data Management", match_score: randInt(75, 95), explanation: "Strong analytical and organizational skills" },
          { job_role: "System Analyst", category: "Systems Analysis", match_score: randInt(75, 95), explanation: "Good communication and technical skills" },
          { job_role: "Network Engineer", category: "Networking", match_score: randInt(75, 95), explanation: "Strong technical knowledge and problem-solving" },
          { job_role: "Quality Assurance Engineer", category: "Testing & QA", match_score: randInt(75, 95), explanation: "Attention to detail and analytical thinking" },
          { job_role: "DevOps Engineer", category: "DevOps", match_score: randInt(75, 95), explanation: "Technical skills and automation mindset" },
          { job_role: "UI/UX Designer", category: "Design", match_score: randInt(75, 95), explanation: "Creativity and user-focused thinking" }
        ];

        data = {
          recommendations: [pick(fallbackCareers)]
        };
      }

      // Create assessment results in the results subcollection
      const timestamp = new Date().toISOString();

      // Save results for each academic assessment using real assessment IDs
      for (const assessment of academicAssessments) {
        const score = randPercentage(65, 95);
        await setDoc(doc(db, "users", student.id, "results", `assessments_${assessment.id}_${Date.now()}`), {
          assessmentId: assessment.id,
          score: score,
          completedAt: timestamp,
          type: "academic"
        });
        // Small delay to ensure unique timestamps
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Save results for each technical assessment using real assessment IDs
      for (const assessment of technicalAssessments) {
        const score = randPercentage(60, 90);
        await setDoc(doc(db, "users", student.id, "results", `technicalAssessments_${assessment.id}_${Date.now()}`), {
          assessmentId: assessment.id,
          score: score,
          completedAt: timestamp,
          type: "technical"
        });
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Save results for each personal assessment using real assessment IDs
      // Personal assessments are surveys, not scored tests
      for (const assessment of personalAssessments) {
        await setDoc(doc(db, "users", student.id, "results", `survey_${assessment.id}_${Date.now()}`), {
          assessmentId: assessment.id,
          completedAt: timestamp,
          type: "personal",
          responses: {
            behavior: profile.behavior,
            introvert: profile.introvert,
            work_style: profile.work_style,
            relationship: profile.relationship,
            seniors_input: profile.seniors_input,
            gaming_interest: profile.gaming_interest,
            management_tech: profile.management_tech,
            salary_work: profile.salary_work,
            team_exp: profile.team_exp,
            books: profile.books,
            interested_subjects: profile.interested_subjects,
            career_area: profile.career_area,
            company_type: profile.company_type,
            public_speaking: profile.public_speaking,
            logical_quotient: profile.logical_quotient,
            coding_skills: profile.coding_skills,
            hackathons: profile.hackathons,
            hours_working: profile.hours_working,
            memory_score: profile.memory_score
          }
        });
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Save career match to selectedCareer subcollection
      let careerData = null;
      console.log("Data from API:", data);
      console.log("Recommendations:", data?.recommendations);

      if (data && data.recommendations && data.recommendations.length > 0) {
        const topMatch = data.recommendations[0];
        console.log("Top match:", topMatch);

        careerData = {
          jobRole: topMatch.job_role,
          category: topMatch.category || "Software Development",
          matchScore: topMatch.match_score,
          explanation: topMatch.explanation || "",
          selectedAt: timestamp,
          profileData: profile
        };

        console.log("Saving career data to subcollection:", careerData);
        console.log("Path: users/" + student.id + "/selectedCareer/current");

        await setDoc(doc(db, "users", student.id, "selectedCareer", "current"), careerData);
        console.log("✓ Career subcollection saved successfully");
      } else {
        console.warn("No career recommendations found in data");
      }

      // Update user document with assessment completion and career info
      const userUpdate = {
        assessmentCompleted: true,
        assessmentData: profile,
        lastAssessmentDate: timestamp,
        updatedAt: timestamp
      };

      // Add career fields to user document if career was selected
      if (careerData) {
        userUpdate.careerPath = careerData.jobRole;
        userUpdate.selectedCareerJobRole = careerData.jobRole;
        userUpdate.selectedCareerCategory = careerData.category;
        userUpdate.selectedCareerMatchScore = careerData.matchScore;
        console.log("Adding career fields to user document:", {
          careerPath: careerData.jobRole,
          selectedCareerJobRole: careerData.jobRole,
          selectedCareerCategory: careerData.category,
          selectedCareerMatchScore: careerData.matchScore
        });
      }

      console.log("Final user update:", userUpdate);
      await updateDoc(doc(db, 'users', student.id), userUpdate);
      console.log("✓ User document updated successfully");

      alert(`✓ Successfully generated assessment and career match for ${student.name}!`);
      window.location.reload();

    } catch (error) {
      console.error("Error auto-generating assessment:", error);
      alert(`Failed to generate assessment: ${error.message}\n\nMake sure the ML API is running at ${import.meta.env.VITE_API_URL || "https://devpath-backend.onrender.com"}`);
    } finally {
      setGeneratingFor(null);
    }
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

          {/* Enrollment Filter */}
          <div className="flex items-center gap-2">
            <GraduationCap className="text-gray-400" size={20} />
            <select
              value={filterEnrollment}
              onChange={(e) => {
                setFilterEnrollment(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary-500 transition-colors"
            >
              <option value="all">
                All Students ({students.length})
              </option>
              <option value="current_pwc">
                PWC Students ({students.filter(s => s.enrollmentStatus === "current_pwc").length})
              </option>
              <option value="pwc_alumni">
                PWC Alumni ({students.filter(s => s.enrollmentStatus === "pwc_alumni").length})
              </option>
              <option value="external">
                External ({students.filter(s => s.enrollmentStatus === "external").length})
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900/70 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-800/50 sticky top-0 z-10">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase cursor-pointer hover:text-white transition-colors w-64"
                >
                  <div className="flex items-center gap-2">
                    Student
                    <SortIcon field="name" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("overall")}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase cursor-pointer hover:text-white transition-colors w-24"
                >
                  <div className="flex items-center gap-2">
                    Overall
                    <SortIcon field="overall" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase w-24">
                  Academic
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase w-24">
                  Technical
                </th>
                <th
                  onClick={() => handleSort("completion")}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase cursor-pointer hover:text-white transition-colors w-32"
                >
                  <div className="flex items-center gap-2">
                    Progress
                    <SortIcon field="completion" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase w-32">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase w-40">
                  Enrollment
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase w-80">
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
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-white font-medium text-sm">{student.name}</div>
                          <div className="text-xs text-gray-400 truncate max-w-[240px]">{student.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-white font-semibold">{student.overallAvg}%</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-blue-400 font-semibold text-sm">{student.academicAvg}%</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-purple-400 font-semibold text-sm">{student.technicalAvg}%</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2 w-20 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-primary-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${displayCompletionRate}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 font-medium min-w-[35px] text-right">
                            {displayCompletionRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold ${badge.color}`}>
                          {badge.icon}
                          {badge.text}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {editingEnrollment === student.id ? (
                          <div className="flex items-center gap-1">
                            <select
                              defaultValue={student.enrollmentStatus || "current_pwc"}
                              onChange={(e) => {
                                console.log("Enrollment changed to:", e.target.value);
                                handleEnrollmentChange(student.id, e.target.value);
                              }}
                              className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                              autoFocus
                            >
                              <option value="current_pwc">PWC Student</option>
                              <option value="pwc_alumni">PWC Alumni</option>
                              <option value="external">External</option>
                            </select>
                            <button
                              onClick={() => setEditingEnrollment(null)}
                              className="text-gray-400 hover:text-white text-xs px-1"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getEnrollmentBadge(student).color}`}>
                              <GraduationCap size={12} />
                              {getEnrollmentBadge(student).text}
                            </div>
                            <button
                              onClick={() => {
                                console.log("Editing enrollment for:", student.id);
                                setEditingEnrollment(student.id);
                              }}
                              className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                              title="Edit enrollment status"
                            >
                              <Edit2 size={12} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => navigate(`/admin/student/${student.id}`)}
                            className="flex items-center gap-1 text-primary-400 hover:text-primary-300 text-xs font-medium transition-colors px-2 py-1 rounded hover:bg-gray-800"
                            title="View student details"
                          >
                            <Eye size={12} />
                            View
                          </button>

                          {/* Advanced Management Actions - Only show if enabled */}
                          {advancedManagementEnabled && (
                            <>
                              {/* Career Assignment Dropdown */}
                              <div className="relative group">
                            <button
                              disabled={assigningCareer === student.id}
                              className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors px-2 py-1 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Assign career to student"
                            >
                              {assigningCareer === student.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-400" />
                                  <span className="text-[10px]">Assigning...</span>
                                </>
                              ) : (
                                <>
                                  <GraduationCap size={12} />
                                  Career
                                </>
                              )}
                            </button>

                            {/* Dropdown menu */}
                            <div className="absolute left-0 mt-1 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 max-h-80 overflow-y-auto">
                              <div className="sticky top-0 bg-gray-800 px-3 py-2 border-b border-gray-700">
                                <p className="text-xs text-gray-400 font-medium">Select Career Path</p>
                              </div>
                              {careerOptions.map((career, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleAssignCareer(student, career)}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors border-b border-gray-800 last:border-b-0"
                                >
                                  <div className="font-medium text-xs">{career.jobRole}</div>
                                  <div className="text-[10px] text-gray-400">{career.category}</div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Score Assignment Dropdown */}
                          <div className="relative group">
                            <button
                              disabled={assigningScores === student.id}
                              className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-xs font-medium transition-colors px-2 py-1 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Assign performance level scores"
                            >
                              {assigningScores === student.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-400" />
                                  <span className="text-[10px]">Assigning...</span>
                                </>
                              ) : (
                                <>
                                  <BarChart3 size={12} />
                                  Scores
                                </>
                              )}
                            </button>

                            {/* Dropdown menu */}
                            <div className="absolute left-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                              <div className="sticky top-0 bg-gray-800 px-3 py-2 border-b border-gray-700">
                                <p className="text-xs text-gray-400 font-medium">Set Performance Level</p>
                              </div>
                              {performanceLevels.map((level, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleAssignScores(student, level)}
                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors border-b border-gray-800 last:border-b-0 ${level.color}`}
                                >
                                  <div className="font-medium text-xs">{level.label}</div>
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => handleAutoGenerateAssessment(student)}
                            disabled={generatingFor === student.id}
                            className="flex items-center gap-1 text-green-400 hover:text-green-300 text-xs font-medium transition-colors px-2 py-1 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Auto-generate assessment results and career match"
                          >
                            {generatingFor === student.id ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-400" />
                                <span className="text-[10px]">Generating...</span>
                              </>
                            ) : (
                              <>
                                <Zap size={12} />
                                Auto
                              </>
                            )}
                          </button>
                              <button
                                onClick={() => setDeletingStudent(student)}
                                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-medium transition-colors px-2 py-1 rounded hover:bg-gray-800"
                                title="Delete student"
                              >
                                <Trash2 size={12} />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
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

      {/* Delete Confirmation Modal */}
      {deletingStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-red-500/20">
                <Trash2 className="text-red-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete Student</h3>
                <p className="text-sm text-gray-400">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-300 mb-2">
                You are about to permanently delete:
              </p>
              <p className="font-semibold text-white">{deletingStudent.name}</p>
              <p className="text-sm text-gray-400">{deletingStudent.email}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type the student's email to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder={deletingStudent.email}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeletingStudent(null);
                  setDeleteConfirmation("");
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteStudent(deletingStudent)}
                disabled={deleteConfirmation !== deletingStudent.email}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Student
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}