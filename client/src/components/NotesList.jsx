import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Tag, Trash2, Loader2, Download, Pin, Archive } from 'lucide-react';
import { notesApi } from '../services/api';
import { formatDate, truncateText, getTagClassName } from '../utils/debounce';
import NotesFilter from './NotesFilter';

export default function NotesList({ onNoteChange }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [filters, setFilters] = useState({
    tags: [],
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Get unique tags from all notes
  const availableTags = useMemo(() => {
    const tagsSet = new Set();
    notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [notes]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Filter by tags
    if (filters.tags.length > 0) {
      result = result.filter(note => 
        note.tags && note.tags.some(tag => filters.tags.includes(tag))
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(note => new Date(note.createdAt) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter(note => new Date(note.createdAt) <= toDate);
    }

    // Sort
    result.sort((a, b) => {
      let aVal, bVal;
      
      if (filters.sortBy === 'title') {
        aVal = a.title.toLowerCase();
        bVal = b.title.toLowerCase();
        return filters.sortOrder === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        aVal = new Date(a[filters.sortBy]);
        bVal = new Date(b[filters.sortBy]);
        return filters.sortOrder === 'asc' 
          ? aVal - bVal
          : bVal - aVal;
      }
    });

    return result;
  }, [notes, filters]);

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

  const handlePin = async (e, noteId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await notesApi.togglePin(noteId);
      fetchNotes();
      onNoteChange?.();
    } catch (err) {
      console.error('Error pinning note:', err);
    }
  };

  const handleArchive = async (e, noteId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await notesApi.toggleArchive(noteId);
      fetchNotes();
      onNoteChange?.();
    } catch (err) {
      console.error('Error archiving note:', err);
    }
  };

  const handleExportAll = () => {
    const notesToExport = filteredNotes.length > 0 ? filteredNotes : notes;
    if (notesToExport.length === 0) return;

    let markdown = `# MindVault Notes Export\n\n`;
    markdown += `Exported on: ${new Date().toLocaleDateString()}\n`;
    markdown += `Total Notes: ${notesToExport.length}\n\n`;
    markdown += `---\n\n`;

    notesToExport.forEach((note, index) => {
      markdown += `## ${index + 1}. ${note.title}\n\n`;
      
      if (note.tags && note.tags.length > 0) {
        markdown += `**Tags:** ${note.tags.map(tag => `#${tag}`).join(', ')}\n\n`;
      }
      
      markdown += `**Created:** ${formatDate(note.createdAt)}\n\n`;
      markdown += `${note.content}\n\n`;
      markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindvault_notes_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-vault-600 dark:text-vault-400" />
        <span className="ml-3 text-slate-600 dark:text-slate-300">Loading your notes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button 
          onClick={fetchNotes}
          className="px-4 py-2 bg-vault-600 dark:bg-vault-500 text-white rounded-lg hover:bg-vault-700 dark:hover:bg-vault-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-20">
        <FileText className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">No notes yet</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Start capturing your thoughts and ideas
        </p>
        <Link
          to="/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-vault-600 dark:bg-vault-500 text-white 
                   rounded-xl hover:bg-vault-700 dark:hover:bg-vault-600 transition-colors font-medium"
        >
          Create Your First Note
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Your Notes</h1>
          <span className="text-slate-500 dark:text-slate-400">
            {filteredNotes.length} {filteredNotes.length !== notes.length && `of ${notes.length}`} notes
          </span>
        </div>
        <div className="flex items-center gap-2">
          <NotesFilter 
            onFilterChange={setFilters}
            availableTags={availableTags}
          />
          <button
            onClick={handleExportAll}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 
                     rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title="Export all notes to Markdown"
          >
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {filteredNotes.length === 0 && notes.length > 0 ? (
        <div className="text-center py-20">
          <FileText className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">No notes match your filters</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Try adjusting your filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <Link
            key={note._id}
            to={`/note/${note._id}`}
            className="note-card bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 
                     hover:border-vault-300 dark:hover:border-vault-500 block group relative"
          >
            {/* Action buttons */}
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => handlePin(e, note._id)}
                className={`p-2 rounded-lg transition-colors ${
                  note.is_pinned 
                    ? 'text-yellow-500 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                }`}
                title={note.is_pinned ? 'Unpin note' : 'Pin note'}
              >
                <Pin className="w-4 h-4" fill={note.is_pinned ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={(e) => handleArchive(e, note._id)}
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 
                         rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                title="Archive note"
              >
                <Archive className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => handleDelete(e, note._id)}
                disabled={deletingId === note._id}
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 
                         rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Delete note"
              >
                {deletingId === note._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Pin indicator */}
            {note.is_pinned && (
              <div className="absolute top-3 left-3">
                <Pin className="w-4 h-4 text-yellow-500 dark:text-yellow-400" fill="currentColor" />
              </div>
            )}

            {/* Title */}
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 pr-24 pl-6 line-clamp-2">
              {note.title}
            </h3>

            {/* Content preview */}
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
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
            <div className="flex items-center text-xs text-slate-400 dark:text-slate-500">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(note.createdAt)}
            </div>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
}
