import { RIASEC_CATEGORIES, RIASEC_CODES, getTotalRiasecCount } from "../../constants/riasec";

/**
 * Visual bar showing RIASEC distribution
 * Displays proportional colored segments with optional labels
 */
export default function RiasecDistributionBar({ distribution, showLabels = true, showBar = true }) {
  const total = getTotalRiasecCount(distribution);

  if (total === 0) {
    return (
      <div className="text-xs text-gray-500 italic">
        No RIASEC categories assigned
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Distribution Bar */}
      {showBar && (
        <div className="flex h-2 rounded-full overflow-hidden bg-gray-700">
          {RIASEC_CODES.map(code => {
            const count = distribution[code] || 0;
            const percentage = (count / total) * 100;
            if (percentage === 0) return null;

            return (
              <div
                key={code}
                className={RIASEC_CATEGORIES[code].solidBg}
                style={{ width: `${percentage}%` }}
                title={`${RIASEC_CATEGORIES[code].name}: ${count} (${percentage.toFixed(0)}%)`}
              />
            );
          })}
        </div>
      )}

      {/* Labels */}
      {showLabels && (
        <div className="flex flex-wrap gap-2 text-xs">
          {RIASEC_CODES.map(code => {
            const count = distribution[code] || 0;
            if (count === 0) return null;
            const category = RIASEC_CATEGORIES[code];

            return (
              <span
                key={code}
                className={`${category.bgClass} ${category.textClass} px-1.5 py-0.5 rounded`}
                title={category.name}
              >
                {code}: {count}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
