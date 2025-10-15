// src/pages/ModuleLearning.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  Play,
  FileText,
  Code,
  Send,
  RotateCcw,
  Award,
  Target,
  Lightbulb,
  Clock,
  Trophy
} from 'lucide-react';

import networkingSecurityRoadmap from '../data/roadmaps/networkingSecurity.js';
import softwareDevelopmentRoadmap from '../data/roadmaps/softwareDevelopment.js';
import dataAnalyticsRoadmap from '../data/roadmaps/dataAnalytics.js';
import qaTestingRoadmap from '../data/roadmaps/qaTestingRoadmap.js';
import itManagementRoadmap from '../data/roadmaps/itManagementRoadmap.js';
import technicalSupportRoadmap from '../data/roadmaps/technicalSupportRoadmap.js';
import specializedRoadmap from '../data/roadmaps/specializedITRoadmap.js';

const ROADMAP_MAP = {
  'networking-security': networkingSecurityRoadmap,
  'software-development': softwareDevelopmentRoadmap,
  'data-analytics': dataAnalyticsRoadmap,
  'qa-testing': qaTestingRoadmap,
  'it-management': itManagementRoadmap,
  'technical-support': technicalSupportRoadmap,
  'specialized': specializedRoadmap,
};

export default function ModuleLearning() {
  const { roadmapId, moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roadmapData, setRoadmapData] = useState(null);
  const [moduleData, setModuleData] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentTab, setCurrentTab] = useState('resources');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModuleData();
  }, [roadmapId, moduleId]);

  const loadModuleData = async () => {
    try {
      const roadmap = ROADMAP_MAP[roadmapId];
      
      if (!roadmap) {
        alert(`Roadmap not found: ${roadmapId}. Redirecting...`);
        navigate('/career-roadmap');
        return;
      }

      const module = roadmap.modules.find(m => m.id === parseInt(moduleId));
      
      if (!module) {
        alert(`Module not found: ${moduleId}. Redirecting...`);
        navigate('/career-roadmap');
        return;
      }

      setRoadmapData(roadmap);
      setModuleData(module);

      const progressDoc = await getDoc(doc(db, 'roadmapProgress', user.uid));
      
      if (progressDoc.exists()) {
        setProgress(progressDoc.data());
        
        const moduleProgress = progressDoc.data().modules?.[`module${moduleId}`];
        if (moduleProgress?.quizScore) {
          setQuizSubmitted(true);
          setQuizScore(moduleProgress.quizScore);
        }
        if (moduleProgress?.challengeCompleted) {
          setChallengeSubmitted(true);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading module:', error);
      alert('Error loading module: ' + error.message);
      setLoading(false);
    }
  };

  const handleQuizSubmit = async () => {
    if (Object.keys(quizAnswers).length !== moduleData.quiz.questions.length) {
      alert('Please answer all questions before submitting!');
      return;
    }

    let correct = 0;
    moduleData.quiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / moduleData.quiz.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    try {
      const progressRef = doc(db, 'roadmapProgress', user.uid);
      
      const progressSnap = await getDoc(progressRef);
      
      if (progressSnap.exists()) {
        const currentData = progressSnap.data();
        const currentModules = currentData.modules || {};
        
        const updatedModules = {
          ...currentModules,
          [`module${moduleId}`]: {
            ...(currentModules[`module${moduleId}`] || {}),
            quizScore: score,
            quizCompleted: true,
            challengeCompleted: challengeSubmitted,
            lastUpdated: new Date().toISOString()
          }
        };
        
        await updateDoc(progressRef, {
          modules: updatedModules
        });
        
        console.log('✅ Quiz progress saved successfully!');
      } else {
        await setDoc(progressRef, {
          category: roadmapData.title,
          currentModule: parseInt(moduleId),
          completedModules: [],
          totalProgress: 0,
          startedAt: new Date().toISOString(),
          modules: {
            [`module${moduleId}`]: {
              quizScore: score,
              quizCompleted: true,
              challengeCompleted: challengeSubmitted,
              lastUpdated: new Date().toISOString()
            }
          }
        });
        
        console.log('✅ Progress document created and quiz saved!');
      }
    } catch (error) {
      console.error('❌ Error saving quiz progress:', error);
      alert('Error saving quiz progress: ' + error.message);
    }
  };

  const handleChallengeSubmit = async () => {
    if (!challengeAnswer.trim()) {
      alert('Please provide your solution before submitting!');
      return;
    }

    setChallengeSubmitted(true);

    try {
      const progressRef = doc(db, 'roadmapProgress', user.uid);
      
      const progressSnap = await getDoc(progressRef);
      
      if (progressSnap.exists()) {
        const currentData = progressSnap.data();
        const currentModules = currentData.modules || {};
        const currentModuleProgress = currentModules[`module${moduleId}`] || {};
        
        const updatedModules = {
          ...currentModules,
          [`module${moduleId}`]: {
            ...currentModuleProgress,
            challengeCompleted: true,
            challengeAnswer: challengeAnswer,
            lastUpdated: new Date().toISOString()
          }
        };
        
        await updateDoc(progressRef, {
          modules: updatedModules
        });
        
        console.log('✅ Challenge saved successfully!');
        alert('Challenge submitted! Your answer has been recorded.');
      } else {
        await setDoc(progressRef, {
          category: roadmapData.title,
          currentModule: parseInt(moduleId),
          completedModules: [],
          totalProgress: 0,
          startedAt: new Date().toISOString(),
          modules: {
            [`module${moduleId}`]: {
              challengeCompleted: true,
              challengeAnswer: challengeAnswer,
              lastUpdated: new Date().toISOString()
            }
          }
        });
        
        console.log('✅ Progress document created and challenge saved!');
        alert('Challenge submitted! Your answer has been recorded.');
      }
      
      const updatedProgressSnap = await getDoc(progressRef);
      if (updatedProgressSnap.exists()) {
        setProgress(updatedProgressSnap.data());
      }
    } catch (error) {
      console.error('❌ Error saving challenge:', error);
      alert('Error saving challenge: ' + error.message);
    }
  };

  const handleCompleteModule = async () => {
    console.log('🎯 Complete Module button clicked!');
    console.log('Current quiz score:', quizScore);
    console.log('Required passing score:', moduleData.quiz.passingScore);
    console.log('Challenge submitted:', challengeSubmitted);

    const quizPassed = quizScore >= moduleData.quiz.passingScore;
    const challengeDone = challengeSubmitted;

    console.log('Quiz passed:', quizPassed);
    console.log('Challenge done:', challengeDone);

    if (!quizPassed) {
      alert(`You need to pass the quiz with at least ${moduleData.quiz.passingScore}% to complete this module! Current score: ${quizScore}%`);
      return;
    }

    if (!challengeDone) {
      alert('Please complete the challenge before finishing this module!');
      return;
    }

    try {
      console.log('💾 Saving module completion to Firebase...');
      
      const progressRef = doc(db, 'roadmapProgress', user.uid);
      const progressSnap = await getDoc(progressRef);
      
      if (!progressSnap.exists()) {
        console.error('❌ Progress document does not exist!');
        alert('Error: Progress document not found. Please try reloading the page.');
        return;
      }
      
      const currentData = progressSnap.data();
      const completedModules = currentData.completedModules || [];
      const currentModules = currentData.modules || {};
      
      if (completedModules.includes(parseInt(moduleId))) {
        console.log('⚠️ Module already completed');
        navigate('/career-roadmap');
        return;
      }
      
      const updatedCompletedModules = [...completedModules, parseInt(moduleId)];
      
      const updatedModules = {
        ...currentModules,
        [`module${moduleId}`]: {
          ...(currentModules[`module${moduleId}`] || {}),
          completed: true,
          completedAt: new Date().toISOString()
        }
      };
      
      const totalModules = roadmapData.modules.length;
      const totalProgress = Math.round((updatedCompletedModules.length / totalModules) * 100);
      
      await updateDoc(progressRef, {
        completedModules: updatedCompletedModules,
        currentModule: parseInt(moduleId) + 1,
        totalProgress: totalProgress,
        modules: updatedModules
      });

      console.log('✅ Module completion saved successfully!');
      alert('🎉 Congratulations! Module completed!');
      navigate('/career-roadmap');
    } catch (error) {
      console.error('❌ Error completing module:', error);
      alert('Error completing module: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  const isModuleCompleted = progress?.completedModules?.includes(parseInt(moduleId));
  const quizPassed = quizScore >= moduleData.quiz.passingScore;

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video': return <Play className="text-red-400" size={20} />;
      case 'article': return <FileText className="text-blue-400" size={20} />;
      case 'interactive': return <Code className="text-purple-400" size={20} />;
      default: return <BookOpen className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800/50 bg-gray-900/30 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <button
            onClick={() => navigate('/career-roadmap')}
            className="text-gray-400 hover:text-white mb-3 flex items-center gap-2 text-xs sm:text-sm transition-colors"
          >
            ← Back to Roadmap
          </button>

          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-1 sm:px-3 bg-primary-500/20 text-primary-300 rounded-full text-xs sm:text-sm font-semibold border border-primary-500/30">
                  Module {moduleData.id}
                </span>
                <span className={`px-2.5 py-1 sm:px-3 rounded-full text-xs font-semibold ${
                  moduleData.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : ''
                }${
                  moduleData.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : ''
                }${
                  moduleData.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : ''
                }${
                  moduleData.difficulty === 'Expert' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : ''
                }`}>
                  {moduleData.difficulty}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1.5 sm:mb-1">
                {moduleData.title}
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
                {moduleData.description}
              </p>
            </div>

            {isModuleCompleted && (
              <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                <CheckCircle className="text-emerald-400" size={16} />
                <span className="text-emerald-300 font-semibold text-xs sm:text-sm">Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Tab Navigation */}
        <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <TabButton
            active={currentTab === 'resources'}
            onClick={() => setCurrentTab('resources')}
            icon={<BookOpen size={18} />}
            label="Learning Resources"
            count={moduleData.learningResources.length}
          />
          <TabButton
            active={currentTab === 'quiz'}
            onClick={() => setCurrentTab('quiz')}
            icon={<Award size={18} />}
            label="Knowledge Check"
            count={moduleData.quiz.questions.length}
            status={quizSubmitted ? (quizPassed ? 'passed' : 'failed') : null}
          />
          <TabButton
            active={currentTab === 'challenge'}
            onClick={() => setCurrentTab('challenge')}
            icon={<Target size={18} />}
            label="Challenge"
            status={challengeSubmitted ? 'completed' : null}
          />
        </div>

        {/* Content Area */}
        <div className="bg-gray-900/70 border border-gray-700/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          {/* Resources Tab */}
          {currentTab === 'resources' && (
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="text-primary-400" size={20} />
                  Learning Resources
                </h2>
                <span className="text-xs sm:text-sm text-gray-400">
                  {moduleData.learningResources.length} resources
                </span>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {moduleData.learningResources.map((resource, index) => (
                  <div
                    key={resource.id}
                    className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/40 hover:border-primary-500/50 transition-all group"
                  >
                    {/* Mobile Layout - Stacked */}
                    <div className="block sm:hidden">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-gray-900/50 group-hover:bg-primary-500/10 transition-colors flex-shrink-0">
                          {getResourceIcon(resource.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-primary-300 transition-colors line-clamp-2">
                            {resource.title}
                          </h3>
                          <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                            {resource.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="flex items-center gap-1 text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                            {resource.platform}
                          </span>
                          <span className="flex items-center gap-1 text-gray-400">
                            <Clock size={12} />
                            {resource.duration}
                          </span>
                        </div>

                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all font-semibold text-xs flex items-center gap-1.5 whitespace-nowrap"
                        >
                          Open
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>

                    {/* Desktop Layout - Horizontal */}
                    <div className="hidden sm:flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gray-900/50 group-hover:bg-primary-500/10 transition-colors">
                        {getResourceIcon(resource.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base lg:text-lg font-semibold text-white mb-1 group-hover:text-primary-300 transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {resource.description}
                        </p>

                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="flex items-center gap-1.5 text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-primary-400"></span>
                            {resource.platform}
                          </span>
                          <span className="flex items-center gap-1.5 text-gray-400">
                            <Clock size={14} />
                            {resource.duration}
                          </span>
                        </div>
                      </div>

                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all font-semibold text-sm flex items-center gap-2 whitespace-nowrap"
                      >
                        Open
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quiz Tab */}
          {currentTab === 'quiz' && (
            <div>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
                    <Award className="text-primary-400" />
                    Knowledge Check
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {moduleData.quiz.questions.length} questions • Passing score: {moduleData.quiz.passingScore}%
                  </p>
                </div>
                
                {quizSubmitted && (
                  <div className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 ${
                    quizPassed 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {quizPassed ? (
                      <CheckCircle size={20} />
                    ) : (
                      <XCircle size={20} />
                    )}
                    <span>Score: {quizScore}%</span>
                  </div>
                )}
              </div>

              {!quizSubmitted ? (
                <div className="space-y-6">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-blue-200 text-sm">
                        You need <strong>{Math.ceil(moduleData.quiz.questions.length * moduleData.quiz.passingScore / 100)} correct answers</strong> ({moduleData.quiz.passingScore}%) to pass this quiz.
                      </p>
                    </div>
                  </div>

                  {moduleData.quiz.questions.map((question, index) => (
                    <div key={question.id} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/40">
                      <h3 className="text-white font-semibold mb-4 flex items-start gap-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500/20 text-primary-300 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="flex-1">{question.question}</span>
                      </h3>
                      
                      <div className="space-y-2 ml-8">
                        {question.options.map((option, optIndex) => (
                          <label
                            key={optIndex}
                            className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-900/70 transition-all border border-transparent hover:border-primary-500/30"
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={optIndex}
                              checked={quizAnswers[question.id] === optIndex}
                              onChange={() => setQuizAnswers({ ...quizAnswers, [question.id]: optIndex })}
                              className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                            />
                            <span className="text-gray-300 flex-1">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length !== moduleData.quiz.questions.length}
                    className="w-full py-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all text-lg flex items-center justify-center gap-2 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                    <Send size={20} />
                    Submit Quiz
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {moduleData.quiz.questions.map((question, index) => {
                    const userAnswer = quizAnswers[question.id];
                    const isCorrect = userAnswer === question.correctAnswer;

                    return (
                      <div 
                        key={question.id} 
                        className={`rounded-xl p-5 border-2 ${
                          isCorrect 
                            ? 'bg-emerald-500/10 border-emerald-500/50' 
                            : 'bg-red-500/10 border-red-500/50'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
                          </div>
                          <h3 className="text-white font-semibold flex-1">
                            {index + 1}. {question.question}
                          </h3>
                        </div>
                        
                        <div className="space-y-2 ml-11">
                          {question.options.map((option, optIndex) => {
                            const isUserAnswer = userAnswer === optIndex;
                            const isCorrectAnswer = question.correctAnswer === optIndex;

                            return (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg border ${
                                  isCorrectAnswer 
                                    ? 'bg-emerald-500/20 border-emerald-500/50' :
                                  isUserAnswer 
                                    ? 'bg-red-500/20 border-red-500/50' :
                                  'bg-gray-800/30 border-gray-700/40'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {isCorrectAnswer && (
                                    <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <XCircle size={16} className="text-red-400 flex-shrink-0" />
                                  )}
                                  <span className={`flex-1 ${
                                    isCorrectAnswer ? 'text-emerald-300 font-semibold' :
                                    isUserAnswer ? 'text-red-300' :
                                    'text-gray-400'
                                  }`}>
                                    {option}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-4 ml-11 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
                            <div>
                              <p className="text-blue-200 text-sm font-medium mb-1">Explanation</p>
                              <p className="text-blue-300/80 text-sm">{question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {!quizPassed && (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                        setQuizScore(0);
                      }}
                      className="w-full py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all text-lg flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={20} />
                      Retake Quiz
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Challenge Tab */}
          {currentTab === 'challenge' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
                  <Target className="text-primary-400" />
                  {moduleData.challenge.title}
                </h2>
                <p className="text-gray-400">{moduleData.challenge.description}</p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/40 mb-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="text-emerald-400" size={18} />
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {moduleData.challenge.requirements.map((req, index) => (
                    <li key={index} className="flex gap-3 text-gray-300 text-sm">
                      <span className="text-primary-400 flex-shrink-0">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {moduleData.challenge.hints && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 mb-6">
                  <h3 className="text-yellow-200 font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="text-yellow-400" size={18} />
                    Hints
                  </h3>
                  <ul className="space-y-2">
                    {moduleData.challenge.hints.map((hint, index) => (
                      <li key={index} className="flex gap-3 text-yellow-200/80 text-sm">
                        <span className="text-yellow-400 flex-shrink-0">•</span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!challengeSubmitted ? (
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Your Solution
                  </label>
                  <textarea
                    value={challengeAnswer}
                    onChange={(e) => setChallengeAnswer(e.target.value)}
                    placeholder="Paste your solution here... (code, diagram description, answer, etc.)"
                    className="w-full h-64 bg-gray-800/50 text-white rounded-xl p-4 border border-gray-700/40 focus:border-primary-500 focus:outline-none resize-y font-mono text-sm"
                  />
                  <button
                    onClick={handleChallengeSubmit}
                    disabled={!challengeAnswer.trim()}
                    className="w-full mt-4 py-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all text-lg flex items-center justify-center gap-2 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                    <Send size={20} />
                    Submit Challenge
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-emerald-500/20">
                      <CheckCircle className="text-emerald-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-emerald-300">Challenge Submitted!</h3>
                      <p className="text-emerald-200/70 text-sm">Your solution has been recorded successfully.</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/40">
                    <h4 className="text-white font-semibold mb-2 text-sm">Your Submission:</h4>
                    <pre className="text-gray-300 text-sm whitespace-pre-wrap overflow-x-auto font-mono">
                      {challengeAnswer}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Completion Requirements */}
        {!isModuleCompleted && (
          <div className="bg-gray-900/70 border border-gray-700/40 rounded-xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="text-yellow-400" size={20} />
              Completion Requirements
            </h3>
            <div className="space-y-3">
              <RequirementItem
                completed={quizPassed}
                text={`Pass the quiz with ${moduleData.quiz.passingScore}% or higher`}
                detail={quizSubmitted && !quizPassed ? `Current: ${quizScore}%` : null}
              />
              <RequirementItem
                completed={challengeSubmitted}
                text="Complete the practical challenge"
              />
            </div>
          </div>
        )}

        {/* Complete Module Button */}
        {quizSubmitted && quizPassed && challengeSubmitted && !isModuleCompleted && (
          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/50 rounded-2xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Trophy className="text-yellow-400" />
                  Ready to Complete!
                </h3>
                <p className="text-gray-300">
                  You've passed the quiz and completed the challenge. Mark this module as complete to unlock the next one!
                </p>
              </div>
              <button
                onClick={handleCompleteModule}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all whitespace-nowrap flex items-center gap-2"
              >
                <CheckCircle size={20} />
                Complete Module
              </button>
            </div>
          </div>
        )}

        {/* Already Completed */}
        {isModuleCompleted && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-500/20">
                <CheckCircle className="text-emerald-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-emerald-300">Module Completed!</h3>
                <p className="text-emerald-200/70">You've successfully completed this module. Continue to the next one!</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper Components
function TabButton({ active, onClick, icon, label, count, status }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${
        active
          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800/70 border border-gray-700/40'
      }`}
    >
      <span className="hidden sm:inline">{icon}</span>
      <span className="text-xs sm:text-sm">{label}</span>
      {count && (
        <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
          active ? 'bg-white/20' : 'bg-gray-700/50'
        }`}>
          {count}
        </span>
      )}
      {status === 'passed' && <CheckCircle size={14} className="text-emerald-400 hidden sm:inline" />}
      {status === 'failed' && <XCircle size={14} className="text-red-400 hidden sm:inline" />}
      {status === 'completed' && <CheckCircle size={14} className="text-emerald-400 hidden sm:inline" />}
    </button>
  );
}

function RequirementItem({ completed, text, detail }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${
      completed ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-gray-800/30 border border-gray-700/40'
    }`}>
      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
        completed ? 'bg-emerald-500/20' : 'bg-gray-700/50'
      }`}>
        {completed ? (
          <CheckCircle size={14} className="text-emerald-400" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-gray-500"></div>
        )}
      </div>
      <div className="flex-1">
        <span className={completed ? 'text-emerald-300' : 'text-gray-400'}>{text}</span>
        {detail && <span className="text-red-400 text-sm ml-2">({detail})</span>}
      </div>
    </div>
  );
}