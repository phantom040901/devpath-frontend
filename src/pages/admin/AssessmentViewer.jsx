import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ChevronDown, ChevronUp, Download, Copy, Trash2, BookOpen, Search } from 'lucide-react';
import DashNav from '../../components/dashboard/DashboardNav';

export default function AssessmentViewer() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIds, setExpandedIds] = useState(new Set());

  useEffect(() => {
    loadAssessments();
  }, []);

  async function loadAssessments() {
    try {
      const assessmentsRef = collection(db, "assessments");
      const snapshot = await getDocs(assessmentsRef);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      data.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      setAssessments(data);
    } catch (error) {
      console.error("Error loading assessments:", error);
      alert("Error loading assessments: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const exportAssessment = (assessment) => {
    const dataStr = JSON.stringify(assessment, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${assessment.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyQuestions = (assessment) => {
    const text = JSON.stringify(assessment.questions, null, 2);
    navigator.clipboard.writeText(text);
    alert('✅ Questions copied to clipboard!');
  };

  const deleteAssessment = async (id, title) => {
    if (!confirm(`⚠️ Are you sure you want to delete "${title}"?\n\nThis action cannot be undone!`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "assessments", id));
      alert('✅ Assessment deleted successfully!');
      setAssessments(assessments.filter(a => a.id !== id));
    } catch (error) {
      alert('❌ Error deleting assessment: ' + error.message);
    }
  };

  const filteredAssessments = assessments.filter(a =>
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalQuestions = assessments.reduce((sum, a) => sum + (a.questions?.length || 0), 0);
  const avgQuestions = assessments.length > 0 ? (totalQuestions / assessments.length).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black">
        <DashNav />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading assessments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-1400 via-primary-1500 to-black">
      <DashNav />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/40 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={40} className="text-primary-400" />
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
              Academic Assessment Analyzer
            </h1>
          </div>
          <p className="text-gray-400">View, analyze, and manage academic assessments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <StatCard title="Total Assessments" value={assessments.length} />
          <StatCard title="Total Questions" value={totalQuestions} />
          <StatCard title="Avg Questions" value={avgQuestions} />
          <StatCard title="MCQ Assessments" value={assessments.filter(a => a.mode !== 'survey').length} />
          <StatCard title="Surveys" value={assessments.filter(a => a.mode === 'survey').length} />
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search assessments by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900/70 border-2 border-gray-700/40 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Assessments List */}
        <div className="space-y-6">
          {filteredAssessments.length === 0 ? (
            <div className="bg-gray-900/70 border-2 border-gray-700/40 rounded-xl p-8 text-center">
              <p className="text-gray-400">No assessments found</p>
            </div>
          ) : (
            filteredAssessments.map(assessment => (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
                isExpanded={expandedIds.has(assessment.id)}
                onToggle={() => toggleExpand(assessment.id)}
                onExport={() => exportAssessment(assessment)}
                onCopy={() => copyQuestions(assessment)}
                onDelete={() => deleteAssessment(assessment.id, assessment.title)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/40 rounded-xl p-4 text-center">
      <div className="text-3xl font-bold text-primary-400 mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  );
}

function AssessmentCard({ assessment, isExpanded, onToggle, onExport, onCopy, onDelete }) {
  const getScoreColor = (answer) => {
    const colors = {
      'A': 'border-blue-500/50 bg-blue-500/10',
      'B': 'border-emerald-500/50 bg-emerald-500/10',
      'C': 'border-purple-500/50 bg-purple-500/10',
      'D': 'border-yellow-500/50 bg-yellow-500/10',
    };
    return colors[answer] || 'border-gray-500/50 bg-gray-500/10';
  };

  return (
    <div className="bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700/40 rounded-2xl p-6 hover:border-primary-500/50 transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-1">{assessment.title}</h2>
          <p className="text-sm text-gray-500 font-mono">{assessment.id}</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/40">
            {assessment.questions?.length || 0} Questions
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/40">
            {assessment.mode === 'survey' ? 'Survey' : 'MCQ'}
          </span>
        </div>
      </div>

      {assessment.description && (
        <div className="mb-4 p-4 bg-gray-800/50 rounded-lg">
          <p className="text-gray-300 text-sm">{assessment.description}</p>
        </div>
      )}

      {/* Toggle Questions */}
      <button
        onClick={onToggle}
        className="w-full mb-4 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/40 rounded-lg text-primary-300 font-semibold flex items-center justify-center gap-2 transition-all"
      >
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        {isExpanded ? 'Hide Questions' : 'Show Questions'}
      </button>

      {/* Questions */}
      {isExpanded && (
        <div className="space-y-4 mb-4">
          {(assessment.questions || []).map((q, index) => (
            <div key={index} className="bg-gray-800/50 border-l-4 border-primary-500 rounded-lg p-4">
              <div className="text-primary-400 font-bold mb-2">Question {index + 1}</div>
              <div className="text-white mb-3">{q.text || q.question}</div>

              {q.options && (
                <div className="space-y-2">
                  {q.options.map((opt, i) => {
                    const letter = String.fromCharCode(65 + i);
                    const isCorrect = q.answer === letter;
                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border-2 ${
                          isCorrect
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-gray-700 bg-gray-800/30'
                        }`}
                      >
                        <span className="font-bold text-primary-400 mr-2">{letter}.</span>
                        <span className={isCorrect ? 'text-emerald-300' : 'text-gray-300'}>
                          {opt}
                        </span>
                        {isCorrect && (
                          <span className="ml-2 text-emerald-400 font-bold">✓ Correct</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all"
        >
          <Download size={18} />
          Export JSON
        </button>
        <button
          onClick={onCopy}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
        >
          <Copy size={18} />
          Copy Questions
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>
    </div>
  );
}
