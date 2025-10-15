// src/components/dashboard/SimulatorCard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/**
 * SimulatorCard
 * props:
 *  - careers: [{ id, title, score, subtitle, tags, description }]
 *  - onSimulate?: (result) => void
 *
 * The component contains an internal mapping of required skills per career id.
 * Edit REQUIRED_SKILLS_MAP below to tune required skills + weights for each career.
 */

const REQUIRED_SKILLS_MAP = {
  // keys are career ids (match your topMatches ids)
  frontend: [
    { key: "programming", label: "Programming", weight: 0.45 },
    { key: "uiux", label: "UI / UX", weight: 0.25 },
    { key: "communication", label: "Communication", weight: 0.15 },
    { key: "testing", label: "Testing", weight: 0.15 },
  ],
  backend: [
    { key: "programming", label: "Programming", weight: 0.45 },
    { key: "databases", label: "Databases", weight: 0.25 },
    { key: "system", label: "System Design", weight: 0.2 },
    { key: "communication", label: "Communication", weight: 0.1 },
  ],
  ml: [
    { key: "programming", label: "Programming", weight: 0.35 },
    { key: "math", label: "Math/Stats", weight: 0.3 },
    { key: "ml", label: "ML Fundamentals", weight: 0.25 },
    { key: "communication", label: "Communication", weight: 0.1 },
  ],
  // fallback default if career id isn't found
  __default__: [
    { key: "programming", label: "Programming", weight: 0.4 },
    { key: "communication", label: "Communication", weight: 0.2 },
    { key: "problem", label: "Problem Solving", weight: 0.4 },
  ],
};

function clamp(n, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

export default function SimulatorCard({ careers = [], onSimulate }) {
  const firstCareerId = careers?.[0]?.id ?? null;
  const [selectedCareerId, setSelectedCareerId] = useState(firstCareerId);
  const skillsDef = useMemo(
    () => REQUIRED_SKILLS_MAP[selectedCareerId] ?? REQUIRED_SKILLS_MAP.__default__,
    [selectedCareerId]
  );

  // initialize slider state from skillsDef (values 40..80 default)
  const [sliders, setSliders] = useState(() =>
    Object.fromEntries(skillsDef.map((s) => [s.key, 60]))
  );

  // ensure sliders re-init when career changes
  useEffect(() => {
    const init = Object.fromEntries(skillsDef.map((s) => [s.key, 60]));
    setSliders(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCareerId]);

  // helper: update a slider
  function updateSlider(key, value) {
    setSliders((s) => ({ ...s, [key]: clamp(Number(value)) }));
  }

  // compute simulated result: combine career base score (if provided) with weighted slider average
  const simulated = useMemo(() => {
    const career = careers.find((c) => c.id === selectedCareerId);
    const baseScore = career?.score ?? 40; // 0-100 baseline from match
    // weighted average of sliders according to weights
    const totalWeight = skillsDef.reduce((acc, s) => acc + (s.weight ?? 0), 0) || 1;
    const weightedSum = skillsDef.reduce((acc, s) => {
      const val = Number(sliders[s.key] ?? 0);
      return acc + (val * (s.weight ?? 0));
    }, 0);
    const weightedPercent = weightedSum / totalWeight; // 0-100-ish
    // combine: 55% slider influence, 45% base score (tune as you like)
    const simulatedScore = Math.round((0.55 * weightedPercent) + (0.45 * baseScore));
    // short recommendation
    const recommendation = (() => {
      // find biggest gaps
      const gaps = skillsDef.map(s => {
        const have = sliders[s.key] ?? 0;
        return { ...s, have, gap: Math.round(s.weight * 100 - have) };
      }).sort((a,b) => b.gap - a.gap);
      const biggest = gaps.slice(0,2).filter(g=>g.gap>0).map(g => g.label);
      if (biggest.length === 0) return "You are well aligned to this role. Focus on projects to showcase skills.";
      return `Improve: ${biggest.join(", ")}.`;
    })();
    return { simulatedScore: clamp(simulatedScore, 0, 100), recommendation, baseScore: Math.round(baseScore) };
  }, [sliders, skillsDef, careers, selectedCareerId]);

  function handleRunSimulation() {
    const career = careers.find((c) => c.id === selectedCareerId);
    const payload = {
      careerId: selectedCareerId,
      careerTitle: career?.title ?? selectedCareerId,
      simulatedScore: simulated.simulatedScore,
      baseScore: simulated.baseScore,
      sliders,
      recommendation: simulated.recommendation,
      timestamp: new Date().toISOString(),
    };
    if (typeof onSimulate === "function") onSimulate(payload);
  }

  return (
    <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }} className="rounded-2xl bg-primary-1300 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary-50">Career Simulator</h3>
        <div className="text-sm text-gray-200">Try scenarios</div>
      </div>

      <div className="mt-4">
        <label className="block text-sm text-gray-200 mb-2">Target role</label>
        <select aria-label="Select target role" value={selectedCareerId ?? ""} onChange={(e)=>setSelectedCareerId(e.target.value)} className="w-full rounded-xl border border-white/10 bg-primary-1400 px-3 py-2 text-primary-50">
          {careers.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      <div className="mt-4 space-y-4">
        {skillsDef.map(skill => (
          <div key={skill.key}>
            <div className="flex items-center justify-between text-sm text-gray-200 mb-1">
              <div className="capitalize">{skill.label}</div>
              <div className="font-medium">{sliders[skill.key] ?? 0}%</div>
            </div>
            <input aria-label={`${skill.label} slider`} type="range" min={0} max={100} value={sliders[skill.key] ?? 0} onChange={(e)=>updateSlider(skill.key, e.target.value)} className="w-full h-2 cursor-pointer appearance-none rounded-full bg-white/10" />
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-white/5 bg-white/5 p-4 text-sm text-primary-50">
        <div className="flex items-center justify-between">
          <div>Baseline</div>
          <div className="font-semibold">{simulated.baseScore}%</div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>Simulated Score</div>
          <div className="text-2xl font-bold text-primary-500">{simulated.simulatedScore}%</div>
        </div>
        <p className="mt-2 text-xs text-gray-200">{simulated.recommendation}</p>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button onClick={handleRunSimulation} className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-primary-1300 shadow-[0_0_25px_rgba(0,255,200,0.12)] hover:shadow-[0_0_40px_rgba(0,255,200,0.2)] transition">
          Run Simulation
        </button>
        <button onClick={()=>{ setSliders(Object.fromEntries(skillsDef.map(s=>[s.key,60]))); }} className="rounded-full border border-white/10 px-4 py-2 text-sm text-primary-50">Reset</button>
      </div>
    </motion.div>
  );
}
