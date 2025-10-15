// src/components/admin/AnalyticsCard.jsx
import { motion } from "framer-motion";

export default function AnalyticsCard({ 
  icon, 
  label, 
  value, 
  subtitle, 
  trend, 
  trendValue,
  color = "blue",
  onClick 
}) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-cyan-600/20 border-blue-500/30',
    emerald: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/30',
    yellow: 'from-yellow-500/20 to-orange-600/20 border-yellow-500/30',
    purple: 'from-purple-500/20 to-pink-600/20 border-purple-500/30',
    red: 'from-red-500/20 to-rose-600/20 border-red-500/30'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-5 ${
        onClick ? 'cursor-pointer' : ''
      } transition-all`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-gray-900/50">
          {icon}
        </div>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {label}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-white mb-1">{value}</div>
          {subtitle && (
            <div className="text-xs text-gray-400">{subtitle}</div>
          )}
        </div>

        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            trend === 'up' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {trend === 'up' ? '↑' : '↓'}
            {trendValue}
          </div>
        )}
      </div>
    </motion.div>
  );
}