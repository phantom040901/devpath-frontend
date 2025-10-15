// src/components/dashboard/CareerCard.jsx
import { motion } from "framer-motion";

export default function CareerCard({ title, subtitle, score, tags, description, onSimulate }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="rounded-2xl bg-primary-1300 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(0,255,200,0.12)] transition-all"
    >
      <h3 className="text-xl font-bold text-primary-50">{title}</h3>
      <span className="text-sm text-primary-500">{subtitle}</span>

      <div className="mt-4">
        <div className="text-3xl font-bold text-primary-500">{score}%</div>
        <p className="text-primary-100 mt-2">{description}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="rounded-full bg-primary-1400 px-3 py-1 text-sm text-primary-100"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button className="rounded-full bg-primary-500 px-4 py-2 font-semibold text-primary-1300 shadow-[0_0_25px_rgba(0,255,200,0.12)]">
          View
        </button>
        <button
          onClick={onSimulate}
          className="rounded-full border border-primary-500 px-4 py-2 font-semibold text-primary-500 hover:bg-primary-500 hover:text-primary-1300 transition-all"
        >
          Simulate
        </button>
      </div>
    </motion.div>
  );
}
