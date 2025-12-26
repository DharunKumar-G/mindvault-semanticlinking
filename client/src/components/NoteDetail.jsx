import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit, Trash2, Clock, Tag as TagIcon, Loader, ArrowLeft, Sparkles } from 'lucide-react';
import { notesApi } from '../services/api';
import { formatDate, getTagClassName } from '../utils/debounce';
import RelatedNotes from './RelatedNotes';

export default function NoteDetail({ onNoteChange }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notesApi.getById(id);
      setNote(data);
    } catch (err) {
      console.error('Error loading note:', err);
      setError('Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      setDeleting(true);
      await notesApi.delete(id);
      onNoteChange();
      navigate('/');
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Failed to delete note');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 text-vault-500 animate-spin" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-800">{error || 'Note not found'}</p>
        <Link
          to="/"
          className="mt-4 inline-block px-4 py-2 bg-vault-600 text-white rounded-lg hover:bg-vault-700"
        >
          Back to Notes
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-vault-50 to-vault-100 px-6 py-4 border-b border-vault-200">
            <div className="flex items-start justify-between gap-4">
              <Link
                to="/"
                className="flex items-center text-vault-600 hover:text-vault-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="flex gap-2">
                <Link
                  to={`/edit/${id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-vault-600 
                           border border-vault-300 rounded-lg hover:bg-vault-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white 
                           rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">
              {note.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-500">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                {formatDate(note.createdAt)}
              </div>
              {note.updatedAt !== note.createdAt && (
                <div className="flex items-center">
                  <span className="text-slate-400">• Updated {formatDate(note.updatedAt)}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {note.tags.map((tag, idx) => (
                  <span key={idx} className={getTagClassName(tag)}>
                    <TagIcon className="w-3 h-3 inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Note Content */}
            <div className="prose max-w-none">
              <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Notes Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <div className="bg-gradient-to-br from-vault-50 to-purple-50 rounded-xl p-5 border border-vault-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-vault-600" />
              <h2 className="text-lg font-semibold text-slate-800">
                Related Notes
              </h2>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Notes with similar meaning and context
            </p>
            <RelatedNotes noteId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
