// src/components/dashboard/ProgressCard.jsx
import { motion } from "framer-motion";

export default function ProgressCard({ skillPercent, skills, modulesCompleted, totalModules, onViewReport }) {
  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl bg-primary-1300 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col"
    >
      <h2 className="text-xl font-bold text-primary-50 mb-4">Your Progress</h2>

      {/* Radial progress */}
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            fill="none"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            stroke="var(--color-primary-500)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 56}
            strokeDashoffset={(1 - skillPercent / 100) * 2 * Math.PI * 56}
            initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
            animate={{ strokeDashoffset: (1 - skillPercent / 100) * 2 * Math.PI * 56 }}
            transition={{ duration: 1 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-primary-500">
          {skillPercent}%
        </div>
      </div>

      {/* Modules */}
      <p className="text-primary-100 mt-4 text-center">
        {modulesCompleted} of {totalModules} modules completed
      </p>

      {/* Top skills */}
      <div className="mt-6 space-y-3">
        {skills.map((s, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm text-primary-100 mb-1">
              <span>{s.name}</span>
              <span>{s.percent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-primary-1400 overflow-hidden">
              <motion.div
                className="h-2 rounded-full bg-primary-500"
                initial={{ width: 0 }}
                animate={{ width: `${s.percent}%` }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onViewReport}
        className="mt-6 rounded-full bg-primary-500 px-6 py-3 font-semibold text-primary-1300 shadow-[0_0_25px_rgba(0,255,200,0.12)] hover:shadow-[0_0_40px_rgba(0,255,200,0.2)] transition-all"
      >
        View Full Report
      </button>
    </motion.div>
  );
}
