import { useState, useEffect } from 'react';
import { Clock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { notesApi } from '../services/api';
import { formatDate } from '../utils/debounce';

export default function RecentNotes() {
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentNotes();
  }, []);

  const loadRecentNotes = async () => {
    try {
      setLoading(true);
      const notes = await notesApi.getRecentlyViewed(5);
      setRecentNotes(notes);
    } catch (error) {
      console.error('Error loading recent notes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-slate-400" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Recent Notes</h2>
        </div>
        <div className="animate-pulse space-y-2">
          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (recentNotes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="font-semibold text-slate-900 dark:text-white">Recent Notes</h2>
      </div>

      <div className="space-y-1">
        {recentNotes.map((note) => (
          <Link
            key={note.id}
            to={`/note/${note.id}`}
            className="block p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
          >
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {note.title}
                </p>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {note.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                {formatDate(note.last_viewed_at)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
