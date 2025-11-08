// src/pages/employer/EmployerLandingPage.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  TrendingUp,
  Shield,
  Search,
  Star,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Target,
  Award,
  Globe,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import logoImage from "../../assets/logo.png";

export default function EmployerLandingPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const features = [
    {
      icon: Search,
      title: "Search Top Talent",
      description:
        "Browse verified students with comprehensive career assessments and skill evaluations.",
      color: "blue",
    },
    {
      icon: BarChart3,
      title: "Data-Driven Insights",
      description:
        "Access detailed performance analytics, technical assessments, and career readiness scores.",
      color: "emerald",
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description:
        "All student profiles are verified with authentic assessment results and credentials.",
      color: "purple",
    },
    {
      icon: Target,
      title: "Perfect Match",
      description:
        "Find candidates that match your exact requirements using our advanced filtering system.",
      color: "orange",
    },
  ];

  const stats = [
    { label: "Active Students", value: "500+", icon: Users },
    { label: "Career Paths", value: "50+", icon: Briefcase },
    { label: "Success Rate", value: "95%", icon: TrendingUp },
    { label: "Partner Companies", value: "100+", icon: Globe },
  ];

  const benefits = [
    "Access to pre-assessed talent pool",
    "Detailed technical and academic evaluations",
    "Career readiness scores and rankings",
    "Direct contact with qualified candidates",
    "Save time on initial screening",
    "Tier-based verification system",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 group"
            >
              <img
                src={logoImage}
                alt="DevPath Logo"
                className="h-12 transition-all duration-300 group-hover:scale-110"
                style={{
                  filter:
                    "drop-shadow(0 0 8px rgba(6, 182, 212, 0.6)) brightness(1.2)",
                }}
              />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-primary-500 to-cyan-400 bg-clip-text text-transparent">
                DevPath for Employers
              </span>
            </button>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/employer/login")}
                className="px-6 py-2.5 rounded-lg border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-200 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/employer/signup")}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/50"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
              <Briefcase className="text-blue-400" size={20} />
              <span className="text-blue-400 font-medium">
                Employer Portal
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Next{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-primary-500 bg-clip-text text-transparent">
                Top Performer
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Access a curated pool of pre-assessed, career-ready students with
              verified skills and comprehensive performance data. Hire smarter,
              faster, and better.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate("/employer/signup")}
                className="w-full sm:w-auto px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-xl hover:shadow-blue-500/50 flex items-center justify-center gap-2"
              >
                Start Hiring Now
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate("/employer/login")}
                className="w-full sm:w-auto px-8 py-4 rounded-lg border-2 border-gray-700 text-gray-300 font-semibold text-lg hover:border-blue-500 hover:text-blue-400 transition-all duration-200"
              >
                Already a Partner? Login
              </button>
            </div>

            {/* Trust Badge */}
            <div className="mt-12 flex items-center justify-center gap-2 text-gray-400">
              <Shield className="text-emerald-400" size={20} />
              <span className="text-sm">
                Trusted by 100+ companies • Verified students only
              </span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all duration-300"
              >
                <stat.icon className="mx-auto mb-3 text-blue-400" size={32} />
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose DevPath?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to find and hire exceptional talent, all in
              one platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 w-fit mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <feature.icon className="text-blue-400" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Access Pre-Qualified Talent
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Every student on DevPath has completed comprehensive assessments
                covering technical skills, academic performance, and career
                readiness. Get detailed insights before you even schedule an
                interview.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="text-emerald-400 flex-shrink-0" size={24} />
                    <span className="text-gray-300 text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => navigate("/employer/signup")}
                className="mt-8 px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-xl hover:shadow-blue-500/50 flex items-center gap-2"
              >
                Create Employer Account
                <ArrowRight size={20} />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-8"
            >
              <div className="space-y-6">
                <div className="bg-gray-900/80 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Award className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">
                        Top Performer
                      </div>
                      <div className="text-gray-400 text-sm">
                        Overall Score: 92%
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Technical Skills</span>
                      <span className="text-emerald-400 font-semibold">
                        95%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Academic Performance</span>
                      <span className="text-emerald-400 font-semibold">
                        88%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Career Readiness</span>
                      <span className="text-emerald-400 font-semibold">
                        93%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/80 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="text-yellow-400" size={20} />
                    <span className="text-white font-semibold">
                      Recommended Career
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm mb-4">
                    Based on comprehensive assessment
                  </div>
                  <div className="inline-block px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 font-medium">
                    Full-Stack Developer
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-y border-blue-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Find Your Next Hire?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join 100+ companies already hiring through DevPath. Get verified
              access to our talent pool today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate("/employer/signup")}
                className="w-full sm:w-auto px-10 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-xl hover:shadow-blue-500/50"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full sm:w-auto px-10 py-4 rounded-lg border-2 border-gray-700 text-gray-300 font-semibold text-lg hover:border-blue-500 hover:text-blue-400 transition-all duration-200"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src={logoImage}
              alt="DevPath Logo"
              className="h-10"
              style={{
                filter: "drop-shadow(0 0 8px rgba(6, 182, 212, 0.6)) brightness(1.2)",
              }}
            />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-primary-500 to-cyan-400 bg-clip-text text-transparent">
              DevPath
            </span>
          </div>
          <p className="text-gray-400 mb-4">
            Connecting exceptional talent with exceptional companies.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <button
              onClick={() => navigate("/")}
              className="hover:text-blue-400 transition-colors"
            >
              For Students
            </button>
            <span>•</span>
            <button
              onClick={() => navigate("/employer/login")}
              className="hover:text-blue-400 transition-colors"
            >
              Employer Login
            </button>
            <span>•</span>
            <button
              onClick={() => navigate("/admin/login")}
              className="hover:text-blue-400 transition-colors"
            >
              Admin Portal
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-6">
            © 2025 DevPath. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
