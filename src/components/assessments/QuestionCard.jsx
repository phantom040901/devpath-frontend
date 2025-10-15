// src/components/assessments/QuestionCard.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function QuestionCard({ question, selected, onSelect }) {
  const [showModal, setShowModal] = useState(false);

  if (!question) return null;

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
        {question.options.map((opt, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(opt)}
            className={`w-full rounded-xl px-5 py-4 text-left text-base sm:text-lg transition-all
              break-words whitespace-normal border-2
              ${
                selected === opt
                  ? "bg-primary-500/20 border-primary-400 text-white font-semibold shadow-lg shadow-primary-500/20"
                  : "bg-gray-800/70 border-transparent text-gray-200 hover:border-gray-600"
              }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}