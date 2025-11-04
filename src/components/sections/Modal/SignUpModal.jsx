// src/components/sections/Modal/SignUpModal.jsx
import Close from "../../icons/Close";
import Checkmark from "../../icons/Checkmark";
import { useState } from "react";
import { useModalContext } from "../../../contexts/ModalContext.jsx";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../AuthContext.jsx";
import { useTheme } from "../../../contexts/ThemeContext";
import OTPVerification from "./OTPVerification";
import emailjs from '@emailjs/browser';

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  course: "",
  otherCourse: "",
  isEnrolled: "",
  yearLevel: "",
};

export default function SignUpModal() {
  const { setActiveModal } = useModalContext();
  const { signup, signInWithGoogle, signInWithGitHub } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);
  const [inputs, setInputs] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // OTP verification state
  const [showOTP, setShowOTP] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [otpExpiry, setOtpExpiry] = useState(null);

  // Password validation checks
  const passwordRequirements = {
    minLength: inputs.password.length >= 8,
    hasUppercase: /[A-Z]/.test(inputs.password),
    hasLowercase: /[a-z]/.test(inputs.password),
    hasNumber: /[0-9]/.test(inputs.password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  // Calculate password strength
  const calculatePasswordStrength = () => {
    let strength = 0;
    if (passwordRequirements.minLength) strength++;
    if (passwordRequirements.hasUppercase) strength++;
    if (passwordRequirements.hasLowercase) strength++;
    if (passwordRequirements.hasNumber) strength++;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength();
  const getStrengthLabel = () => {
    if (passwordStrength === 0) return { text: "Very Weak", color: "text-red-500" };
    if (passwordStrength === 1) return { text: "Weak", color: "text-orange-500" };
    if (passwordStrength === 2) return { text: "Fair", color: "text-yellow-500" };
    if (passwordStrength === 3) return { text: "Good", color: "text-blue-500" };
    return { text: "Strong", color: "text-green-500" };
  };

  const strengthLabel = getStrengthLabel();

  function handleInputs(e) {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [e.target.name]: e.target.value,
    }));
    setError("");
  }

  // Generate and send OTP using EmailJS
  async function sendOTP() {
    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(otp);
      setOtpExpiry(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      // EmailJS configuration
      const serviceId = 'service_fn2o6do';  // Your EmailJS Service ID
      const templateId = 'template_kiqyhq6'; // Your EmailJS Template ID
      const publicKey = 'E0obOJjzr6CNIfzKR';   // Your EmailJS Public Key

      console.log("📧 Attempting to send OTP email...");
      console.log("Email:", inputs.email);
      console.log("Name:", inputs.firstName);
      console.log("OTP Code:", otp);

      // Send OTP via EmailJS
      const templateParams = {
        to_email: inputs.email,
        to_name: inputs.firstName,
        otp_code: otp,
        from_name: 'DevPath',
        from_email: 'alfredcmelencion@gmail.com',
        reply_to: inputs.email,
      };

      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);

      console.log("✅ OTP sent successfully via EmailJS", response);
      return true;
    } catch (err) {
      console.error("❌ Error sending OTP:", err);
      console.error("Error details:", err.text || err.message);
      throw new Error(err.text || "Failed to send OTP. Please check your internet connection.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!checked) {
      setError("You must agree to the terms and policies to continue.");
      return;
    }

    if (!isPasswordValid) {
      setError("Password does not meet all requirements");
      return;
    }

    if (inputs.password !== inputs.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Send OTP instead of directly signing up
      await sendOTP();
      setShowOTP(true);
    } catch (err) {
      setError(err.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Verify OTP and complete signup
  async function handleOTPVerify(otpCode) {
    // Check if OTP is expired
    if (Date.now() > otpExpiry) {
      throw new Error("OTP has expired. Please request a new one.");
    }

    // Verify OTP
    if (otpCode !== generatedOTP) {
      throw new Error("Invalid OTP. Please check and try again.");
    }

    setIsLoading(true);

    try {
      // OTP verified, create account
      await signup(inputs.email, inputs.password, {
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        course: inputs.course === "Other" ? inputs.otherCourse : inputs.course,
        isEnrolled: inputs.isEnrolled === "yes",
        yearLevel: inputs.yearLevel,
      });

      setInputs(initialState);
      setChecked(false);
      setShowOTP(false);
      setActiveModal("");

      // Scroll to top before navigating
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Navigate to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } catch (err) {
      throw new Error(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Resend OTP
  async function handleResendOTP() {
    await sendOTP();
  }

  // Cancel OTP verification
  function handleCancelOTP() {
    setShowOTP(false);
    setGeneratedOTP("");
    setOtpExpiry(null);
  }

  function handleTermsClick(e) {
    e.stopPropagation();
    setShowTermsModal(true);
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

      // Redirect to dashboard after successful OAuth
      setActiveModal("");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || `Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <section className="grid sm:grid-cols-2 grid-cols-1 max-w-5xl rounded-3xl overflow-hidden shadow-2xl w-full">
        {/* Left panel (hidden on mobile) */}
        <div
          className="relative flex flex-col justify-center gap-y-6 p-10 text-center
          bg-primary-1300 bg-[url('../src/assets/Noise.webp')] bg-repeat
          border-r border-white/10 shadow-xl shadow-black/40
          rounded-l-2xl max-sm:hidden"
        >
          <h4 className="text-primary-50 text-4xl max-md:text-3xl max-sm:text-2xl font-extrabold tracking-tight drop-shadow-md">
            Join DevPath Today
          </h4>
          <p className="text-primary-100 text-lg max-md:text-base max-sm:text-sm opacity-90">
            Kickstart your developer journey — no fees, no hidden costs.
          </p>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-1200/40 via-transparent to-primary-1400/40 pointer-events-none rounded-l-2xl" />
        </div>

        {/* Right panel (form) */}
        <div
          className="relative flex flex-col bg-primary-1400
          bg-[url('../src/assets/Noise.webp')] bg-repeat
          p-10 max-md:px-6 max-md:py-8 max-sm:p-6
          border-l border-white/10 rounded-r-2xl shadow-xl shadow-black/30"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-1200/30 via-transparent to-primary-1300/40 pointer-events-none rounded-r-2xl" />

          {/* Close button */}
          <button
            type="button"
            className="border-primary-300 hover:bg-primary-300 group transition-properties ml-auto w-fit cursor-pointer rounded-2xl border-2 p-3 relative z-10 max-sm:p-2"
            onClick={() => setActiveModal("")}
          >
            <Close
              className="stroke-primary-300 group-hover:stroke-primary-1300 transition-properties max-md:h-4 max-md:w-4"
              width={3}
            />
          </button>

          {/* Signup form */}
          <form
            onSubmit={handleSubmit}
            className="relative z-10 flex flex-col gap-6 text-primary-50"
          >
            {/* First + Last Name */}
            <div className="flex flex-col sm:flex-row sm:gap-5 gap-4">
              <label className="flex flex-col gap-1 flex-1 min-w-0">
                <span className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-primary-100'}`}>First Name</span>
                <input
                  name="firstName"
                  type="text"
                  placeholder="Juan"
                  value={inputs.firstName}
                  onChange={handleInputs}
                  className="w-full rounded-xl bg-primary-75/80 backdrop-blur-sm text-primary-1300 px-4 py-3 
                  placeholder:opacity-40 focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                  disabled={isLoading}
                />
              </label>

              <label className="flex flex-col gap-1 flex-1 min-w-0">
                <span className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-primary-100'}`}>Last Name</span>
                <input
                  name="lastName"
                  type="text"
                  placeholder="Dela Cruz"
                  value={inputs.lastName}
                  onChange={handleInputs}
                  className="w-full rounded-xl bg-primary-75/80 backdrop-blur-sm text-primary-1300 px-4 py-3 
                  placeholder:opacity-40 focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                  disabled={isLoading}
                />
              </label>
            </div>

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
            <label className="flex flex-col gap-1 relative">
              <span className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-primary-100'}`}>Password</span>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={inputs.password}
                  onChange={handleInputs}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="w-full rounded-xl bg-primary-75/80 backdrop-blur-sm text-primary-1300 px-4 py-3 pr-10
                  placeholder:opacity-40 focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-800"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
                </button>
              </div>

              {/* Password Requirements */}
              {(passwordFocused || inputs.password) && (
                <div className="mt-2 space-y-2">
                  {/* Password Strength Meter */}
                  {inputs.password && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-primary-200'}`}>Password Strength:</span>
                        <span className={`text-xs font-semibold ${strengthLabel.color}`}>
                          {strengthLabel.text}
                        </span>
                      </div>
                      <div className="flex gap-2 h-3">
                        {[...Array(4)].map((_, index) => {
                          const isFilled = index < passwordStrength;

                          // Determine colors based on strength and theme
                          let backgroundColor = '';
                          let borderColor = '';

                          if (isFilled) {
                            if (passwordStrength === 1) {
                              backgroundColor = theme === 'light' ? '#f97316' : '#f97316'; // orange-500
                              borderColor = theme === 'light' ? '#c2410c' : '#ea580c'; // orange-700 / orange-600
                            } else if (passwordStrength === 2) {
                              backgroundColor = theme === 'light' ? '#facc15' : '#eab308'; // yellow-400 / yellow-500
                              borderColor = theme === 'light' ? '#ca8a04' : '#ca8a04'; // yellow-600
                            } else if (passwordStrength === 3) {
                              backgroundColor = theme === 'light' ? '#3b82f6' : '#3b82f6'; // blue-500
                              borderColor = theme === 'light' ? '#1d4ed8' : '#2563eb'; // blue-700 / blue-600
                            } else {
                              backgroundColor = theme === 'light' ? '#22c55e' : '#22c55e'; // green-500
                              borderColor = theme === 'light' ? '#15803d' : '#16a34a'; // green-700 / green-600
                            }
                          } else {
                            backgroundColor = theme === 'light' ? '#e5e7eb' : '#374151'; // gray-200 / gray-700
                            borderColor = theme === 'light' ? '#6b7280' : '#4b5563'; // gray-500 / gray-600
                          }

                          return (
                            <div
                              key={index}
                              className="flex-1 rounded-md transition-all duration-300"
                              style={{
                                backgroundColor,
                                borderWidth: theme === 'light' ? '2px' : '1px',
                                borderStyle: 'solid',
                                borderColor
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Requirements Checklist */}
                  <div className="space-y-1.5 text-xs pt-1">
                    <p className={`font-medium mb-1.5 ${theme === 'light' ? 'text-gray-700' : 'text-primary-200'}`}>Your password must contain:</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        passwordRequirements.minLength ? 'bg-green-500' : theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'
                      }`}>
                        {passwordRequirements.minLength && <Checkmark className="h-2.5 w-2.5 stroke-white" />}
                      </div>
                      <span className={passwordRequirements.minLength ? theme === 'light' ? 'text-green-600' : 'text-green-400' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        passwordRequirements.hasUppercase ? 'bg-green-500' : theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'
                      }`}>
                        {passwordRequirements.hasUppercase && <Checkmark className="h-2.5 w-2.5 stroke-white" />}
                      </div>
                      <span className={passwordRequirements.hasUppercase ? theme === 'light' ? 'text-green-600' : 'text-green-400' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                        One uppercase letter (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        passwordRequirements.hasLowercase ? 'bg-green-500' : theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'
                      }`}>
                        {passwordRequirements.hasLowercase && <Checkmark className="h-2.5 w-2.5 stroke-white" />}
                      </div>
                      <span className={passwordRequirements.hasLowercase ? theme === 'light' ? 'text-green-600' : 'text-green-400' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                        One lowercase letter (a-z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        passwordRequirements.hasNumber ? 'bg-green-500' : theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'
                      }`}>
                        {passwordRequirements.hasNumber && <Checkmark className="h-2.5 w-2.5 stroke-white" />}
                      </div>
                      <span className={passwordRequirements.hasNumber ? theme === 'light' ? 'text-green-600' : 'text-green-400' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                        One number (0-9)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </label>

            {/* Confirm Password */}
            <label className="flex flex-col gap-1 relative">
              <span className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-primary-100'}`}>Confirm Password</span>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={inputs.confirmPassword}
                  onChange={handleInputs}
                  className="w-full rounded-xl bg-primary-75/80 backdrop-blur-sm text-primary-1300 px-4 py-3 pr-10 
                  placeholder:opacity-40 focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-800"
                  onClick={() => setShowConfirm(!showConfirm)}
                  disabled={isLoading}
                >
                  {showConfirm ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
                </button>
              </div>
            </label>

            {/* Course */}
            <label className="flex flex-col gap-1">
              <span className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-primary-100'}`}>Course</span>
              <select
                name="course"
                value={inputs.course}
                onChange={handleInputs}
                className="rounded-xl bg-primary-75/80 backdrop-blur-sm text-primary-1300 px-4 py-3
                focus:ring-2 focus:ring-primary-500 outline-none"
                required
                disabled={isLoading}
              >
                <option value="">Select your course</option>
                <option value="BS Computer Science">BS Computer Science</option>
                <option value="BS Information Technology">BS Information Technology</option>
                <option value="BS Information Systems">BS Information Systems</option>
                <option value="BS Computer Engineering">BS Computer Engineering</option>
                <option value="BS Software Engineering">BS Software Engineering</option>
                <option value="Other">Other</option>
              </select>
            </label>

            {/* Other Course Specification */}
            {inputs.course === "Other" && (
              <label className="flex flex-col gap-1">
                <span className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-primary-100'}`}>
                  Please specify your course
                </span>
                <input
                  name="otherCourse"
                  type="text"
                  placeholder="Enter your course name"
                  value={inputs.otherCourse}
                  onChange={handleInputs}
                  className="rounded-xl bg-primary-75/80 backdrop-blur-sm text-primary-1300 px-4 py-3
                  placeholder:opacity-40 focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                  disabled={isLoading}
                />
              </label>
            )}

            {/* Enrollment Status */}
            <label className="flex flex-col gap-1">
              <span className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-primary-100'}`}>
                Are you currently enrolled?
              </span>
              <select
                name="isEnrolled"
                value={inputs.isEnrolled}
                onChange={handleInputs}
                className="rounded-xl bg-primary-75/80 backdrop-blur-sm text-primary-1300 px-4 py-3
                focus:ring-2 focus:ring-primary-500 outline-none"
                required
                disabled={isLoading}
              >
                <option value="">Select enrollment status</option>
                <option value="yes">Yes, I am currently enrolled</option>
                <option value="no">No, I am not currently enrolled</option>
              </select>
            </label>

            {/* Year Level - Conditional based on enrollment */}
            <label className="flex flex-col gap-1">
              <span className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-primary-100'}`}>
                Year Level
              </span>
              <select
                name="yearLevel"
                value={inputs.yearLevel}
                onChange={handleInputs}
                className="rounded-xl bg-primary-75/80 backdrop-blur-sm text-primary-1300 px-4 py-3
                focus:ring-2 focus:ring-primary-500 outline-none"
                required
                disabled={isLoading || !inputs.isEnrolled}
              >
                <option value="">
                  {!inputs.isEnrolled ? "Select enrollment status first" : "Select year level"}
                </option>
                {inputs.isEnrolled === "yes" && (
                  <>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </>
                )}
                {inputs.isEnrolled === "no" && (
                  <>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                  </>
                )}
              </select>
            </label>

            {/* Error */}
            {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

            {/* Terms */}
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => !isLoading && setChecked((curr) => !curr)}
            >
              <div
                className={`h-5 w-5 flex items-center justify-center rounded-md border-2 transition 
                ${checked ? "bg-primary-500 border-primary-500" : "border-primary-300"}`}
              >
                {checked && <Checkmark className="h-3 w-3 stroke-white" />}
              </div>
              <p className="text-sm text-primary-100">
                I agree to DevPath's{" "}
                <button
                  type="button"
                  onClick={handleTermsClick}
                  className="text-primary-400 underline hover:text-primary-200"
                >
                  terms and policies
                </button>
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!checked || isLoading}
              className={`w-full rounded-xl py-3 font-semibold shadow-lg transition text-sm md:text-base
              ${checked && !isLoading
                ? "bg-primary-500 hover:bg-primary-600 shadow-primary-500/30"
                : "bg-gray-500 cursor-not-allowed opacity-70"}`}
            >
              {isLoading ? "Creating Account..." : "Start Building"}
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3 my-2">
              <div className="flex-1 border-t border-primary-300/30"></div>
              <span className={`text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-primary-300'}`}>
                OR SIGN UP WITH
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

            {/* Login redirect */}
            <p className="text-center text-sm text-primary-200 mt-2">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setActiveModal("login")}
                className="text-primary-400 hover:text-primary-300 underline transition"
              >
                Log in
              </button>
            </p>
          </form>
        </div>
      </section>

      {/* OTP Verification Modal */}
      {showOTP && (
        <OTPVerification
          email={inputs.email}
          onVerify={handleOTPVerify}
          onResend={handleResendOTP}
          onCancel={handleCancelOTP}
        />
      )}

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div
          className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${
            theme === 'light' ? 'bg-black/30' : 'bg-black/60'
          }`}
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className={`backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden ${
              theme === 'light'
                ? 'bg-white border border-gray-200'
                : 'bg-primary-1400/95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              theme === 'light' ? 'border-gray-200' : 'border-white/10'
            }`}>
              <h2 className={`text-2xl font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-primary-50'
              }`}>
                Terms & Conditions
              </h2>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className={`group transition cursor-pointer rounded-xl border-2 p-2 ${
                  theme === 'light'
                    ? 'border-gray-300 hover:bg-gray-100'
                    : 'border-primary-300 hover:bg-primary-300'
                }`}
              >
                <Close
                  className={`transition h-4 w-4 ${
                    theme === 'light'
                      ? 'stroke-gray-600 group-hover:stroke-gray-900'
                      : 'stroke-primary-300 group-hover:stroke-primary-1300'
                  }`}
                  width={3}
                />
              </button>
            </div>

            {/* Content */}
            <div className={`p-6 overflow-y-auto max-h-[60vh] space-y-4 ${
              theme === 'light' ? 'text-gray-700' : 'text-primary-100'
            }`}>
              <p>
                Welcome to DevPath. By creating an account and using our platform, you agree to be bound by these Terms and Conditions.
              </p>
              
              <h3 className={`text-lg font-semibold mt-4 ${
                theme === 'light' ? 'text-gray-900' : 'text-primary-50'
              }`}>
                1. Acceptance of Terms
              </h3>
              <p>
                By registering for DevPath and using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
              </p>

              <h3 className={`text-lg font-semibold mt-4 ${
                theme === 'light' ? 'text-gray-900' : 'text-primary-50'
              }`}>
                2. User Accounts
              </h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration.
              </p>

              <h3 className={`text-lg font-semibold mt-4 ${
                theme === 'light' ? 'text-gray-900' : 'text-primary-50'
              }`}>
                3. Educational Use
              </h3>
              <p>
                DevPath is designed for educational purposes to support students in their development journey. Users must be enrolled in an accredited educational institution to use the platform.
              </p>

              <h3 className={`text-lg font-semibold mt-4 ${
                theme === 'light' ? 'text-gray-900' : 'text-primary-50'
              }`}>
                4. Privacy & Data Protection
              </h3>
              <p>
                We take your privacy seriously. Your personal information, including your name, email, course, and year level, will be collected and stored securely. We will never share your information with third parties without your explicit consent.
              </p>

              <h3 className={`text-lg font-semibold mt-4 ${
                theme === 'light' ? 'text-gray-900' : 'text-primary-50'
              }`}>
                5. User Conduct
              </h3>
              <p>
                You agree not to use DevPath for any unlawful purposes or in any way that could damage, disable, or impair the platform. You will not upload malicious code or attempt to gain unauthorized access to our systems.
              </p>

              <h3 className={`text-lg font-semibold mt-4 ${
                theme === 'light' ? 'text-gray-900' : 'text-primary-50'
              }`}>
                6. Intellectual Property
              </h3>
              <p>
                All content, features, and functionality on DevPath are owned by us and are protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className={`text-lg font-semibold mt-4 ${
                theme === 'light' ? 'text-gray-900' : 'text-primary-50'
              }`}>
                7. Service Modifications
              </h3>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of DevPath at any time. We will provide notice of significant changes when possible.
              </p>

              <h3 className={`text-lg font-semibold mt-4 ${
                theme === 'light' ? 'text-gray-900' : 'text-primary-50'
              }`}>
                8. Limitation of Liability
              </h3>
              <p>
                DevPath is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
              </p>

              <h3 className={`text-lg font-semibold mt-4 ${
                theme === 'light' ? 'text-gray-900' : 'text-primary-50'
              }`}>
                9. Contact Information
              </h3>
              <p>
                If you have any questions about these Terms and Conditions, please contact our support team at support@devpath.com.
              </p>

              <p className={`text-sm mt-6 ${
                theme === 'light' ? 'text-gray-500' : 'text-primary-200'
              }`}>
                Last updated: October 2025
              </p>
            </div>

            {/* Footer */}
            <div className={`p-6 border-t ${
              theme === 'light' ? 'border-gray-200' : 'border-white/10'
            }`}>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className={`w-full transition rounded-xl py-3 font-semibold shadow-lg ${
                  theme === 'light'
                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/30'
                    : 'bg-primary-500 hover:bg-primary-600 text-primary-50 shadow-primary-500/30'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}