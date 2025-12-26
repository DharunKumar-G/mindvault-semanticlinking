import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp, Loader } from 'lucide-react';
import { notesApi } from '../services/api';
import { formatDate, truncateText, getTagClassName } from '../utils/debounce';

export default function RelatedNotes({ noteId }) {
  const [relatedNotes, setRelatedNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (noteId) {
      loadRelatedNotes();
    }
  }, [noteId]);

  const loadRelatedNotes = async () => {
    try {
      setLoading(true);
      const notes = await notesApi.getRelated(noteId, 5);
      setRelatedNotes(notes);
    } catch (err) {
      console.error('Error loading related notes:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-5 h-5 text-vault-500 animate-spin" />
      </div>
    );
  }

  if (relatedNotes.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No related notes found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {relatedNotes.map((note) => (
        <Link
          key={note._id}
          to={`/note/${note._id}`}
          className="block p-3 bg-white rounded-lg border border-slate-200 
                   hover:border-vault-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-vault-600">
              {note.title}
            </h4>
            {note.score && (
              <div className="flex items-center gap-1 text-xs text-vault-600 bg-vault-50 px-2 py-0.5 rounded-full flex-shrink-0">
                <TrendingUp className="w-3 h-3" />
                {Math.round(note.score * 100)}%
              </div>
            )}
          </div>
          <p className="text-xs text-slate-600 line-clamp-2 mb-2">
            {truncateText(note.content, 80)}
          </p>
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                  {tag}
                </span>
              ))}
              {note.tags.length > 2 && (
                <span className="text-xs px-2 py-0.5 text-slate-500">
                  +{note.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
