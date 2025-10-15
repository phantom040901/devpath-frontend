export default function ProgressBar({ current = 1, total = 1, pct = 0 }) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-400">Progress</span>
        <span className="text-sm font-semibold text-gray-200">
          {current} / {total}
        </span>
      </div>

      {/* Bar */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-800/60 shadow-inner">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 shadow-md transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />

        {/* Floating percentage badge */}
        <div
          className="absolute -top-7 flex h-6 w-12 items-center justify-center rounded-md bg-gray-900 text-xs font-semibold text-primary-400 shadow-lg transition-all duration-500"
          style={{ left: `calc(${pct}% - 1.5rem)` }}
        >
          {pct}%
        </div>
      </div>
    </div>
  );
}
