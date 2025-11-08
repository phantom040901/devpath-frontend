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
  Zap,
  Filter,
  FileCheck,
  Rocket,
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
    { label: "Registered Students", value: "Active", icon: Users },
    { label: "Assessment Areas", value: "17", icon: Briefcase },
    { label: "Career Paths", value: "7", icon: TrendingUp },
    { label: "Verification Tiers", value: "2", icon: Shield },
  ];

  const benefits = [
    "Access to pre-assessed talent pool",
    "Detailed technical and academic evaluations",
    "Career readiness scores and rankings",
    "Direct contact with qualified candidates",
    "Save time on initial screening",
    "Tier-based verification system",
  ];

  const processSteps = [
    {
      step: "01",
      title: "Create Account",
      description: "Sign up and get verified to access our talent pool",
      icon: FileCheck,
    },
    {
      step: "02",
      title: "Search & Filter",
      description: "Use advanced filters to find perfect candidates",
      icon: Filter,
    },
    {
      step: "03",
      title: "Review Profiles",
      description: "Analyze comprehensive assessments and scores",
      icon: BarChart3,
    },
    {
      step: "04",
      title: "Connect & Hire",
      description: "Reach out to candidates and build your team",
      icon: Rocket,
    },
  ];


  const pricingTiers = [
    {
      name: "Tier 1",
      subtitle: "Basic Verification",
      price: "Free",
      features: [
        "Browse student profiles",
        "Basic search filters",
        "Limited profile views (10/month)",
        "Email support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Tier 2",
      subtitle: "Enhanced Access",
      price: "$99/mo",
      features: [
        "Unlimited profile views",
        "Advanced search & filters",
        "Detailed assessment reports",
        "Direct messaging",
        "Priority support",
        "Save candidate lists",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
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
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6"
            >
              <Briefcase className="text-blue-400" size={20} />
              <span className="text-blue-400 font-medium">
                Employer Portal
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Hire Pre-Assessed{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-primary-500 bg-clip-text text-transparent">
                Top Talent
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-300 mb-8 leading-relaxed"
            >
              Access a curated pool of verified, career-ready students with
              comprehensive performance data. Skip the screening, hire smarter.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => navigate("/employer/signup")}
                className="w-full sm:w-auto px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-xl hover:shadow-blue-500/50 flex items-center justify-center gap-2 group"
              >
                Start Hiring Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/employer/login")}
                className="w-full sm:w-auto px-8 py-4 rounded-lg border-2 border-gray-700 text-gray-300 font-semibold text-lg hover:border-blue-500 hover:text-blue-400 transition-all duration-200"
              >
                Already a Partner? Login
              </button>
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex items-center justify-center gap-2 text-gray-400"
            >
              <Shield className="text-emerald-400" size={20} />
              <span className="text-sm">
                Verified student profiles • Comprehensive assessments
              </span>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all duration-300 group"
              >
                <stat.icon className="mx-auto mb-3 text-blue-400 group-hover:text-cyan-400 transition-colors" size={32} />
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started in minutes and find your perfect hire in 4 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 h-full">
                  <div className="text-6xl font-bold text-blue-500/20 mb-4">
                    {step.step}
                  </div>
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 w-fit mb-4">
                    <step.icon className="text-blue-400" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">
                    {step.description}
                  </p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
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
                whileHover={{ y: -5 }}
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950/30">
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
                    className="flex items-center gap-3 group"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                      <CheckCircle className="text-emerald-400" size={16} />
                    </div>
                    <span className="text-gray-300 text-lg group-hover:text-white transition-colors">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => navigate("/employer/signup")}
                className="mt-8 px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-xl hover:shadow-blue-500/50 flex items-center gap-2 group"
              >
                Create Employer Account
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-8"
            >
              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-900/80 rounded-xl p-6 border border-gray-800"
                >
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
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Technical Skills</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "95%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                          ></motion.div>
                        </div>
                        <span className="text-emerald-400 font-semibold text-sm">95%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Academic Performance</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "88%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          ></motion.div>
                        </div>
                        <span className="text-emerald-400 font-semibold text-sm">88%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Career Readiness</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "93%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                          ></motion.div>
                        </div>
                        <span className="text-emerald-400 font-semibold text-sm">93%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-900/80 rounded-xl p-6 border border-gray-800"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
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
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your hiring needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`bg-gray-900/70 border rounded-2xl p-8 relative ${
                  tier.popular
                    ? "border-blue-500 shadow-2xl shadow-blue-500/20"
                    : "border-gray-800"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{tier.subtitle}</p>
                  <div className="text-5xl font-bold text-white mb-2">
                    {tier.price}
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/employer/signup")}
                  className={`w-full py-4 rounded-lg font-semibold transition-all duration-200 ${
                    tier.popular
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-blue-500/50"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  {tier.cta}
                </button>
              </motion.div>
            ))}
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
            <Rocket className="mx-auto mb-6 text-blue-400" size={60} />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Find Your Next Hire?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Get verified access to pre-assessed students with comprehensive career evaluations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate("/employer/signup")}
                className="w-full sm:w-auto px-10 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-xl hover:shadow-blue-500/50 flex items-center justify-center gap-2 group"
              >
                Get Started Free
                <Zap size={20} className="group-hover:rotate-12 transition-transform" />
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
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
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
              <p className="text-gray-400 mb-4 max-w-md">
                Connecting exceptional talent with exceptional companies through
                data-driven career assessments and verified profiles.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate("/")}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    For Students
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/employer/login")}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Employer Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/admin/login")}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Admin Portal
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@devpath.com</li>
                <li>1-800-DEVPATH</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-600 text-sm">
              © 2025 DevPath. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
