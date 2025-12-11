// src/pages/LearningPath.jsx
import { notifyModuleCompletion } from "../utils/assessmentCompletionHandler";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthContext";
import DashNav from "../components/dashboard/DashboardNav";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Loader2,
  Trophy,
  X,
  ChevronDown,
  Video,
  FileText,
  BookMarked,
  Zap,
  PartyPopper,
  ArrowRight,
  Target,
  Lightbulb,
  GraduationCap
} from "lucide-react";
import { learningResources, identifyWeakAreas, getRecommendedLevel } from "../data/sections/learningResources";
import { check2ndAttemptUnlock } from "../utils/assessmentUnlock";
import { useNavigate } from "react-router-dom";

export default function LearningPath() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [weakAreas, setWeakAreas] = useState([]);
  const [learningProgress, setLearningProgress] = useState({});
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);
  // Removed category filter - focusing only on academic assessments
  const [expandedTopics, setExpandedTopics] = useState({});
  const [assessmentResults, setAssessmentResults] = useState({});
  const [showUnlockNotification, setShowUnlockNotification] = useState(false);
  const [unlockedAssessments, setUnlockedAssessments] = useState([]);

  useEffect(() => {
    if (!user) return;
    loadLearningPath();
  }, [user]);

  const loadLearningPath = async () => {
    setLoading(true);
    try {
      const resultsRef = collection(db, "users", user.uid, "results");
      const snapshot = await getDocs(resultsRef);
      
      const resultsMap = {};
      const assessmentResultsMap = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const baseId = doc.id.replace(/_\d+$/, '');
        
        if (!resultsMap[baseId] || (data.score > (resultsMap[baseId].score || 0))) {
          resultsMap[baseId] = { id: doc.id, ...data };
        }
        
        if (!assessmentResultsMap[baseId]) {
          assessmentResultsMap[baseId] = [];
        }
        assessmentResultsMap[baseId].push({ id: doc.id, ...data });
      });

      setAssessmentResults(assessmentResultsMap);

      const academicScores = {
        os_perc: resultsMap["assessments_operating_systems"]?.score || 0,
        algo_perc: resultsMap["assessments_algorithms"]?.score || 0,
        prog_perc: resultsMap["assessments_programming"]?.score || 0,
        se_perc: resultsMap["assessments_software_engineering"]?.score || 0,
        cn_perc: resultsMap["assessments_computer_networks"]?.score || 0,
        comm_perc: resultsMap["assessments_communication"]?.score || 0,
        math_perc: resultsMap["assessments_mathematics"]?.score || 0,
        es_perc: resultsMap["assessments_electronics"]?.score || 0,
        ca_perc: resultsMap["assessments_computer_architecture"]?.score || 0,
      };

      // Focus only on academic assessments for learning paths
      const technicalSkills = {};

      const weak = identifyWeakAreas(academicScores, technicalSkills);
      // Filter to only show academic assessment weak areas
      const academicWeakAreas = weak.filter(area => area.type === "academic");
      setWeakAreas(academicWeakAreas);

      console.log("📚 Academic weak areas:", academicWeakAreas);

      const progressRef = collection(db, "users", user.uid, "learningProgress");
      const progressSnapshot = await getDocs(progressRef);
      
      const progress = {};
      progressSnapshot.docs.forEach(doc => {
        progress[doc.id] = doc.data();
      });
      setLearningProgress(progress);

    } catch (err) {
      console.error("Error loading learning path:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkForUnlockedAssessments = (newProgress) => {
    const newlyUnlocked = [];
    
    Object.keys(assessmentResults).forEach(assessmentId => {
      const attempts = assessmentResults[assessmentId];
      if (attempts.length !== 1) return;
      
      const assessment = {
        id: assessmentId,
        result: attempts[0],
        attempts: attempts.length,
        mode: "mcq"
      };
      
      const unlockStatus = check2ndAttemptUnlock(assessment, newProgress, weakAreas);
      
      if (unlockStatus.canAccess && unlockStatus.reason === "resources_completed") {
        // Double-check: find the corresponding weak area and verify ALL resources are completed
        const weakArea = weakAreas.find(area => area.assessmentId === assessmentId);
        if (weakArea) {
          const topicKey = weakArea.topic.replace(/\s+/g, '_').toLowerCase();
          const topicResources = learningResources[weakArea.topic];
          const level = getRecommendedLevel(weakArea.currentScore, weakArea.threshold);
          
          // Get total resources for this level
          const totalResourcesForLevel = topicResources?.[level]?.length || 0;
          
          // Get completed resources from progress
          const completedInProgress = newProgress[topicKey]?.resources.filter(r => r.status === "completed").length || 0;
          
          // Only unlock if ALL resources for this level are completed
          if (completedInProgress >= totalResourcesForLevel && totalResourcesForLevel > 0) {
            newlyUnlocked.push(assessmentId);
          }
        }
      }
    });
    
    if (newlyUnlocked.length > 0) {
      setUnlockedAssessments(newlyUnlocked);
      setShowUnlockNotification(true);
      setTimeout(() => setShowUnlockNotification(false), 10000);
    }
  };

  const handleResourceStart = (topic, resource) => {
    window.open(resource.url, '_blank');
    updateResourceProgress(topic, resource, "in_progress");
  };

  const handleResourceComplete = (topic, resource) => {
    setCurrentTopic(topic);
    setCurrentResource(resource);
    setShowVerificationModal(true);
  };

  const confirmCompletion = async (reflectionNotes) => {
    if (!currentTopic || !currentResource) return;
    
    try {
      const topicKey = currentTopic.replace(/\s+/g, '_').toLowerCase();
      const progressDocRef = doc(db, "users", user.uid, "learningProgress", topicKey);
      
      const currentProgress = learningProgress[topicKey] || { resources: [] };
      const resourceIndex = currentProgress.resources.findIndex(r => r.resourceId === currentResource.id);

      let updatedResources = [...currentProgress.resources];

      if (resourceIndex >= 0) {
        updatedResources[resourceIndex] = {
          ...updatedResources[resourceIndex],
          status: "completed",
          completedAt: new Date().toISOString(),
          reflectionNotes,
          verified: true
        };
      } else {
        updatedResources.push({
          resourceId: currentResource.id,
          status: "completed",
          completedAt: new Date().toISOString(),
          reflectionNotes,
          verified: true
        });
      }

      await setDoc(progressDocRef, {
        topic: currentTopic,
        resources: updatedResources,
        lastUpdated: new Date().toISOString()
      });

      const newProgress = {
        ...learningProgress,
        [topicKey]: { topic: currentTopic, resources: updatedResources }
      };
      
      setLearningProgress(newProgress);
      checkForUnlockedAssessments(newProgress);

      // CHECK IF MODULE IS COMPLETED (all resources for the level done)
      const area = weakAreas.find(a => a.topic === currentTopic);
      if (area) {
        const topicResources = learningResources[currentTopic];
        const level = getRecommendedLevel(area.currentScore, area.threshold);
        const totalResourcesForLevel = topicResources?.[level]?.length || 0;
        const completedInTopic = updatedResources.filter(r => r.status === "completed").length;
        
        if (completedInTopic >= totalResourcesForLevel && totalResourcesForLevel > 0) {
          // Create notification for module completion
          if (area.assessmentId) {
            await notifyModuleCompletion(user.uid, currentTopic, area.assessmentId);
          }
        }
      }

      setShowVerificationModal(false);
      setCurrentResource(null);
      setCurrentTopic(null);

    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const updateResourceProgress = async (topic, resource, status) => {
    try {
      const topicKey = topic.replace(/\s+/g, '_').toLowerCase();
      const progressDocRef = doc(db, "users", user.uid, "learningProgress", topicKey);
      
      const currentProgress = learningProgress[topicKey] || { resources: [] };
      const resourceIndex = currentProgress.resources.findIndex(r => r.resourceId === resource.id);

      let updatedResources = [...currentProgress.resources];

      if (status === "in_progress") {
        if (resourceIndex === -1) {
          updatedResources.push({
            resourceId: resource.id,
            status: "in_progress",
            startedAt: new Date().toISOString(),
            timeSpent: 0
          });
        } else if (updatedResources[resourceIndex].status === "not_started") {
          updatedResources[resourceIndex].status = "in_progress";
          updatedResources[resourceIndex].startedAt = new Date().toISOString();
        }
      }

      await setDoc(progressDocRef, {
        topic,
        resources: updatedResources,
        lastUpdated: new Date().toISOString()
      });

      setLearningProgress(prev => ({
        ...prev,
        [topicKey]: { topic, resources: updatedResources }
      }));

    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const getResourceStatus = (topic, resourceId) => {
    const topicKey = topic.replace(/\s+/g, '_').toLowerCase();
    const progress = learningProgress[topicKey];
    if (!progress) return "not_started";
    
    const resource = progress.resources.find(r => r.resourceId === resourceId);
    return resource?.status || "not_started";
  };

  const getTopicProgress = (topic) => {
    const topicKey = topic.replace(/\s+/g, '_').toLowerCase();
    const topicResources = learningResources[topic];
    if (!topicResources) return 0;

    const allResources = [
      ...(topicResources.beginner || []),
      ...(topicResources.intermediate || []),
      ...(topicResources.advanced || [])
    ];

    const progress = learningProgress[topicKey];
    if (!progress) return 0;

    const completed = progress.resources.filter(r => r.status === "completed").length;
    return allResources.length > 0 ? Math.round((completed / allResources.length) * 100) : 0;
  };

  const getTopicCompletedCount = (topic) => {
    const topicKey = topic.replace(/\s+/g, '_').toLowerCase();
    const progress = learningProgress[topicKey];
    if (!progress) return 0;
    
    return progress.resources.filter(r => r.status === "completed").length;
  };

  const getTotalStats = () => {
    let totalResources = 0;
    let completedResources = 0;

    weakAreas.forEach(area => {
      const resources = learningResources[area.topic];
      if (resources) {
        const allRes = [
          ...(resources.beginner || []),
          ...(resources.intermediate || []),
          ...(resources.advanced || [])
        ];
        totalResources += allRes.length;
      }
    });

    Object.values(learningProgress).forEach(prog => {
      completedResources += prog.resources.filter(r => r.status === "completed").length;
    });

    return { totalResources, completedResources };
  };

  const getResourceIcon = (type) => {
    switch(type) {
      case 'video': return <Video size={14} className="text-blue-400" />;
      case 'article': return <FileText size={14} className="text-emerald-400" />;
      case 'practice': return <Code size={14} className="text-purple-400" />;
      case 'course': return <BookMarked size={14} className="text-yellow-400" />;
      case 'interactive': return <Zap size={14} className="text-cyan-400" />;
      default: return <BookOpen size={14} className="text-gray-400" />;
    }
  };

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const handleTakeAssessment = (assessmentId) => {
    // Navigate to academic assessments page
    navigate("/academic-assessments");
  };

  // No filtering needed - only showing academic assessments
  const filteredAreas = weakAreas;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-1400 via-primary-1500 to-black">
        <Loader2 className="animate-spin text-primary-400" size={48} />
      </div>
    );
  }

  const stats = getTotalStats();

  return (
    <section className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black dark:from-primary-1400 dark:via-primary-1500 dark:to-black light:from-gray-50 light:via-white light:to-gray-100 text-primary-50 dark:text-primary-50 light:text-gray-900">
      <DashNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 mt-14 sm:mt-16">
        {/* Page Header with Context */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white dark:text-white light:text-gray-900 mb-2 sm:mb-3">Your Personalized Learning Path</h1>
              <p className="text-gray-300 dark:text-gray-300 light:text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                Based on your assessment results, we've identified areas where you can improve.
                Complete the curated resources below to strengthen your skills and unlock retake opportunities.
              </p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4 sm:p-5 mt-4 sm:mt-6">
            <div className="flex items-start gap-2 sm:gap-3 mb-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/20 flex-shrink-0">
                <BookOpen className="text-blue-400" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white dark:text-white light:text-gray-900 font-semibold text-base sm:text-lg mb-1">How Your Learning Path Works</h3>
                <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-xs sm:text-sm leading-relaxed">
                  Your learning path is tailored based on your assessment performance. Each topic shows recommended resources
                  at the appropriate difficulty level. Complete all resources for a topic to unlock a second assessment attempt and improve your score.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4">
              <div className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white/50 rounded-lg p-3 border border-gray-700/30 dark:border-gray-700/30 light:border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">1</div>
                  <span className="text-white dark:text-white light:text-gray-900 font-medium text-sm">Learn</span>
                </div>
                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-xs">Study the recommended resources for each weak area</p>
              </div>
              <div className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white/50 rounded-lg p-3 border border-gray-700/30 dark:border-gray-700/30 light:border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">2</div>
                  <span className="text-white dark:text-white light:text-gray-900 font-medium text-sm">Complete</span>
                </div>
                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-xs">Mark resources as done and share what you learned</p>
              </div>
              <div className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white/50 rounded-lg p-3 border border-gray-700/30 dark:border-gray-700/30 light:border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">3</div>
                  <span className="text-white dark:text-white light:text-gray-900 font-medium text-sm">Retake</span>
                </div>
                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-xs">Unlock and retake assessments to improve your score</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8"
        >
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-3 sm:p-4 hover:scale-105 transition-transform">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-2">
              <div className="p-1 sm:p-1.5 bg-yellow-500/20 rounded-lg">
                <Target className="text-yellow-400" size={14} />
              </div>
              <div className="text-[10px] sm:text-xs font-medium text-yellow-400 uppercase tracking-wide">Focus Areas</div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{weakAreas.length}</div>
            <div className="text-[10px] sm:text-xs text-gray-400">Topics to improve</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-3 sm:p-4 hover:scale-105 transition-transform">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-2">
              <div className="p-1 sm:p-1.5 bg-blue-500/20 rounded-lg">
                <BookOpen className="text-blue-400" size={14} />
              </div>
              <div className="text-[10px] sm:text-xs font-medium text-blue-400 uppercase tracking-wide">Resources</div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stats.totalResources}</div>
            <div className="text-[10px] sm:text-xs text-gray-400">Learning materials</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-3 sm:p-4 hover:scale-105 transition-transform">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-2">
              <div className="p-1 sm:p-1.5 bg-emerald-500/20 rounded-lg">
                <CheckCircle className="text-emerald-400" size={14} />
              </div>
              <div className="text-[10px] sm:text-xs font-medium text-emerald-400 uppercase tracking-wide">Completed</div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stats.completedResources}</div>
            <div className="text-[10px] sm:text-xs text-gray-400">Resources finished</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-3 sm:p-4 hover:scale-105 transition-transform">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-2">
              <div className="p-1 sm:p-1.5 bg-purple-500/20 rounded-lg">
                <Trophy className="text-purple-400" size={14} />
              </div>
              <div className="text-[10px] sm:text-xs font-medium text-purple-400 uppercase tracking-wide">Progress</div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {stats.totalResources > 0 ? Math.round((stats.completedResources / stats.totalResources) * 100) : 0}%
            </div>
            <div className="text-[10px] sm:text-xs text-gray-400">Overall completion</div>
          </div>
        </motion.div>

        {/* Category filter removed - focusing only on academic assessments */}

        <div className="space-y-3">
          {filteredAreas.map((area, idx) => {
            const resources = learningResources[area.topic];
            const level = getRecommendedLevel(area.currentScore, area.threshold);
            const progress = getTopicProgress(area.topic);
            const completedCount = getTopicCompletedCount(area.topic);
            const isExpanded = expandedTopics[area.topic];
            const totalResourcesForLevel = resources?.[level]?.length || 0;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-gray-900/70 dark:bg-gray-900/70 light:bg-white border rounded-xl overflow-hidden transition-all ${
                  isExpanded
                    ? 'border-primary-500/50 shadow-lg shadow-primary-500/20'
                    : 'border-gray-700/40 dark:border-gray-700/40 light:border-gray-200 hover:border-gray-600/60 dark:hover:border-gray-600/60 light:hover:border-gray-300 light:hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleTopic(area.topic)}
                  className="w-full p-4 sm:p-5 lg:p-6 flex items-start sm:items-center justify-between hover:bg-gray-800/30 dark:hover:bg-gray-800/30 light:hover:bg-gray-50 transition group"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* Topic Icon - Academic Only */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                      <GraduationCap className="text-blue-400 sm:w-6 sm:h-6" size={20} />
                    </div>

                    <div className="text-left flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white dark:text-white light:text-gray-900">{area.topic}</h3>
                      </div>

                      {/* Score Progress Bar */}
                      <div className="mb-2 sm:mb-3">
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs flex-wrap">
                            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 font-semibold whitespace-nowrap">
                              Current: {area.currentScore}%
                            </span>
                            <ArrowRight size={12} className="text-gray-500 hidden sm:block" />
                            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold whitespace-nowrap">
                              Target: {area.threshold}%
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 whitespace-nowrap">
                            {level}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 dark:bg-gray-700 light:bg-gray-200 rounded-full h-2 sm:h-2.5 shadow-inner">
                          <div
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 h-2 sm:h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((area.currentScore / area.threshold) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 mt-1 sm:mt-1.5">
                          Need {area.threshold}% for proficiency
                        </p>
                      </div>

                      {/* Resource Count */}
                      <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs flex-wrap">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <CheckCircle size={12} className="sm:w-3.5 sm:h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">
                            {completedCount}/{totalResourcesForLevel}
                          </span>
                          <span className="text-gray-500 dark:text-gray-500 light:text-gray-600 hidden sm:inline">resources completed</span>
                          <span className="text-gray-500 dark:text-gray-500 light:text-gray-600 sm:hidden">completed</span>
                        </div>
                        {completedCount >= totalResourcesForLevel && totalResourcesForLevel > 0 && (
                          <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-emerald-500/20 border border-emerald-500/30">
                            <Trophy size={10} className="sm:w-3 sm:h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold text-[10px] sm:text-xs">Ready!</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Circle and Expand Button */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <div className="text-right hidden lg:block">
                        <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                          {progress}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 light:text-gray-600 uppercase tracking-wide">Progress</div>
                      </div>
                      <div className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                        isExpanded
                          ? 'bg-primary-500/20'
                          : 'bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-100 group-hover:bg-gray-700/50 dark:group-hover:bg-gray-700/50 light:group-hover:bg-gray-200'
                      }`}>
                        <ChevronDown
                          className={`text-gray-400 dark:text-gray-400 light:text-gray-600 transition-transform ${isExpanded ? 'rotate-180 text-primary-400' : ''}`}
                          size={18}
                        />
                      </div>
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-700/40 dark:border-gray-700/40 light:border-gray-200"
                    >
                      <div className="p-4 sm:p-5 bg-gray-800/30 dark:bg-gray-800/30 light:bg-gray-50">
                        <div className="mb-3 sm:mb-4">
                          <div className="w-full bg-gray-700 dark:bg-gray-700 light:bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Retake Assessment Section */}
                        <div className="mb-3 sm:mb-4 p-3 rounded-lg border transition-all">
                          {/* Check if user already has a good score (above threshold) */}
                          {area.currentScore >= area.threshold ? (
                            <div className="bg-yellow-500/10 border-yellow-500/30 rounded-lg">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-yellow-400">
                                  <Trophy size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                                  <span className="font-semibold text-xs sm:text-sm">Proficiency achieved! ({area.currentScore}% ≥ {area.threshold}%)</span>
                                </div>
                                <button
                                  disabled
                                  className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-yellow-500/20 text-yellow-400 text-xs font-medium cursor-not-allowed flex items-center justify-center gap-1.5 opacity-75"
                                >
                                  <span>No Retake Needed</span>
                                  <CheckCircle size={12} />
                                </button>
                              </div>
                            </div>
                          ) : completedCount >= totalResourcesForLevel && totalResourcesForLevel > 0 ? (
                            <div className="bg-emerald-500/10 border-emerald-500/30 rounded-lg">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                                <div className="flex items-center gap-2 text-emerald-400">
                                  <CheckCircle size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                                  <span className="font-semibold text-xs sm:text-sm">All resources completed! Ready for retake.</span>
                                </div>
                                <button
                                  onClick={() => handleTakeAssessment(area.assessmentId)}
                                  className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs font-medium transition flex items-center justify-center gap-1.5"
                                >
                                  <span>Take 2nd Attempt</span>
                                  <ArrowRight size={12} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-800/50 border-gray-700/40 rounded-lg">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-gray-400">
                                  <Lightbulb size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                                  <span className="font-medium text-xs sm:text-sm">Complete all resources to unlock retake</span>
                                </div>
                                <button
                                  disabled
                                  className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-gray-700/50 text-gray-500 text-xs font-medium cursor-not-allowed flex items-center justify-center gap-1.5 opacity-50"
                                >
                                  <span>Retake Locked</span>
                                  <Trophy size={12} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          {resources[level]?.map((resource) => {
                            const status = getResourceStatus(area.topic, resource.id);
                            
                            return (
                              <div
                                key={resource.id}
                                className={`p-3 sm:p-3 rounded-lg border transition ${
                                  status === "completed"
                                    ? "bg-emerald-500/10 border-emerald-500/30"
                                    : "bg-gray-900/50 dark:bg-gray-900/50 light:bg-white border-gray-700/30 dark:border-gray-700/30 light:border-gray-200 hover:border-gray-600/50 dark:hover:border-gray-600/50 light:hover:border-gray-300 light:hover:shadow-sm"
                                }`}
                              >
                                <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                                  {status === "completed" ? (
                                    <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0" size={16} />
                                  ) : (
                                    <div className="w-4 h-4 sm:w-[18px] sm:h-[18px] rounded-full border-2 border-gray-600 dark:border-gray-600 light:border-gray-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                                  )}

                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-white dark:text-white light:text-gray-900 font-medium text-xs sm:text-sm mb-1 line-clamp-2">{resource.title}</h4>
                                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 light:text-gray-600 flex-wrap">
                                      {getResourceIcon(resource.type)}
                                      <span className="truncate">{resource.platform}</span>
                                      <span className="hidden sm:inline">•</span>
                                      <div className="flex items-center gap-1">
                                        <Clock size={10} />
                                        <span>{resource.duration}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                                    {status === "completed" ? (
                                      <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-medium whitespace-nowrap">
                                        Done
                                      </div>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => handleResourceStart(area.topic, resource)}
                                          className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 text-[10px] sm:text-xs font-medium transition whitespace-nowrap"
                                        >
                                          Open
                                        </button>
                                        <button
                                          onClick={() => handleResourceComplete(area.topic, resource)}
                                          className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-medium transition whitespace-nowrap"
                                        >
                                          Done
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {weakAreas.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="text-yellow-400 mx-auto mb-4" size={64} />
            <h3 className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-2">Outstanding Work!</h3>
            <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">You've met all proficiency thresholds</p>
          </div>
        )}
      </div>

      {/* Unlock Notification */}
      <AnimatePresence>
        {showUnlockNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 left-4 right-4 sm:bottom-8 sm:right-8 sm:left-auto z-50 max-w-md mx-auto sm:mx-0"
          >
            <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl shadow-2xl p-4 sm:p-6 border-2 border-white/20">
              <button
                onClick={() => setShowUnlockNotification(false)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 text-white/80 hover:text-white transition"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-white/20 rounded-full flex-shrink-0">
                  <PartyPopper className="text-white sm:w-7 sm:h-7" size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2">
                    Assessment{unlockedAssessments.length > 1 ? 's' : ''} Unlocked! 🎉
                  </h3>
                  <p className="text-white/90 text-xs sm:text-sm mb-3 sm:mb-4">
                    Great job! You've completed enough resources to unlock your 2nd attempt for {unlockedAssessments.length} assessment{unlockedAssessments.length > 1 ? 's' : ''}.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => {
                        setShowUnlockNotification(false);
                        navigate('/academic-assessments');
                      }}
                      className="px-3 sm:px-4 py-2 bg-white text-emerald-600 rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-100 transition text-center"
                    >
                      Take Assessment
                    </button>
                    <button
                      onClick={() => setShowUnlockNotification(false)}
                      className="px-3 sm:px-4 py-2 bg-white/20 text-white rounded-lg font-medium text-xs sm:text-sm hover:bg-white/30 transition text-center"
                    >
                      Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Modal */}
      <AnimatePresence>
        {showVerificationModal && (
          <VerificationModal
            resource={currentResource}
            onConfirm={confirmCompletion}
            onClose={() => {
              setShowVerificationModal(false);
              setCurrentResource(null);
              setCurrentTopic(null);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// Verification Modal Component
function VerificationModal({ resource, onConfirm, onClose }) {
  const [reflection, setReflection] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (reflection.trim().length < 20) {
      alert("Please provide at least 20 characters describing what you learned");
      return;
    }

    setIsSubmitting(true);
    await onConfirm(reflection);
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 dark:bg-gray-900 light:bg-white border border-gray-700 dark:border-gray-700 light:border-gray-300 rounded-xl shadow-2xl max-w-lg w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-bold text-white dark:text-white light:text-gray-900">Verify Completion</h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition flex-shrink-0">
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 mb-3 sm:mb-4">
          Share a brief reflection on what you learned from <span className="text-white dark:text-white light:text-gray-900 font-medium">{resource?.title}</span>
        </p>

        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="I learned about..."
          className="w-full h-24 sm:h-28 px-3 py-2 rounded-lg bg-gray-800 dark:bg-gray-800 light:bg-gray-50 border border-gray-700 dark:border-gray-700 light:border-gray-300 text-white dark:text-white light:text-gray-900 text-xs sm:text-sm placeholder-gray-500 dark:placeholder-gray-500 light:placeholder-gray-400 focus:outline-none focus:border-primary-500 transition resize-none mb-2"
        />
        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 light:text-gray-600 mb-3 sm:mb-4">{reflection.length} / 20 characters minimum</div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 sm:py-2.5 rounded-lg bg-gray-800 dark:bg-gray-800 light:bg-gray-100 hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-200 text-gray-300 dark:text-gray-300 light:text-gray-700 text-xs sm:text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={reflection.trim().length < 20 || isSubmitting}
            className="flex-1 py-2 sm:py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Confirm"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}