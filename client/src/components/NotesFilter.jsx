import { useState } from 'react';
import { Filter, X, Calendar, Tag, SortAsc, SortDesc } from 'lucide-react';

export default function NotesFilter({ onFilterChange, availableTags }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    tags: [],
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTagToggle = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    const defaultFilters = {
      tags: [],
      dateFrom: '',
      dateTo: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = filters.tags.length > 0 || filters.dateFrom || filters.dateTo;

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
          hasActiveFilters
            ? 'bg-vault-50 dark:bg-vault-900/30 border-vault-300 dark:border-vault-600 text-vault-700 dark:text-vault-300'
            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filter</span>
        {hasActiveFilters && (
          <span className="ml-1 px-1.5 py-0.5 bg-vault-600 dark:bg-vault-500 text-white text-xs rounded-full">
            {filters.tags.length + (filters.dateFrom ? 1 : 0) + (filters.dateTo ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl 
                        border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 
                          bg-slate-50 dark:bg-slate-700/50">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Filters</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
              >
                <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {/* Sort Options */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                  {filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  Sort By
                </label>
                <div className="flex gap-2">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                             bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-vault-500"
                  >
                    <option value="createdAt">Date Created</option>
                    <option value="updatedAt">Last Modified</option>
                    <option value="title">Title</option>
                  </select>
                  <button
                    onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                             hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  >
                    {filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date Range
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                             bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-vault-500"
                    placeholder="From"
                  />
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                             bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-vault-500"
                    placeholder="To"
                  />
                </div>
              </div>

              {/* Tags Filter */}
              {availableTags && availableTags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Filter by Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          filters.tags.includes(tag)
                            ? 'bg-vault-600 dark:bg-vault-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {hasActiveFilters && (
              <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 
                           hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
