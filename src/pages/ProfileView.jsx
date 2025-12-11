// src/pages/ProfileView.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthContext";
import { motion } from "framer-motion";
import DashNav from "../components/dashboard/DashboardNav";
import { User, Edit, BookOpen, Heart, Trophy, Loader2 } from "lucide-react";

export default function ProfileView() {
  const { user } = useAuth() || {};
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const profileRef = doc(db, "users", user.uid, "profile", "survey");
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        setProfile(profileSnap.data());
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: "Demographics & Interests",
      icon: <User className="text-cyan-400" size={28} />,
      gradient: "from-cyan-500/10 to-blue-500/10",
      borderColor: "border-cyan-400/40",
      fields: [
        { key: "Courses", label: "Course" },
        { key: "Interested subjects", label: "Interested Subjects" },
        { key: "interested career area", label: "Interested Career Area" },
        { key: "Type of company want to settle in?", label: "Company Type Preference" },
        { key: "interested in games", label: "Interested in Games" },
        { key: "Interested Type of Books", label: "Book Preferences" },
        { key: "Management or Technical", label: "Career Path" },
        { key: "Salary/work", label: "Priority" },
      ],
    },
    {
      title: "Personal Traits",
      icon: <Heart className="text-pink-400" size={28} />,
      gradient: "from-pink-500/10 to-rose-500/10",
      borderColor: "border-pink-400/40",
      fields: [
        { key: "Taken inputs from seniors or elders", label: "Takes Input from Seniors" },
        { key: "In a Realtionship?", label: "Relationship Status" },
        { key: "Gentle or Tuff behaviour?", label: "Behavior Type" },
        { key: "hard/smart worker", label: "Work Style" },
        { key: "worked in teams ever?", label: "Team Experience" },
        { key: "Introvert", label: "Personality Type" },
      ],
    },
    {
      title: "Credentials & Activities",
      icon: <Trophy className="text-yellow-400" size={28} />,
      gradient: "from-yellow-500/10 to-orange-500/10",
      borderColor: "border-yellow-400/40",
      fields: [
        { key: "Hours working per day", label: "Working Hours/Day" },
        { key: "hackathons", label: "Hackathons Attended" },
        { key: "certifications", label: "Certifications" },
        { key: "workshops", label: "Workshops Attended" },
        { key: "self-learning capability?", label: "Self-Learning" },
        { key: "Extra-courses did", label: "Extra Courses" },
        { key: "olympiads", label: "Olympiads" },
        { key: "Job/Higher Studies?", label: "Future Plans" },
      ],
    },
  ];

  if (loading) {
    return (
      <section className="min-h-screen w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400" size={48} />
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="min-h-screen w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black px-4 sm:px-6 lg:px-10 py-12">
        <DashNav />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mt-12 text-center"
        >
          <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/95 border-2 border-emerald-400/40 rounded-3xl p-12 shadow-2xl overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 opacity-50" />

            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <BookOpen className="mx-auto text-emerald-400 mb-6 drop-shadow-lg" size={80} />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                No Profile Data Found
              </h2>

              <p className="text-gray-300 text-lg mb-8">
                You haven't completed the profile survey yet.
              </p>

              <motion.button
                onClick={() => navigate("/profile-survey")}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-lg rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all font-bold shadow-lg shadow-emerald-500/30 border-2 border-emerald-400 relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-100, 200] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="relative z-10">Complete Profile Survey</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black px-4 sm:px-6 lg:px-10 py-12">
      <DashNav />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mt-12"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400 bg-clip-text text-transparent mb-4">
              Your Profile
            </h1>
            <p className="text-gray-300 text-lg mb-6">
              View and manage your profile survey responses
            </p>

            <motion.button
              onClick={() => navigate("/profile-survey")}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all font-bold flex items-center gap-2 mx-auto shadow-lg shadow-blue-500/30 border-2 border-blue-400/50"
            >
              <Edit size={20} />
              Edit Profile
            </motion.button>
          </motion.div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
              className={`relative bg-gradient-to-br from-gray-800/90 to-gray-900/95 border-2 ${section.borderColor} rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden group hover:shadow-3xl hover:border-opacity-60 transition-all duration-300`}
            >
              {/* Animated Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-30`} />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="p-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-lg"
                  >
                    {section.icon}
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">{section.title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map((field, fieldIndex) => {
                    const value = profile[field.key];
                    const displayValue = Array.isArray(value)
                      ? value.join(", ") || "None"
                      : value !== undefined && value !== ""
                      ? value.toString()
                      : "Not specified";

                    return (
                      <motion.div
                        key={field.key}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.15 + fieldIndex * 0.03 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-gray-700/60 border-2 border-gray-600/60 rounded-xl p-4 hover:bg-gray-700/80 hover:border-gray-500/80 transition-all duration-200 cursor-default"
                      >
                        <p className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                          {field.label}
                        </p>
                        <p className="text-white font-bold text-base">{displayValue}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
