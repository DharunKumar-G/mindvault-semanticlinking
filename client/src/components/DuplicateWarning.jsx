import { X, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/debounce';

export default function DuplicateWarning({ duplicates, onClose, onIgnore }) {
  if (!duplicates || duplicates.length === 0) return null;

  return (
    <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
            Similar Notes Found
          </h3>
          <p className="text-yellow-800 dark:text-yellow-300 text-sm mb-3">
            You may already have {duplicates.length} similar {duplicates.length === 1 ? 'note' : 'notes'}. 
            Consider updating an existing note instead of creating a duplicate.
          </p>
          
          <div className="space-y-2 mb-3">
            {duplicates.slice(0, 3).map((note) => (
              <Link
                key={note._id}
                to={`/note/${note._id}`}
                className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded border 
                         border-yellow-200 dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-500 
                         transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 dark:text-slate-100 text-sm truncate">
                    {note.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(note.createdAt)} • {Math.round(note.similarity * 100)}% similar
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-yellow-600 dark:text-yellow-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onIgnore}
              className="px-3 py-1.5 text-sm bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 
                       rounded hover:bg-yellow-200 dark:hover:bg-yellow-900/60 transition-colors"
            >
              Continue Anyway
            </button>
            {duplicates.length > 3 && (
              <span className="text-xs text-yellow-600 dark:text-yellow-400 self-center">
                +{duplicates.length - 3} more
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
