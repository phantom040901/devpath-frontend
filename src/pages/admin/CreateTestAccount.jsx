// src/pages/admin/CreateTestAccount.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import AdminNav from "../../components/admin/AdminNav";
import { motion } from "framer-motion";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  GraduationCap,
  Wrench,
  Zap,
} from "lucide-react";

// RIASEC Profile Templates
const RIASEC_TEMPLATES = {
  realistic_investigative: {
    name: "R+I (Realistic + Investigative)",
    description: "Technical problem-solver - Software Engineer, Programmer",
    profile: {
      "Interested subjects": "Computer Architecture",
      "interested career area": "system developer",
      "Type of company want to settle in?": "Product based",
      "interested in games": "yes",
      "Interested Type of Books": "Technical",
      "Management or Technical": "Technical",
      "Salary/work": "work",
      "Taken inputs from seniors or elders": "yes",
      "In a Realtionship?": "no",
      "Gentle or Tuff behaviour?": "stubborn",
      "hard/smart worker": "hard worker",
      "worked in teams ever?": "yes",
      "Introvert": "yes",
      "Hours working per day": 9,
      "hackathons": 3,
      "certifications": ["python/java"],
      "workshops": ["system designing"],
      "self-learning capability?": "yes",
      "Extra-courses did": "yes",
      "olympiads": "yes",
      "Job/Higher Studies?": "job",
    },
    technicalScores: { logical: 9, coding: 8, memory: "excellent", publicSpeaking: 4 },
    academicRange: [75, 95],
  },
  artistic_social: {
    name: "A+S (Artistic + Social)",
    description: "Creative communicator - UI/UX, Technical Trainer",
    profile: {
      "Interested subjects": "Software Engineering",
      "interested career area": "developer",
      "Type of company want to settle in?": "Service Based",
      "interested in games": "no",
      "Interested Type of Books": "Self help",
      "Management or Technical": "Management",
      "Salary/work": "salary",
      "Taken inputs from seniors or elders": "yes",
      "In a Realtionship?": "yes",
      "Gentle or Tuff behaviour?": "gentle",
      "hard/smart worker": "smart worker",
      "worked in teams ever?": "yes",
      "Introvert": "no",
      "Hours working per day": 6,
      "hackathons": 1,
      "certifications": ["app development"],
      "workshops": ["web technologies"],
      "self-learning capability?": "yes",
      "Extra-courses did": "yes",
      "olympiads": "no",
      "Job/Higher Studies?": "job",
    },
    technicalScores: { logical: 5, coding: 4, memory: "medium", publicSpeaking: 9 },
    academicRange: [55, 75],
  },
  enterprising_conventional: {
    name: "E+C (Enterprising + Conventional)",
    description: "Organized leader - Project Manager, Business Analyst",
    profile: {
      "Interested subjects": "Management",
      "interested career area": "Business process analyst",
      "Type of company want to settle in?": "Product based",
      "interested in games": "no",
      "Interested Type of Books": "Self help",
      "Management or Technical": "Management",
      "Salary/work": "salary",
      "Taken inputs from seniors or elders": "yes",
      "In a Realtionship?": "yes",
      "Gentle or Tuff behaviour?": "gentle",
      "hard/smart worker": "smart worker",
      "worked in teams ever?": "yes",
      "Introvert": "no",
      "Hours working per day": 8,
      "hackathons": 1,
      "certifications": ["shell programming"],
      "workshops": ["system designing"],
      "self-learning capability?": "yes",
      "Extra-courses did": "yes",
      "olympiads": "no",
      "Job/Higher Studies?": "job",
    },
    technicalScores: { logical: 6, coding: 5, memory: "medium", publicSpeaking: 8 },
    academicRange: [65, 85],
  },
  investigative_artistic: {
    name: "I+A (Investigative + Artistic)",
    description: "Analytical creative - Data Analyst, Business Systems Analyst",
    profile: {
      "Interested subjects": "data engineering",
      "interested career area": "Business process analyst",
      "Type of company want to settle in?": "Product based",
      "interested in games": "yes",
      "Interested Type of Books": "Technical",
      "Management or Technical": "Technical",
      "Salary/work": "work",
      "Taken inputs from seniors or elders": "yes",
      "In a Realtionship?": "no",
      "Gentle or Tuff behaviour?": "gentle",
      "hard/smart worker": "hard worker",
      "worked in teams ever?": "yes",
      "Introvert": "yes",
      "Hours working per day": 9,
      "hackathons": 2,
      "certifications": ["machine learning"],
      "workshops": ["database administrator"],
      "self-learning capability?": "yes",
      "Extra-courses did": "yes",
      "olympiads": "yes",
      "Job/Higher Studies?": "higherstudies",
    },
    technicalScores: { logical: 9, coding: 6, memory: "excellent", publicSpeaking: 5 },
    academicRange: [80, 95],
  },
  balanced: {
    name: "Balanced (All Types)",
    description: "Well-rounded - Multiple career options",
    profile: {
      "Interested subjects": "Software Engineering",
      "interested career area": "developer",
      "Type of company want to settle in?": "Service Based",
      "interested in games": "yes",
      "Interested Type of Books": "Technical",
      "Management or Technical": "Management",
      "Salary/work": "work",
      "Taken inputs from seniors or elders": "yes",
      "In a Realtionship?": "yes",
      "Gentle or Tuff behaviour?": "gentle",
      "hard/smart worker": "smart worker",
      "worked in teams ever?": "yes",
      "Introvert": "no",
      "Hours working per day": 7,
      "hackathons": 1,
      "certifications": ["python/java"],
      "workshops": ["web technologies"],
      "self-learning capability?": "yes",
      "Extra-courses did": "yes",
      "olympiads": "no",
      "Job/Higher Studies?": "job",
    },
    technicalScores: { logical: 5, coding: 5, memory: "medium", publicSpeaking: 5 },
    academicRange: [65, 75],
  },
};

