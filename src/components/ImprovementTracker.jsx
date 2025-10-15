// src/components/ImprovementTracker.jsx
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
  import { useAuth } from "./AuthContext";
import { TrendingUp, TrendingDown, Minus, Download } from "lucide-react";
import { downloadCertificate } from "../utils/certificateGenerator";

export default function ImprovementTracker({ careerData }) {
  const { user } = useAuth();
  const [improvements, setImprovements] = useState([]);
  const [overallStats, setOverallStats] = useState({
    academicAvg: 0,
    technicalAvg: 0,
    overallReadiness: 0,
    skillsImproved: 0
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadImprovementData();
  }, [user]);

  const loadImprovementData = async () => {
    try {
      const resultsRef = collection(db, "users", user.uid, "results");
      const snapshot = await getDocs(resultsRef);
      
      // Group results by assessment to track improvement over time
      const assessmentHistory = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const assessmentId = doc.id.replace(/_\d+$/, '');
        
        if (!assessmentHistory[assessmentId]) {
          assessmentHistory[assessmentId] = [];
        }
        
        assessmentHistory[assessmentId].push({
          score: data.score || 0,
          timestamp: data.submittedAt || data.timestamp,
          id: doc.id
        });
      });

      // Calculate improvements
      const improvementData = [];
      let academicTotal = 0;
      let academicCount = 0;
      let technicalTotal = 0;
      let technicalCount = 0;
      let improved = 0;

      Object.entries(assessmentHistory).forEach(([assessmentId, attempts]) => {
        if (attempts.length < 2) return;

        const sorted = attempts.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        const firstScore = sorted[0].score;
        const lastScore = sorted[sorted.length - 1].score;
        const improvement = lastScore - firstScore;

        if (improvement > 0) improved++;

        const name = formatAssessmentName(assessmentId);
        const isAcademic = assessmentId.startsWith('assessments_');
        const isTechnical = assessmentId.startsWith('technicalAssessments_');

        if (isAcademic) {
          academicTotal += lastScore;
          academicCount++;
        } else if (isTechnical) {
          technicalTotal += lastScore;
          technicalCount++;
        }

        improvementData.push({
          name,
          firstScore,
          lastScore,
          improvement,
          percentChange: firstScore > 0 ? ((improvement / firstScore) * 100).toFixed(1) : 0,
          type: isAcademic ? 'academic' : 'technical'
        });
      });

      improvementData.sort((a, b) => Math.abs(b.improvement) - Math.abs(a.improvement));

      const academicAvg = academicCount > 0 ? Math.round(academicTotal / academicCount) : 0;
      const technicalAvg = technicalCount > 0 ? Math.round(technicalTotal / technicalCount) : 0;
      const overall = Math.round((academicAvg + technicalAvg) / 2);

      setImprovements(improvementData);
      setOverallStats({
        academicAvg,
        technicalAvg,
        overallReadiness: overall,
        skillsImproved: improved
      });

      // Check if ready (all scores >= 70%)
      const allReady = improvementData.every(item => item.lastScore >= 70);
      setIsReady(allReady && overall >= 70);

    } catch (err) {
      console.error("Error loading improvement data:", err);
    }
  };

  const formatAssessmentName = (id) => {
    return id
      .replace('assessments_', '')
      .replace('technicalAssessments_', '')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleDownloadCertificate = () => {
    downloadCertificate(
      { name: user.displayName || user.email },
      careerData,
      overallStats
    );
  };

  return (
    <div className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="text-primary-400" size={28} />
          Skill Improvement Tracking
        </h2>
        
        {isReady && (
          <button
            onClick={handleDownloadCertificate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-semibold transition"
          >
            <Download size={18} />
            Get Certificate
          </button>
        )}
      </div>

      {/* Overall Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-primary-500/10 rounded-lg p-4 border border-primary-500/20">
          <div className="text-sm text-gray-400 mb-1">Academic</div>
          <div className="text-2xl font-bold text-primary-400">{overallStats.academicAvg}%</div>
        </div>
        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
          <div className="text-sm text-gray-400 mb-1">Technical</div>
          <div className="text-2xl font-bold text-purple-400">{overallStats.technicalAvg}%</div>
        </div>
        <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
          <div className="text-sm text-gray-400 mb-1">Overall Readiness</div>
          <div className="text-2xl font-bold text-emerald-400">{overallStats.overallReadiness}%</div>
        </div>
        <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
          <div className="text-sm text-gray-400 mb-1">Skills Improved</div>
          <div className="text-2xl font-bold text-yellow-400">{overallStats.skillsImproved}</div>
        </div>
      </div>

      {/* Readiness Status */}
      <div className={`p-4 rounded-lg mb-6 ${
        isReady 
          ? 'bg-emerald-500/10 border border-emerald-500/30' 
          : 'bg-yellow-500/10 border border-yellow-500/30'
      }`}>
        <div className="flex items-center gap-2">
          {isReady ? (
            <>
              <TrendingUp className="text-emerald-400" size={20} />
              <span className="text-emerald-400 font-semibold">Career Ready!</span>
              <span className="text-gray-300">You've met all requirements for {careerData?.jobRole}</span>
            </>
          ) : (
            <>
              <TrendingUp className="text-yellow-400" size={20} />
              <span className="text-yellow-400 font-semibold">In Progress</span>
              <span className="text-gray-300">Keep improving to reach career readiness</span>
            </>
          )}
        </div>
      </div>

      {/* Improvement Details */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white mb-3">Assessment Progress</h3>
        {improvements.map((item, idx) => (
          <div key={idx} className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{item.name}</span>
              <div className="flex items-center gap-2">
                {item.improvement > 0 ? (
                  <TrendingUp className="text-emerald-400" size={16} />
                ) : item.improvement < 0 ? (
                  <TrendingDown className="text-red-400" size={16} />
                ) : (
                  <Minus className="text-gray-400" size={16} />
                )}
                <span className={`font-bold ${
                  item.improvement > 0 ? 'text-emerald-400' : 
                  item.improvement < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {item.improvement > 0 ? '+' : ''}{item.improvement}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-4">
                <span className="text-gray-400">Initial: {item.firstScore}%</span>
                <span className="text-gray-400">Current: {item.lastScore}%</span>
              </div>
              {item.improvement !== 0 && (
                <span className={`${
                  item.improvement > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {item.percentChange}% change
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  item.lastScore >= 70 ? 'bg-emerald-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${Math.min(item.lastScore, 100)}%` }}
              />
            </div>
          </div>
        ))}

        {improvements.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            Complete assessments multiple times to track improvement
          </p>
        )}
      </div>
    </div>
  );
}