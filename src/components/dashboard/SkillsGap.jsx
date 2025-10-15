// src/components/dashboard/SkillsGap.jsx
import React from "react";

/**
 * requiredSkills: [{ name, required }]
 * profile: { prog_perc, algo_perc, coding_skills, logical_quotient, comm_perc }
 */
export default function SkillsGap({ requiredSkills = [], profile = {} }) {
  // map basic profile percentages for relevant skills
  const profileMap = {
    Programming: profile.prog_perc ?? 60,
    Algorithms: profile.algo_perc ?? 60,
    "System Design": Math.round(((profile.prog_perc ?? 60) + (profile.coding_skills ?? 3) * 10) / 2),
    Communication: profile.comm_perc ?? 60,
  };

  return (
    <div className="space-y-3 mt-3">
      {requiredSkills.map((s) => {
        const have = profileMap[s.name] ?? Math.round(Math.random() * 40) + 40;
        const required = s.required;
        const pctHave = Math.max(0, Math.min(100, have));
        return (
          <div key={s.name}>
            <div className="flex justify-between text-xs text-primary-200 mb-1">
              <span>{s.name}</span>
              <span>{pctHave}% / {required}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
              <div className="h-2 rounded-full bg-primary-500" style={{ width: `${pctHave}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
