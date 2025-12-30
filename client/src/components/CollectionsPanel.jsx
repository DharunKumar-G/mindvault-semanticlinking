import { useState, useEffect } from 'react';
import { FolderOpen, Plus, Edit2, Trash2, FolderPlus } from 'lucide-react';
import { collectionsApi } from '../services/api';

export default function CollectionsPanel({ selectedCollection, onSelectCollection }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    color: 'slate'
  });

  const colorOptions = [
    { name: 'slate', class: 'bg-slate-100 dark:bg-slate-700' },
    { name: 'blue', class: 'bg-blue-100 dark:bg-blue-700' },
    { name: 'purple', class: 'bg-purple-100 dark:bg-purple-700' },
    { name: 'green', class: 'bg-green-100 dark:bg-green-700' },
    { name: 'amber', class: 'bg-amber-100 dark:bg-amber-700' },
    { name: 'rose', class: 'bg-rose-100 dark:bg-rose-700' }
  ];

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const data = await collectionsApi.getAll();
      setCollections(data);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!newCollection.name.trim()) return;

    try {
      await collectionsApi.create(newCollection);
      setNewCollection({ name: '', description: '', color: 'slate' });
      setShowCreateModal(false);
      loadCollections();
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this collection? Notes will not be deleted.')) return;

    try {
      await collectionsApi.delete(id);
      if (selectedCollection === id) {
        onSelectCollection(null);
      }
      loadCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Collections
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-vault-600 dark:text-vault-400"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* All Notes */}
        <button
          onClick={() => onSelectCollection(null)}
          className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            selectedCollection === null
              ? 'bg-vault-100 dark:bg-vault-900/30 text-vault-700 dark:text-vault-300'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span className="flex-1">All Notes</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-600">
            {collections.reduce((sum, c) => sum + parseInt(c.note_count || 0), 0)}
          </span>
        </button>
      </div>

      {/* Collections List */}
      <div className="p-2 space-y-1">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className={`group relative px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              selectedCollection === collection.id
                ? 'bg-vault-100 dark:bg-vault-900/30 text-vault-700 dark:text-vault-300'
                : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            onClick={() => onSelectCollection(collection.id)}
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${colorOptions.find(c => c.name === collection.color)?.class || 'bg-slate-400'}`}></div>
              <span className="flex-1 text-sm font-medium truncate">{collection.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-600">
                {collection.note_count || 0}
              </span>
            </div>
            {collection.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-5 truncate">
                {collection.description}
              </p>
            )}

            {/* Delete button */}
            {collection.name !== 'General' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(collection.id);
                }}
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FolderPlus className="w-5 h-5" />
              Create Collection
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="My Collection"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Brief description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setNewCollection({ ...newCollection, color: color.name })}
                      className={`w-8 h-8 rounded-lg ${color.class} ${
                        newCollection.color === color.name ? 'ring-2 ring-vault-600 ring-offset-2 dark:ring-offset-slate-800' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewCollection({ name: '', description: '', color: 'slate' });
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCollection.name.trim()}
                  className="flex-1 px-4 py-2 bg-vault-600 text-white rounded-lg hover:bg-vault-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
