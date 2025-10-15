// src/pages/PreAssessment.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Polished PreAssessment (presentation-ready)
 * - responsive 12-column grid layout (fills the page)
 * - left: categories + questions (big cards)
 * - right: how-it-works + estimated readiness + preview
 * - Submit -> spinner -> animated full-screen modal with 3 cards (choose -> navigate to /dashboard)
 *
 * This is a client-only mock; replace runLocalPredict with your backend call when ready.
 */

function runLocalPredict(profile) {
  // small mocked recommender that returns 3 roles with scores
  const pool = [
    "UX Designer",
    "Database Developer",
    "Information Security Analyst",
    "Software Engineer",
    "Web Developer",
    "Data Architect",
  ];

  const base =
    (profile.prog_perc * 0.25 || 75 * 0.25) +
    (profile.algo_perc * 0.2 || 70 * 0.2) +
    (profile.coding_skills * 6 || 3 * 6) +
    (profile.logical_quotient * 6 || 3 * 6) +
    (profile.comm_perc * 0.15 || 70 * 0.15);

  const recs = pool.map((role) => {
    const rand = Math.random() * 10 - 5;
    const match_score = Math.max(55, Math.min(95, Math.round(base / 1.2 + rand)));
    const category = role.includes("Developer") || role.includes("Engineer")
      ? "Software Development"
      : role.includes("Data")
      ? "Data & Analytics"
      : role.includes("Security")
      ? "Networking & Security"
      : "Other";
    return {
      job_role: role,
      category,
      match_score,
      explanation: `Mock explanation for ${role}. Strengths: programming, practical projects, and domain interest.`,
    };
  });

  return recs.sort((a, b) => b.match_score - a.match_score).slice(0, 3);
}

