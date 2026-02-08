// src/pages/admin/AssessmentManagement.jsx - MOBILE OPTIMIZED
import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import AdminNav from "../../components/admin/AdminNav";
import RiasecSelector from "../../components/admin/RiasecSelector";
import RiasecDistributionBar from "../../components/admin/RiasecDistributionBar";
import { RIASEC_CATEGORIES, calculateRiasecDistribution, getDefaultRiasecForAssessment, getSmartRiasecForQuestion } from "../../constants/riasec";
import {
  BookOpen,
  Code,
  Brain,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  GripVertical,
  HelpCircle,
  Wand2
} from "lucide-react";

export default function AssessmentManagement() {
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState({
    academic: [],
    technical: [],
    personal: []
  });
  const [selectedType, setSelectedType] = useState("academic");
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const [academicSnap, technicalSnap, personalSnap] = await Promise.all([
        getDocs(collection(db, "assessments")),
        getDocs(collection(db, "technicalAssessments")),
        getDocs(collection(db, "personalAssessments"))
      ]);

      setAssessments({
        academic: academicSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        technical: technicalSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        personal: personalSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      });
    } catch (error) {
      console.error("Error loading assessments:", error);
      showNotification("Failed to load assessments", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAssessment = async (assessment) => {
    setSaving(true);
    try {
      const collectionName = 
        selectedType === "academic" ? "assessments" :
        selectedType === "technical" ? "technicalAssessments" :
        "personalAssessments";

      if (assessment.id) {
        // Update existing
        const docRef = doc(db, collectionName, assessment.id);
        await updateDoc(docRef, assessment);
        showNotification("Assessment updated successfully", "success");
      } else {
        // Add new
        await addDoc(collection(db, collectionName), assessment);
        showNotification("Assessment created successfully", "success");
      }

      await loadAssessments();
      setEditingAssessment(null);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error saving assessment:", error);
      showNotification("Failed to save assessment", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAssessment = async (id) => {
    if (!confirm("Are you sure you want to delete this assessment?")) return;

    try {
      const collectionName = 
        selectedType === "academic" ? "assessments" :
        selectedType === "technical" ? "technicalAssessments" :
        "personalAssessments";

      await deleteDoc(doc(db, collectionName, id));
      await loadAssessments();
      showNotification("Assessment deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting assessment:", error);
      showNotification("Failed to delete assessment", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getCollectionIcon = (type) => {
    switch(type) {
      case "academic": return <BookOpen className="text-blue-400" size={18} />;
      case "technical": return <Code className="text-purple-400" size={18} />;
      case "personal": return <Brain className="text-emerald-400" size={18} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-400" size={48} />
      </div>
    );
  }

  const currentAssessments = assessments[selectedType];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black pb-20">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Assessment Management</h1>
            <p className="text-sm sm:text-base text-gray-400">Create, edit, and manage assessments</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-all text-sm"
          >
            <Plus size={16} />
            <span>Add Assessment</span>
          </button>
        </div>

        {/* Notification - Mobile Optimized */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border flex items-center gap-2 sm:gap-3 text-sm ${
                notification.type === "success"
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-red-500/20 border-red-500/40 text-red-300"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle size={18} className="flex-shrink-0" />
              ) : (
                <AlertCircle size={18} className="flex-shrink-0" />
              )}
              <span className="flex-1">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Type Tabs - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
          {["academic", "technical", "personal"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex items-center justify-between sm:justify-start gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm ${
                selectedType === type
                  ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                {getCollectionIcon(type)}
                <span className="capitalize">{type}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-gray-700 text-xs">
                {assessments[type].length}
              </span>
            </button>
          ))}
        </div>

        {/* Assessments Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {currentAssessments.map((assessment) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/70 border border-gray-800 rounded-xl p-4 sm:p-5 hover:border-primary-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold mb-1 text-sm sm:text-base line-clamp-2">{assessment.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                    {assessment.description || assessment.instructions || "No description"}
                  </p>
                </div>
              </div>

              {/* RIASEC Distribution */}
              {assessment.questions?.length > 0 && (
                <div className="mb-3">
                  <RiasecDistributionBar
                    distribution={calculateRiasecDistribution(assessment.questions)}
                    showLabels={false}
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <div className="text-xs sm:text-sm text-gray-400">
                  {assessment.questions?.length || assessment.questionsCount || 0} questions
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingAssessment(assessment)}
                    className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteAssessment(assessment.id)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {currentAssessments.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="mb-4">
              {getCollectionIcon(selectedType)}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">No {selectedType} assessments</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first assessment to get started</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-all text-sm"
            >
              <Plus size={16} />
              Add Assessment
            </button>
          </div>
        )}

        {/* Edit Modal */}
        <AnimatePresence>
          {editingAssessment && (
            <AssessmentEditorModal
              assessment={editingAssessment}
              onSave={handleSaveAssessment}
              onClose={() => setEditingAssessment(null)}
              saving={saving}
            />
          )}
        </AnimatePresence>

        {/* Add Modal */}
        <AnimatePresence>
          {showAddModal && (
            <AssessmentEditorModal
              assessment={{ type: selectedType }}
              onSave={handleSaveAssessment}
              onClose={() => setShowAddModal(false)}
              saving={saving}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Assessment Editor Modal Component - Mobile Optimized with Question Editor
function AssessmentEditorModal({ assessment, onSave, onClose, saving }) {
  const [formData, setFormData] = useState({
    title: assessment.title || "",
    description: assessment.description || "",
    instructions: assessment.instructions || "",
    timeLimit: assessment.timeLimit || 30,
    mode: assessment.mode || "mcq",
    questions: assessment.questions || []
  });
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...assessment, ...formData });
  };

  // Question management functions
  const addQuestion = () => {
    // Auto-assign RIASEC based on assessment subject/title
    const defaultRiasec = getDefaultRiasecForAssessment(assessment.id, formData.title);
    const newQuestion = {
      text: "",
      difficulty: "beginner",
      riasecCategories: defaultRiasec,
      options: ["", "", "", ""],
      answer: "A"
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
    setExpandedQuestion(formData.questions.length);
  };

  // Auto-assign RIASEC to all questions (smart analysis based on question text)
  const autoAssignAllRiasec = () => {
    const updatedQuestions = formData.questions.map(q => ({
      ...q,
      riasecCategories: getSmartRiasecForQuestion(q.text, assessment.id, formData.title)
    }));
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Quick toggle RIASEC for a specific question
  const toggleQuestionRiasec = (qIndex, code) => {
    const question = formData.questions[qIndex];
    const currentCategories = question.riasecCategories || [];
    const updatedCategories = currentCategories.includes(code)
      ? currentCategories.filter(c => c !== code)
      : [...currentCategories, code];
    updateQuestion(qIndex, "riasecCategories", updatedCategories);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];
    updatedOptions[optionIndex] = value;
    updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], options: updatedOptions };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
    setExpandedQuestion(null);
  };

  const moveQuestion = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= formData.questions.length) return;

    const updatedQuestions = [...formData.questions];
    [updatedQuestions[index], updatedQuestions[newIndex]] = [updatedQuestions[newIndex], updatedQuestions[index]];
    setFormData({ ...formData, questions: updatedQuestions });
    setExpandedQuestion(newIndex);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner": return "text-emerald-400 bg-emerald-500/20";
      case "intermediate": return "text-yellow-400 bg-yellow-500/20";
      case "advanced": return "text-red-400 bg-red-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  // Required difficulty distribution: 5 beginner, 3 intermediate, 2 advanced
  const REQUIRED_DISTRIBUTION = { beginner: 5, intermediate: 3, advanced: 2 };

  const getDifficultyDistribution = () => {
    const distribution = { beginner: 0, intermediate: 0, advanced: 0 };
    formData.questions.forEach(q => {
      if (distribution.hasOwnProperty(q.difficulty)) {
        distribution[q.difficulty]++;
      }
    });
    return distribution;
  };

  const difficultyDistribution = getDifficultyDistribution();
  const isDistributionValid =
    difficultyDistribution.beginner === REQUIRED_DISTRIBUTION.beginner &&
    difficultyDistribution.intermediate === REQUIRED_DISTRIBUTION.intermediate &&
    difficultyDistribution.advanced === REQUIRED_DISTRIBUTION.advanced;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-4xl w-full my-4"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {assessment.id ? "Edit Assessment" : "Add Assessment"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., JavaScript Fundamentals"
                className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 30 })}
                min="1"
                className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Brief description of the assessment"
              className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary-500 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={2}
              placeholder="Instructions for students taking the assessment"
              className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary-500 text-sm resize-none"
            />
          </div>

          {/* Questions Section */}
          <div className="border-t border-gray-700 pt-4 sm:pt-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-primary-400" />
                <h3 className="text-lg font-semibold text-white">Questions</h3>
                <span className="px-2 py-0.5 rounded-full bg-gray-700 text-xs text-gray-300">
                  {formData.questions.length}
                </span>
              </div>
              <div className="flex gap-2">
                {formData.questions.length > 0 && (
                  <button
                    type="button"
                    onClick={autoAssignAllRiasec}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium transition-all"
                    title="Auto-assign RIASEC to all questions based on subject"
                  >
                    <Wand2 size={14} />
                    <span className="hidden sm:inline">Auto RIASEC</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-all"
                >
                  <Plus size={14} />
                  Add Question
                </button>
              </div>
            </div>

            {/* Difficulty Distribution Summary */}
            <div className={`mb-4 p-3 rounded-lg border ${isDistributionValid ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Difficulty Distribution</p>
                {isDistributionValid ? (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={12} /> Valid
                  </span>
                ) : (
                  <span className="text-xs text-amber-400 flex items-center gap-1">
                    <AlertCircle size={12} /> Requires 5B / 3I / 2A
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${difficultyDistribution.beginner === REQUIRED_DISTRIBUTION.beginner ? 'bg-emerald-500/20' : 'bg-gray-700'}`}>
                  <span className="text-emerald-400 text-xs font-medium">B:</span>
                  <span className={`text-xs font-bold ${difficultyDistribution.beginner === REQUIRED_DISTRIBUTION.beginner ? 'text-emerald-400' : 'text-white'}`}>
                    {difficultyDistribution.beginner}/{REQUIRED_DISTRIBUTION.beginner}
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${difficultyDistribution.intermediate === REQUIRED_DISTRIBUTION.intermediate ? 'bg-yellow-500/20' : 'bg-gray-700'}`}>
                  <span className="text-yellow-400 text-xs font-medium">I:</span>
                  <span className={`text-xs font-bold ${difficultyDistribution.intermediate === REQUIRED_DISTRIBUTION.intermediate ? 'text-yellow-400' : 'text-white'}`}>
                    {difficultyDistribution.intermediate}/{REQUIRED_DISTRIBUTION.intermediate}
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${difficultyDistribution.advanced === REQUIRED_DISTRIBUTION.advanced ? 'bg-red-500/20' : 'bg-gray-700'}`}>
                  <span className="text-red-400 text-xs font-medium">A:</span>
                  <span className={`text-xs font-bold ${difficultyDistribution.advanced === REQUIRED_DISTRIBUTION.advanced ? 'text-red-400' : 'text-white'}`}>
                    {difficultyDistribution.advanced}/{REQUIRED_DISTRIBUTION.advanced}
                  </span>
                </div>
              </div>
            </div>

            {/* RIASEC Distribution Summary */}
            {formData.questions.length > 0 && (
              <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">RIASEC Distribution</p>
                <RiasecDistributionBar
                  distribution={calculateRiasecDistribution(formData.questions)}
                />
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {formData.questions.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-gray-700 rounded-lg">
                  <HelpCircle size={32} className="mx-auto text-gray-600 mb-2" />
                  <p className="text-gray-500 text-sm">No questions yet</p>
                  <p className="text-gray-600 text-xs">Click "Add Question" to get started</p>
                </div>
              ) : (
                formData.questions.map((question, qIndex) => (
                  <div
                    key={qIndex}
                    className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden"
                  >
                    {/* Question Header */}
                    <div
                      className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-800/80 transition-all"
                      onClick={() => setExpandedQuestion(expandedQuestion === qIndex ? null : qIndex)}
                    >
                      <GripVertical size={14} className="text-gray-500" />
                      <span className="text-xs font-medium text-gray-400 w-6">Q{qIndex + 1}</span>
                      <span className="flex-1 text-sm text-white truncate">
                        {question.text || "Untitled question"}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                      {/* Quick RIASEC toggle buttons */}
                      <div className="flex gap-0.5" onClick={(e) => e.stopPropagation()}>
                        {["R", "I", "A", "S", "E", "C"].map(code => {
                          const isSelected = question.riasecCategories?.includes(code);
                          const category = RIASEC_CATEGORIES[code];
                          return (
                            <button
                              key={code}
                              type="button"
                              onClick={() => toggleQuestionRiasec(qIndex, code)}
                              className={`w-5 h-5 rounded text-[10px] font-bold transition-all
                                ${isSelected
                                  ? `${category.bgClass} ${category.textClass}`
                                  : "bg-gray-700/50 text-gray-500 hover:bg-gray-600"
                                }`}
                              title={`${category.name}: ${category.description}`}
                            >
                              {code}
                            </button>
                          );
                        })}
                      </div>
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-medium">
                        {question.answer}
                      </span>
                      {expandedQuestion === qIndex ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </div>

                    {/* Expanded Question Editor */}
                    <AnimatePresence>
                      {expandedQuestion === qIndex && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-700"
                        >
                          <div className="p-4 space-y-4">
                            {/* Question Text */}
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                Question Text *
                              </label>
                              <textarea
                                value={question.text}
                                onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                                rows={2}
                                placeholder="Enter your question here..."
                                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-primary-500 text-sm resize-none"
                              />
                            </div>

                            {/* Difficulty */}
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                Difficulty
                              </label>
                              <select
                                value={question.difficulty}
                                onChange={(e) => updateQuestion(qIndex, "difficulty", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-primary-500 text-sm"
                              >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                              </select>
                            </div>

                            {/* RIASEC Categories */}
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                RIASEC Categories
                              </label>
                              <RiasecSelector
                                selected={question.riasecCategories || []}
                                onChange={(categories) => updateQuestion(qIndex, "riasecCategories", categories)}
                              />
                              <p className="text-xs text-gray-500 mt-1.5">
                                Select personality types this question relates to
                              </p>
                            </div>

                            {/* Options */}
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                                Options
                              </label>
                              <div className="space-y-2">
                                {["A", "B", "C", "D"].map((letter, oIndex) => (
                                  <div key={letter} className="flex items-center gap-2">
                                    <span
                                      className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold ${
                                        question.answer === letter
                                          ? "bg-emerald-500 text-white"
                                          : "bg-gray-700 text-gray-400"
                                      }`}
                                    >
                                      {letter}
                                    </span>
                                    <input
                                      type="text"
                                      value={question.options[oIndex] || ""}
                                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                      placeholder={`Option ${letter}`}
                                      className="flex-1 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-primary-500 text-sm"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => updateQuestion(qIndex, "answer", letter)}
                                      className={`px-2 py-1.5 rounded text-xs font-medium transition-all ${
                                        question.answer === letter
                                          ? "bg-emerald-500 text-white"
                                          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                                      }`}
                                    >
                                      {question.answer === letter ? "Correct" : "Set Correct"}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => moveQuestion(qIndex, -1)}
                                  disabled={qIndex === 0}
                                  className="p-1.5 rounded bg-gray-700 text-gray-400 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                  title="Move up"
                                >
                                  <ChevronUp size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveQuestion(qIndex, 1)}
                                  disabled={qIndex === formData.questions.length - 1}
                                  className="p-1.5 rounded bg-gray-700 text-gray-400 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                  title="Move down"
                                >
                                  <ChevronDown size={14} />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => deleteQuestion(qIndex)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-medium transition-all"
                              >
                                <Trash2 size={12} />
                                Delete
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Distribution Warning */}
          {formData.questions.length > 0 && !isDistributionValid && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>Questions should have 5 Beginner, 3 Intermediate, and 2 Advanced for proper assessment structure.</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !formData.title}
              className={`w-full sm:flex-1 px-4 py-2.5 sm:py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm ${
                formData.questions.length > 0 && !isDistributionValid
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {formData.questions.length > 0 && !isDistributionValid
                    ? `Save Anyway (${formData.questions.length}/10 questions)`
                    : `Save Assessment (${formData.questions.length} questions)`
                  }
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}