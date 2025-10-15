// src/pages/DebugUserData.jsx
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthContext";
import { motion } from "framer-motion";
import DashNav from "../components/dashboard/DashboardNav";
import { Copy, Check } from "lucide-react";

export default function DebugUserData() {
  const { user } = useAuth();
  const [rawResults, setRawResults] = useState([]);
  const [aggregatedData, setAggregatedData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const resultsRef = collection(db, "users", user.uid, "results");
      const snapshot = await getDocs(resultsRef);
      
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setRawResults(results);
      
      // Build results map
      const resultsMap = {};
      results.forEach(doc => {
        resultsMap[doc.id] = doc;
      });
      
      // Direct extraction - no helper function
      const payload = {
        courses: "BSIT",
        
        os_perc: resultsMap["assessments_operating_systems_1"]?.score || 0,
        algo_perc: resultsMap["assessments_algorithms_1"]?.score || 0,
        prog_perc: resultsMap["assessments_programming_1"]?.score || 0,
        se_perc: resultsMap["assessments_software_engineering_1"]?.score || 0,
        cn_perc: resultsMap["assessments_computer_networks_1"]?.score || 0,
        es_perc: resultsMap["assessments_electronics_1"]?.score || 0,
        ca_perc: resultsMap["assessments_computer_architecture_1"]?.score || 0,
        math_perc: resultsMap["assessments_mathematics_1"]?.score || 0,
        comm_perc: resultsMap["assessments_communication_1"]?.score || 0,
        
        coding_skills: Math.round((resultsMap["technicalAssessments_coding_skills_1"]?.score || 0) / 20),
        logical_quotient: Math.round((resultsMap["technicalAssessments_logical_quotient_1"]?.score || 0) / 20),
        memory_score: Math.round((resultsMap["technicalAssessments_memory_test_1"]?.score || 0) / 10),
        
        hours_working: resultsMap["survey_hours_working_1"]?.answers?.q1?.value || 6,
        hackathons: resultsMap["survey_hackathons_1"]?.answers?.q1?.value || 0,
        
        interested_subjects: resultsMap["survey_career_preferences_1"]?.answers?.q1?.value || "Software Engineering",
        career_area: resultsMap["survey_career_preferences_1"]?.answers?.q2?.value || "system developer",
        company_type: resultsMap["survey_career_preferences_1"]?.answers?.q3?.value || "Product based",
        management_tech: resultsMap["survey_career_preferences_1"]?.answers?.q4?.value || "Technical",
        
        books: resultsMap["survey_personal_interests_1"]?.answers?.q1?.value || "Technical",
        gaming_interest: resultsMap["survey_personal_interests_1"]?.answers?.q2?.value || "no",
        public_speaking: parseInt(resultsMap["survey_personal_interests_1"]?.answers?.q3?.value) || 3,
        work_style: resultsMap["survey_personal_interests_1"]?.answers?.q4?.value || "smart worker",
        
        behavior: resultsMap["survey_personality_workstyle_1"]?.answers?.q1?.value || "gentle",
        introvert: resultsMap["survey_personality_workstyle_1"]?.answers?.q2?.value || "no",
        relationship: resultsMap["survey_personality_workstyle_1"]?.answers?.q3?.value || "no",
        team_exp: resultsMap["survey_personality_workstyle_1"]?.answers?.q4?.value || "yes",
        seniors_input: resultsMap["survey_personality_workstyle_1"]?.answers?.q5?.value || "yes",
        salary_work: resultsMap["survey_personality_workstyle_1"]?.answers?.q6?.value || "work",
      };
      
      console.log("DIRECT HACKATHONS VALUE:", resultsMap["survey_hackathons_1"]?.answers?.q1?.value);
      
      setAggregatedData(payload);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(aggregatedData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-1400 via-primary-1500 to-black">
        <div className="text-gray-300 animate-pulse">Loading data...</div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black px-4 sm:px-6 py-12">
      <DashNav />

      <div className="max-w-7xl mx-auto mt-20 sm:mt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent mb-4">
            Debug: User Data Mapping
          </h1>
          <p className="text-gray-300">Verify that all assessment data is being captured correctly</p>
        </motion.div>

        <div className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">FastAPI Payload</h2>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="bg-gray-800/50 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
            {JSON.stringify(aggregatedData, null, 2)}
          </pre>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={async () => {
              try {
                const response = await fetch("http://localhost:8000/predict", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(aggregatedData),
                });
                const data = await response.json();
                console.log("API Response:", data);
                alert("Check console for API response");
              } catch (err) {
                alert("API Error: " + err.message);
              }
            }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-emerald-400 text-primary-1300 font-semibold hover:scale-105 transition"
          >
            Test API with This Data
          </button>
        </div>
      </div>
    </section>
  );
}