export default function PreAssessment() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    prog_perc: 78,
    algo_perc: 72,
    coding_skills: 4,
    logical_quotient: 3,
    comm_perc: 70,
    categories: [],
  });

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [flipped, setFlipped] = useState({});

  const CATEGORIES = [
    "Software Development",
    "Data Science",
    "Cybersecurity",
    "IT Management",
    "Networking & Security",
    "Quality Assurance & Testing",
  ];

  // compute a simple estimated readiness score for the preview
  const readiness = useMemo(() => {
    // weight sliders: programming 35%, algorithms 25%, coding skills (1-5 scaled) 20%, logic 10%, comm 10%
    const codingScaled = (profile.coding_skills / 5) * 100;
    const logicScaled = (profile.logical_quotient / 5) * 100;
    const score = Math.round(
      profile.prog_perc * 0.35 +
      profile.algo_perc * 0.25 +
      codingScaled * 0.2 +
      logicScaled * 0.1 +
      profile.comm_perc * 0.1
    );
    return Math.max(0, Math.min(100, score));
  }, [profile]);

  function toggleCategory(cat) {
    setProfile((p) => {
      const has = p.categories.includes(cat);
      return { ...p, categories: has ? p.categories.filter((c) => c !== cat) : [...p.categories, cat] };
    });
  }

  function updateField(name, value) {
    setProfile((p) => ({ ...p, [name]: value }));
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setShowModal(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function handleSubmit(e) {
    e && e.preventDefault();
    setLoading(true);
    setRecommendations(null);
    setShowModal(false);

    // simulate server compute
    setTimeout(() => {
      const recs = runLocalPredict(profile);
      setRecommendations(recs);
      setLoading(false);

      setTimeout(() => {
        setShowModal(true);
        setFlipped({});
      }, 180);
    }, 900);
  }

  function handleChoose(rec) {
    // navigate to dashboard and pass chosen career and profile
    navigate("/dashboard", { state: { chosen: rec, profile, hasTakenAssessment: true } });
  }

  // Framer motion variants
  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { y: "110vh", opacity: 0, scale: 0.98 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 88, damping: 14 } },
    exit: { y: "110vh", opacity: 0, transition: { duration: 0.35 } },
  };

  return (
    <main className="min-h-screen bg-primary-1400 text-primary-50 px-6 py-12">
      <div className="mx-auto max-w-[1100px]">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold">Pre-Assessment</h1>
          <p className="text-primary-200 mt-2">
            Pick the categories that interest you and answer a few quick questions. When you press Submit we’ll calculate your top matches and show them in an animated popup.
          </p>
        </header>

        {/* grid: left 8 columns, right 4 columns (desktop) */}
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
  {/* Left: categories + quick questions */}
  <div className="col-span-12 lg:col-span-8 space-y-6">
    <section className="rounded-2xl bg-primary-1200 p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Choose career categories</h2>
      <p className="text-sm text-primary-200 mb-4">
        Select any areas you’re curious about. This will bias the recommendations.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CATEGORIES.map((c) => {
          const active = profile.categories.includes(c);
          return (
            <label
              key={c}
              onClick={(e) => {
                e.preventDefault();
                toggleCategory(c);
              }}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition ${
                active ? "bg-primary-900" : "bg-primary-1000 hover:bg-primary-1100"
              }`}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => toggleCategory(c)}
                className="h-4 w-4"
                aria-label={`Select ${c}`}
              />
              <div className="text-sm font-medium">{c}</div>
            </label>
          );
        })}
      </div>
    </section>

    <section className="rounded-2xl bg-primary-1200 p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Quick questions</h2>

      <div className="space-y-6">
        <label className="block">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm">Programming concepts (%)</div>
            <div className="text-sm font-medium text-primary-50">{profile.prog_perc}%</div>
          </div>
          <input
            aria-label="Programming concepts percent"
            type="range"
            min="60"
            max="100"
            value={profile.prog_perc}
            onChange={(e) => updateField("prog_perc", Number(e.target.value))}
            className="w-full"
          />
        </label>

        <label className="block">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm">Algorithms (%)</div>
            <div className="text-sm font-medium text-primary-50">{profile.algo_perc}%</div>
          </div>
          <input
            aria-label="Algorithms percent"
            type="range"
            min="60"
            max="100"
            value={profile.algo_perc}
            onChange={(e) => updateField("algo_perc", Number(e.target.value))}
            className="w-full"
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm">Coding skills (1-5)</div>
              <div className="text-sm font-medium text-primary-50">{profile.coding_skills}</div>
            </div>
            <input
              aria-label="Coding skills"
              type="range"
              min="1"
              max="5"
              value={profile.coding_skills}
              onChange={(e) => updateField("coding_skills", Number(e.target.value))}
              className="w-full"
            />
          </label>

          <label>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm">Logical quotient (1-5)</div>
              <div className="text-sm font-medium text-primary-50">{profile.logical_quotient}</div>
            </div>
            <input
              aria-label="Logical quotient"
              type="range"
              min="1"
              max="5"
              value={profile.logical_quotient}
              onChange={(e) => updateField("logical_quotient", Number(e.target.value))}
              className="w-full"
            />
          </label>
        </div>
      </div>
    </section>

    <div className="flex items-center gap-4">
      <button
        type="submit"
        className="rounded-full bg-primary-500 px-8 py-3 font-semibold text-primary-1300 hover:bg-primary-400 transition shadow-md"
        aria-label="Submit assessment"
      >
        Submit
      </button>

      <button
        type="button"
        onClick={() => {
          // quick demo reset
          setProfile({
            prog_perc: 78,
            algo_perc: 72,
            coding_skills: 4,
            logical_quotient: 3,
            comm_perc: 70,
            categories: [],
          });
          setRecommendations(null);
        }}
        className="rounded-full bg-primary-900 px-6 py-3 text-sm text-primary-50 hover:bg-primary-800 transition"
      >
        Reset
      </button>

      <div className="ml-auto text-sm text-primary-200">
        <strong className="text-primary-50 mr-2">Tip:</strong> Choose categories then press Submit
        for a surprise popup.
      </div>
    </div>
  </div>

  {/* Right column: how it works + preview + readiness */}
  <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6">
    <div className="rounded-2xl bg-primary-1200 p-6 shadow-lg flex flex-col">
      <h3 className="text-xl font-semibold mb-2">How it works</h3>
      <p className="text-primary-200 text-sm flex-grow">
        This is a mock pre-assessment for your presentation. When you press Submit we simulate
        computation of top matches and show them in an animated modal. Pick one to fill your
        dashboard.
      </p>

      <div className="mt-4">
        <div className="text-sm text-primary-200 mb-2">Selected categories</div>
        <div className="flex flex-wrap gap-2">
          {profile.categories.length === 0 ? (
            <span className="text-sm text-primary-200">None yet</span>
          ) : (
            profile.categories.map((c) => (
              <span
                key={c}
                className="rounded-full bg-primary-900 px-3 py-1 text-xs font-medium"
              >
                {c}
              </span>
            ))
          )}
        </div>
      </div>
    </div>

    <div className="rounded-2xl bg-primary-1200 p-6 shadow-lg flex flex-col">
      <h3 className="text-xl font-semibold mb-2">Estimated readiness</h3>
      <p className="text-primary-200 text-sm mb-4">
        A quick mock metric computed from your answers to demonstrate readiness for developer
        roles.
      </p>

      <div className="flex items-center gap-4">
        <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-full bg-primary-1000">
          {/* circular progress using conic-gradient fallback */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#44e5e7 ${readiness * 3.6}deg, rgba(255,255,255,0.03) 0deg)`,
            }}
            aria-hidden
          />
          <div className="relative z-10 text-center">
            <div className="text-xl font-bold text-primary-50">{readiness}%</div>
            <div className="text-xs text-primary-200">Readiness</div>
          </div>
        </div>

        <div className="flex-1">
          <div className="text-sm text-primary-200 mb-2">Quick summary</div>
          <div className="text-sm text-primary-50">
            Based on your current inputs you are approximately <strong>{readiness}%</strong> ready.
            Use the simulator on the dashboard to explore ways to increase this.
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            <div className="flex justify-between text-xs text-primary-200">
              <span>Programming</span>
              <span>{profile.prog_perc}%</span>
            </div>
            <div className="flex justify-between text-xs text-primary-200">
              <span>Algorithms</span>
              <span>{profile.algo_perc}%</span>
            </div>
            <div className="flex justify-between text-xs text-primary-200">
              <span>Coding skills</span>
              <span>{profile.coding_skills}/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </aside>
</form>

      </div>

      {/* Animated full-screen modal with recommendations */}
      <AnimatePresence>
        {showModal && recommendations && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            style={{ background: "rgba(4,9,9,0.75)" }}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              className="w-[95%] max-w-6xl rounded-3xl bg-primary-1400 p-6 md:p-10 shadow-2xl ring-1 ring-white/5"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-primary-50">Surprise — your top matches</h2>
                  <p className="text-sm text-primary-200 mt-1">Flip a card to read details. Pick one to fill your dashboard.</p>
                </div>

                <div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded-full border border-white/10 px-3 py-2 text-sm text-primary-50"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((rec, idx) => (
                  <motion.div key={rec.job_role} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.08 }}>
                    <div className="relative w-full h-[360px]">
                      <div className="absolute inset-0" style={{ perspective: 1400 }}>
                        <div style={{
                          width: "100%",
                          height: "100%",
                          transformStyle: "preserve-3d",
                          transition: "transform 700ms",
                          transform: flipped[idx] ? "rotateY(180deg)" : "rotateY(0deg)",
                        }}>
                          <div className="absolute inset-0 rounded-2xl bg-primary-1300 p-6 flex flex-col" style={{ backfaceVisibility: "hidden" }}>
                            <div className="flex-grow">
                              <div className="text-sm text-primary-500">{rec.category}</div>
                              <h3 className="text-2xl font-bold text-primary-50 mt-3">{rec.job_role}</h3>
                              <p className="text-primary-200 mt-4">Score: <span className="font-semibold text-primary-500">{rec.match_score}%</span></p>
                              <p className="text-sm text-primary-200 mt-4 line-clamp-4">{rec.explanation}</p>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                              <button onClick={(e) => { e.stopPropagation(); setFlipped((f) => ({ ...f, [idx]: true })); }} className="rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-primary-1300">Details</button>
                              <button onClick={(e) => { e.stopPropagation(); handleChoose(rec); }} className="rounded-full bg-primary-900 px-4 py-2 text-sm font-semibold text-primary-50">Choose</button>
                            </div>
                          </div>

                          <div className="absolute inset-0 rounded-2xl bg-primary-1400 p-6 flex flex-col" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
                            <div className="flex-grow">
                              <h3 className="text-xl font-semibold text-primary-50">{rec.job_role}</h3>
                              <p className="text-sm text-primary-200 mt-3">{rec.explanation}</p>

                              <div className="mt-4 text-sm text-primary-200">
                                <div>Suggested focus areas:</div>
                                <ul className="list-disc list-inside mt-2">
                                  <li>Build portfolio projects</li>
                                  <li>Practice algorithms & data structures</li>
                                  <li>Contribute to open source</li>
                                </ul>
                              </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                              <button onClick={(e) => { e.stopPropagation(); setFlipped((f) => ({ ...f, [idx]: false })); }} className="rounded-full border border-white/10 px-4 py-2 text-sm text-primary-50">Back</button>
                              <button onClick={(e) => { e.stopPropagation(); handleChoose(rec); }} className="rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-primary-1300">Choose this career</button>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div className="fixed inset-0 z-40 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: "rgba(4,9,9,0.6)" }}>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-primary-500 animate-spin" />
              <div className="text-center">
                <div className="text-lg font-semibold">Calculating your matches…</div>
                <div className="text-sm text-primary-200">This is a mock calculation for presentation.</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