// Academic assessments list - matches current Firebase assessment IDs
const ACADEMIC_ASSESSMENTS = [
  { id: "algorithms_data_structures", title: "Algorithms & Data Structures" },
  { id: "communication_skills", title: "Communication Skills" },
  { id: "computer_architecture", title: "Computer Architecture" },
  { id: "computer_networks", title: "Computer Networks" },
  { id: "electronics_digital_logic", title: "Electronics & Digital Logic" },
  { id: "mathematics_logic", title: "Mathematics & Logic" },
  { id: "operating_systems", title: "Operating Systems" },
  { id: "programming_software_dev", title: "Programming & Software Development" },
  { id: "software_engineering", title: "Software Engineering" },
];

// Technical assessments list
const TECHNICAL_ASSESSMENTS = [
  { id: "logical_quotient", title: "Logical Quotient" },
  { id: "coding_skills", title: "Coding Skills" },
  { id: "public_speaking", title: "Public Speaking" },
  { id: "memory_test", title: "Memory Test" },
  { id: "communication_test", title: "Communication Assessment" },
];

export default function CreateTestAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "Test123!",
    selectedTemplate: "",
    autoFillProfile: true,
    autoFillAcademic: true,
    autoFillTechnical: true,
    academicScoreRange: [70, 85],
    technicalScoreRange: [70, 85],
    selectedAcademicAssessments: ACADEMIC_ASSESSMENTS.map((a) => a.id),
    selectedTechnicalAssessments: TECHNICAL_ASSESSMENTS.map((a) => a.id),
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (templateKey) => {
    const template = RIASEC_TEMPLATES[templateKey];
    setFormData((prev) => ({
      ...prev,
      selectedTemplate: templateKey,
      academicScoreRange: template.academicRange,
    }));
  };

  const toggleAssessment = (type, assessmentId) => {
    const field = type === "academic" ? "selectedAcademicAssessments" : "selectedTechnicalAssessments";
    setFormData((prev) => {
      const current = prev[field];
      const updated = current.includes(assessmentId)
        ? current.filter((id) => id !== assessmentId)
        : [...current, assessmentId];
      return { ...prev, [field]: updated };
    });
  };

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const handleCreateAccount = async () => {
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (!formData.selectedTemplate) {
      setError("Please select a RIASEC profile template");
      return;
    }

    setLoading(true);

    try {
      // 1. Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2. Get the selected template
      const template = RIASEC_TEMPLATES[formData.selectedTemplate];

      // 3. Create user document in Firestore
      const userData = {
        uid: user.uid,
        email: formData.email,
        name: formData.name,
        role: "student",
        isTestAccount: true, // Mark as test account
        testTemplate: formData.selectedTemplate,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        emailVerified: true, // Mark as verified for test accounts
      };

      await setDoc(doc(db, "users", user.uid), userData);

      // 4. Auto-fill profile survey if enabled
      if (formData.autoFillProfile && template.profile) {
        const profileData = {
          ...template.profile,
          Courses: "BSIT",
          certifications: template.profile.certifications?.[0] || "none",
          workshops: template.profile.workshops?.[0] || "none",
          profileCompleted: true,
          submittedAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "users", user.uid, "profile", "survey"), profileData);

        // Update user document to mark profile as completed
        await setDoc(
          doc(db, "users", user.uid),
          { profileCompleted: true },
          { merge: true }
        );
      }

      // 5. Auto-fill academic assessments if enabled
      if (formData.autoFillAcademic && formData.selectedAcademicAssessments.length > 0) {
        const [minScore, maxScore] = formData.academicScoreRange;

        // Generate ONE base score, then vary each assessment by ±5% (10% total range)
        const baseScore = randInt(minScore, maxScore);

        // Generate RIASEC profile based on template type
        const generateRiasecProfile = (templateKey) => {
          const profiles = {
            realistic_investigative: { R: randInt(2, 4), I: randInt(2, 4), A: randInt(0, 1), S: randInt(0, 1), E: randInt(0, 1), C: randInt(0, 1) },
            artistic_social: { R: randInt(0, 1), I: randInt(0, 1), A: randInt(2, 4), S: randInt(2, 4), E: randInt(0, 1), C: randInt(0, 1) },
            enterprising_conventional: { R: randInt(0, 1), I: randInt(0, 1), A: randInt(0, 1), S: randInt(0, 1), E: randInt(2, 4), C: randInt(2, 4) },
            investigative_artistic: { R: randInt(0, 1), I: randInt(2, 4), A: randInt(2, 4), S: randInt(0, 1), E: randInt(0, 1), C: randInt(0, 1) },
            balanced: { R: randInt(1, 2), I: randInt(1, 2), A: randInt(1, 2), S: randInt(1, 2), E: randInt(1, 2), C: randInt(1, 2) },
          };
          return profiles[templateKey] || profiles.balanced;
        };

        for (const assessmentId of formData.selectedAcademicAssessments) {
          // Add small variance of ±5% from base score (10% total variance)
          const variance = randInt(-5, 5);
          const score = Math.max(0, Math.min(100, baseScore + variance));

          // Generate RIASEC profile for this assessment result
          const riasecProfile = generateRiasecProfile(formData.selectedTemplate);

          // Use same format as Assessment.jsx: collectionName_subjectId_attemptNum
          const resultId = `assessments_${assessmentId}_1`;

          await setDoc(doc(db, "users", user.uid, "results", resultId), {
            assessmentId: assessmentId,
            collection: "assessments",
            score: score,
            correct: Math.round((score / 100) * 10),
            total: 10,
            attempt: 1,
            completedAt: new Date().toISOString(),
            submittedAt: new Date().toISOString(),
            type: "academic",
            riasecProfile, // Include RIASEC profile for visualization
          });

          // Small delay to ensure unique timestamps
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }

      // 6. Auto-fill technical assessments if enabled
      if (formData.autoFillTechnical && formData.selectedTechnicalAssessments.length > 0) {
        const techScores = template.technicalScores;

        // Generate RIASEC profile for technical assessments based on template
        const generateTechRiasecProfile = (templateKey, assessmentType) => {
          // Technical assessments map to specific RIASEC types
          const typeMapping = {
            logical_quotient: { primary: "I", secondary: "R" },
            coding_skills: { primary: "R", secondary: "I" },
            public_speaking: { primary: "E", secondary: "S" },
            memory_test: { primary: "I", secondary: "C" },
            communication_test: { primary: "S", secondary: "E" },
          };
          const mapping = typeMapping[assessmentType] || { primary: "I", secondary: "R" };

          const profile = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
          profile[mapping.primary] = randInt(2, 4);
          profile[mapping.secondary] = randInt(1, 3);
          return profile;
        };

        for (const assessmentId of formData.selectedTechnicalAssessments) {
          let score;

          // Use template-specific scores for technical assessments
          if (assessmentId === "logical_quotient") {
            score = techScores.logical * 10;
          } else if (assessmentId === "coding_skills") {
            score = techScores.coding * 10;
          } else if (assessmentId === "public_speaking") {
            score = techScores.publicSpeaking * 10;
          } else if (assessmentId === "memory_test") {
            score = techScores.memory === "excellent" ? 90 : techScores.memory === "medium" ? 70 : 50;
          } else {
            score = randInt(60, 85);
          }

          // Generate RIASEC profile for this technical assessment
          const riasecProfile = generateTechRiasecProfile(formData.selectedTemplate, assessmentId);

          // Use same format as Assessment.jsx: collectionName_subjectId_attemptNum
          const resultId = `technicalAssessments_${assessmentId}_1`;

          await setDoc(doc(db, "users", user.uid, "results", resultId), {
            assessmentId: assessmentId,
            collection: "technicalAssessments",
            score: score,
            completedAt: new Date().toISOString(),
            submittedAt: new Date().toISOString(),
            type: "technical",
            riasecProfile, // Include RIASEC profile for visualization
          });
        }
      }

      // 7. Update user document with assessment completion status
      await setDoc(
        doc(db, "users", user.uid),
        {
          assessmentCompleted: formData.autoFillAcademic || formData.autoFillTechnical,
          lastAssessmentDate: serverTimestamp(),
        },
        { merge: true }
      );

      setSuccess(
        `Test account created successfully!\n\nEmail: ${formData.email}\nPassword: ${formData.password}\nTemplate: ${template.name}`
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "Test123!",
        selectedTemplate: "",
        autoFillProfile: true,
        autoFillAcademic: true,
        autoFillTechnical: true,
        academicScoreRange: [70, 85],
        technicalScoreRange: [70, 85],
        selectedAcademicAssessments: ACADEMIC_ASSESSMENTS.map((a) => a.id),
        selectedTechnicalAssessments: TECHNICAL_ASSESSMENTS.map((a) => a.id),
      });
    } catch (err) {
      console.error("Error creating test account:", err);
      setError(err.message || "Failed to create test account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <AdminNav />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <UserPlus className="text-primary-400" />
            Create Test Account
          </h1>
          <p className="text-gray-400 mt-2">
            Create test accounts with pre-filled RIASEC profiles and assessment scores for testing
          </p>
        </motion.div>

        {/* Error/Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-300"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-start gap-3 text-green-300"
          >
            <CheckCircle2 size={20} className="mt-1 flex-shrink-0" />
            <pre className="whitespace-pre-wrap font-mono text-sm">{success}</pre>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Account Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Basic Info Card */}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <User className="text-primary-400" size={20} />
                Account Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Test User A"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="test.user.a@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Default: Test123!</p>
                </div>
              </div>
            </div>

            {/* RIASEC Template Selection */}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="text-emerald-400" size={20} />
                RIASEC Profile Template *
              </h2>

              <div className="space-y-3">
                {Object.entries(RIASEC_TEMPLATES).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => handleTemplateSelect(key)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.selectedTemplate === key
                        ? "bg-primary-500/20 border-primary-500 text-white"
                        : "bg-gray-900/50 border-gray-700 text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    <div className="font-semibold">{template.name}</div>
                    <div className="text-sm text-gray-400 mt-1">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Assessment Configuration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Auto-fill Options */}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="text-yellow-400" size={20} />
                Auto-Fill Options
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoFillProfile}
                    onChange={(e) => handleChange("autoFillProfile", e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-900 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-white">Auto-fill Profile Survey</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoFillAcademic}
                    onChange={(e) => handleChange("autoFillAcademic", e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-900 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-white">Auto-fill Academic Assessments</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoFillTechnical}
                    onChange={(e) => handleChange("autoFillTechnical", e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-900 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-white">Auto-fill Technical Assessments</span>
                </label>
              </div>
            </div>

            {/* Academic Assessments */}
            {formData.autoFillAcademic && (
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <GraduationCap className="text-blue-400" size={20} />
                  Academic Assessments
                </h2>

                {/* Score Range */}
                <div className="mb-4 p-4 bg-gray-900/50 rounded-xl">
                  <label className="block text-sm text-gray-400 mb-2">
                    Score Range: {formData.academicScoreRange[0]}% - {formData.academicScoreRange[1]}%
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.academicScoreRange[0]}
                      onChange={(e) =>
                        handleChange("academicScoreRange", [
                          parseInt(e.target.value),
                          formData.academicScoreRange[1],
                        ])
                      }
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.academicScoreRange[1]}
                      onChange={(e) =>
                        handleChange("academicScoreRange", [
                          formData.academicScoreRange[0],
                          parseInt(e.target.value),
                        ])
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Assessment Checkboxes */}
                <div className="grid grid-cols-1 gap-2">
                  {ACADEMIC_ASSESSMENTS.map((assessment) => (
                    <label
                      key={assessment.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedAcademicAssessments.includes(assessment.id)}
                        onChange={() => toggleAssessment("academic", assessment.id)}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-gray-300 text-sm">{assessment.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Assessments */}
            {formData.autoFillTechnical && (
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Wrench className="text-orange-400" size={20} />
                  Technical Assessments
                </h2>

                <p className="text-sm text-gray-400 mb-4">
                  Scores are based on the selected RIASEC template
                </p>

                {/* Assessment Checkboxes */}
                <div className="grid grid-cols-1 gap-2">
                  {TECHNICAL_ASSESSMENTS.map((assessment) => (
                    <label
                      key={assessment.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedTechnicalAssessments.includes(assessment.id)}
                        onChange={() => toggleAssessment("technical", assessment.id)}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-gray-300 text-sm">{assessment.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Create Button */}
            <button
              onClick={handleCreateAccount}
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-primary-500 to-emerald-400 text-gray-900 font-bold rounded-xl hover:scale-[1.02] transition-all shadow-lg hover:shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Test Account
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
