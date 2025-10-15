
// src/components/dashboard/ResumeCard.jsx
import { FileText, Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ResumeCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25 }}
      onClick={() => navigate('/dashboard/resume')}
      className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:scale-105 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 group-hover:bg-indigo-500/30 transition-all">
          <FileText className="text-indigo-400" size={24} />
        </div>
        <Sparkles className="text-yellow-400" size={20} />
      </div>

      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
        Resume Builder
        <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
      </h3>
      
      <p className="text-sm text-gray-300 leading-relaxed mb-4">
        Create your professional resume powered by your DevPath assessment data
      </p>

      <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
        <span className="px-2 py-1 rounded-md bg-indigo-500/20">AI-Powered</span>
        <span className="px-2 py-1 rounded-md bg-indigo-500/20">PDF Export</span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700/40">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Quick start →</span>
          <span className="text-indigo-400 font-semibold">Build Now</span>
        </div>
      </div>
    </motion.div>
  );
}