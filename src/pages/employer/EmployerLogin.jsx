// src/pages/employer/EmployerLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useEmployer } from "../../contexts/EmployerContext";
import { motion } from "framer-motion";
import { Briefcase, Loader2, AlertCircle, ArrowLeft } from "lucide-react";

export default function EmployerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginEmployer } = useEmployer();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginEmployer(email, password);
      navigate("/employer/dashboard");
    } catch (err) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-blue-500/20 border border-blue-500/30 mb-4">
            <Briefcase className="text-blue-400" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Employer Portal</h1>
          <p className="text-gray-400">Sign in to access your dashboard</p>
        </div>

        {/* Login Form */}
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

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="hr@company.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/employer/signup"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Register here
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
