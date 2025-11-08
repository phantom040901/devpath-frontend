// src/pages/employer/EmployerSignup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useEmployer } from "../../contexts/EmployerContext";
import { motion } from "framer-motion";
import { Briefcase, Loader2, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";

export default function EmployerSignup() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyWebsite: "",
    industry: "",
    companySize: "",
    contactPerson: "",
    contactPhone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signupEmployer } = useEmployer();
  const navigate = useNavigate();

  const industries = [
    "Information Technology",
    "Software Development",
    "Telecommunications",
    "E-commerce",
    "Financial Services",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Consulting",
    "Other",
  ];

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    // Check required fields
    if (!formData.companyName.trim()) {
      setError("Company name is required");
      return false;
    }

    // Validate company email (must not be free email)
    const freeEmailDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
    const emailDomain = formData.email.split("@")[1]?.toLowerCase();
    if (freeEmailDomains.includes(emailDomain)) {
      setError("Please use your company email address, not a personal email.");
      return false;
    }

    // Validate website URL
    if (formData.companyWebsite && !formData.companyWebsite.match(/^https?:\/\/.+/)) {
      setError("Please enter a valid website URL (e.g., https://company.com)");
      return false;
    }

    // Validate passwords
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await signupEmployer(formData.email, formData.password, {
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
        industry: formData.industry,
        companySize: formData.companySize,
        contactPerson: formData.contactPerson,
        contactPhone: formData.contactPhone,
      });

      navigate("/employer/verification");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-blue-500/20 border border-blue-500/30 mb-4">
            <Briefcase className="text-blue-400" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join as Employer</h1>
          <p className="text-gray-400">Connect with talented IT students</p>
        </div>

        {/* Signup Form */}
        <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/40 rounded-lg p-4 flex items-start gap-3"
              >
                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-1">Important:</p>
                  <p>Use your company email address for verification. Personal emails (Gmail, Yahoo, etc.) are not accepted.</p>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Company Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Acme Corp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Website
                  </label>
                  <input
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="https://company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Industry <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Size <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select size</option>
                    {companySizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 pt-4 border-t border-gray-800">
              <h3 className="text-lg font-semibold text-white">Contact Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Person <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="+63 912 345 6789"
                  />
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="space-y-4 pt-4 border-t border-gray-800">
              <h3 className="text-lg font-semibold text-white">Account Security</h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="hr@company.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be a company email (not Gmail, Yahoo, etc.)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/employer/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Back Link */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to main site
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
