// src/components/sections/Modal/OTPVerification.jsx
import { useState, useRef, useEffect } from "react";
import { X, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function OTPVerification({ email, onVerify, onResend, onCancel }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);
  const { theme } = useTheme();

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      await onVerify(otpCode);
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      await onResend();
      setResendCooldown(60); // 60 second cooldown
      setOtp(["", "", "", "", "", ""]);
      setError("");
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div
        className={`${theme === 'light' ? 'bg-white' : 'bg-primary-1400/95'} backdrop-blur-xl rounded-3xl shadow-2xl
        max-w-md w-full border-2 border-black`}
      >
        {/* Header */}
        <div className={`${theme === 'light' ? 'bg-blue-600' : 'bg-primary-500'} p-6 rounded-t-3xl relative`}>
          <button
            onClick={onCancel}
            className={`absolute top-4 right-4 ${theme === 'light' ? 'text-white hover:bg-white/20' : 'text-primary-100 hover:bg-white/10'}
            rounded-full p-2 transition`}
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className={`${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} rounded-full p-4 mb-4`}>
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
            <p className={`${theme === 'light' ? 'text-blue-100' : 'text-primary-100'} text-sm`}>
              We've sent a 6-digit code to
            </p>
            <p className="text-white font-semibold mt-1">{email}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* OTP Input */}
          <div className="flex gap-2 justify-center mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isVerifying}
                className={`w-12 h-14 text-center text-2xl font-bold rounded-xl
                ${theme === 'light'
                  ? 'bg-gray-100 text-gray-900 border-2 border-gray-300 focus:border-blue-500'
                  : 'bg-primary-1300/50 text-primary-50 border-2 border-primary-700 focus:border-primary-500'
                }
                outline-none transition-all
                ${digit ? (theme === 'light' ? 'border-blue-500' : 'border-primary-500') : ''}
                disabled:opacity-50 disabled:cursor-not-allowed`}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border-l-4 border-red-500 rounded-r">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={otp.join("").length !== 6 || isVerifying}
            className={`w-full py-3 rounded-xl font-semibold transition shadow-lg mb-4
            ${otp.join("").length === 6 && !isVerifying
              ? theme === 'light'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-primary-500 hover:bg-primary-600 text-white'
              : theme === 'light'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isVerifying ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle size={20} />
                Verify & Create Account
              </span>
            )}
          </button>

          {/* Resend OTP */}
          <div className="text-center">
            <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-primary-200'} mb-2`}>
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className={`text-sm font-semibold transition
              ${resendCooldown > 0
                ? theme === 'light'
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-500 cursor-not-allowed'
                : theme === 'light'
                  ? 'text-blue-600 hover:text-blue-700 underline'
                  : 'text-primary-400 hover:text-primary-300 underline'
              }`}
            >
              {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
