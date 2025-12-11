// src/pages/TechnicalAssessmentPlaceholder.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthContext";
import { motion } from "framer-motion";
import DashNav from "../components/dashboard/DashboardNav";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

export default function TechnicalAssessmentPlaceholder() {
  const { id } = useParams();
  const { user } = useAuth() || {};
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const assessmentDetails = {
    "logical-quotient": {
      title: "Logical Quotient Test",
      description: "This is a placeholder for the logical quotient test. In the full implementation, you would have 15 MCQ questions testing patterns and logical reasoning.",
      field: "Logical quotient rating",
      defaultScore: 5,
    },
    "coding-challenge": {
      title: "Coding Challenge",
      description: "This is a placeholder for the coding challenge. In the full implementation, you would solve 3 programming problems of varying difficulty.",
      field: "coding skills rating",
      defaultScore: 5,
    },
    "public-speaking": {
      title: "Public Speaking Assessment",
      description: "This is a placeholder for the public speaking assessment. In the full implementation, you would complete a self-assessment questionnaire.",
      field: "public speaking points",
      defaultScore: 5,
    },
    "memory-game": {
      title: "Memory Passage Test",
      description: "This is a placeholder for the memory passage test. In the full implementation, you would read a passage and answer questions from memory.",
      field: "Memory Passage Test",
      defaultScore: 5,
    },
    "writing-task": {
      title: "Writing Task",
      description: "This is a placeholder for the writing task. In the full implementation, you would write a 150-250 word technical explanation.",
      field: "reading and writing skills",
      defaultScore: "medium",
    },
  };

  const assessment = assessmentDetails[id];

  if (!assessment) {
    return (
      <section className="min-h-screen w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Assessment not found</h2>
          <button
            onClick={() => navigate("/technical-assessments")}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
          >
            Go Back
          </button>
        </div>
      </section>
    );
  }

  const handleComplete = async () => {
    if (!user) {
      alert("Please log in to save your progress.");
      return;
    }

    setSaving(true);

    try {
      // Load existing assessments
      const docRef = doc(db, "users", user.uid, "assessments", "technical");
      const docSnap = await getDoc(docRef);
      const existing = docSnap.exists() ? docSnap.data() : {};

      // Save with default score
      await setDoc(
        docRef,
        {
          ...existing,
          [assessment.field]: assessment.defaultScore,
        }
      );

      // Go back to list
      navigate("/technical-assessments");
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save progress. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-primary-1400 via-primary-1500 to-black px-4 sm:px-6 lg:px-10 py-12">
      <DashNav />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mt-12"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/technical-assessments")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
        >
          <ArrowLeft size={20} />
          Back to Assessments
        </button>

        {/* Assessment Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-cyan-400/30 rounded-2xl p-8 shadow-2xl"
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            {assessment.title}
          </h1>

          {/* Placeholder Notice */}
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="text-blue-400 flex-shrink-0 mt-1" size={20} />
            <div className="text-sm text-gray-300">
              <p className="font-medium text-white mb-2">This is a Placeholder</p>
              <p>{assessment.description}</p>
            </div>
          </div>

          {/* Placeholder Content */}
          <div className="space-y-6 mb-8">
            <div className="bg-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-3">
                What you'll see in the full implementation:
              </h3>
              <ul className="space-y-2 text-gray-300">
                {id === "logical-quotient" && (
                  <>
                    <li>• 15 multiple-choice questions</li>
                    <li>• Pattern recognition challenges</li>
                    <li>• Sequence completion problems</li>
                    <li>• Timed: 15 minutes</li>
                    <li>• Auto-graded: Outputs 1-9 scale</li>
                  </>
                )}
                {id === "coding-challenge" && (
                  <>
                    <li>• 3 programming problems (Easy, Medium, Hard)</li>
                    <li>• Fill-in-the-blank or MCQ format</li>
                    <li>• Test case validation</li>
                    <li>• Timed: 30 minutes</li>
                    <li>• Auto-graded: Outputs 1-9 scale</li>
                  </>
                )}
                {id === "public-speaking" && (
                  <>
                    <li>• Self-assessment questionnaire</li>
                    <li>• Cross-validated questions</li>
                    <li>• Confidence and experience metrics</li>
                    <li>• Timed: 5 minutes</li>
                    <li>• Outputs 1-9 scale</li>
                  </>
                )}
                {id === "memory-game" && (
                  <>
                    <li>• Phase 1: Read and memorize a detailed passage (2 minutes)</li>
                    <li>• Phase 2: Answer 10 MCQ questions from memory (3 minutes)</li>
                    <li>• Tests short-term memory and recall ability</li>
                    <li>• Total time: 5 minutes</li>
                    <li>• Auto-graded: Outputs 1-9 scale</li>
                  </>
                )}
                {id === "writing-task" && (
                  <>
                    <li>• Write 150-250 word technical explanation</li>
                    <li>• Auto-scored: word count, structure, keywords</li>
                    <li>• Grammar and clarity assessment</li>
                    <li>• Timed: 15 minutes</li>
                    <li>• Outputs: poor/medium/excellent</li>
                  </>
                )}
              </ul>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-3">
                Current Placeholder Behavior:
              </h3>
              <p className="text-gray-300 mb-3">
                When you click "Complete Assessment" below, the system will assign a default score:
              </p>
              <p className="text-cyan-400 font-medium">
                Default Score: {typeof assessment.defaultScore === "number"
                  ? `${assessment.defaultScore}/9`
                  : assessment.defaultScore}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/technical-assessments")}
              className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleComplete}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Complete Assessment (Use Default Score)
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Implementation Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
        >
          <p className="text-sm text-gray-400 text-center">
            💡 <strong className="text-white">For Developers:</strong> Replace this placeholder with actual assessment
            components when implementing the full system.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
