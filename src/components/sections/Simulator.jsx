import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

const sampleJobs = [
  { id: "frontend", title: "Frontend Developer", desc: "Responsive UIs & modern frameworks.", vector: [0.95, 0.15, 0.20] },
  { id: "backend", title: "Backend Developer", desc: "APIs, databases & system design.", vector: [0.20, 0.95, 0.25] },
  { id: "data", title: "Data Scientist", desc: "Dashboards, ML & insights.", vector: [0.15, 0.30, 0.95] },
  { id: "mobile", title: "Mobile Developer", desc: "iOS/Android apps & cross-platform tooling.", vector: [0.85, 0.20, 0.30] },
  { id: "devops", title: "DevOps Engineer", desc: "CI/CD, infra automation & reliability.", vector: [0.30, 0.85, 0.25] },
  { id: "fullstack", title: "Full-Stack Developer", desc: "End-to-end systems: frontend, backend, integrations.", vector: [0.80, 0.70, 0.40] },
  { id: "ml", title: "ML Engineer", desc: "Production ML systems and model deployment.", vector: [0.25, 0.40, 0.92] },
  { id: "qa", title: "QA / SDET", desc: "Test automation, quality pipelines & reliability.", vector: [0.45, 0.60, 0.35] },
  { id: "ux", title: "UX Engineer", desc: "Design-driven frontend, prototyping & research.", vector: [0.90, 0.12, 0.22] },
  { id: "security", title: "Security Engineer", desc: "Application security, threat modeling & hardening.", vector: [0.25, 0.90, 0.28] },
  { id: "cloud", title: "Cloud Engineer", desc: "Cloud infra, cost optimization & ops.", vector: [0.35, 0.85, 0.40] },
  { id: "product", title: "Technical Product Manager", desc: "Roadmaps, stakeholder alignment & technical strategy.", vector: [0.60, 0.60, 0.50] },
];

function cosineSim(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (!magA || !magB) return 0;
  return dot / (magA * magB);
}

export default function Simulator({ id = "simulator", title, desc }) {
  const [skills, setSkills] = useState([0.5, 0.5, 0.5]);

  const results = useMemo(() => {
    return sampleJobs
      .map((job) => ({
        ...job,
        score: cosineSim(skills, job.vector),
      }))
      .sort((a, b) => b.score - a.score);
  }, [skills]);

  const topPercent = Math.round((results[0]?.score ?? 0) * 100);

  const handleChange = (i, value) => {
    const newSkills = [...skills];
    newSkills[i] = parseFloat(value);
    setSkills(newSkills);
  };

  return (
    <section
      id={id}
      className="relative bg-primary-1500 overflow-hidden bg-[url('../src/assets/Noise.webp')] bg-repeat"
    >
      {/* background glow */}
      <div className="bg-primary-1300 absolute top-[60%] left-[0%] h-[45rem] w-[45rem] -translate-y-[50%] rounded-full opacity-30 blur-[30rem]" />

      <div className="relative w-full max-w-[90rem] mx-auto px-24 py-32 max-xl:px-16 max-xl:py-24 max-lg:px-8 max-md:px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-primary-50 mb-6 text-6xl/18 font-extrabold tracking-tight text-center max-xl:text-5xl/16 max-lg:text-4xl/10 max-sm:text-3xl/9"
        >
          {title || "Interactive Career Path Simulator"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-primary-100 mb-12 text-xl/loose font-light text-center max-w-3xl mx-auto max-xl:text-lg/8 max-md:text-base/loose"
        >
          {desc || "Adjust your skills and see which developer roles best match your profile."}
        </motion.p>

        {/* Simulator grid */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col bg-primary-1300/40 border border-primary-800 rounded-2xl p-8 shadow-xl backdrop-blur-md hover:shadow-2xl transition-all duration-300"
          >
            <h3 className="text-primary-50 text-lg font-semibold mb-6">Adjust your skills</h3>

            {/* Sliders */}
            <div className="space-y-8">
              {["Frontend", "Backend", "Data"].map((label, i) => (
                <div key={i}>
                  <label className="block mb-2 text-primary-100 font-medium">
                    {label} Skill:{" "}
                    <span className="text-primary-400 font-semibold">
                      {Math.round(skills[i] * 100)}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={skills[i]}
                    onChange={(e) => handleChange(i, e.target.value)}
                    className="w-full accent-primary-500 cursor-pointer hover:accent-cyan-400 transition-colors"
                  />
                </div>
              ))}
            </div>

            {/* Call-to-action */}
            <div className="mt-8">
              <button className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-cyan-400 text-black font-semibold py-3 px-6 shadow-lg hover:scale-[1.05] hover:shadow-xl transition-transform duration-300">
                Take full assessment
              </button>
              <p className="text-primary-300 text-sm mt-3 text-center">
                Unlock your personalized roadmap with deeper insights.
              </p>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-full flex flex-col bg-primary-1300/40 border border-primary-800 rounded-2xl p-8 shadow-xl backdrop-blur-md hover:shadow-2xl transition-all duration-300"
          >
            {/* Top match */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs text-primary-300">Top match</div>
                <div className="text-primary-50 font-semibold text-lg">
                  {results[0]?.title ?? "—"}
                </div>
                <div className="text-primary-200 text-sm">{results[0]?.desc}</div>
              </div>
              <div className="w-20 h-20 relative">
                <svg viewBox="0 0 36 36" className="w-20 h-20">
                  <path
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="2.5"
                  />
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{
                      pathLength: Math.min(1, results[0]?.score ?? 0),
                    }}
                    transition={{ duration: 0.8 }}
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#g2)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="g2" x1="0%" x2="100%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-primary-50">
                  {topPercent}%
                </div>
              </div>
            </div>

            {/* Ranked results */}
            <div className="space-y-3 flex-1">
              {results.slice(0, 3).map((r) => (
                <motion.div
                  key={r.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="p-4 rounded-lg border border-primary-800 flex items-center justify-between bg-primary-1300/60 hover:bg-primary-1200/60 transition-all"
                >
                  <div>
                    <div className="text-sm text-primary-50 font-semibold">{r.title}</div>
                    <div className="text-xs text-primary-300">{(r.score * 100).toFixed(1)}% fit</div>
                  </div>
                  <div className="text-xs text-primary-400 hidden sm:block max-w-[45%] text-right">
                    {r.desc}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
