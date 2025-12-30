import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Save, X, Loader, Sparkles, Tag as TagIcon } from 'lucide-react';
import { notesApi } from '../services/api';
import { debounce } from '../utils/debounce';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import RelatedNotesLive from './RelatedNotesLive';
import DuplicateWarning from './DuplicateWarning';
import WritingSuggestions from './WritingSuggestions';

export default function NoteEditor({ onSave }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [ignoreDuplicates, setIgnoreDuplicates] = useState(false);
  const [writingSuggestions, setWritingSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    loadAvailableTags();
    if (isEditMode) {
      loadNote();
    } else if (location.state?.template) {
      // Load template data
      const template = location.state.template;
      setTitle(template.title || '');
      setContent(template.content || '');
      setTags(template.tags || []);
    }
  }, [id, location.state]);

  useEffect(() => {
    if (content.length > 20) {
      debouncedGetSuggestedTags(content);
    }
  }, [content]);

  // Check for duplicates when title or content changes
  useEffect(() => {
    if (!isEditMode && (title.length > 10 || content.length > 50) && !ignoreDuplicates) {
      debouncedCheckDuplicates(title, content);
    }
  }, [title, content, isEditMode, ignoreDuplicates]);

  // Get writing suggestions periodically
  useEffect(() => {
    if (content.length > 100 && content.length < 1000) {
      debouncedGetSuggestions(content, title);
    }
  }, [content, title]);

  const loadNote = async () => {
    try {
      setLoading(true);
      const note = await notesApi.getById(id);
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags || []);
    } catch (err) {
      console.error('Error loading note:', err);
      alert('Failed to load note');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableTags = async () => {
    try {
      const tagsList = await notesApi.getTags();
      setAvailableTags(tagsList);
    } catch (err) {
      console.error('Error loading tags:', err);
    }
  };

  const getSuggestedTags = async (text) => {
    if (text.length < 20) return;
    
    try {
      setLoadingTags(true);
      const result = await notesApi.categorize(text);
      setSuggestedTags(result.tags || []);
    } catch (err) {
      console.error('Error getting suggested tags:', err);
    } finally {
      setLoadingTags(false);
    }
  };

  const debouncedGetSuggestedTags = useCallback(
    debounce((text) => getSuggestedTags(text), 1500),
    []
  );

  const checkDuplicates = async (noteTitle, noteContent) => {
    if (!noteTitle && !noteContent) return;
    
    try {
      const result = await notesApi.checkDuplicates(noteTitle, noteContent, id);
      if (result.duplicates && result.duplicates.length > 0) {
        setDuplicates(result.duplicates);
        setShowDuplicateWarning(true);
      }
    } catch (err) {
      console.error('Error checking duplicates:', err);
    }
  };

  const debouncedCheckDuplicates = useCallback(
    debounce((noteTitle, noteContent) => checkDuplicates(noteTitle, noteContent), 2000),
    []
  );

  const getWritingSuggestions = async (noteContent, noteTitle) => {
    try {
      const result = await notesApi.getWritingSuggestions(noteContent, noteTitle);
      if (result.suggestions && result.suggestions.length > 0) {
        setWritingSuggestions(result.suggestions);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error('Error getting writing suggestions:', err);
    }
  };

  const debouncedGetSuggestions = useCallback(
    debounce((noteContent, noteTitle) => getWritingSuggestions(noteContent, noteTitle), 3000),
    []
  );

  const handleApplySuggestion = (suggestion) => {
    if (suggestion.action === 'add') {
      setContent(prev => prev + '\n\n' + suggestion.value);
    }
    // Remove the applied suggestion
    setWritingSuggestions(prev => prev.filter(s => s !== suggestion));
  };

  const handleAddTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }

    try {
      setSaving(true);
      const noteData = { title, content, tags };

      if (isEditMode) {
        await notesApi.update(id, noteData);
      } else {
        await notesApi.create(noteData);
      }

      onSave();
      navigate('/');
    } catch (err) {
      console.error('Error saving note:', err);
      alert('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  // Keyboard shortcut for saving
  useKeyboardShortcuts([
    {
      key: 's',
      ctrl: true,
      meta: true,
      callback: (e) => {
        e.preventDefault();
        if (!saving) {
          handleSubmit();
        }
      },
      allowInInput: true
    }
  ]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 text-vault-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Editor */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-vault-50 to-vault-100 dark:from-slate-700 dark:to-slate-700 px-6 py-4 border-b border-vault-200 dark:border-slate-600">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {isEditMode ? 'Edit Note' : 'Create New Note'}
              </h1>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* Duplicate Warning */}
              {showDuplicateWarning && !ignoreDuplicates && (
                <DuplicateWarning
                  duplicates={duplicates}
                  onClose={() => setShowDuplicateWarning(false)}
                  onIgnore={() => {
                    setIgnoreDuplicates(true);
                    setShowDuplicateWarning(false);
                  }}
                />
              )}

              {/* Writing Suggestions */}
              {showSuggestions && writingSuggestions.length > 0 && (
                <WritingSuggestions
                  suggestions={writingSuggestions}
                  onDismiss={() => setShowSuggestions(false)}
                  onApply={handleApplySuggestion}
                />
              )}

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The sunset at the beach yesterday was calming"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg 
                           focus:ring-2 focus:ring-vault-500 focus:border-transparent 
                           text-lg font-medium"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts... MindVault will help you find it later by meaning, not just keywords."
                  rows={12}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg 
                           focus:ring-2 focus:ring-vault-500 focus:border-transparent 
                           resize-none"
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags
                </label>
                
                {/* Selected Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-vault-100 
                                 text-vault-800 rounded-full text-sm font-medium"
                      >
                        <TagIcon className="w-3.5 h-3.5" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-vault-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* AI Suggested Tags */}
                {suggestedTags.length > 0 && (
                  <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">
                        AI Suggested Tags
                      </span>
                      {loadingTags && (
                        <Loader className="w-3 h-3 text-purple-600 animate-spin" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags
                        .filter(tag => !tags.includes(tag))
                        .map((tag, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAddTag(tag)}
                            className="px-3 py-1 bg-white border border-purple-300 text-purple-700 
                                     rounded-full text-sm hover:bg-purple-100 transition-colors"
                          >
                            + {tag}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* All Available Tags */}
                <div className="flex flex-wrap gap-2">
                  {availableTags
                    .filter(tag => !tags.includes(tag) && !suggestedTags.includes(tag))
                    .map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full 
                                 text-sm hover:bg-slate-200 transition-colors"
                      >
                        + {tag}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg 
                         hover:bg-slate-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-vault-600 text-white 
                         rounded-lg hover:bg-vault-700 transition-colors font-medium 
                         disabled:opacity-50 shadow-sm"
              >
                {saving ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {isEditMode ? 'Update Note' : 'Create Note'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Related Notes Live Preview */}
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
              As you type, see similar notes from your vault
            </p>
            <RelatedNotesLive content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
