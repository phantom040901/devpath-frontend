// src/components/dashboard/DashboardNav.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut, Settings, ChevronDown, Menu, X, MessageSquare } from "lucide-react";
import { useAuth } from "../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "../../assets/logo.png";
import NotificationBell from "./NotificationBell";

export default function DashboardNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // State and refs for dropdowns
  const [assessOpen, setAssessOpen] = useState(false);
  const [careerOpen, setCareerOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);

  // Mobile dropdown states
  const [mobileCareerOpen, setMobileCareerOpen] = useState(false);
  const [mobileAssessOpen, setMobileAssessOpen] = useState(false);
  const [mobileProgressOpen, setMobileProgressOpen] = useState(false);
  const assessRef = useRef(null);
  const careerRef = useRef(null);
  const progressRef = useRef(null);
  const dropdownRef = useRef(null);
  const assessTimeout = useRef(null);
  const careerTimeout = useRef(null);
  const progressTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Unified outside-click listener for all dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (assessRef.current && !assessRef.current.contains(e.target)) {
        setAssessOpen(false);
      }
      if (careerRef.current && !careerRef.current.contains(e.target)) {
        setCareerOpen(false);
      }
      if (progressRef.current && !progressRef.current.contains(e.target)) {
        setProgressOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (assessTimeout.current) clearTimeout(assessTimeout.current);
      if (careerTimeout.current) clearTimeout(careerTimeout.current);
      if (progressTimeout.current) clearTimeout(progressTimeout.current);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Reports", path: "/student/reports" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 w-full backdrop-blur-md bg-primary-1400/90 dark:bg-primary-1400/90 light:bg-white/95 transition-shadow duration-300 border-b border-gray-800/50 dark:border-gray-800/50 light:border-gray-200"
      style={{
        boxShadow: scrollY > 10 ? "0 8px 25px rgba(0,0,0,0.4)" : "none",
        zIndex: 9000,
      }}
    >
      <div className="m-auto flex max-w-[90rem] justify-between items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-primary-50 dark:text-primary-50 light:text-gray-900 w-full">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-x-2 sm:gap-x-4 group">
          <div className="relative">
            <img
              src={logoImage}
              alt="DevPath Logo"
              className="h-10 sm:h-12 md:h-14 transition-all duration-300 group-hover:scale-110 relative z-10"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.6)) drop-shadow(0 0 16px rgba(6, 182, 212, 0.4)) brightness(1.2)',
              }}
            />
            <div 
              className="absolute inset-0 blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(14, 116, 144, 0.6) 50%, transparent 70%)',
              }}
            />
          </div>
          <p className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-primary-500 to-cyan-400 bg-clip-text text-transparent group-hover:from-primary-400 group-hover:via-cyan-300 group-hover:to-primary-500 transition-all duration-300"
             style={{
               textShadow: '0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)',
             }}>
            DevPath
          </p>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-x-6 xl:gap-x-8">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`relative transition-all duration-200 text-sm xl:text-base font-medium hover:scale-105 ${
                  location.pathname === link.path
                    ? "text-primary-400 dark:text-primary-400 light:text-primary-600 font-bold"
                    : "text-gray-300 dark:text-gray-300 light:text-gray-700 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 to-cyan-400 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          ))}

          {/* Career dropdown */}
          <li
            ref={careerRef}
            className="relative cursor-pointer"
            onMouseEnter={() => {
              if (careerTimeout.current) clearTimeout(careerTimeout.current);
              setCareerOpen(true);
            }}
            onMouseLeave={() => {
              if (careerTimeout.current) clearTimeout(careerTimeout.current);
              careerTimeout.current = setTimeout(() => setCareerOpen(false), 120);
            }}
          >
            <button
              onClick={() => setCareerOpen((v) => !v)}
              className={`relative flex items-center gap-1 transition-all duration-200 text-sm xl:text-base font-medium hover:scale-105 ${
                ['/career-matches', '/career-roadmap', '/student/learning-path'].includes(location.pathname)
                  ? "text-primary-400 dark:text-primary-400 light:text-primary-600 font-bold"
                  : "text-gray-300 dark:text-gray-300 light:text-gray-700 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600"
              }`}
              aria-haspopup="menu"
              aria-expanded={careerOpen}
            >
              Career <ChevronDown size={14} className={`transition-transform duration-200 ${careerOpen ? 'rotate-180' : ''}`} />
              {['/career-matches', '/career-roadmap', '/student/learning-path'].includes(location.pathname) && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 to-cyan-400 rounded-full" />
              )}
            </button>

            <AnimatePresence>
              {careerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-3 bg-primary-1400/95 dark:bg-primary-1400/95 light:bg-white/95 backdrop-blur-xl border border-white/10 dark:border-white/10 light:border-gray-200 rounded-xl shadow-2xl w-56 py-2 overflow-hidden"
                  style={{ zIndex: 9100 }}
                  onMouseEnter={() => {
                    if (careerTimeout.current) clearTimeout(careerTimeout.current);
                    setCareerOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (careerTimeout.current) clearTimeout(careerTimeout.current);
                    careerTimeout.current = setTimeout(() => setCareerOpen(false), 120);
                  }}
                >
                  <Link
                    to="/career-matches"
                    onClick={() => setCareerOpen(false)}
                    className="block px-4 py-3 text-sm hover:bg-primary-1200 dark:hover:bg-primary-1200 light:hover:bg-gray-100 transition-colors duration-150 text-gray-200 dark:text-gray-200 light:text-gray-700 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 font-medium"
                  >
                    🎯 Career Matches
                  </Link>
                  <Link
                    to="/career-roadmap"
                    onClick={() => setCareerOpen(false)}
                    className="block px-4 py-3 text-sm hover:bg-primary-1200 dark:hover:bg-primary-1200 light:hover:bg-gray-100 transition-colors duration-150 text-gray-200 dark:text-gray-200 light:text-gray-700 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 font-medium"
                  >
                    🗺️ Career Roadmap
                  </Link>
                  <Link
                    to="/student/learning-path"
                    onClick={() => setCareerOpen(false)}
                    className="block px-4 py-3 text-sm hover:bg-primary-1200 dark:hover:bg-primary-1200 light:hover:bg-gray-100 transition-colors duration-150 text-gray-200 dark:text-gray-200 light:text-gray-700 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 font-medium"
                  >
                    📖 Learning Path
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {/* Assessments dropdown */}
          <li
            ref={assessRef}
            className="relative cursor-pointer"
            onMouseEnter={() => {
              if (assessTimeout.current) clearTimeout(assessTimeout.current);
              setAssessOpen(true);
            }}
            onMouseLeave={() => {
              if (assessTimeout.current) clearTimeout(assessTimeout.current);
              assessTimeout.current = setTimeout(() => setAssessOpen(false), 120);
            }}
          >
            <button
              onClick={() => setAssessOpen((v) => !v)}
              className="relative flex items-center gap-1 transition-all duration-200 text-sm xl:text-base font-medium hover:scale-105 text-gray-300 dark:text-gray-300 light:text-gray-700 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600"
              aria-haspopup="menu"
              aria-expanded={assessOpen}
            >
              Assessments <ChevronDown size={14} className={`transition-transform duration-200 ${assessOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {assessOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-3 bg-primary-1400/95 dark:bg-primary-1400/95 light:bg-white/95 backdrop-blur-xl border border-white/10 dark:border-white/10 light:border-gray-200 rounded-xl shadow-2xl w-56 py-2 overflow-hidden"
                  style={{ zIndex: 9100 }}
                  onMouseEnter={() => {
                    if (assessTimeout.current) clearTimeout(assessTimeout.current);
                    setAssessOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (assessTimeout.current) clearTimeout(assessTimeout.current);
                    assessTimeout.current = setTimeout(() => setAssessOpen(false), 120);
                  }}
                >
                  <Link
                    to="/assessments?tab=academic"
                    onClick={() => setAssessOpen(false)}
                    className="block px-4 py-3 text-sm hover:bg-primary-1200 dark:hover:bg-primary-1200 light:hover:bg-gray-100 transition-colors duration-150 text-gray-200 dark:text-gray-200 light:text-gray-700 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 font-medium"
                  >
                    📚 Academic
                  </Link>
                  <Link
                    to="/assessments?tab=technical"
                    onClick={() => setAssessOpen(false)}
                    className="block px-4 py-3 text-sm hover:bg-primary-1200 dark:hover:bg-primary-1200 light:hover:bg-gray-100 transition-colors duration-150 text-gray-200 dark:text-gray-200 light:text-gray-700 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 font-medium"
                  >
                    ⚡ Technical
                  </Link>
                  <Link
                    to="/assessments?tab=personal"
                    onClick={() => setAssessOpen(false)}
                    className="block px-4 py-3 text-sm hover:bg-primary-1200 dark:hover:bg-primary-1200 light:hover:bg-gray-100 transition-colors duration-150 text-gray-200 dark:text-gray-200 light:text-gray-700 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 font-medium"
                  >
                    🎯 Personal
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {/* Progress dropdown */}
          <li
            ref={progressRef}
            className="relative cursor-pointer"
            onMouseEnter={() => {
              if (progressTimeout.current) clearTimeout(progressTimeout.current);
              setProgressOpen(true);
            }}
            onMouseLeave={() => {
              if (progressTimeout.current) clearTimeout(progressTimeout.current);
              progressTimeout.current = setTimeout(() => setProgressOpen(false), 120);
            }}
          >
            <button
              onClick={() => setProgressOpen((v) => !v)}
              className={`relative flex items-center gap-1 transition-all duration-200 text-sm xl:text-base font-medium hover:scale-105 ${
                location.pathname === '/student/progress'
                  ? "text-primary-400 dark:text-primary-400 light:text-primary-600 font-bold"
                  : "text-gray-300 dark:text-gray-300 light:text-gray-700 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600"
              }`}
              aria-haspopup="menu"
              aria-expanded={progressOpen}
            >
              Progress <ChevronDown size={14} className={`transition-transform duration-200 ${progressOpen ? 'rotate-180' : ''}`} />
              {location.pathname === '/student/progress' && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 to-cyan-400 rounded-full" />
              )}
            </button>

            <AnimatePresence>
              {progressOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-3 bg-primary-1400/95 dark:bg-primary-1400/95 light:bg-white/95 backdrop-blur-xl border border-white/10 dark:border-white/10 light:border-gray-200 rounded-xl shadow-2xl w-56 py-2 overflow-hidden"
                  style={{ zIndex: 9100 }}
                  onMouseEnter={() => {
                    if (progressTimeout.current) clearTimeout(progressTimeout.current);
                    setProgressOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (progressTimeout.current) clearTimeout(progressTimeout.current);
                    progressTimeout.current = setTimeout(() => setProgressOpen(false), 120);
                  }}
                >
                  <Link
                    to="/student/progress"
                    onClick={() => setProgressOpen(false)}
                    className="block px-4 py-3 text-sm hover:bg-primary-1200 dark:hover:bg-primary-1200 light:hover:bg-gray-100 transition-colors duration-150 text-gray-200 dark:text-gray-200 light:text-gray-700 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 font-medium"
                  >
                    📊 Overall Progress
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Messages Icon - Desktop */}
          <Link
            to="/student/messaging"
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-primary-1200/50 dark:bg-primary-1200/50 light:bg-gray-100 hover:bg-primary-1200 dark:hover:bg-primary-1200 light:hover:bg-gray-200 transition-all duration-200 border border-transparent hover:border-primary-500/30 relative group"
          >
            <MessageSquare
              size={20}
              className={`${
                location.pathname === '/student/messaging'
                  ? 'text-primary-400 dark:text-primary-400 light:text-primary-600'
                  : 'text-gray-300 dark:text-gray-300 light:text-gray-600 group-hover:text-primary-400 dark:group-hover:text-primary-400 light:group-hover:text-primary-600'
              }`}
            />
            {location.pathname === '/student/messaging' && (
              <div className="absolute inset-0 rounded-full border-2 border-primary-400 dark:border-primary-400 light:border-primary-600" />
            )}
          </Link>

          {/* Notification Bell - Desktop */}
          <div className="hidden lg:block">
            <NotificationBell />
          </div>

          {/* User Dropdown - Desktop */}
          <div className="relative hidden lg:block" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full bg-primary-1200/50 dark:bg-primary-1200/50 light:bg-gray-100 px-3 py-2 hover:bg-primary-1200 dark:hover:bg-primary-1200 light:hover:bg-gray-200 transition-all duration-200 border border-transparent hover:border-primary-500/30"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                {user?.firstName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="hidden xl:inline text-sm max-w-[120px] truncate font-medium text-gray-200 dark:text-gray-200 light:text-gray-700">
                {user?.firstName || user?.email?.split('@')[0] || "User"}
              </span>
              <ChevronDown size={16} className={`opacity-70 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-56 rounded-xl bg-primary-1400/95 dark:bg-primary-1400/95 light:bg-white/95 backdrop-blur-xl shadow-2xl border border-white/10 dark:border-white/10 light:border-gray-200 overflow-hidden"
                  style={{ zIndex: 9100 }}
                >
                  <div className="px-4 py-3 border-b border-white/10 dark:border-white/10 light:border-gray-200">
                    <p className="text-sm font-semibold text-white dark:text-white light:text-gray-900 truncate">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.email?.split('@')[0] || "User"}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 truncate mt-0.5">{user?.email}</p>
                  </div>
                  <Link to="/student/profile" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary-1200 dark:hover:bg-primary-1200 light:hover:bg-gray-100 transition-colors text-gray-200 dark:text-gray-200 light:text-gray-700 font-medium">
                    <User size={16} /> Profile
                  </Link>
                  <Link to="/student/settings" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary-1200 dark:hover:bg-primary-1200 light:hover:bg-gray-100 transition-colors text-gray-200 dark:text-gray-200 light:text-gray-700 font-medium">
                    <Settings size={16} /> Settings
                  </Link>
                  <div className="border-t border-white/10 dark:border-white/10 light:border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/20 transition-colors font-medium"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Messages Icon - Mobile/Tablet */}
          <Link
            to="/student/messaging"
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-primary-1200/50 dark:bg-primary-1200/50 light:bg-gray-100 hover:bg-primary-1200 dark:hover:bg-primary-1200 light:hover:bg-gray-200 transition-all duration-200 relative"
          >
            <MessageSquare
              size={20}
              className={`${
                location.pathname === '/student/messaging'
                  ? 'text-primary-400 dark:text-primary-400 light:text-primary-600'
                  : 'text-gray-300 dark:text-gray-300 light:text-gray-600'
              }`}
            />
            {location.pathname === '/student/messaging' && (
              <div className="absolute inset-0 rounded-full border-2 border-primary-400 dark:border-primary-400 light:border-primary-600" />
            )}
          </Link>

          {/* Notification Bell - Mobile/Tablet */}
          <div className="lg:hidden">
            <NotificationBell />
          </div>

          {/* Mobile Burger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg bg-primary-1200/50 hover:bg-primary-1200 transition"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-primary-1400/95 dark:bg-primary-1400/95 light:bg-white/95 backdrop-blur-xl px-4 sm:px-6 py-4 border-t border-white/10 dark:border-white/10 light:border-gray-200 max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <ul className="flex flex-col gap-2">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-3 px-3 rounded-lg transition-colors ${
                      location.pathname === link.path
                        ? "text-primary-400 dark:text-primary-400 light:text-primary-600 font-semibold bg-primary-500/10 dark:bg-primary-500/10 light:bg-primary-50"
                        : "text-gray-200 dark:text-gray-200 light:text-gray-700 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 hover:bg-primary-500/5 dark:hover:bg-primary-500/5 light:hover:bg-gray-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              {/* Career Collapsible */}
              <li className="flex flex-col">
                <button
                  onClick={() => setMobileCareerOpen(!mobileCareerOpen)}
                  className={`flex items-center justify-between py-3 px-3 rounded-lg font-semibold transition-colors ${
                    ['/career-matches', '/career-roadmap', '/student/learning-path'].includes(location.pathname)
                      ? "text-primary-400 dark:text-primary-400 light:text-primary-600 bg-primary-500/10 dark:bg-primary-500/10 light:bg-primary-50"
                      : "text-gray-200 dark:text-gray-200 light:text-gray-700 hover:bg-primary-500/5 dark:hover:bg-primary-500/5 light:hover:bg-gray-100"
                  }`}
                >
                  <span>Career</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${mobileCareerOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {mobileCareerOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-1 flex flex-col gap-1">
                        <Link
                          to="/career-matches"
                          onClick={() => setMobileOpen(false)}
                          className={`py-2 px-3 text-sm rounded-lg transition-colors ${
                            location.pathname === '/career-matches'
                              ? "text-primary-400 dark:text-primary-400 light:text-primary-600 bg-primary-500/10 dark:bg-primary-500/10 light:bg-primary-50"
                              : "text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 hover:bg-primary-500/5 dark:hover:bg-primary-500/5 light:hover:bg-gray-100"
                          }`}
                        >
                          🎯 Career Matches
                        </Link>
                        <Link
                          to="/career-roadmap"
                          onClick={() => setMobileOpen(false)}
                          className={`py-2 px-3 text-sm rounded-lg transition-colors ${
                            location.pathname === '/career-roadmap'
                              ? "text-primary-400 dark:text-primary-400 light:text-primary-600 bg-primary-500/10 dark:bg-primary-500/10 light:bg-primary-50"
                              : "text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 hover:bg-primary-500/5 dark:hover:bg-primary-500/5 light:hover:bg-gray-100"
                          }`}
                        >
                          🗺️ Career Roadmap
                        </Link>
                        <Link
                          to="/student/learning-path"
                          onClick={() => setMobileOpen(false)}
                          className={`py-2 px-3 text-sm rounded-lg transition-colors ${
                            location.pathname === '/student/learning-path'
                              ? "text-primary-400 dark:text-primary-400 light:text-primary-600 bg-primary-500/10 dark:bg-primary-500/10 light:bg-primary-50"
                              : "text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 hover:bg-primary-500/5 dark:hover:bg-primary-500/5 light:hover:bg-gray-100"
                          }`}
                        >
                          📖 Learning Path
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              {/* Assessments Collapsible */}
              <li className="flex flex-col">
                <button
                  onClick={() => setMobileAssessOpen(!mobileAssessOpen)}
                  className={`flex items-center justify-between py-3 px-3 rounded-lg font-semibold transition-colors ${
                    location.pathname === '/assessments'
                      ? "text-primary-400 dark:text-primary-400 light:text-primary-600 bg-primary-500/10 dark:bg-primary-500/10 light:bg-primary-50"
                      : "text-gray-200 dark:text-gray-200 light:text-gray-700 hover:bg-primary-500/5 dark:hover:bg-primary-500/5 light:hover:bg-gray-100"
                  }`}
                >
                  <span>Assessments</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${mobileAssessOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {mobileAssessOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-1 flex flex-col gap-1">
                        <Link
                          to="/assessments?tab=academic"
                          onClick={() => setMobileOpen(false)}
                          className="py-2 px-3 text-sm rounded-lg text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 hover:bg-primary-500/5 dark:hover:bg-primary-500/5 light:hover:bg-gray-100 transition-colors"
                        >
                          📚 Academic
                        </Link>
                        <Link
                          to="/assessments?tab=technical"
                          onClick={() => setMobileOpen(false)}
                          className="py-2 px-3 text-sm rounded-lg text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 hover:bg-primary-500/5 dark:hover:bg-primary-500/5 light:hover:bg-gray-100 transition-colors"
                        >
                          ⚡ Technical
                        </Link>
                        <Link
                          to="/assessments?tab=personal"
                          onClick={() => setMobileOpen(false)}
                          className="py-2 px-3 text-sm rounded-lg text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 hover:bg-primary-500/5 dark:hover:bg-primary-500/5 light:hover:bg-gray-100 transition-colors"
                        >
                          🎯 Personal
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              {/* Progress Collapsible */}
              <li className="flex flex-col">
                <button
                  onClick={() => setMobileProgressOpen(!mobileProgressOpen)}
                  className={`flex items-center justify-between py-3 px-3 rounded-lg font-semibold transition-colors ${
                    location.pathname === '/student/progress'
                      ? "text-primary-400 dark:text-primary-400 light:text-primary-600 bg-primary-500/10 dark:bg-primary-500/10 light:bg-primary-50"
                      : "text-gray-200 dark:text-gray-200 light:text-gray-700 hover:bg-primary-500/5 dark:hover:bg-primary-500/5 light:hover:bg-gray-100"
                  }`}
                >
                  <span>Progress</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${mobileProgressOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {mobileProgressOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-1 flex flex-col gap-1">
                        <Link
                          to="/student/progress"
                          onClick={() => setMobileOpen(false)}
                          className={`py-2 px-3 text-sm rounded-lg transition-colors ${
                            location.pathname === '/student/progress'
                              ? "text-primary-400 dark:text-primary-400 light:text-primary-600 bg-primary-500/10 dark:bg-primary-500/10 light:bg-primary-50"
                              : "text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 hover:bg-primary-500/5 dark:hover:bg-primary-500/5 light:hover:bg-gray-100"
                          }`}
                        >
                          📊 Overall Progress
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              <hr className="border-white/10 dark:border-white/10 light:border-gray-200 my-2" />

              {/* User Profile Section */}
              <div className="flex items-center gap-3 py-3 px-3 bg-primary-500/5 dark:bg-primary-500/5 light:bg-gray-50 rounded-lg mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                  {user?.firstName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-100 dark:text-gray-100 light:text-gray-900 truncate">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email?.split('@')[0] || "User"}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 truncate">{user?.email}</p>
                </div>
              </div>

              <Link
                to="/student/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-3 px-3 text-sm rounded-lg text-gray-200 dark:text-gray-200 light:text-gray-700 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 hover:bg-primary-500/5 dark:hover:bg-primary-500/5 light:hover:bg-gray-100 transition-colors"
              >
                <User size={16} /> Profile
              </Link>
              <Link
                to="/student/settings"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-3 px-3 text-sm rounded-lg text-gray-200 dark:text-gray-200 light:text-gray-700 hover:text-primary-400 dark:hover:text-primary-400 light:hover:text-primary-600 hover:bg-primary-500/5 dark:hover:bg-primary-500/5 light:hover:bg-gray-100 transition-colors"
              >
                <Settings size={16} /> Settings
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3 py-3 px-3 text-sm rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left"
              >
                <LogOut size={16} /> Logout
              </button>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}