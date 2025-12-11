// src/pages/ProfileSurvey.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import DashNav from "../components/dashboard/DashboardNav";
import { ChevronLeft, ChevronRight, Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ProfileSurvey() {
  const { user } = useAuth() || {};
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    // Section A: Demographics & Interests
    Courses: "BSIT",
    "Interested subjects": "",
    "interested career area": "",
    "Type of company want to settle in?": "",
    "interested in games": "",
    "Interested Type of Books": "",
    "Management or Technical": "",
    "Salary/work": "",

    // Section B: Personal Traits
    "Taken inputs from seniors or elders": "",
    "In a Realtionship?": "",
    "Gentle or Tuff behaviour?": "",
    "hard/smart worker": "",
    "worked in teams ever?": "",
    "Introvert": "",

    // Section C: Credentials & Activities (NEW!)
    "Hours working per day": 8,
    "hackathons": 0,
    "certifications": [], // Multi-select
    "workshops": [], // Multi-select
    "self-learning capability?": "",
    "Extra-courses did": "",
    "olympiads": "",
    "Job/Higher Studies?": "",
  });

  const [currentSection, setCurrentSection] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const sections = [
    {
      title: "Demographics & Interests",
      description: "Tell us about your academic background and interests",
      icon: "🎓",
    },
    {
      title: "Personal Traits",
      description: "Help us understand your personality and work style",
      icon: "🤝",
    },
    {
      title: "Credentials & Activities",
      description: "Share your achievements, certifications, and activities",
      icon: "🏆",
    },
  ];

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field, value) => {
    setProfile((prev) => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const validateSection = (sectionIndex) => {
    if (sectionIndex === 0) {
      // Section A: Demographics & Interests
      return (
        profile["Interested subjects"] &&
        profile["interested career area"] &&
        profile["Type of company want to settle in?"] &&
        profile["interested in games"] &&
        profile["Interested Type of Books"] &&
        profile["Management or Technical"] &&
        profile["Salary/work"]
      );
    } else if (sectionIndex === 1) {
      // Section B: Personal Traits
      return (
        profile["Taken inputs from seniors or elders"] &&
        profile["In a Realtionship?"] &&
        profile["Gentle or Tuff behaviour?"] &&
        profile["hard/smart worker"] &&
        profile["worked in teams ever?"] &&
        profile["Introvert"]
      );
    } else if (sectionIndex === 2) {
      // Section C: Credentials & Activities
      return (
        profile["Hours working per day"] &&
        profile["self-learning capability?"] &&
        profile["Extra-courses did"] &&
        profile["olympiads"] &&
        profile["Job/Higher Studies?"]
      );
    }
    return true;
  };

  const handleNext = () => {
    if (!validateSection(currentSection)) {
      alert("Please answer all required questions before continuing.");
      return;
    }
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Please log in to save your profile.");
      return;
    }

    if (!validateSection(currentSection)) {
      alert("Please answer all required questions before submitting.");
      return;
    }

    setSaving(true);

    try {
      // Convert certifications and workshops arrays to comma-separated strings or first value
      const profileData = {
        ...profile,
        certifications: profile.certifications.length > 0 ? profile.certifications[0] : "none",
        workshops: profile.workshops.length > 0 ? profile.workshops[0] : "none",
        completedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", user.uid, "profile", "survey"), profileData);

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black px-4 sm:px-6 lg:px-10 py-12">
      <DashNav />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mt-12"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-green-300 to-cyan-400 bg-clip-text text-transparent mb-4">
            Create Your Profile
          </h1>
          <p className="text-gray-300 text-lg">
            Complete all sections to continue to assessments
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-6">
            {sections.map((section, index) => (
              <div
                key={index}
                className={`flex-1 ${index < sections.length - 1 ? "mr-2 sm:mr-4" : ""}`}
              >
                <div className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl shadow-lg transition-all
                    ${
                      index < currentSection
                        ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white"
                        : index === currentSection
                        ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-white animate-pulse"
                        : "bg-gray-700/50 text-gray-400 border-2 border-gray-600"
                    }`}
                  >
                    {index < currentSection ? (
                      <CheckCircle2 size={24} className="animate-in zoom-in" />
                    ) : (
                      <span className="text-2xl">{section.icon}</span>
                    )}
                    {index === currentSection && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-cyan-400"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  {index < sections.length - 1 && (
                    <div className="flex-1 h-1 mx-1 sm:mx-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          index < currentSection
                            ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                            : "bg-transparent"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: index < currentSection ? "100%" : "0%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
                <p className={`text-xs mt-2 text-center font-medium hidden sm:block ${
                  index === currentSection ? "text-cyan-400" : "text-gray-400"
                }`}>
                  {section.title}
                </p>
              </div>
            ))}
          </div>

          {/* Progress Percentage */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Overall Progress</span>
            <span className="text-sm font-bold text-emerald-400">
              {Math.round(((currentSection) / sections.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentSection) / sections.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Enhanced Form Card */}
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/95 border-2 border-emerald-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-50" />

          {/* Content */}
          <div className="relative z-10">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl shadow-lg">
                  <span className="text-2xl">{sections[currentSection].icon}</span>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {sections[currentSection].title}
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base mt-1">
                    {sections[currentSection].description}
                  </p>
                </div>
              </div>
            </div>

          {/* Section A: Demographics & Interests */}
          {currentSection === 0 && (
            <div className="space-y-6">
              {/* Question 1: Course */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group"
              >
                <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-bold">1</span>
                  Course <span className="text-red-400 text-lg">*</span>
                </label>
                <select
                  value={profile.Courses}
                  onChange={(e) => handleChange("Courses", e.target.value)}
                  className="w-full px-5 py-4 bg-gray-700/50 text-white border-2 border-gray-600 rounded-xl focus:border-emerald-400 focus:bg-gray-700 focus:ring-2 focus:ring-emerald-400/20 transition-all outline-none hover:border-emerald-400/50 cursor-pointer"
                  required
                >
                  <option value="BSIT">BSIT</option>
                </select>
              </motion.div>

              {/* Question 2: Interested Subjects */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group"
              >
                <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-bold">2</span>
                  Interested Subject <span className="text-red-400 text-lg">*</span>
                </label>
                <select
                  value={profile["Interested subjects"]}
                  onChange={(e) => handleChange("Interested subjects", e.target.value)}
                  className="w-full px-5 py-4 bg-gray-700/50 text-white border-2 border-gray-600 rounded-xl focus:border-emerald-400 focus:bg-gray-700 focus:ring-2 focus:ring-emerald-400/20 transition-all outline-none hover:border-emerald-400/50 cursor-pointer"
                  required
                >
                  <option value="">Select your interested subject</option>
                  <option value="Computer Architecture">Computer Architecture</option>
                  <option value="IOT">Internet of Things (IOT)</option>
                  <option value="Management">Management</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="cloud computing">Cloud Computing</option>
                  <option value="data engineering">Data Engineering</option>
                  <option value="hacking">Hacking / Cybersecurity</option>
                  <option value="networks">Networks</option>
                  <option value="parallel computing">Parallel Computing</option>
                  <option value="programming">Programming</option>
                </select>
              </motion.div>

              {/* Question 3: Interested Career Area */}
              <div>
                <label className="block text-white font-medium mb-2">
                  3. Interested Career Area <span className="text-red-400">*</span>
                </label>
                <select
                  value={profile["interested career area"]}
                  onChange={(e) => handleChange("interested career area", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-emerald-400 focus:outline-none"
                  required
                >
                  <option value="">Select your career interest</option>
                  <option value="Business process analyst">Business Process Analyst</option>
                  <option value="cloud computing">Cloud Computing</option>
                  <option value="developer">Developer</option>
                  <option value="security">Security / Cybersecurity</option>
                  <option value="system developer">System Developer</option>
                  <option value="testing">Testing / QA</option>
                </select>
              </div>

              {/* Question 4: Company Type */}
              <div>
                <label className="block text-white font-medium mb-2">
                  4. Type of Company to Settle In <span className="text-red-400">*</span>
                </label>
                <select
                  value={profile["Type of company want to settle in?"]}
                  onChange={(e) => handleChange("Type of company want to settle in?", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-emerald-400 focus:outline-none"
                  required
                >
                  <option value="">Select company type</option>
                  <option value="BPA">BPA (Business Process Analyst)</option>
                  <option value="Cloud Services">Cloud Services</option>
                  <option value="Finance">Finance</option>
                  <option value="Product based">Product Based</option>
                  <option value="SAaS services">SaaS Services</option>
                  <option value="Sales and Marketing">Sales and Marketing</option>
                  <option value="Service Based">Service Based</option>
                  <option value="Testing and Maintainance Services">Testing and Maintenance Services</option>
                  <option value="Web Services">Web Services</option>
                  <option value="product development">Product Development</option>
                </select>
              </div>

              {/* Question 5: Interested in Games */}
              <div>
                <label className="block text-white font-medium mb-2">
                  5. Are you interested in games? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="interestedInGames"
                      value="yes"
                      checked={profile["interested in games"] === "yes"}
                      onChange={(e) => handleChange("interested in games", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="interestedInGames"
                      value="no"
                      checked={profile["interested in games"] === "no"}
                      onChange={(e) => handleChange("interested in games", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">No</span>
                  </label>
                </div>
              </div>

              {/* Question 6: Book Type */}
              <div>
                <label className="block text-white font-medium mb-2">
                  6. Interested Type of Books <span className="text-red-400">*</span>
                </label>
                <select
                  value={profile["Interested Type of Books"]}
                  onChange={(e) => handleChange("Interested Type of Books", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-emerald-400 focus:outline-none"
                  required
                >
                  <option value="">Select book type preference</option>
                  <option value="Science">Science</option>
                  <option value="Science fiction">Science Fiction</option>
                  <option value="Math">Math</option>
                  <option value="Self help">Self Help</option>
                  <option value="Action and Adventure">Action and Adventure</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Horror">Horror</option>
                  <option value="History">History</option>
                  <option value="Biography">Biography</option>
                </select>
              </div>

              {/* Question 7: Management or Technical */}
              <div>
                <label className="block text-white font-medium mb-2">
                  7. Career Path Preference <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="managementOrTechnical"
                      value="Management"
                      checked={profile["Management or Technical"] === "Management"}
                      onChange={(e) => handleChange("Management or Technical", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Management</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="managementOrTechnical"
                      value="Technical"
                      checked={profile["Management or Technical"] === "Technical"}
                      onChange={(e) => handleChange("Management or Technical", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Technical</span>
                  </label>
                </div>
              </div>

              {/* Question 8: Salary or Work */}
              <div>
                <label className="block text-white font-medium mb-2">
                  8. What drives you more? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="salaryWork"
                      value="salary"
                      checked={profile["Salary/work"] === "salary"}
                      onChange={(e) => handleChange("Salary/work", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Salary Driven</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="salaryWork"
                      value="work"
                      checked={profile["Salary/work"] === "work"}
                      onChange={(e) => handleChange("Salary/work", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Work Driven (Passion)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Section B: Personal Traits */}
          {currentSection === 1 && (
            <div className="space-y-6">
              {/* Question 9: Taken Inputs from Seniors */}
              <div>
                <label className="block text-white font-medium mb-2">
                  9. Have you taken career guidance from seniors/elders? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="takenInputs"
                      value="yes"
                      checked={profile["Taken inputs from seniors or elders"] === "yes"}
                      onChange={(e) => handleChange("Taken inputs from seniors or elders", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="takenInputs"
                      value="no"
                      checked={profile["Taken inputs from seniors or elders"] === "no"}
                      onChange={(e) => handleChange("Taken inputs from seniors or elders", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">No</span>
                  </label>
                </div>
              </div>

              {/* Question 10: Relationship */}
              <div>
                <label className="block text-white font-medium mb-2">
                  10. Are you currently in a relationship? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="relationship"
                      value="yes"
                      checked={profile["In a Realtionship?"] === "yes"}
                      onChange={(e) => handleChange("In a Realtionship?", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="relationship"
                      value="no"
                      checked={profile["In a Realtionship?"] === "no"}
                      onChange={(e) => handleChange("In a Realtionship?", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">No</span>
                  </label>
                </div>
              </div>

              {/* Question 11: Behaviour */}
              <div>
                <label className="block text-white font-medium mb-2">
                  11. How would you describe your behavior? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="behaviour"
                      value="gentle"
                      checked={profile["Gentle or Tuff behaviour?"] === "gentle"}
                      onChange={(e) => handleChange("Gentle or Tuff behaviour?", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Gentle</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="behaviour"
                      value="stubborn"
                      checked={profile["Gentle or Tuff behaviour?"] === "stubborn"}
                      onChange={(e) => handleChange("Gentle or Tuff behaviour?", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Tough/Stubborn</span>
                  </label>
                </div>
              </div>

              {/* Question 12: Worker Type */}
              <div>
                <label className="block text-white font-medium mb-2">
                  12. What type of worker are you? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="workerType"
                      value="hard worker"
                      checked={profile["hard/smart worker"] === "hard worker"}
                      onChange={(e) => handleChange("hard/smart worker", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Hard Worker</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="workerType"
                      value="smart worker"
                      checked={profile["hard/smart worker"] === "smart worker"}
                      onChange={(e) => handleChange("hard/smart worker", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Smart Worker</span>
                  </label>
                </div>
              </div>

              {/* Question 13: Worked in Teams */}
              <div>
                <label className="block text-white font-medium mb-2">
                  13. Have you ever worked in teams? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="workedInTeams"
                      value="yes"
                      checked={profile["worked in teams ever?"] === "yes"}
                      onChange={(e) => handleChange("worked in teams ever?", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="workedInTeams"
                      value="no"
                      checked={profile["worked in teams ever?"] === "no"}
                      onChange={(e) => handleChange("worked in teams ever?", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">No</span>
                  </label>
                </div>
              </div>

              {/* Question 14: Introvert */}
              <div>
                <label className="block text-white font-medium mb-2">
                  14. Are you an introvert? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="introvert"
                      value="yes"
                      checked={profile["Introvert"] === "yes"}
                      onChange={(e) => handleChange("Introvert", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="introvert"
                      value="no"
                      checked={profile["Introvert"] === "no"}
                      onChange={(e) => handleChange("Introvert", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">No</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Section C: Credentials & Activities */}
          {currentSection === 2 && (
            <div className="space-y-6">
              {/* Question 15: Hours Working Per Day */}
              <div>
                <label className="block text-white font-medium mb-2">
                  15. How many hours do you work/study per day? <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="4"
                  max="12"
                  value={profile["Hours working per day"]}
                  onChange={(e) => handleChange("Hours working per day", parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-emerald-400 focus:outline-none"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">Range: 4-12 hours</p>
              </div>

              {/* Question 16: Hackathons */}
              <div>
                <label className="block text-white font-medium mb-2">
                  16. How many hackathons have you participated in?
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={profile.hackathons}
                  onChange={(e) => handleChange("hackathons", parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-emerald-400 focus:outline-none"
                />
              </div>

              {/* Question 17: Certifications */}
              <div>
                <label className="block text-white font-medium mb-3">
                  17. Which certifications have you earned? (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: "python", label: "Python Programming" },
                    { value: "machine learning", label: "Machine Learning" },
                    { value: "full stack", label: "Full Stack Development" },
                    { value: "app development", label: "App Development" },
                    { value: "information security", label: "Information Security" },
                    { value: "hadoop", label: "Hadoop / Big Data" },
                    { value: "r programming", label: "R Programming" },
                    { value: "shell programming", label: "Shell Programming" },
                    { value: "distro making", label: "Distro Making / Linux" },
                  ].map((cert) => (
                    <label key={cert.value} className="flex items-center">
                      <input
                        type="checkbox"
                        value={cert.value}
                        checked={profile.certifications.includes(cert.value)}
                        onChange={() => handleMultiSelect("certifications", cert.value)}
                        className="mr-2"
                      />
                      <span className="text-white text-sm">{cert.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 18: Workshops */}
              <div>
                <label className="block text-white font-medium mb-3">
                  18. Which workshops have you attended? (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: "data science", label: "Data Science" },
                    { value: "web technologies", label: "Web Technologies" },
                    { value: "cloud computing", label: "Cloud Computing" },
                    { value: "hacking", label: "Hacking / Cybersecurity" },
                    { value: "game development", label: "Game Development" },
                    { value: "system designing", label: "System Designing" },
                    { value: "database security", label: "Database Security" },
                    { value: "testing", label: "Testing / QA" },
                  ].map((workshop) => (
                    <label key={workshop.value} className="flex items-center">
                      <input
                        type="checkbox"
                        value={workshop.value}
                        checked={profile.workshops.includes(workshop.value)}
                        onChange={() => handleMultiSelect("workshops", workshop.value)}
                        className="mr-2"
                      />
                      <span className="text-white text-sm">{workshop.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 19: Self-Learning */}
              <div>
                <label className="block text-white font-medium mb-2">
                  19. Can you learn new technologies on your own? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="selfLearning"
                      value="yes"
                      checked={profile["self-learning capability?"] === "yes"}
                      onChange={(e) => handleChange("self-learning capability?", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="selfLearning"
                      value="no"
                      checked={profile["self-learning capability?"] === "no"}
                      onChange={(e) => handleChange("self-learning capability?", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">No</span>
                  </label>
                </div>
              </div>

              {/* Question 20: Extra Courses */}
              <div>
                <label className="block text-white font-medium mb-2">
                  20. Have you taken extra courses outside your curriculum? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="extraCourses"
                      value="yes"
                      checked={profile["Extra-courses did"] === "yes"}
                      onChange={(e) => handleChange("Extra-courses did", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="extraCourses"
                      value="no"
                      checked={profile["Extra-courses did"] === "no"}
                      onChange={(e) => handleChange("Extra-courses did", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">No</span>
                  </label>
                </div>
              </div>

              {/* Question 21: Olympiads */}
              <div>
                <label className="block text-white font-medium mb-2">
                  21. Have you won any olympiads or competitions? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="olympiads"
                      value="yes"
                      checked={profile["olympiads"] === "yes"}
                      onChange={(e) => handleChange("olympiads", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="olympiads"
                      value="no"
                      checked={profile["olympiads"] === "no"}
                      onChange={(e) => handleChange("olympiads", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">No</span>
                  </label>
                </div>
              </div>

              {/* Question 22: Job or Higher Studies */}
              <div>
                <label className="block text-white font-medium mb-2">
                  22. What are your plans after graduation? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="futureplan"
                      value="job"
                      checked={profile["Job/Higher Studies?"] === "job"}
                      onChange={(e) => handleChange("Job/Higher Studies?", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Get a Job</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="futureplan"
                      value="higherstudies"
                      checked={profile["Job/Higher Studies?"] === "higherstudies"}
                      onChange={(e) => handleChange("Job/Higher Studies?", e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-white">Pursue Higher Studies</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Navigation Buttons */}
          <div className="flex justify-between items-center mt-10 pt-8 border-t-2 border-gray-700/50">
            <motion.button
              onClick={handlePrevious}
              disabled={currentSection === 0}
              whileHover={currentSection > 0 ? { scale: 1.05, x: -5 } : {}}
              whileTap={currentSection > 0 ? { scale: 0.95 } : {}}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-700/80 text-white rounded-xl hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 font-semibold transition-all shadow-lg border-2 border-gray-600 hover:border-gray-500"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Back</span>
            </motion.button>

            {currentSection < sections.length - 1 ? (
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 flex items-center gap-2 font-bold transition-all shadow-lg shadow-emerald-500/30 border-2 border-emerald-400"
              >
                <span>Next</span>
                <ChevronRight size={20} />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                disabled={saving}
                whileHover={!saving ? { scale: 1.05 } : {}}
                whileTap={!saving ? { scale: 0.95 } : {}}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold transition-all shadow-lg shadow-cyan-500/30 border-2 border-cyan-400 relative overflow-hidden"
              >
                {!saving && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: [-100, 200] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-2">
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span className="hidden sm:inline">Save & Continue</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  )}
                </div>
              </motion.button>
            )}
          </div>
          </div>
        </motion.div>

        {/* Enhanced Success Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            >
              <motion.div
                initial={{ scale: 0.5, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 50 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative bg-gradient-to-br from-gray-800/95 to-gray-900/95 p-10 rounded-3xl shadow-2xl text-center max-w-md border-2 border-emerald-400/30 overflow-hidden"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />

                {/* Confetti Effect */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </motion.div>

                <div className="relative z-10">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    <CheckCircle2 size={80} className="text-emerald-400 mx-auto mb-6 drop-shadow-lg" />
                  </motion.div>
                  <h2 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                    Profile Saved Successfully!
                  </h2>
                  <p className="text-gray-300 text-lg mb-2">
                    Redirecting to dashboard...
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
