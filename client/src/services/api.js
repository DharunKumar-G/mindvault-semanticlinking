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
};

export default api;
