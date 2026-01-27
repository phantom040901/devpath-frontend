// src/components/admin/AdminNav.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";
import { motion } from "framer-motion";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  BookOpen,
  MessageSquare,
  Briefcase,
  Building2,
  UserPlus
} from "lucide-react";

export default function AdminNav() {
  const { admin, logoutAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [pendingEmployersCount, setPendingEmployersCount] = useState(0);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    fetchPendingEmployersCount();
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showProfileMenu]);

  const fetchPendingEmployersCount = async () => {
    try {
      const employersRef = collection(db, "employers");
      const q = query(employersRef, where("verificationStatus", "==", "pending"));
      const snapshot = await getDocs(q);
      setPendingEmployersCount(snapshot.size);
    } catch (error) {
      console.error("Error fetching pending employers:", error);
    }
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/admin/students", label: "Students", icon: <Users size={20} /> },
    { path: "/admin/employers", label: "Employers", icon: <Building2 size={20} />, badge: pendingEmployersCount },
    { path: "/admin/assessments", label: "Assessments", icon: <BookOpen size={20} /> },
    { path: "/admin/career-analytics", label: "Careers", icon: <Briefcase size={20} /> },
    { path: "/admin/messaging", label: "Messages", icon: <MessageSquare size={20} /> },
    { path: "/admin/create-test-account", label: "Test Account", icon: <UserPlus size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-emerald-400 bg-clip-text text-transparent">
              DevPath
            </div>
            <span className="px-2 py-1 rounded-md bg-red-500/20 text-red-400 text-xs font-semibold">
              ADMIN
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all relative ${
                  location.pathname === item.path
                    ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Admin Info & Logout */}
          <div className="hidden md:flex items-center gap-3">
            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  {admin?.displayName?.charAt(0) || admin?.email?.charAt(0) || 'A'}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">
                    {admin?.displayName || admin?.email}
                  </div>
                  <div className="text-xs text-gray-400">Administrator</div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50"
                >
                  <button
                    onClick={() => {
                      navigate("/admin/analytics");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
                  >
                    <BarChart3 size={18} />
                    <span className="text-sm">Analytics</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/admin/settings");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
                  >
                    <Settings size={18} />
                    <span className="text-sm">Settings</span>
                  </button>
                </motion.div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all border border-red-500/30"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-gray-900 border-t border-gray-800"
        >
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                  location.pathname === item.path
                    ? "bg-primary-500/20 text-primary-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            {/* Divider */}
            <div className="border-t border-gray-800 my-2"></div>

            {/* Additional Menu Items */}
            <button
              onClick={() => {
                navigate("/admin/analytics");
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
            >
              <BarChart3 size={20} />
              <span className="font-medium">Analytics</span>
            </button>
            <button
              onClick={() => {
                navigate("/admin/settings");
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
            >
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-800 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}