import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Notes API
export const notesApi = {
  // Get all notes
  getAll: async () => {
    const response = await api.get('/notes');
    return response.data;
  },

  // Get a single note by ID
  getById: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  // Create a new note
  create: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },

  // Update a note
  update: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  // Delete a note
  delete: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  // Semantic search
  search: async (query, limit = 10) => {
    const response = await api.get('/notes/search', {
      params: { q: query, limit },
    });
    return response.data;
  },

  // Get related notes for a specific note
  getRelated: async (noteId, limit = 5) => {
    const response = await api.get(`/notes/${noteId}/related`, {
      params: { limit },
    });
    return response.data;
  },

  // Find related notes by content (real-time)
  findRelatedByContent: async (content, limit = 5) => {
    const response = await api.post('/notes/related-by-content', {
      content,
      limit,
    });
    return response.data;
  },

  // Get AI-suggested tags for content
  categorize: async (content) => {
    const response = await api.post('/notes/categorize', { content });
    return response.data;
  },

  // Get available tags
  getTags: async () => {
    const response = await api.get('/notes/tags');
    return response.data;
  },

  // Summarize note content
  summarize: async (content, title = '') => {
    const response = await api.post('/notes/summarize', { content, title });
    return response.data;
  },

  // Check for duplicate/similar notes
  checkDuplicates: async (title, content, excludeId = null) => {
    const response = await api.post('/notes/check-duplicates', { 
      title, 
      content,
      excludeId 
    });
    return response.data;
  },

  // Get writing suggestions
  getWritingSuggestions: async (content, context = '') => {
    const response = await api.post('/notes/writing-suggestions', { content, context });
    return response.data;
  },
};

// Collections API
export const collectionsApi = {
  // Get all collections
  getAll: async () => {
    const response = await api.get('/collections');
    return response.data;
  },

  // Get a collection by ID with its notes
  getById: async (id) => {
    const response = await api.get(`/collections/${id}`);
    return response.data;
  },

  // Create a new collection
  create: async (data) => {
    const response = await api.post('/collections', data);
    return response.data;
  },

  // Update a collection
  update: async (id, data) => {
    const response = await api.put(`/collections/${id}`, data);
    return response.data;
  },

  // Delete a collection
  delete: async (id) => {
    const response = await api.delete(`/collections/${id}`);
    return response.data;
  },

  // Move a note to a collection
  moveNote: async (collectionId, noteId) => {
    const response = await api.post(`/collections/${collectionId}/move-note`, { noteId });
    return response.data;
  },
};

// AI API
export const aiApi = {
  // Ask a question about notes
  askQuestion: async (question) => {
    const response = await api.post('/notes/ask', { question });
    return response.data;
  },
};

export default api;
