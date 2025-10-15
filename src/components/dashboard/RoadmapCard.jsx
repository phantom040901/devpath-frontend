// src/components/dashboard/RoadmapCard.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../AuthContext';

export default function RoadmapCard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [currentUser]);

  const loadProgress = async () => {
    try {
      const progressDoc = await getDoc(doc(db, 'roadmapProgress', currentUser.uid));
      if (progressDoc.exists()) {
        setProgress(progressDoc.data());
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading progress:', error);
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!progress) return 0;
    // Assuming 4 modules per roadmap
    const totalModules = 4;
    const completed = progress.completedModules?.length || 0;
    return Math.round((completed / totalModules) * 100);
  };

  const overallProgress = calculateProgress();
  const hasStarted = progress && progress.completedModules?.length > 0;

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer"
         onClick={() => navigate('/career-roadmap')}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">🎯 Career Roadmap</h3>
          <p className="text-gray-300 text-sm">
            {hasStarted ? 'Continue your learning journey' : 'Start your personalized learning path'}
          </p>
        </div>
        {!loading && hasStarted && (
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16">
              <svg className="transform -rotate-90 w-16 h-16">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-white/20"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - overallProgress / 100)}`}
                  className="text-purple-400"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{overallProgress}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {hasStarted ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Completed Modules</span>
            <span className="text-white font-semibold">
              {progress.completedModules?.length || 0} / 4
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Current Module</span>
            <span className="text-purple-300 font-semibold">
              Module {progress.currentModule || 1}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 rounded-lg p-4 mt-4">
          <p className="text-gray-300 text-sm mb-2">
            Learn the skills needed for your predicted career path with:
          </p>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>• Curated learning resources</li>
            <li>• Hands-on challenges</li>
            <li>• Knowledge assessments</li>
            <li>• Certificate upon completion</li>
          </ul>
        </div>
      )}

      <button className="w-full mt-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition">
        {hasStarted ? 'Continue Learning →' : 'Start Roadmap →'}
      </button>
    </div>
  );
}