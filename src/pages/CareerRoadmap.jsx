// src/pages/CareerRoadmap.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import networkingSecurityRoadmap from '../data/roadmaps/networkingSecurity.js';
import softwareDevelopmentRoadmap from '../data/roadmaps/softwareDevelopment.js';
import dataAnalyticsRoadmap from '../data/roadmaps/dataAnalytics.js';
import qaTestingRoadmap from '../data/roadmaps/qaTestingRoadmap.js';
import itManagementRoadmap from '../data/roadmaps/itManagementRoadmap.js';
import technicalSupportRoadmap from '../data/roadmaps/technicalSupportRoadmap.js';
import specializedRoadmap from '../data/roadmaps/specializedITRoadmap.js';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Lock, 
  Award, 
  TrendingUp,
  Target,
  Play,
  RotateCcw,
  Trophy,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';

const categoryToRoadmapKey = (category) => {
  const mapping = {
    'Networking & Security': 'networking-security',
    'Software Development': 'software-development',
    'Data & Analytics': 'data-analytics',
    'Quality Assurance & Testing': 'qa-testing',
    'IT Management': 'it-management',
    'Technical Support': 'technical-support',
    'Specialized': 'specialized'
  };
  return mapping[category] || category.toLowerCase().replace(/\s+&?\s*/g, '-');
};

const ROADMAP_MAP = {
  'networking-security': networkingSecurityRoadmap,
  'software-development': softwareDevelopmentRoadmap,
  'data-analytics': dataAnalyticsRoadmap,
  'qa-testing': qaTestingRoadmap,
  'it-management': itManagementRoadmap,
  'technical-support': technicalSupportRoadmap,
  'specialized': specializedRoadmap,
};

