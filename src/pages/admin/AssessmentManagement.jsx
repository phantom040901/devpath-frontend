// src/pages/admin/AssessmentManagement.jsx - MOBILE OPTIMIZED
import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import AdminNav from "../../components/admin/AdminNav";
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
  CheckCircle
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

// Assessment Editor Modal Component - Mobile Optimized
function AssessmentEditorModal({ assessment, onSave, onClose, saving }) {
  const [formData, setFormData] = useState({
    title: assessment.title || "",
    description: assessment.description || "",
    instructions: assessment.instructions || "",
    timeLimit: assessment.timeLimit || 30,
    questions: assessment.questions || []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...assessment, ...formData });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl w-full my-4 sm:my-0"
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

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
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
              rows={3}
              className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary-500 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Time Limit (minutes)
            </label>
            <input
              type="number"
              value={formData.timeLimit}
              onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
              min="1"
              className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-primary-500 text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Assessment
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}