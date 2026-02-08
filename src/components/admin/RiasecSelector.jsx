import { RIASEC_CATEGORIES, RIASEC_CODES } from "../../constants/riasec";

/**
 * Multi-select toggle component for RIASEC categories
 * Allows selecting multiple RIASEC codes for a question
 */
export default function RiasecSelector({ selected = [], onChange, compact = false }) {
  const toggleCategory = (code) => {
    const updated = selected.includes(code)
      ? selected.filter(c => c !== code)
      : [...selected, code];
    onChange(updated);
  };

  return (
    <div className={`flex ${compact ? "gap-1" : "gap-2"} flex-wrap`}>
      {RIASEC_CODES.map(code => {
        const category = RIASEC_CATEGORIES[code];
        const isSelected = selected.includes(code);

        return (
          <button
            key={code}
            type="button"
            onClick={() => toggleCategory(code)}
            className={`${compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"}
              rounded-lg font-medium transition-all border
              ${isSelected
                ? `${category.bgClass} ${category.textClass} ${category.borderClass}`
                : "bg-gray-700 text-gray-400 border-gray-600 hover:bg-gray-600"
              }`}
            title={`${category.name}: ${category.description}`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
