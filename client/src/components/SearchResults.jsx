import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Loader, TrendingUp } from 'lucide-react';
import { notesApi } from '../services/api';
import { formatDate, truncateText, getTagClassName } from '../utils/debounce';

export default function SearchResults({ query, onClearSearch }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    performSearch();
  }, [query]);

  const performSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await notesApi.search(query, 20);
      setResults(data);
    } catch (err) {
      console.error('Error searching:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader className="w-8 h-8 text-vault-500 animate-spin mb-4" />
        <p className="text-slate-600">Searching your notes by meaning...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-800">{error}</p>
        <button
          onClick={performSearch}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Search Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Search Results
            </h1>
            <p className="text-slate-600">
              Found <span className="font-semibold text-vault-600">{results.length}</span> notes 
              matching "<span className="font-medium">{query}</span>"
            </p>
          </div>
          <button
            onClick={onClearSearch}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 
                     rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear Search
          </button>
        </div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-20">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">
            No results found
          </h2>
          <p className="text-slate-500 mb-6">
            Try a different search query or create a new note
          </p>
          <button
            onClick={onClearSearch}
            className="px-6 py-3 bg-vault-600 text-white rounded-xl hover:bg-vault-700 
                     transition-colors font-medium"
          >
            View All Notes
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((note) => (
            <Link
              key={note._id}
              to={`/note/${note._id}`}
              className="block bg-white rounded-xl shadow-sm border border-slate-200 
                       p-6 hover:border-vault-300 hover:shadow-md transition-all 
                       note-card animate-fade-in"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-slate-800 mb-2 line-clamp-2">
                    {note.title}
                  </h3>

                  {/* Content Preview */}
                  <p className="text-slate-600 mb-3 line-clamp-2">
                    {truncateText(note.content, 200)}
                  </p>

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {note.tags.map((tag, idx) => (
                        <span key={idx} className={getTagClassName(tag)}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center text-xs text-slate-500">
                    {formatDate(note.createdAt)}
                  </div>
                </div>

                {/* Relevance Score */}
                {note.score && (
                  <div className="flex flex-col items-center gap-1 bg-vault-50 px-4 py-3 
                               rounded-lg border border-vault-200 flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-vault-600" />
                    <span className="text-sm font-bold text-vault-700">
                      {Math.round(note.score * 100)}%
                    </span>
                    <span className="text-xs text-vault-600">Match</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
