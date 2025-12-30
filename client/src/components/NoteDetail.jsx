import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit, Trash2, Clock, Tag as TagIcon, Loader, ArrowLeft, Sparkles, Download, FileText } from 'lucide-react';
import { notesApi } from '../services/api';
import { formatDate, getTagClassName } from '../utils/debounce';
import RelatedNotes from './RelatedNotes';

export default function NoteDetail({ onNoteChange }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);
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

  const handleExportMarkdown = () => {
    if (!note) return;

    // Create markdown content
    let markdown = `# ${note.title}\n\n`;
    
    if (note.tags && note.tags.length > 0) {
      markdown += `**Tags:** ${note.tags.map(tag => `#${tag}`).join(', ')}\n\n`;
    }
    
    markdown += `**Created:** ${formatDate(note.createdAt)}\n`;
    
    if (note.updatedAt !== note.createdAt) {
      markdown += `**Updated:** ${formatDate(note.updatedAt)}\n`;
    }
    
    markdown += `\n---\n\n${note.content}\n`;

    // Create blob and download
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSummarize = async () => {
    if (!note) return;
    
    try {
      setSummarizing(true);
      const result = await notesApi.summarize(note.content, note.title);
      setSummary(result.summary);
      setShowSummary(true);
    } catch (err) {
      console.error('Error summarizing note:', err);
      alert('Failed to summarize note');
    } finally {
      setSummarizing(false);
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
                <button
                  onClick={handleSummarize}
                  disabled={summarizing}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 
                           border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 
                           transition-colors disabled:opacity-50"
                  title="AI Summarize"
                >
                  <FileText className="w-4 h-4" />
                  <span>{summarizing ? 'Summarizing...' : 'Summarize'}</span>
                </button>
                <button
                  onClick={handleExportMarkdown}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 
                           border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  title="Export to Markdown"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <Link
                  to={`/edit/${id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-vault-600 dark:text-vault-400 
                           border border-vault-300 dark:border-vault-600 rounded-lg hover:bg-vault-50 dark:hover:bg-slate-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-700 text-white 
                           rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors disabled:opacity-50"
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

            {/* AI Summary */}
            {showSummary && summary && (
              <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">AI Summary</h3>
                    <p className="text-purple-800 dark:text-purple-300 text-sm leading-relaxed">
                      {summary}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSummary(false)}
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Note Content */}
            <div className="prose max-w-none">
              <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed whitespace-pre-wrap">
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
