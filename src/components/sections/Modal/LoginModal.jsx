import Close from "../../icons/Close";
import { useState, useEffect } from "react";
import { useModalContext } from "../../../contexts/ModalContext.jsx";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../AuthContext.jsx";
import { useTheme } from "../../../contexts/ThemeContext";
import PasswordResetSuccessModal from "./PasswordResetSuccessModal";
import PasswordResetConfirmModal from "./PasswordResetConfirmModal";

const initialState = { email: "", password: "", remember: false };

export default function LoginModal() {
  const { setActiveModal } = useModalContext();
  const { login, user, resetPassword, signInWithGoogle, signInWithGitHub } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showResetSuccessModal, setShowResetSuccessModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // Effect to handle redirect after user is authenticated
  useEffect(() => {
    if (loginSuccess && user) {
      setInputs(initialState);
      setActiveModal(""); // close modal

      // Scroll to top before navigating (helps with mobile UX)
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Small delay to ensure smooth transition
      setTimeout(() => {
        navigate("/dashboard", { replace: true }); // redirect to dashboard
      }, 100);
    }
  }, [loginSuccess, user, navigate, setActiveModal]);

  function handleInputs(e) {
    const { name, type, value, checked } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setLoginSuccess(false);

    try {
      await login(inputs.email, inputs.password);
      setLoginSuccess(true); // Trigger the useEffect to redirect
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      setIsLoading(false);
    }
  }

  // Step 1: Validate email and show confirmation modal
  function handleForgotPassword() {
    // Validate email input
    if (!inputs.email || inputs.email.trim() === "") {
      setError("Please enter your email address first.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputs.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Clear any previous errors
    setError("");

    // Show confirmation modal
    setShowResetConfirmModal(true);
  }

  // Step 2: Actually send the reset email (after user confirms)
  async function sendPasswordResetEmail() {
    // Close confirmation modal
    setShowResetConfirmModal(false);

    setIsLoading(true);
    setResetEmailSent(false);

    try {
      console.log("📧 Sending password reset email to:", inputs.email);
      console.log("🔧 Current domain:", window.location.origin);
      console.log("🔧 Firebase project:", "devpath-capstone");

      await resetPassword(inputs.email);

      // Firebase sent email successfully
      setResetEmailSent(true);
      setError("");
      console.log("✅ Password reset email sent successfully!");
      console.log("📬 Check your inbox and spam folder for an email from Firebase");
      console.log("📧 Email should come from: noreply@devpath-capstone.firebaseapp.com");

      // Show success modal
      setShowResetSuccessModal(true);
    } catch (err) {
      console.error("❌ Password reset error:", err);
      console.error("Error details:", {
        code: err.code,
        message: err.message,
        email: inputs.email,
        domain: window.location.origin
      });

      setError(err.message || "Failed to send reset email. Please try again.");
      setResetEmailSent(false);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle OAuth sign-in
  async function handleOAuthSignIn(provider) {
    setError("");
    setIsLoading(true);

    try {
      if (provider === "google") {
        await signInWithGoogle();
      } else if (provider === "github") {
        await signInWithGitHub();
      }
      setLoginSuccess(true);
    } catch (err) {
      setError(err.message || `Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl">
      {/* Left panel */}
      <div
        className="relative hidden sm:flex flex-col justify-center gap-y-6 p-10 text-center
        bg-primary-1300 bg-[url('../src/assets/Noise.webp')] bg-repeat
        sm:border-r border-white/10 shadow-xl shadow-black/40 rounded-l-2xl"
      >
        <h4 className="text-primary-50 text-4xl sm:text-3xl font-extrabold tracking-tight drop-shadow-md">
          Welcome Back
        </h4>
        <p className="text-primary-100 text-lg sm:text-base opacity-90">
          Log in to continue your developer journey 🚀
        </p>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-1200/40 via-transparent to-primary-1400/40 pointer-events-none rounded-l-2xl" />
      </div>

      {/* Right panel (form) */}
      <div
        className="relative flex flex-col bg-primary-1400
        bg-[url('../src/assets/Noise.webp')] bg-repeat
        p-8 sm:p-10
        shadow-xl shadow-black/30
        sm:border-l border-white/10 rounded-r-2xl sm:rounded-none
        max-sm:rounded-2xl w-full"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-1200/30 via-transparent to-primary-1300/40 pointer-events-none rounded-r-2xl sm:rounded-none max-sm:rounded-2xl" />

        {/* Close button */}
        <button
          type="button"
          className="border-primary-300 hover:bg-primary-300 group transition ml-auto w-fit cursor-pointer rounded-2xl border-2 p-3 relative z-10 max-sm:p-2"
          onClick={() => setActiveModal("")}
        >
          <Close
            className="stroke-primary-300 group-hover:stroke-primary-1300 transition max-md:h-4 max-md:w-4"
            width={3}
          />
        </button>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 flex flex-col gap-6 text-primary-50"
        >
          {/* Email */}
          <label className="flex flex-col gap-1">
            <span className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-primary-100'}`}>Email</span>
            <input
              name="email"
              type="email"
              placeholder="dev@example.com"
              value={inputs.email}
              onChange={handleInputs}
              className="rounded-xl bg-primary-75/80 backdrop-blur-sm text-primary-1300 px-4 py-3 
              placeholder:opacity-40 focus:ring-2 focus:ring-primary-500 outline-none"
              required
              disabled={isLoading}
            />
          </label>

          {/* Password */}
          <label className="flex flex-col gap-2 relative">
            <div className="flex justify-between items-center">
              <span className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-primary-100'}`}>Password</span>
            </div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={inputs.password}
                onChange={handleInputs}
                className="w-full rounded-xl bg-primary-75/80 backdrop-blur-sm text-primary-1300 px-4 py-3 pr-10
                placeholder:opacity-40 focus:ring-2 focus:ring-primary-500 outline-none"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-800 z-10"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
              </button>
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className={`text-xs font-medium transition hover:underline self-end -mt-1 ${
                theme === 'light' ? 'text-primary-600 hover:text-primary-700' : 'text-primary-400 hover:text-primary-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Forgot Password?
            </button>
          </label>

          {/* Reset email success message */}
          {resetEmailSent && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <p className="text-green-400 text-sm font-medium mb-2">
                ✅ Password reset email sent to {inputs.email}!
              </p>
              <p className="text-green-300 text-xs">
                📬 Check your <strong>inbox and spam/junk folder</strong> for an email from Firebase.
              </p>
            </div>
          )}

          {/* Remember me */}
          <label className={`flex items-center gap-2 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-primary-200'}`}>
            <input
              type="checkbox"
              name="remember"
              checked={inputs.remember}
              onChange={handleInputs}
              className="w-4 h-4 accent-primary-500 rounded cursor-pointer"
              disabled={isLoading}
            />
            Remember me
          </label>

          {/* Error */}
          {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-500 hover:bg-primary-600 transition rounded-xl py-3
            font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-3 my-2">
            <div className="flex-1 border-t border-primary-300/30"></div>
            <span className={`text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-primary-300'}`}>
              OR CONTINUE WITH
            </span>
            <div className="flex-1 border-t border-primary-300/30"></div>
          </div>

          {/* OAuth Buttons */}
          <div className="flex flex-col gap-3">
            {/* Google Sign-In */}
            <button
              type="button"
              onClick={() => handleOAuthSignIn("google")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50
              text-gray-700 font-semibold py-3 px-4 rounded-xl border-2 border-gray-200
              transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* GitHub Sign-In */}
            <button
              type="button"
              onClick={() => handleOAuthSignIn("github")}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800
              text-white font-semibold py-3 px-4 rounded-xl border-2 border-gray-700
              transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Signup redirect */}
          <p className="text-center text-sm text-primary-200 mt-4">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setActiveModal("sign-up")}
              className="text-primary-400 hover:text-primary-300 underline transition"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>

      {/* Password Reset Confirmation Modal */}
      <PasswordResetConfirmModal
        isOpen={showResetConfirmModal}
        onClose={() => setShowResetConfirmModal(false)}
        onConfirm={sendPasswordResetEmail}
        email={inputs.email}
      />

      {/* Password Reset Success Modal */}
      <PasswordResetSuccessModal
        isOpen={showResetSuccessModal}
        onClose={() => setShowResetSuccessModal(false)}
        email={inputs.email}
      />
    </section>
  );
}
