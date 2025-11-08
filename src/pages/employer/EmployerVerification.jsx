// src/pages/employer/EmployerVerification.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployer } from "../../contexts/EmployerContext";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  FileText,
  Building2,
  Shield,
  Upload,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function EmployerVerification() {
  const { employer, updateEmployerProfile, refreshEmployerData } = useEmployer();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedDocs, setUploadedDocs] = useState({
    businessRegistration: null,
    tin: null,
    businessPermit: null,
  });

  useEffect(() => {
    if (!employer) {
      navigate("/employer/login");
      return;
    }
    setCurrentStep(employer.verificationStep || 1);
  }, [employer, navigate]);

  const steps = [
    {
      number: 1,
      title: "Email Verification",
      description: "Verify your company email address",
      icon: Shield,
      status: employer?.verificationStep >= 2 ? "completed" : currentStep === 1 ? "current" : "pending",
    },
    {
      number: 2,
      title: "Company Information",
      description: "Review and confirm your details",
      icon: Building2,
      status:
        employer?.verificationStep >= 3
          ? "completed"
          : currentStep === 2
          ? "current"
          : "pending",
    },
    {
      number: 3,
      title: "Document Upload",
      description: "Upload business documents (optional)",
      icon: FileText,
      status:
        employer?.verificationStep >= 4
          ? "completed"
          : currentStep === 3
          ? "current"
          : "pending",
    },
    {
      number: 4,
      title: "Review",
      description: "Awaiting admin approval",
      icon: Clock,
      status: employer?.verificationStatus === "tier1_verified" ? "completed" : "pending",
    },
  ];

  const handleEmailVerification = async () => {
    setLoading(true);
    setError("");

    try {
      // Simulate email verification (in production, send actual email)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await updateEmployerProfile({
        emailVerified: true,
        verificationStep: 2,
      });

      await refreshEmployerData();
      setCurrentStep(2);
    } catch (err) {
      setError(err.message || "Failed to verify email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyInfoConfirmation = async () => {
    setLoading(true);
    setError("");

    try {
      await updateEmployerProfile({
        verificationStep: 3,
      });

      await refreshEmployerData();
      setCurrentStep(3);
    } catch (err) {
      setError(err.message || "Failed to confirm information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkipDocuments = async () => {
    setLoading(true);
    setError("");

    try {
      await updateEmployerProfile({
        verificationStep: 4,
        verificationStatus: "pending",
      });

      await refreshEmployerData();
      navigate("/employer/dashboard");
    } catch (err) {
      setError(err.message || "Failed to proceed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = (docType, file) => {
    setUploadedDocs({
      ...uploadedDocs,
      [docType]: file,
    });
  };

  const handleSubmitDocuments = async () => {
    setLoading(true);
    setError("");

    try {
      // In production, upload files to Firebase Storage
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const documentsInfo = Object.keys(uploadedDocs)
        .filter((key) => uploadedDocs[key])
        .map((key) => ({
          type: key,
          filename: uploadedDocs[key].name,
          uploadedAt: new Date().toISOString(),
        }));

      await updateEmployerProfile({
        verificationStep: 4,
        verificationStatus: "pending",
        documents: documentsInfo,
      });

      await refreshEmployerData();
      navigate("/employer/dashboard");
    } catch (err) {
      setError(err.message || "Failed to upload documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!employer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Verification Process</h1>
          <p className="text-gray-400">Complete these steps to activate your account</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  {/* Step Circle */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${
                      step.status === "completed"
                        ? "bg-green-500/20 border-green-500"
                        : step.status === "current"
                        ? "bg-blue-500/20 border-blue-500"
                        : "bg-gray-800 border-gray-700"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle className="text-green-400" size={28} />
                    ) : (
                      <step.icon
                        className={
                          step.status === "current" ? "text-blue-400" : "text-gray-500"
                        }
                        size={28}
                      />
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="text-center mt-3">
                    <p
                      className={`text-sm font-medium ${
                        step.status === "completed"
                          ? "text-green-400"
                          : step.status === "current"
                          ? "text-blue-400"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-4 -mt-12 ${
                      steps[index + 1].status !== "pending" ? "bg-green-500" : "bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-500/20 border border-red-500/40 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Step Content */}
        <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8">
          {/* Step 1: Email Verification */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center mb-8">
                <div className="inline-flex p-4 rounded-full bg-blue-500/20 border border-blue-500/30 mb-4">
                  <Shield className="text-blue-400" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
                <p className="text-gray-400">
                  We need to verify that <span className="text-white">{employer.email}</span> is your
                  company email
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                <p className="text-gray-300 mb-4">
                  Click the button below to send a verification link to your email. Check your inbox
                  and click the link to verify.
                </p>
                <p className="text-sm text-gray-500">
                  Can't find the email? Check your spam folder.
                </p>
              </div>

              <button
                onClick={handleEmailVerification}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Verifying...
                  </>
                ) : (
                  <>
                    Send Verification Email
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Step 2: Company Information */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center mb-8">
                <div className="inline-flex p-4 rounded-full bg-blue-500/20 border border-blue-500/30 mb-4">
                  <Building2 className="text-blue-400" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Company Information</h2>
                <p className="text-gray-400">Please review and confirm your company details</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Company Name</p>
                  <p className="text-white font-medium">{employer.companyName}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Industry</p>
                    <p className="text-white font-medium">{employer.industry}</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Company Size</p>
                    <p className="text-white font-medium">{employer.companySize}</p>
                  </div>
                </div>

                {employer.companyWebsite && (
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Website</p>
                    <a
                      href={employer.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {employer.companyWebsite}
                    </a>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Contact Person</p>
                    <p className="text-white font-medium">{employer.contactPerson}</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Contact Phone</p>
                    <p className="text-white font-medium">{employer.contactPhone}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCompanyInfoConfirmation}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm & Continue
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Step 3: Document Upload */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center mb-8">
                <div className="inline-flex p-4 rounded-full bg-blue-500/20 border border-blue-500/30 mb-4">
                  <FileText className="text-blue-400" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Document Upload</h2>
                <p className="text-gray-400">
                  Upload documents to get verified badge (optional)
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-300">
                  <strong>Optional but recommended:</strong> Upload business documents to get a
                  "Verified Employer" badge, which increases your visibility to students by 3x.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {/* Business Registration */}
                <div className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">Business Registration</p>
                      <p className="text-sm text-gray-400">DTI/SEC Certificate</p>
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleDocumentUpload("businessRegistration", e.target.files[0])
                        }
                        className="hidden"
                      />
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        <Upload size={16} className="text-gray-300" />
                        <span className="text-sm text-gray-300">
                          {uploadedDocs.businessRegistration ? "Change" : "Upload"}
                        </span>
                      </div>
                    </label>
                  </div>
                  {uploadedDocs.businessRegistration && (
                    <p className="text-sm text-green-400 flex items-center gap-2">
                      <CheckCircle size={16} />
                      {uploadedDocs.businessRegistration.name}
                    </p>
                  )}
                </div>

                {/* TIN */}
                <div className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">Tax Identification Number</p>
                      <p className="text-sm text-gray-400">BIR TIN Certificate</p>
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleDocumentUpload("tin", e.target.files[0])}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        <Upload size={16} className="text-gray-300" />
                        <span className="text-sm text-gray-300">
                          {uploadedDocs.tin ? "Change" : "Upload"}
                        </span>
                      </div>
                    </label>
                  </div>
                  {uploadedDocs.tin && (
                    <p className="text-sm text-green-400 flex items-center gap-2">
                      <CheckCircle size={16} />
                      {uploadedDocs.tin.name}
                    </p>
                  )}
                </div>

                {/* Business Permit */}
                <div className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">Business Permit</p>
                      <p className="text-sm text-gray-400">Mayor's Permit</p>
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleDocumentUpload("businessPermit", e.target.files[0])}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        <Upload size={16} className="text-gray-300" />
                        <span className="text-sm text-gray-300">
                          {uploadedDocs.businessPermit ? "Change" : "Upload"}
                        </span>
                      </div>
                    </label>
                  </div>
                  {uploadedDocs.businessPermit && (
                    <p className="text-sm text-green-400 flex items-center gap-2">
                      <CheckCircle size={16} />
                      {uploadedDocs.businessPermit.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSkipDocuments}
                  disabled={loading}
                  className="flex-1 py-3 rounded-lg border border-gray-700 text-gray-300 font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Skip for Now
                </button>

                <button
                  onClick={handleSubmitDocuments}
                  disabled={loading || Object.values(uploadedDocs).every((doc) => !doc)}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Uploading...
                    </>
                  ) : (
                    <>
                      Submit Documents
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
