import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AdminNav from '../../components/admin/AdminNav';
import {
  ArrowLeft,
  Database,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  BarChart3,
  FileText,
  Zap,
  Shield,
  Target
} from 'lucide-react';

export default function MigrationGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <AdminNav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Back Button */}
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Recommendation System Migration Guide
          </h1>
          <p className="text-lg text-gray-400">
            Complete guide for migrating from Cosine Similarity to AdaBoost Machine Learning
          </p>
        </motion.div>

        {/* Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-primary-900/20 to-purple-900/20 border border-primary-500/30 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Zap className="text-primary-400" size={28} />
            Migration Overview
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            This migration transitions DevPath's recommendation system from a simple{' '}
            <span className="text-primary-400 font-semibold">Cosine Similarity</span> approach
            to an advanced{' '}
            <span className="text-purple-400 font-semibold">AdaBoost Machine Learning</span> model.
            This upgrade will significantly improve recommendation accuracy and personalization
            for students seeking career guidance.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Current System</h3>
              <p className="text-white font-medium">Cosine Similarity (Data Collection Phase)</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Target System</h3>
              <p className="text-white font-medium">AdaBoost Machine Learning</p>
            </div>
          </div>
        </motion.div>

        {/* Three-Phase Approach */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Migration Phases</h2>

          {/* Phase 1 */}
          <div className="mb-6">
            <PhaseCard
              phase="1"
              title="Data Collection (Current Phase)"
              duration="3 months or 2,000 students (whichever comes first)"
              status="in-progress"
              icon={Database}
              color="purple"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">What's Happening:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-1" size={16} />
                      Using cosine similarity to provide initial career recommendations
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-1" size={16} />
                      Collecting comprehensive student profile data (skills, interests, performance metrics)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-1" size={16} />
                      Tracking recommendation effectiveness and user interactions
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-1" size={16} />
                      Building labeled training dataset for the ML model
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                  <h4 className="text-white font-semibold mb-3">Migration Requirements:</h4>
                  <div className="space-y-2">
                    <RequirementItem label="Minimum 2,000 student profiles" />
                    <RequirementItem label="Data quality score > 85%" />
                    <RequirementItem label="Balanced representation across all career paths" />
                    <RequirementItem label="User interaction rate > 60%" />
                  </div>
                </div>
              </div>
            </PhaseCard>
          </div>

          {/* Phase 2 */}
          <div className="mb-6">
            <PhaseCard
              phase="2"
              title="Model Training & Testing"
              duration="2-4 weeks"
              status="pending"
              icon={BarChart3}
              color="blue"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">What We'll Do:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <TrendingUp className="text-blue-400 flex-shrink-0 mt-1" size={16} />
                      Train AdaBoost ML model on collected dataset
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="text-blue-400 flex-shrink-0 mt-1" size={16} />
                      Perform cross-validation and hyperparameter tuning
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="text-blue-400 flex-shrink-0 mt-1" size={16} />
                      Run parallel A/B testing (cosine vs. AdaBoost)
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="text-blue-400 flex-shrink-0 mt-1" size={16} />
                      Validate performance improvements and accuracy metrics
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="text-blue-400 flex-shrink-0 mt-1" size={16} />
                      Ensure system stability and acceptable latency
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="text-yellow-400 font-semibold mb-1">Admin Responsibility</h4>
                      <p className="text-gray-300 text-sm">
                        Review A/B test results and approve model deployment based on
                        performance metrics (accuracy, precision, recall, F1-score).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </PhaseCard>
          </div>

          {/* Phase 3 */}
          <div className="mb-6">
            <PhaseCard
              phase="3"
              title="Full Migration & Deployment"
              duration="1-2 weeks"
              status="pending"
              icon={Zap}
              color="emerald"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">What Changes:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <Zap className="text-emerald-400 flex-shrink-0 mt-1" size={16} />
                      Switch primary recommendation engine to AdaBoost ML model
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="text-emerald-400 flex-shrink-0 mt-1" size={16} />
                      Improved recommendation accuracy and personalization
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="text-emerald-400 flex-shrink-0 mt-1" size={16} />
                      Continuous learning from new student data
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="text-emerald-400 flex-shrink-0 mt-1" size={16} />
                      Cosine similarity maintained as fallback for new users with sparse data
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="text-emerald-400 flex-shrink-0 mt-1" size={16} />
                      Real-time performance monitoring and model drift detection
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3">Gradual Traffic Shift:</h4>
                  <div className="space-y-2">
                    <TrafficShiftItem percentage="10%" description="Initial rollout to test stability" />
                    <TrafficShiftItem percentage="25%" description="Increased exposure if metrics are positive" />
                    <TrafficShiftItem percentage="50%" description="Half of users using ML model" />
                    <TrafficShiftItem percentage="100%" description="Full migration complete" />
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="text-emerald-400 font-semibold mb-1">Rollback Plan</h4>
                      <p className="text-gray-300 text-sm">
                        If performance degrades or critical issues arise, we can instantly
                        revert to the cosine similarity system with zero data loss.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </PhaseCard>
          </div>
        </motion.div>

        {/* Data Collection Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Database className="text-blue-400" size={28} />
            Data Collection Strategy
          </h2>

          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              We are collecting comprehensive student data that will serve as training labels
              for the machine learning model:
            </p>

            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Student Profile Features:</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <FeatureItem label="Skills & Technical Competencies" />
                <FeatureItem label="Academic Performance Metrics" />
                <FeatureItem label="Career Interests & Preferences" />
                <FeatureItem label="Assessment Completion Rates" />
                <FeatureItem label="Learning Patterns & Behavior" />
                <FeatureItem label="User Interaction History" />
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Labeled Outcomes (Training Data):</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <Target className="text-primary-400 flex-shrink-0 mt-1" size={16} />
                  Recommendations shown to each student
                </li>
                <li className="flex items-start gap-2">
                  <Target className="text-primary-400 flex-shrink-0 mt-1" size={16} />
                  User clicks, views, and engagement metrics
                </li>
                <li className="flex items-start gap-2">
                  <Target className="text-primary-400 flex-shrink-0 mt-1" size={16} />
                  Actual career path selections made by students
                </li>
                <li className="flex items-start gap-2">
                  <Target className="text-primary-400 flex-shrink-0 mt-1" size={16} />
                  Success indicators (enrollment, course completion)
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Admin Responsibilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Users className="text-yellow-400" size={28} />
            Admin Action Items
          </h2>

          <div className="space-y-3">
            <ActionItem
              priority="high"
              label="Monitor data collection progress weekly via dashboard"
            />
            <ActionItem
              priority="high"
              label="Review data quality reports monthly"
            />
            <ActionItem
              priority="medium"
              label="Verify balanced representation across career paths"
            />
            <ActionItem
              priority="medium"
              label="Approve migration when all criteria are met"
            />
            <ActionItem
              priority="low"
              label="Communicate system changes to users before migration"
            />
            <ActionItem
              priority="low"
              label="Monitor post-migration performance metrics"
            />
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/admin/dataset-viewer"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02]"
          >
            <FileText size={20} />
            View Current Dataset
          </Link>
          <Link
            to="/admin/dashboard"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] border border-gray-700"
          >
            <BarChart3 size={20} />
            Back to Dashboard
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

// Component Helpers
function PhaseCard({ phase, title, duration, status, icon: Icon, color, children }) {
  const statusConfig = {
    'in-progress': {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      label: 'In Progress'
    },
    'pending': {
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/30',
      text: 'text-gray-400',
      label: 'Pending'
    },
    'completed': {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      label: 'Completed'
    }
  };

  const config = statusConfig[status];

  return (
    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/30`}>
            <Icon className={`text-${color}-400`} size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-white">Phase {phase}: {title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
                {config.label}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Clock size={14} />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}

function RequirementItem({ label }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="text-primary-400 flex-shrink-0" size={16} />
      <span className="text-gray-300 text-sm">{label}</span>
    </div>
  );
}

function TrafficShiftItem({ percentage, description }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
      <div className="text-2xl font-bold text-emerald-400 w-16">{percentage}</div>
      <div className="text-sm text-gray-300">{description}</div>
    </div>
  );
}

function FeatureItem({ label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
      <span className="text-gray-300 text-sm">{label}</span>
    </div>
  );
}

function ActionItem({ priority, label }) {
  const priorityConfig = {
    high: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', label: 'High' },
    medium: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', label: 'Medium' },
    low: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', label: 'Low' }
  };

  const config = priorityConfig[priority];

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
      <span className={`px-2 py-1 rounded text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
        {config.label}
      </span>
      <span className="text-gray-300 text-sm">{label}</span>
    </div>
  );
}
