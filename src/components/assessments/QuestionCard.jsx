// src/components/assessments/QuestionCard.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// RIASEC info for displaying badges
const RIASEC_INFO = {
  R: { name: "Realistic", color: "bg-red-500/20 text-red-400 border-red-500/40" },
  I: { name: "Investigative", color: "bg-blue-500/20 text-blue-400 border-blue-500/40" },
  A: { name: "Artistic", color: "bg-purple-500/20 text-purple-400 border-purple-500/40" },
  S: { name: "Social", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40" },
  E: { name: "Enterprising", color: "bg-orange-500/20 text-orange-400 border-orange-500/40" },
  C: { name: "Conventional", color: "bg-green-500/20 text-green-400 border-green-500/40" }
};

export default function QuestionCard({ question, selected, onSelect }) {
  const [showModal, setShowModal] = useState(false);

  if (!question) return null;

  const riasecCategories = question.riasecCategories || [];

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="relative rounded-3xl bg-gray-900/70 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
      {/* Question text */}
      <h2 className="text-xl sm:text-2xl font-semibold text-white break-words whitespace-pre-wrap leading-relaxed">
        {question.question}
      </h2>

      {/* RIASEC Category Badges */}
      {riasecCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {riasecCategories.map(code => {
            const info = RIASEC_INFO[code];
            if (!info) return null;
            return (
              <span
                key={code}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${info.color}`}
                title={`This question relates to ${info.name} skills`}
              >
                {info.name}
              </span>
            );
          })}
        </div>
      )}

      {/* Show image with modal trigger */}
      {question.image && (
        <>
          <div className="my-6 flex justify-center">
            <motion.img
              whileHover={{ scale: 1.02 }}
              src={question.image}
              alt={`Question ${question.number}`}
              className="max-h-72 rounded-xl border border-gray-700 shadow-lg object-contain cursor-pointer hover:shadow-primary-500/20 transition"
              onClick={() => setShowModal(true)}
            />
          </div>

          {/* Modal with blurred question background */}
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            >
              <div
                className="relative max-w-5xl w-full px-4"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.img
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  src={question.image}
                  alt={`Question ${question.number}`}
                  className="w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
                />
                {/* Close button */}
                <button
                  className="absolute top-4 right-4 bg-gray-900/80 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition border border-gray-700"
                  onClick={() => setShowModal(false)}
                >
                  ✕ Close
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          // Handle both string options and object options {value, label, correct}
          const optionLabel = typeof opt === 'object' && opt !== null ? opt.label : opt;
          const optionValue = typeof opt === 'object' && opt !== null ? opt.value : opt;

          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(optionValue)}
              className={`w-full rounded-xl px-5 py-4 text-left text-base sm:text-lg transition-all
                break-words whitespace-normal border-2
                ${
                  selected === optionValue
                    ? "bg-primary-500/20 border-primary-400 text-white font-semibold shadow-lg shadow-primary-500/20"
                    : "bg-gray-800/70 border-transparent text-gray-200 hover:border-gray-600"
                }`}
            >
              {optionLabel}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}