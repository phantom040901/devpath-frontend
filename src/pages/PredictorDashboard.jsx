import React, { useState } from "react";
import ApiLoadingState from "../components/loading/ApiLoadingState";
import useApiWithColdStart from "../hooks/useApiWithColdStart";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"; // backend URL

function PredictorDashboard() {
  const [profile, setProfile] = useState({
    courses: "BSIT",
    os_perc: 85,
    algo_perc: 80,
    prog_perc: 90,
    se_perc: 88,
    cn_perc: 84,
    es_perc: 78,
    ca_perc: 82,
    math_perc: 86,
    comm_perc: 92,
    hours_working: 6,
    hackathons: 2,
    logical_quotient: 4,
    coding_skills: 4,
    public_speaking: 3,
    memory_score: 7,
    interested_subjects: "Software Engineering",
    career_area: "system developer",
    company_type: "Product based",
    books: "Technical",
    behavior: "gentle",
    management_tech: "Technical",
    salary_work: "salary",
    team_exp: "yes",
    work_style: "smart worker",
    relationship: "no",
    introvert: "no",
    seniors_input: "yes",
    gaming_interest: "no",
  });

  const [recommendations, setRecommendations] = useState([]);
  const [detailedExplanations, setDetailedExplanations] = useState([]);
  const [validation, setValidation] = useState(null);
  const [diversityInfo, setDiversityInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // API cold start detection hook
  const { isLoading: isApiLoading, execute: executeApiCall } = useApiWithColdStart();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // --- Helpers for random generation ---
  const randInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Generate random percentage in multiples of 10 (like assessment scores)
  const randPercentage = (min, max) => {
    const minTens = Math.ceil(min / 10);
    const maxTens = Math.floor(max / 10);
    return (randInt(minTens, maxTens) * 10);
  };

  const generateRandomProfile = () => {
    setProfile({
      courses: "BSIT",
      os_perc: randPercentage(60, 100),
      algo_perc: randPercentage(60, 100),
      prog_perc: randPercentage(60, 100),
      se_perc: randPercentage(60, 100),
      cn_perc: randPercentage(60, 100),
      es_perc: randPercentage(60, 100),
      ca_perc: randPercentage(60, 100),
      math_perc: randPercentage(60, 100),
      comm_perc: randPercentage(60, 100),
      hours_working: randInt(4, 12),
      hackathons: randInt(0, 10),
      logical_quotient: randInt(1, 5),
      coding_skills: randInt(1, 5),
      public_speaking: randInt(1, 5),
      memory_score: randInt(5, 10),
      interested_subjects: pick([
        "networks",
        "cloud computing",
        "hacking",
        "parallel computing",
        "Software Engineering",
        "Computer Architecture",
        "IOT",
        "Management",
      ]),
      career_area: pick([
        "cloud computing",
        "data engineering",
        "system developer",
        "security",
        "Business process analyst",
        "testing",
      ]),
      company_type: pick([
        "product development",
        "Product based",
        "Service Based",
        "Cloud Services",
        "Web Services",
        "SAaaS services",
      ]),
      books: pick([
        "Cookbooks",
        "Technical",
        "Science fiction",
        "Mystery",
        "Self help",
        "Fantasy",
        "Biographies",
      ]),
      behavior: pick(["stubborn", "gentle"]),
      management_tech: pick(["Technical", "Management"]),
      salary_work: pick(["salary", "work"]),
      team_exp: pick(["yes", "no"]),
      work_style: pick(["hard worker", "smart worker"]),
      relationship: pick(["yes", "no"]),
      introvert: pick(["yes", "no"]),
      seniors_input: pick(["yes", "no"]),
      gaming_interest: pick(["yes", "no"]),
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Wrap API call with cold start detection
    const data = await executeApiCall(async () => {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`);
      }

      return await res.json();
    });

    if (data) {
      console.log("Full API Response:", data); // For debugging

      // Store all the new data
      setRecommendations(data.recommendations?.job_matches || []);
      setDetailedExplanations(data.recommendations?.detailed_explanations || []);
      setValidation(data.recommendations?.validation || null);
      setDiversityInfo({
        strategy: data.recommendations?.diversity_strategy,
        note: data.recommendations?.diversity_note
      });
    }

    setLoading(false);
  };

  // --- Score Formatter ---
  const formatScore = (score) => {
    if (typeof score === "string") {
      return score; // Already formatted like "75.31%"
    }
    if (typeof score === "number") {
      return `${(score * 100).toFixed(2)}%`; // Convert float to %
    }
    return "N/A";
  };

  // --- Readiness Badge Helper ---
  const getReadinessBadge = (readiness) => {
    const badges = {
      "READY": { color: "bg-green-500", text: "✓ Ready", desc: "You meet all prerequisites!" },
      "READY_WITH_GROWTH": { color: "bg-blue-500", text: "Ready to Grow", desc: "Ready with room for improvement" },
      "CONDITIONAL": { color: "bg-yellow-500", text: "⚠ Conditional", desc: "Need skill improvements" },
      "NOT_READY": { color: "bg-red-500", text: "✗ Not Ready", desc: "Critical skill gaps present" }
    };
    return badges[readiness] || { color: "bg-gray-500", text: "Unknown", desc: "" };
  };

  // --- Confidence Badge Helper ---
  const getConfidenceBadge = (level) => {
    const badges = {
      "High": { color: "bg-green-500", icon: "✓" },
      "Medium": { color: "bg-yellow-500", icon: "~" },
      "Low": { color: "bg-orange-500", icon: "!" },
      "Conditional": { color: "bg-red-500", icon: "⚠" }
    };
    return badges[level] || { color: "bg-gray-500", icon: "?" };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6 flex justify-center">
      {/* API Loading State with Cold Start Detection */}
      <ApiLoadingState
        isLoading={isApiLoading}
        initialMessage="Generating your career predictions..."
        fullScreen={true}
      />

      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-indigo-400">
          Career Path Predictor
        </h1>

        {/* --- Profile Form --- */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-10">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-300">
            Student Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Percentages */}
            {[
              ["os_perc", "📚 Operating Systems %", 60, 100],
              ["algo_perc", "📐 Algorithms %", 60, 100],
              ["prog_perc", "💻 Programming Concepts %", 60, 100],
              ["se_perc", "🛠 Software Engineering %", 60, 100],
              ["cn_perc", "🌐 Computer Networks %", 60, 100],
              ["es_perc", "🔌 Electronics Subjects %", 60, 95],
              ["ca_perc", "🏛 Computer Architecture %", 60, 95],
              ["math_perc", "📊 Mathematics %", 60, 100],
              ["comm_perc", "🗣 Communication Skills %", 60, 100],
            ].map(([name, label, min, max]) => (
              <div key={name} className="flex flex-col">
                <label className="text-sm text-gray-400">{label}</label>
                <input
                  type="number"
                  name={name}
                  value={profile[name]}
                  min={min}
                  max={max}
                  onChange={handleChange}
                  className="mt-1 p-2 rounded-lg bg-gray-700 border border-gray-600"
                />
              </div>
            ))}

            {/* Numeric */}
            {[
              ["hours_working", "⏰ Hours per day", 1, 12],
              ["hackathons", "🏆 Hackathons", 0, 10],
              ["logical_quotient", "🧠 Logical Quotient", 1, 5],
              ["coding_skills", "👨‍💻 Coding Skills", 1, 5],
              ["public_speaking", "🎤 Public Speaking", 1, 5],
              ["memory_score", "🧠 Memory Score", 5, 10],
            ].map(([name, label, min, max]) => (
              <div key={name} className="flex flex-col">
                <label className="text-sm text-gray-400">{label}</label>
                <input
                  type="number"
                  name={name}
                  value={profile[name]}
                  min={min}
                  max={max}
                  onChange={handleChange}
                  className="mt-1 p-2 rounded-lg bg-gray-700 border border-gray-600"
                />
              </div>
            ))}

            {/* Dropdowns */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-400">📌 Interested Subjects</label>
              <select
                name="interested_subjects"
                value={profile.interested_subjects}
                onChange={handleChange}
                className="mt-1 p-2 rounded-lg bg-gray-700 border border-gray-600"
              >
                {[
                  "Software Engineering",
                  "parallel computing",
                  "Computer Architecture",
                  "data engineering",
                  "Management",
                  "IOT",
                  "networks",
                  "programming",
                  "cloud computing",
                  "hacking",
                ].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-400">🎯 Career Area</label>
              <select
                name="career_area"
                value={profile.career_area}
                onChange={handleChange}
                className="mt-1 p-2 rounded-lg bg-gray-700 border border-gray-600"
              >
                {[
                  "system developer",
                  "security",
                  "testing",
                  "cloud computing",
                  "Business process analyst",
                  "data engineering",
                ].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-400">🏢 Company Type</label>
              <select
                name="company_type"
                value={profile.company_type}
                onChange={handleChange}
                className="mt-1 p-2 rounded-lg bg-gray-700 border border-gray-600"
              >
                {[
                  "Product based",
                  "product development",
                  "Service Based",
                  "Cloud Services",
                  "Web Services",
                  "SAaaS services",
                ].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Other dropdowns */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-400">📖 Books</label>
              <select
                name="books"
                value={profile.books}
                onChange={handleChange}
                className="mt-1 p-2 rounded-lg bg-gray-700 border border-gray-600"
              >
                {[
                  "Cookbooks",
                  "Technical",
                  "Science fiction",
                  "Mystery",
                  "Self help",
                  "Fantasy",
                  "Biographies",
                ].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-400">👤 Behavior</label>
              <select
                name="behavior"
                value={profile.behavior}
                onChange={handleChange}
                className="mt-1 p-2 rounded-lg bg-gray-700 border border-gray-600"
              >
                {["stubborn", "gentle"].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-400">⚙ Management Style</label>
              <select
                name="management_tech"
                value={profile.management_tech}
                onChange={handleChange}
                className="mt-1 p-2 rounded-lg bg-gray-700 border border-gray-600"
              >
                {["Technical", "Management"].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-400">💼 Salary vs Work</label>
              <select
                name="salary_work"
                value={profile.salary_work}
                onChange={handleChange}
                className="mt-1 p-2 rounded-lg bg-gray-700 border border-gray-600"
              >
                {["salary", "work"].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-400">⚡ Work Style</label>
              <select
                name="work_style"
                value={profile.work_style}
                onChange={handleChange}
                className="mt-1 p-2 rounded-lg bg-gray-700 border border-gray-600"
              >
                {["hard worker", "smart worker"].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Radios */}
            {[
              ["relationship", "💖 Relationship"],
              ["introvert", "😶 Introvert"],
              ["seniors_input", "👨‍👩‍👦 Seniors Input"],
              ["gaming_interest", "🎮 Gaming Interest"],
              ["team_exp", "🤝 Worked in Teams"],
            ].map(([name, label]) => (
              <div key={name} className="flex flex-col">
                <label className="text-sm text-gray-400">{label}</label>
                <div className="flex gap-4 mt-1">
                  {["yes", "no"].map((opt) => (
                    <label key={opt} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={name}
                        value={opt}
                        checked={profile[name] === opt}
                        onChange={handleChange}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-6 mb-12">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg shadow-md disabled:opacity-50 font-semibold"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button
            onClick={generateRandomProfile}
            disabled={loading}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg shadow-md disabled:opacity-50 font-semibold"
          >
            Generate Random Profile
          </button>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-8">
            {/* Diversity Info Banner */}
            {diversityInfo?.note && (
              <div className="bg-indigo-900 border border-indigo-600 p-4 rounded-xl">
                <p className="text-sm text-indigo-200">
                  <span className="font-semibold">Strategy:</span> {diversityInfo.strategy} - {diversityInfo.note}
                </p>
              </div>
            )}

            {/* Validation Metrics */}
            {validation && (
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-indigo-300">System Confidence</h3>
                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-4 py-2 rounded-full text-white font-bold ${getConfidenceBadge(validation.confidence_level).color}`}>
                    {getConfidenceBadge(validation.confidence_level).icon} {validation.confidence_level}
                  </span>
                  <span className="text-2xl font-bold text-white">{validation.confidence_score}%</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Score Spread</p>
                    <p className="font-bold">{validation.metrics.score_spread} points</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Avg Score</p>
                    <p className="font-bold">{validation.metrics.average_score}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Diversity</p>
                    <p className="font-bold">{validation.metrics.category_diversity}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Strong Features</p>
                    <p className="font-bold">{validation.metrics.strong_profile_features}</p>
                  </div>
                </div>
                {validation.validation_notes && validation.validation_notes.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                    <p className="text-sm font-semibold text-gray-300 mb-2">Notes:</p>
                    {validation.validation_notes.map((note, i) => (
                      <p key={i} className="text-sm text-gray-400">• {note}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recommended Careers with Details */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 text-indigo-300 text-center">
                Recommended Careers
              </h2>
              <div className="space-y-6">
                {recommendations.map((rec, idx) => {
                  const detail = detailedExplanations[idx];
                  const readinessBadge = detail ? getReadinessBadge(detail.readiness) : null;

                  return (
                    <div
                      key={idx}
                      className="bg-gray-700 rounded-xl p-6 shadow-md border border-gray-600"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-indigo-300">
                            {rec.job_role}
                          </h3>
                          <p className="text-gray-400 text-sm">Category: {rec.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-400">
                            {formatScore(rec.match_score)}
                          </p>
                          {readinessBadge && (
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold text-white ${readinessBadge.color}`}>
                              {readinessBadge.text}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Readiness Description */}
                      {readinessBadge && (
                        <p className="text-sm text-gray-300 mb-4">{readinessBadge.desc}</p>
                      )}

                      {/* Details Section */}
                      {detail && (
                        <div className="space-y-4">
                          {/* Skill Gaps - CRITICAL */}
                          {detail.skill_gaps && detail.skill_gaps.length > 0 && (
                            <div className="bg-red-900 bg-opacity-30 border border-red-700 p-4 rounded-lg">
                              <p className="font-semibold text-red-300 mb-2">⚠️ Critical Skill Gaps:</p>
                              {detail.skill_gaps.map((gap, i) => (
                                <div key={i} className="text-sm text-red-200">
                                  • {gap.skill}: <span className="font-bold">{gap.current}</span> → needs <span className="font-bold">{gap.required}</span> (ideal: {gap.ideal})
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Readiness Warnings */}
                          {detail.readiness_warnings && detail.readiness_warnings.length > 0 && (
                            <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 p-4 rounded-lg">
                              <p className="font-semibold text-yellow-300 mb-2">⚠️ Warnings:</p>
                              {detail.readiness_warnings.map((warning, i) => (
                                <p key={i} className="text-sm text-yellow-200">• {warning}</p>
                              ))}
                            </div>
                          )}

                          {/* Alternative Roles */}
                          {detail.alternative_roles && detail.alternative_roles.length > 0 && (
                            <div className="bg-blue-900 bg-opacity-30 border border-blue-700 p-4 rounded-lg">
                              <p className="font-semibold text-blue-300 mb-2">🔄 Consider Starting With:</p>
                              {detail.alternative_roles.map((alt, i) => (
                                <p key={i} className="text-sm text-blue-200">• {alt}</p>
                              ))}
                            </div>
                          )}

                          {/* Recommended Career Path */}
                          {detail.recommended_career_path && (
                            <div className="bg-purple-900 bg-opacity-30 border border-purple-700 p-4 rounded-lg">
                              <p className="font-semibold text-purple-300 mb-2">📍 Recommended Path:</p>
                              <p className="text-sm text-purple-200">{detail.recommended_career_path}</p>
                            </div>
                          )}

                          {/* Your Strengths */}
                          {detail.your_strengths && detail.your_strengths.length > 0 && (
                            <div className="bg-green-900 bg-opacity-30 border border-green-700 p-4 rounded-lg">
                              <p className="font-semibold text-green-300 mb-2">💪 Your Strengths:</p>
                              {detail.your_strengths.map((strength, i) => (
                                <p key={i} className="text-sm text-green-200">• {strength}</p>
                              ))}
                            </div>
                          )}

                          {/* Growth Areas */}
                          {detail.growth_areas && detail.growth_areas.length > 0 && (
                            <div className="bg-gray-600 p-4 rounded-lg">
                              <p className="font-semibold text-gray-300 mb-2">📈 Areas for Growth:</p>
                              {detail.growth_areas.map((area, i) => (
                                <div key={i} className="text-sm text-gray-300">
                                  • {area.skill}: {area.current} → ideal {area.ideal}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Improvement Opportunities */}
                          {detail.improvement_opportunities && detail.improvement_opportunities.length > 0 && !detail.growth_areas?.length && (
                            <div className="bg-gray-600 p-4 rounded-lg">
                              <p className="font-semibold text-gray-300 mb-2">📈 Improvement Opportunities:</p>
                              {detail.improvement_opportunities.map((opp, i) => (
                                <div key={i} className="text-sm text-gray-300">
                                  • {opp.area}: {opp.current} → {opp.target}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictorDashboard;
