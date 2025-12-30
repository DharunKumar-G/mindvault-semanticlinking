import { Lightbulb, X } from 'lucide-react';

export default function WritingSuggestions({ suggestions, onDismiss, onApply }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
            Writing Suggestions
          </h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, idx) => (
              <div 
                key={idx}
                className="flex items-start justify-between gap-2 p-2 bg-white dark:bg-slate-800 rounded border border-amber-200 dark:border-amber-700"
              >
                <p className="text-sm text-slate-700 dark:text-slate-300 flex-1">
                  {suggestion.text}
                </p>
                {suggestion.action && (
                  <button
                    onClick={() => onApply(suggestion)}
                    className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 
                             rounded hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors whitespace-nowrap"
                  >
                    Apply
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
