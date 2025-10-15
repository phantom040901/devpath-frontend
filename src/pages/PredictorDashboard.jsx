import React, { useState } from "react";

const API_URL = "http://127.0.0.1:8000"; // backend URL

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // --- Helpers for random generation ---
  const randInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const generateRandomProfile = () => {
    setProfile({
      courses: "BSIT",
      os_perc: randInt(75, 100),
      algo_perc: randInt(75, 100),
      prog_perc: randInt(75, 100),
      se_perc: randInt(75, 100),
      cn_perc: randInt(75, 100),
      es_perc: randInt(75, 95),
      ca_perc: randInt(75, 95),
      math_perc: randInt(75, 95),
      comm_perc: randInt(75, 100),
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
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();

      // Ensure it's always an array
      setRecommendations(data.recommendations?.job_matches || []);
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6 flex justify-center">
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
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-indigo-300 text-center">
              Recommended Careers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-gray-700 rounded-xl p-6 shadow-md border border-gray-600"
                >
                  <h3 className="text-xl font-bold text-indigo-300">
                    {rec.job_role}
                  </h3>
                  <p className="text-gray-400">Category: {rec.category}</p>
                  <p className="mt-3 text-lg font-bold text-green-400">
                    Match Score: {formatScore(rec.match_score)}
                  </p>
                  {rec.explanation && (
                    <p className="mt-2 text-sm text-gray-300">{rec.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictorDashboard;
