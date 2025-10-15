// src/components/dashboard/DashboardNav.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut, Settings, ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "../../assets/logo.png";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "../ThemeToggle";

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
    { name: "Messages", path: "/student/messaging" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 w-full backdrop-blur-md bg-primary-1400/90 transition-shadow duration-300"
      style={{
        boxShadow: scrollY > 10 ? "0 8px 25px rgba(0,0,0,0.4)" : "none",
        zIndex: 9000,
      }}
    >
      <div className="m-auto flex max-w-[90rem] justify-between items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-primary-50 w-full">
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
                className={`transition text-sm xl:text-base ${
                  location.pathname === link.path
                    ? "text-primary-500 font-semibold"
                    : "hover:text-primary-400"
                }`}
              >
                {link.name}
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
              className={`flex items-center gap-1 transition text-sm xl:text-base ${
                ['/career-matches', '/career-roadmap', '/student/learning-path'].includes(location.pathname)
                  ? "text-primary-500 font-semibold"
                  : "hover:text-primary-400"
              }`}
              aria-haspopup="menu"
              aria-expanded={careerOpen}
            >
              Career <ChevronDown size={14} />
            </button>

            <AnimatePresence>
              {careerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-0 top-full mt-2 bg-primary-1400 border border-white/10 rounded-lg shadow-lg w-52 py-2"
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
                    className="block px-4 py-2 text-sm hover:bg-primary-1200"
                  >
                    🎯 Career Matches
                  </Link>
                  <Link
                    to="/career-roadmap"
                    onClick={() => setCareerOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-primary-1200"
                  >
                    🗺️ Career Roadmap
                  </Link>
                  <Link
                    to="/student/learning-path"
                    onClick={() => setCareerOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-primary-1200"
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
              className="flex items-center gap-1 hover:text-primary-400 text-sm xl:text-base"
              aria-haspopup="menu"
              aria-expanded={assessOpen}
            >
              Assessments <ChevronDown size={14} />
            </button>

            <AnimatePresence>
              {assessOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-0 top-full mt-2 bg-primary-1400 border border-white/10 rounded-lg shadow-lg w-52 py-2"
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
                    className="block px-4 py-2 text-sm hover:bg-primary-1200"
                  >
                    📚 Academic
                  </Link>
                  <Link
                    to="/assessments?tab=technical"
                    onClick={() => setAssessOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-primary-1200"
                  >
                    ⚡ Technical
                  </Link>
                  <Link
                    to="/assessments?tab=personal"
                    onClick={() => setAssessOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-primary-1200"
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
              className={`flex items-center gap-1 transition text-sm xl:text-base ${
                location.pathname === '/student/progress'
                  ? "text-primary-500 font-semibold"
                  : "hover:text-primary-400"
              }`}
              aria-haspopup="menu"
              aria-expanded={progressOpen}
            >
              Progress <ChevronDown size={14} />
            </button>

            <AnimatePresence>
              {progressOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-0 top-full mt-2 bg-primary-1400 border border-white/10 rounded-lg shadow-lg w-52 py-2"
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
                    className="block px-4 py-2 text-sm hover:bg-primary-1200"
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
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notification Bell - Desktop */}
          <div className="hidden lg:block">
            <NotificationBell />
          </div>

          {/* User Dropdown - Desktop */}
          <div className="relative hidden lg:block" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full bg-primary-1200/50 px-3 py-2 hover:bg-primary-1200 transition"
            >
              <User size={18} />
              <span className="hidden xl:inline text-sm max-w-[120px] truncate">{user?.email || "User"}</span>
              <ChevronDown size={16} className="opacity-70" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-primary-1400 shadow-lg border border-white/10 overflow-hidden"
                  style={{ zIndex: 9100 }}
                >
                  <Link to="/student/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary-1200">
                    <User size={16} /> Profile
                  </Link>
                  <Link to="/student/settings" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary-1200">
                    <Settings size={16} /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
            className="lg:hidden bg-primary-1400/95 backdrop-blur-xl px-4 sm:px-6 py-4 border-t border-white/10 max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <ul className="flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-2 transition ${
                      location.pathname === link.path ? "text-primary-500 font-semibold" : "hover:text-primary-400"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              <li className="flex flex-col">
                <span className="text-primary-400 font-semibold mt-2 mb-1">Career</span>
                <Link 
                  to="/career-matches" 
                  onClick={() => setMobileOpen(false)}
                  className="ml-4 py-2 text-sm hover:text-primary-400"
                >
                  🎯 Career Matches
                </Link>
                <Link 
                  to="/career-roadmap" 
                  onClick={() => setMobileOpen(false)}
                  className="ml-4 py-2 text-sm hover:text-primary-400"
                >
                  🗺️ Career Roadmap
                </Link>
                <Link 
                  to="/student/learning-path" 
                  onClick={() => setMobileOpen(false)}
                  className="ml-4 py-2 text-sm hover:text-primary-400"
                >
                  📖 Learning Path
                </Link>
              </li>

              <li className="flex flex-col">
                <span className="text-primary-400 font-semibold mt-2 mb-1">Assessments</span>
                <Link 
                  to="/assessments?tab=academic" 
                  onClick={() => setMobileOpen(false)}
                  className="ml-4 py-2 text-sm hover:text-primary-400"
                >
                  📚 Academic
                </Link>
                <Link 
                  to="/assessments?tab=technical" 
                  onClick={() => setMobileOpen(false)}
                  className="ml-4 py-2 text-sm hover:text-primary-400"
                >
                  ⚡ Technical
                </Link>
                <Link 
                  to="/assessments?tab=personal" 
                  onClick={() => setMobileOpen(false)}
                  className="ml-4 py-2 text-sm hover:text-primary-400"
                >
                  🎯 Personal
                </Link>
              </li>

              <li className="flex flex-col">
                <span className="text-primary-400 font-semibold mt-2 mb-1">Progress</span>
                <Link 
                  to="/student/progress" 
                  onClick={() => setMobileOpen(false)}
                  className="ml-4 py-2 text-sm hover:text-primary-400"
                >
                  📊 Overall Progress
                </Link>
              </li>

              <hr className="border-white/10 my-2" />

              <Link to="/student/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 text-sm hover:text-primary-400">
                <User size={16} /> Profile
              </Link>
              <Link to="/student/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 text-sm hover:text-primary-400">
                <Settings size={16} /> Settings
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 py-2 text-sm text-red-400 hover:text-red-300"
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