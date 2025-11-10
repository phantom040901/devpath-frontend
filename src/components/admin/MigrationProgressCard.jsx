import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, TrendingUp, Calendar, AlertCircle, CheckCircle2, Clock, ChevronDown, ChevronUp, Download, FileSpreadsheet, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const MigrationProgressCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [migrationData, setMigrationData] = useState({
    currentStudents: 0,
    targetStudents: 2000,
    daysElapsed: 0,
    totalDays: 90,
    dataQualityScore: 0,
    interactionRate: 0,
    status: 'collecting' // collecting, ready, migrating, completed
  });

  useEffect(() => {
    // TODO: Replace with actual data fetching from your backend/Firebase
    // This is placeholder logic to demonstrate the component
    const fetchMigrationProgress = async () => {
      try {
        // Placeholder: Calculate based on your actual data
        // You'll need to query your Firestore 'users' collection
        const response = await fetch('/api/admin/migration-progress'); // Adjust endpoint
        const data = await response.json();
        setMigrationData(data);
      } catch (error) {
        // Fallback to mock data for demonstration
        const startDate = new Date('2025-01-01'); // Replace with actual start date
        const today = new Date();
        const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

        setMigrationData({
          currentStudents: 1247, // Replace with actual count
          targetStudents: 2000,
          daysElapsed: Math.min(daysElapsed, 90),
          totalDays: 90,
          dataQualityScore: 87,
          interactionRate: 73,
          status: 'collecting'
        });
      }
    };

    fetchMigrationProgress();
    // Refresh every 5 minutes
    const interval = setInterval(fetchMigrationProgress, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const progressPercentage = Math.min(
    Math.max(
      (migrationData.currentStudents / migrationData.targetStudents) * 100,
      (migrationData.daysElapsed / migrationData.totalDays) * 100
    ),
    100
  );

  const estimatedDaysRemaining = Math.max(
    migrationData.totalDays - migrationData.daysElapsed,
    0
  );

  const getStatusConfig = () => {
    if (migrationData.status === 'completed') {
      return {
        color: 'emerald',
        icon: CheckCircle2,
        text: 'Migration Complete',
        bgColor: 'bg-emerald-500/10',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/20'
      };
    } else if (migrationData.status === 'ready') {
      return {
        color: 'blue',
        icon: TrendingUp,
        text: 'Ready to Migrate',
        bgColor: 'bg-blue-500/10',
        textColor: 'text-blue-400',
        borderColor: 'border-blue-500/20'
      };
    } else if (migrationData.status === 'migrating') {
      return {
        color: 'yellow',
        icon: Clock,
        text: 'Migration in Progress',
        bgColor: 'bg-yellow-500/10',
        textColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/20'
      };
    } else {
      return {
        color: 'purple',
        icon: Database,
        text: 'Collecting Data',
        bgColor: 'bg-purple-500/10',
        textColor: 'text-purple-400',
        borderColor: 'border-purple-500/20'
      };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-xl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className={`p-2 sm:p-3 rounded-xl ${statusConfig.bgColor} border ${statusConfig.borderColor} flex-shrink-0`}>
            <StatusIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${statusConfig.textColor}`} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-white">
              Recommendation System Migration
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1">
              Cosine Similarity → AdaBoost ML
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} whitespace-nowrap`}>
            {statusConfig.text}
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 sm:p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Extended Information */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
              {/* Dataset Information */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Info className="text-blue-400 flex-shrink-0 mt-0.5 sm:mt-1" size={16} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-blue-400 font-semibold mb-2 text-sm sm:text-base">Dataset Information</h4>
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                      <p>
                        <span className="font-medium">Source:</span> DevPath V.2/cs_students.csv
                      </p>
                      <p>
                        <span className="font-medium">Format:</span> CSV (Comma-Separated Values)
                      </p>
                      <p>
                        <span className="font-medium">Contains:</span> Student profiles, skills, interests,
                        assessment results, and career path selections
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-400 mt-2">
                        This dataset serves as the foundation for training the AdaBoost ML model.
                        Data is continuously collected during the cosine similarity phase.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Migration Timeline */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 sm:p-4">
                <h4 className="text-purple-400 font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Migration Timeline
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <TimelineItem
                    phase="Phase 1"
                    title="Data Collection"
                    status={migrationData.status === 'collecting' ? 'active' : 'completed'}
                    description="Collecting student data via cosine similarity system"
                  />
                  <TimelineItem
                    phase="Phase 2"
                    title="Model Training"
                    status="pending"
                    description="Train and validate AdaBoost ML model"
                  />
                  <TimelineItem
                    phase="Phase 3"
                    title="Deployment"
                    status="pending"
                    description="Gradual migration to ML-powered recommendations"
                  />
                </div>
              </div>

              {/* Technical Details */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4">
                <h4 className="text-gray-300 font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Database size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-400 text-[10px] sm:text-xs">Current Algorithm:</span>
                    <p className="text-white font-medium text-xs sm:text-sm">Cosine Similarity</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] sm:text-xs">Target Algorithm:</span>
                    <p className="text-white font-medium text-xs sm:text-sm">AdaBoost</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] sm:text-xs">Dataset Size:</span>
                    <p className="text-white font-medium text-xs sm:text-sm">{migrationData.currentStudents.toLocaleString()} records</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] sm:text-xs">Data Quality:</span>
                    <p className="text-white font-medium text-xs sm:text-sm">{migrationData.dataQualityScore}%</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Link
          to="/admin/migration-guide"
          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 hover:scale-[1.02] text-center"
        >
          Migration Guide
        </Link>
        <Link
          to="/admin/dataset-viewer"
          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 hover:scale-[1.02] border border-gray-700 text-center"
        >
          View Dataset
        </Link>
      </div>
    </motion.div>
  );
};

const RequirementItem = ({ met, label }) => (
  <div className="flex items-center gap-2">
    {met ? (
      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
    ) : (
      <div className="w-4 h-4 rounded-full border-2 border-gray-600 flex-shrink-0" />
    )}
    <span className={`text-sm ${met ? 'text-gray-300' : 'text-gray-500'}`}>
      {label}
    </span>
  </div>
);

const TimelineItem = ({ phase, title, status, description }) => {
  const statusConfig = {
    active: {
      icon: <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />,
      bg: 'bg-purple-500/20',
      border: 'border-purple-500/50',
      text: 'text-purple-400'
    },
    completed: {
      icon: <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />,
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/50',
      text: 'text-emerald-400'
    },
    pending: {
      icon: <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-gray-600" />,
      bg: 'bg-gray-700/20',
      border: 'border-gray-700',
      text: 'text-gray-500'
    }
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border ${config.border} ${config.bg}`}>
      <div className="mt-0.5 flex-shrink-0">{config.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
          <span className="text-[10px] sm:text-xs font-semibold text-gray-400">{phase}</span>
          <span className={`text-xs sm:text-sm font-semibold ${config.text} truncate`}>{title}</span>
        </div>
        <p className="text-[10px] sm:text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default MigrationProgressCard;
