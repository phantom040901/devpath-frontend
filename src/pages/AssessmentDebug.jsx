// Quick debug page to see all assessments in Firestore
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function AssessmentDebug() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const [academicSnap, technicalSnap, personalSnap] = await Promise.all([
          getDocs(collection(db, "assessments")),
          getDocs(collection(db, "technicalAssessments")),
          getDocs(collection(db, "personalAssessments"))
        ]);

        const academic = academicSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const technical = technicalSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const personal = personalSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setData({
          academic,
          technical,
          personal,
          counts: {
            academic: academicSnap.size,
            technical: technicalSnap.size,
            personal: personalSnap.size,
            total: academicSnap.size + technicalSnap.size + personalSnap.size
          }
        });
      } catch (error) {
        console.error('Error fetching assessments:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAssessments();
  }, []);

  if (loading) {
    return <div className="p-8">Loading assessments...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Assessment Database Debug</h1>

      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">📊 Total Counts</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-900/30 p-4 rounded">
            <div className="text-sm text-gray-400">Academic</div>
            <div className="text-2xl font-bold">{data?.counts.academic}</div>
          </div>
          <div className="bg-purple-900/30 p-4 rounded">
            <div className="text-sm text-gray-400">Technical</div>
            <div className="text-2xl font-bold">{data?.counts.technical}</div>
          </div>
          <div className="bg-green-900/30 p-4 rounded">
            <div className="text-sm text-gray-400">Personal</div>
            <div className="text-2xl font-bold">{data?.counts.personal}</div>
          </div>
          <div className="bg-orange-900/30 p-4 rounded">
            <div className="text-sm text-gray-400">TOTAL</div>
            <div className="text-2xl font-bold">{data?.counts.total}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Academic */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-400">📚 Academic ({data?.counts.academic})</h2>
          <ul className="space-y-2">
            {data?.academic.map(item => (
              <li key={item.id} className="text-sm bg-gray-700 p-2 rounded">
                <div className="font-semibold">{item.id}</div>
                <div className="text-gray-400 text-xs">{item.title}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Technical */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-purple-400">💻 Technical ({data?.counts.technical})</h2>
          <ul className="space-y-2">
            {data?.technical.map(item => (
              <li key={item.id} className="text-sm bg-gray-700 p-2 rounded">
                <div className="font-semibold">{item.id}</div>
                <div className="text-gray-400 text-xs">{item.title}</div>
                <div className="text-xs text-purple-300">Mode: {item.mode}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Personal */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-green-400">👤 Personal ({data?.counts.personal})</h2>
          <ul className="space-y-2">
            {data?.personal.map(item => (
              <li key={item.id} className="text-sm bg-gray-700 p-2 rounded">
                <div className="font-semibold">{item.id}</div>
                <div className="text-gray-400 text-xs">{item.title}</div>
                <div className="text-xs text-green-300">Mode: {item.mode}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