export default function CareerRoadmap() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userCareer, setUserCareer] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      if (!userData?.careerCategory) {
        navigate('/career-matches');
        return;
      }

      setUserCareer(userData.careerCategory);
      const roadmapKey = categoryToRoadmapKey(userData.careerCategory);
      const roadmap = ROADMAP_MAP[roadmapKey];
      
      if (!roadmap) {
        setRoadmapData(null);
        setLoading(false);
        return;
      }

      setRoadmapData(roadmap);

      const progressDoc = await getDoc(doc(db, 'roadmapProgress', user.uid));
      
      if (progressDoc.exists()) {
        setProgress(progressDoc.data());
      } else {
        const initialProgress = {
          category: userData.careerCategory,
          currentModule: 1,
          completedModules: [],
          totalProgress: 0,
          startedAt: new Date().toISOString(),
          modules: {}
        };
        
        await setDoc(doc(db, 'roadmapProgress', user.uid), initialProgress);
        setProgress(initialProgress);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading roadmap data:', error);
      setLoading(false);
    }
  };

  const calculateOverallProgress = () => {
    if (!progress || !roadmapData) return 0;
    const totalModules = roadmapData.modules.length;
    const completed = progress.completedModules.length;
    return Math.round((completed / totalModules) * 100);
  };

  const getModuleStatus = (moduleId) => {
    if (!progress) return 'locked';
    
    if (progress.completedModules.includes(moduleId)) {
      return 'completed';
    }
    
    if (moduleId === 1 || progress.completedModules.includes(moduleId - 1)) {
      return 'unlocked';
    }
    
    return 'locked';
  };

  const handleModuleClick = (moduleId, status) => {
    if (status === 'locked') {
      return;
    }
    
    const roadmapKey = categoryToRoadmapKey(userCareer);
    navigate(`/career-roadmap/${roadmapKey}/module/${moduleId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black flex items-center justify-center p-4">
        <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-700/40 rounded-2xl p-8 max-w-md text-center">
          <div className="inline-flex p-4 rounded-full bg-yellow-500/20 mb-4">
            <Sparkles className="text-yellow-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Roadmap Coming Soon!</h2>
          <p className="text-gray-300 mb-6">
            The roadmap for <span className="font-semibold text-primary-400">{userCareer}</span> is currently being prepared.
          </p>
          <button
            onClick={() => navigate('/student-dashboard')}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();
  const currentModuleNum = progress?.currentModule || 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black text-white">
      {/* Header with Navigation */}
      <div className="border-b border-gray-800/50 bg-gray-900/30 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white mb-3 flex items-center gap-2 text-sm transition-colors"
          >
            ← Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 truncate">
                {roadmapData.title}
              </h1>
              <p className="text-gray-400 text-sm sm:text-base line-clamp-2">
                {roadmapData.description}
              </p>
            </div>
            
            {/* Compact Stats */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-2xl font-bold text-primary-400">{overallProgress}%</div>
                <div className="text-xs text-gray-400">Complete</div>
              </div>
              <div className="relative w-16 h-16">
                <svg className="transform -rotate-90 w-16 h-16">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-gray-700"
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
                    className="text-primary-400 transition-all duration-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white sm:hidden">{overallProgress}%</span>
                  <CheckCircle className="text-primary-400 hidden sm:block" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <BookOpen className="text-blue-400" size={20} />
              </div>
              <div className="text-xs text-gray-400 uppercase font-medium">Modules</div>
            </div>
            <div className="text-2xl font-bold text-white">{progress?.completedModules?.length || 0}/{roadmapData.modules.length}</div>
            <div className="text-xs text-gray-400 mt-1">Completed</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Clock className="text-emerald-400" size={20} />
              </div>
              <div className="text-xs text-gray-400 uppercase font-medium">Duration</div>
            </div>
            <div className="text-2xl font-bold text-white">{roadmapData.estimatedDuration}</div>
            <div className="text-xs text-gray-400 mt-1">Total time</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Target className="text-purple-400" size={20} />
              </div>
              <div className="text-xs text-gray-400 uppercase font-medium">Current</div>
            </div>
            <div className="text-2xl font-bold text-white">Module {currentModuleNum}</div>
            <div className="text-xs text-gray-400 mt-1">In progress</div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-gray-900/70 border border-gray-700/40 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="text-yellow-400" size={20} />
            Skills You'll Master
          </h3>
          <div className="flex flex-wrap gap-2">
            {roadmapData.skillsGained.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-primary-500/20 text-primary-300 rounded-full text-sm border border-primary-500/30 hover:bg-primary-500/30 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Learning Path */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="text-primary-400" />
            Your Learning Journey
          </h2>

          {/* Progress Timeline */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-blue-500 to-emerald-500 hidden md:block" />

            <div className="space-y-4">
              {roadmapData.modules.map((module, index) => {
                const status = getModuleStatus(module.id);
                const isLocked = status === 'locked';
                const isCompleted = status === 'completed';
                const isCurrent = status === 'unlocked' && module.id === currentModuleNum;

                return (
                  <div 
                    key={module.id} 
                    className="relative"
                    onClick={() => handleModuleClick(module.id, status)}
                  >
                    {/* Module Number Badge */}
                    <div className={`absolute left-0 top-6 w-12 h-12 rounded-full flex items-center justify-center z-10 border-4 border-primary-1500 hidden md:flex transition-all ${
                      isCompleted ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                      isCurrent ? 'bg-gradient-to-br from-primary-500 to-blue-600 ring-4 ring-primary-500/30' :
                      isLocked ? 'bg-gray-700' : 'bg-gradient-to-br from-primary-600 to-purple-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={24} className="text-white" />
                      ) : isLocked ? (
                        <Lock size={20} className="text-gray-400" />
                      ) : (
                        <span className="text-lg font-bold text-white">{module.id}</span>
                      )}
                    </div>

                    {/* Module Card */}
                    <div className="md:ml-20">
                      <div className={`group bg-gray-900/70 backdrop-blur-lg rounded-xl p-5 border-2 transition-all ${
                        isLocked ? 'border-gray-700/40 opacity-60 cursor-not-allowed' : 
                        isCurrent ? 'border-primary-500 shadow-lg shadow-primary-500/20 cursor-pointer hover:shadow-primary-500/30' :
                        isCompleted ? 'border-emerald-500/50 cursor-pointer hover:border-emerald-500/70' :
                        'border-gray-700/40 cursor-pointer hover:border-primary-500/50'
                      }`}>
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              {/* Mobile Number Badge */}
                              <div className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center ${
                                isCompleted ? 'bg-emerald-500/20' :
                                isCurrent ? 'bg-primary-500/20' :
                                isLocked ? 'bg-gray-700/50' : 'bg-primary-500/20'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle size={20} className="text-emerald-400" />
                                ) : isLocked ? (
                                  <Lock size={16} className="text-gray-400" />
                                ) : (
                                  <span className="text-sm font-bold text-primary-400">{module.id}</span>
                                )}
                              </div>
                              <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors truncate">
                                {module.title}
                              </h3>
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2">{module.description}</p>
                          </div>
                          
                          <div className="flex flex-col gap-2 items-end">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                              module.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : ''
                            }${
                              module.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : ''
                            }${
                              module.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : ''
                            }${
                              module.difficulty === 'Expert' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : ''
                            }`}>
                              {module.difficulty}
                            </span>
                            {isCurrent && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-300 border border-primary-500/30 animate-pulse">
                                Current
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Module Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="bg-gray-800/50 rounded-lg p-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Clock size={14} className="text-blue-400" />
                              <div className="text-xs text-gray-400">Duration</div>
                            </div>
                            <div className="text-sm text-white font-semibold">{module.duration}</div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <BookOpen size={14} className="text-purple-400" />
                              <div className="text-xs text-gray-400">Resources</div>
                            </div>
                            <div className="text-sm text-white font-semibold">{module.learningResources.length} items</div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Award size={14} className="text-yellow-400" />
                              <div className="text-xs text-gray-400">Quiz</div>
                            </div>
                            <div className="text-sm text-white font-semibold">{module.quiz.questions.length} questions</div>
                          </div>
                        </div>

                        {/* Action Button */}
                        {!isLocked && (
                          <button
                            className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                              isCompleted 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30' 
                                : 'bg-primary-500 text-white hover:bg-primary-600'
                            }`}
                          >
                            {isCompleted ? (
                              <>
                                <RotateCcw size={18} />
                                Review Module
                              </>
                            ) : (
                              <>
                                <Play size={18} />
                                Start Learning
                              </>
                            )}
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        )}

                        {isLocked && (
                          <div className="w-full py-2.5 rounded-lg font-semibold bg-gray-700/30 text-gray-500 border border-gray-700/30 flex items-center justify-center gap-2">
                            <Lock size={16} />
                            Complete Previous Module
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Final Project */}
              <div className="relative">
                <div className="absolute left-0 top-6 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 border-4 border-primary-1500 flex items-center justify-center z-10 hidden md:flex">
                  <Trophy size={24} className="text-white" />
                </div>

                <div className="md:ml-20">
                  <div className={`bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-lg rounded-xl p-5 border-2 transition-all ${
                    progress?.completedModules?.length === roadmapData.modules.length 
                      ? 'border-yellow-500 cursor-pointer hover:shadow-lg hover:shadow-yellow-500/20' 
                      : 'border-gray-700/40 opacity-60 cursor-not-allowed'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="md:hidden w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <Trophy size={20} className="text-yellow-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {roadmapData.finalProject.title}
                      </h3>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">{roadmapData.finalProject.description}</p>
                    
                    <div className="bg-gray-800/50 rounded-lg p-3 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-yellow-400" />
                        <span className="text-sm text-gray-400">Duration:</span>
                      </div>
                      <span className="text-white font-semibold">{roadmapData.finalProject.duration}</span>
                    </div>

                    <button
                      disabled={progress?.completedModules?.length !== roadmapData.modules.length}
                      onClick={() => navigate(`/career-roadmap/${roadmapData.id}/final-project`)}
                      className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        progress?.completedModules?.length === roadmapData.modules.length
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                          : 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {progress?.completedModules?.length === roadmapData.modules.length ? (
                        <>
                          <Trophy size={18} />
                          Start Final Project
                        </>
                      ) : (
                        <>
                          <Lock size={18} />
                          Complete All Modules First
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}