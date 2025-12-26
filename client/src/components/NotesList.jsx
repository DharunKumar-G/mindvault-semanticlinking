import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Tag, Trash2, Loader2 } from 'lucide-react';
import { notesApi } from '../services/api';
import { formatDate, truncateText, getTagClassName } from '../utils/debounce';

export default function NotesList({ onNoteChange }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await notesApi.getAll();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load notes. Please try again.');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, noteId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      setDeletingId(noteId);
      await notesApi.delete(noteId);
      setNotes(notes.filter(note => note._id !== noteId));
      onNoteChange?.();
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Failed to delete note. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-vault-600" />
        <span className="ml-3 text-slate-600">Loading your notes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchNotes}
          className="px-4 py-2 bg-vault-600 text-white rounded-lg hover:bg-vault-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-20">
        <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 mb-2">No notes yet</h2>
        <p className="text-slate-500 mb-6">
          Start capturing your thoughts and ideas
        </p>
        <Link
          to="/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-vault-600 text-white 
                   rounded-xl hover:bg-vault-700 transition-colors font-medium"
        >
          Create Your First Note
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Your Notes</h1>
        <span className="text-slate-500">{notes.length} notes</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <Link
            key={note._id}
            to={`/note/${note._id}`}
            className="note-card bg-white rounded-xl p-5 border border-slate-200 
                     hover:border-vault-300 block group relative"
          >
            {/* Delete button */}
            <button
              onClick={(e) => handleDelete(e, note._id)}
              disabled={deletingId === note._id}
              className="absolute top-3 right-3 p-2 text-slate-400 hover:text-red-500 
                       opacity-0 group-hover:opacity-100 transition-opacity rounded-lg
                       hover:bg-red-50"
              title="Delete note"
            >
              {deletingId === note._id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>

            {/* Title */}
            <h3 className="font-semibold text-slate-800 mb-2 pr-8 line-clamp-2">
              {note.title}
            </h3>

            {/* Content preview */}
            <p className="text-slate-600 text-sm mb-4 line-clamp-3">
              {truncateText(note.content, 120)}
            </p>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {note.tags.map((tag, idx) => (
                  <span key={idx} className={getTagClassName(tag)}>
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Date */}
            <div className="flex items-center text-xs text-slate-400">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(note.createdAt)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
