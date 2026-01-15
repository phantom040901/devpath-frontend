import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function AssessmentDebugger() {
  const { user } = useAuth();
  const [debug, setDebug] = useState(null);

  useEffect(() => {
    if (user) loadDebugInfo();
  }, [user]);

  const loadDebugInfo = async () => {
    try {
      // Get all results
      const resultsRef = collection(db, "users", user.uid, "results");
      const resultsSnap = await getDocs(resultsRef);
      const results = resultsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get technical assessments
      const technicalRef = doc(db, "users", user.uid, "assessments", "technical");
      const technicalDoc = await getDoc(technicalRef);
      const technicalData = technicalDoc.exists() ? technicalDoc.data() : {};

      // Get collection sizes
      const [academicSnap, technicalSnap, personalSnap] = await Promise.all([
        getDocs(collection(db, "assessments")),
        getDocs(collection(db, "technicalAssessments")),
        getDocs(collection(db, "personalAssessments"))
      ]);

      // Categorize results
      const academic = results.filter(r => r.id.includes("assessments_"));
      const technical = results.filter(r => r.id.includes("technicalAssessments_"));
      const personal = results.filter(r => r.id.includes("survey_"));

      // Debug: Log ALL result IDs to console
      console.log("=== ALL RESULT IDs ===", results.map(r => r.id));
      console.log("ACADEMIC IDs:", academic.map(r => r.id));
      console.log("TECHNICAL IDs:", technical.map(r => r.id));
      console.log("PERSONAL IDs:", personal.map(r => r.id));

      // Get unique assessments
      const uniqueAcademic = [...new Set(academic.map(r => r.assessmentId))];
      const uniqueTechnical = [...new Set(technical.map(r => r.assessmentId))];
      const uniquePersonal = [...new Set(personal.map(r => r.assessmentId))];

      // Technical from doc
      const technicalFromDoc = Object.keys(technicalData).filter(k => k !== 'completed');
      const allTechnicalCompleted = [...new Set([...uniqueTechnical, ...technicalFromDoc])];

      // Calculate totals - don't count personal
      const totalAssessments = academicSnap.size + technicalSnap.size;
      const completedAssessments = uniqueAcademic.length + allTechnicalCompleted.length;

      setDebug({
        totalAssessments,
        completedAssessments,
        breakdown: {
          academic: { total: academicSnap.size, completed: uniqueAcademic.length, ids: uniqueAcademic },
          technical: { total: technicalSnap.size, completed: allTechnicalCompleted.length, ids: allTechnicalCompleted },
          personal: { total: 0, completed: 0, count: personal.length, ids: uniquePersonal, note: "Not counted in total" }
        },
        rawData: {
          academicResults: academic.length,
          technicalResults: technical.length,
          personalResults: personal.length,
          technicalDocData: technicalData
        }
      });
    } catch (err) {
      console.error("Debug error:", err);
      setDebug({ error: err.message });
    }
  };

  if (!debug) return <div className="p-8 text-white">Loading debug info...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Assessment Debug Info</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-4">
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <div className="text-2xl mb-2">
          <span className="text-cyan-400">{debug.completedAssessments}</span> / 
          <span className="text-emerald-400">{debug.totalAssessments}</span> Completed
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
          <h3 className="font-bold mb-2">Academic</h3>
          <p>Total Available: {debug.breakdown.academic.total}</p>
          <p>Completed: {debug.breakdown.academic.completed}</p>
          <p className="text-xs text-gray-400 mt-2">IDs: {debug.breakdown.academic.ids.join(', ')}</p>
        </div>

        <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
          <h3 className="font-bold mb-2">Technical</h3>
          <p>Total Available: {debug.breakdown.technical.total}</p>
          <p>Completed: {debug.breakdown.technical.completed}</p>
          <p className="text-xs text-gray-400 mt-2">IDs: {debug.breakdown.technical.ids.join(', ')}</p>
        </div>

        <div className="bg-emerald-900/30 rounded-lg p-4 border border-emerald-500/30">
          <h3 className="font-bold mb-2">Personal</h3>
          <p>Total Available: {debug.breakdown.personal.total}</p>
          <p>Completed: {debug.breakdown.personal.completed}</p>
          <p>Raw Count: {debug.breakdown.personal.count}</p>
          <p className="text-xs text-gray-400 mt-2">IDs: {debug.breakdown.personal.ids.join(', ')}</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Raw Data</h2>
        <pre className="text-xs overflow-auto">{JSON.stringify(debug, null, 2)}</pre>
      </div>
    </div>
  );
}
