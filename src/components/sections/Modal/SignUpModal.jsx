// src/components/sections/Modal/SignUpModal.jsx
import Close from "../../icons/Close";
import Checkmark from "../../icons/Checkmark";
import { useState } from "react";
import { useModalContext } from "../../../contexts/ModalContext.jsx";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../AuthContext.jsx";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  course: "",
  yearLevel: "",
};

export default function SignUpModal() {
  const { setActiveModal } = useModalContext();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);
  const [inputs, setInputs] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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

    try {
      await signup(inputs.email, inputs.password, {
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        course: inputs.course,
        yearLevel: inputs.yearLevel,
      });

      setInputs(initialState);
      setChecked(false);
      setActiveModal("");
      // Small delay to ensure modal closes before navigation
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleTermsClick(e) {
    e.stopPropagation();
    setShowTermsModal(true);
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
            className="border-primary-75 hover:bg-primary-75 group transition-properties ml-auto w-fit cursor-pointer rounded-2xl border-2 p-3 relative z-10 max-sm:p-2"
            onClick={() => setActiveModal("")}
          >
            <Close
              className="stroke-primary-75 group-hover:stroke-primary-1300 transition-properties max-md:h-4 max-md:w-4"
              width={2}
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
                <span className="text-sm text-primary-100">First Name</span>
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
                <span className="text-sm text-primary-100">Last Name</span>
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
              <span className="text-sm text-primary-100">Email</span>
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
              <span className="text-sm text-primary-100">Password</span>
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
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Requirements */}
              {(passwordFocused || inputs.password) && (
                <div className="mt-2 space-y-2">
                  {/* Password Strength Meter */}
                  {inputs.password && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-primary-200">Password Strength:</span>
                        <span className={`text-xs font-semibold ${strengthLabel.color}`}>
                          {strengthLabel.text}
                        </span>
                      </div>
                      <div className="flex gap-1 h-1.5">
                        {[...Array(4)].map((_, index) => (
                          <div
                            key={index}
                            className={`flex-1 rounded-full transition-all duration-300 ${
                              index < passwordStrength
                                ? passwordStrength === 1
                                  ? 'bg-orange-500'
                                  : passwordStrength === 2
                                  ? 'bg-yellow-500'
                                  : passwordStrength === 3
                                  ? 'bg-blue-500'
                                  : 'bg-green-500'
                                : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Requirements Checklist */}
                  <div className="space-y-1.5 text-xs pt-1">
                    <p className="text-primary-200 font-medium mb-1.5">Your password must contain:</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        passwordRequirements.minLength ? 'bg-green-500' : 'bg-gray-600'
                      }`}>
                        {passwordRequirements.minLength && <Checkmark className="h-2.5 w-2.5 stroke-white" />}
                      </div>
                      <span className={passwordRequirements.minLength ? 'text-green-400' : 'text-gray-400'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        passwordRequirements.hasUppercase ? 'bg-green-500' : 'bg-gray-600'
                      }`}>
                        {passwordRequirements.hasUppercase && <Checkmark className="h-2.5 w-2.5 stroke-white" />}
                      </div>
                      <span className={passwordRequirements.hasUppercase ? 'text-green-400' : 'text-gray-400'}>
                        One uppercase letter (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        passwordRequirements.hasLowercase ? 'bg-green-500' : 'bg-gray-600'
                      }`}>
                        {passwordRequirements.hasLowercase && <Checkmark className="h-2.5 w-2.5 stroke-white" />}
                      </div>
                      <span className={passwordRequirements.hasLowercase ? 'text-green-400' : 'text-gray-400'}>
                        One lowercase letter (a-z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        passwordRequirements.hasNumber ? 'bg-green-500' : 'bg-gray-600'
                      }`}>
                        {passwordRequirements.hasNumber && <Checkmark className="h-2.5 w-2.5 stroke-white" />}
                      </div>
                      <span className={passwordRequirements.hasNumber ? 'text-green-400' : 'text-gray-400'}>
                        One number (0-9)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </label>

            {/* Confirm Password */}
            <label className="flex flex-col gap-1 relative">
              <span className="text-sm text-primary-100">Confirm Password</span>
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
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {/* Course */}
            <label className="flex flex-col gap-1">
              <span className="text-sm text-primary-100">Course</span>
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
                <option value="BS Data Science">BS Data Science</option>
              </select>
            </label>

            {/* Year Level */}
            <label className="flex flex-col gap-1">
              <span className="text-sm text-primary-100">Year Level</span>
              <select
                name="yearLevel"
                value={inputs.yearLevel}
                onChange={handleInputs}
                className="rounded-xl bg-primary-75/80 backdrop-blur-sm text-primary-1300 px-4 py-3 
                focus:ring-2 focus:ring-primary-500 outline-none"
                required
                disabled={isLoading}
              >
                <option value="">Select year level</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
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
          </form>
        </div>
      </section>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowTermsModal(false)}
        >
          <div 
            className="bg-primary-1400/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-primary-50">Terms & Conditions</h2>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="border-primary-75 hover:bg-primary-75 group transition cursor-pointer rounded-xl border-2 p-2"
              >
                <Close
                  className="stroke-primary-75 group-hover:stroke-primary-1300 transition h-4 w-4"
                  width={2}
                />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] text-primary-100 space-y-4">
              <p>
                Welcome to DevPath. By creating an account and using our platform, you agree to be bound by these Terms and Conditions.
              </p>
              
              <h3 className="text-lg font-semibold text-primary-50 mt-4">1. Acceptance of Terms</h3>
              <p>
                By registering for DevPath and using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
              </p>

              <h3 className="text-lg font-semibold text-primary-50 mt-4">2. User Accounts</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration.
              </p>

              <h3 className="text-lg font-semibold text-primary-50 mt-4">3. Educational Use</h3>
              <p>
                DevPath is designed for educational purposes to support students in their development journey. Users must be enrolled in an accredited educational institution to use the platform.
              </p>

              <h3 className="text-lg font-semibold text-primary-50 mt-4">4. Privacy & Data Protection</h3>
              <p>
                We take your privacy seriously. Your personal information, including your name, email, course, and year level, will be collected and stored securely. We will never share your information with third parties without your explicit consent.
              </p>

              <h3 className="text-lg font-semibold text-primary-50 mt-4">5. User Conduct</h3>
              <p>
                You agree not to use DevPath for any unlawful purposes or in any way that could damage, disable, or impair the platform. You will not upload malicious code or attempt to gain unauthorized access to our systems.
              </p>

              <h3 className="text-lg font-semibold text-primary-50 mt-4">6. Intellectual Property</h3>
              <p>
                All content, features, and functionality on DevPath are owned by us and are protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-lg font-semibold text-primary-50 mt-4">7. Service Modifications</h3>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of DevPath at any time. We will provide notice of significant changes when possible.
              </p>

              <h3 className="text-lg font-semibold text-primary-50 mt-4">8. Limitation of Liability</h3>
              <p>
                DevPath is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
              </p>

              <h3 className="text-lg font-semibold text-primary-50 mt-4">9. Contact Information</h3>
              <p>
                If you have any questions about these Terms and Conditions, please contact our support team at support@devpath.com.
              </p>

              <p className="text-sm text-primary-200 mt-6">
                Last updated: October 2025
              </p>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="w-full bg-primary-500 hover:bg-primary-600 transition rounded-xl py-3 
                font-semibold shadow-lg shadow-primary-500/30 text-primary-50"
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