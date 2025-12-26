import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Loader, Sparkles } from 'lucide-react';
import { notesApi } from '../services/api';
import { truncateText } from '../utils/debounce';
import { debounce } from '../utils/debounce';

export default function RelatedNotesLive({ content }) {
  const [relatedNotes, setRelatedNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (content && content.length > 30) {
      debouncedLoadRelated(content);
    } else {
      setRelatedNotes([]);
    }
  }, [content]);

  const loadRelatedNotes = async (text) => {
    try {
      setLoading(true);
      const notes = await notesApi.findRelatedByContent(text, 5);
      setRelatedNotes(notes);
    } catch (err) {
      console.error('Error loading related notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedLoadRelated = useCallback(
    debounce((text) => loadRelatedNotes(text), 1000),
    []
  );

  if (content.length < 30) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Start typing to see related notes...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-5 h-5 text-vault-500 animate-spin" />
        <span className="ml-2 text-sm text-slate-600">Finding connections...</span>
      </div>
    );
  }

  if (relatedNotes.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No similar notes found yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {relatedNotes.map((note) => (
        <Link
          key={note._id}
          to={`/note/${note._id}`}
          target="_blank"
          className="block p-3 bg-white rounded-lg border border-slate-200 
                   hover:border-vault-300 hover:shadow-sm transition-all group"
        >
          <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-2 group-hover:text-vault-600">
            {note.title}
          </h4>
          <p className="text-xs text-slate-600 line-clamp-2">
            {truncateText(note.content, 80)}
          </p>
          {note.score && (
            <div className="mt-2 text-xs text-vault-600">
              Similarity: {Math.round(note.score * 100)}%
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
