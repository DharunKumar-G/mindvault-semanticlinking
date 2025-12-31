export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  NOTES: '/api/notes',
  NOTE_BY_ID: (id) => `/api/notes/${id}`,
  SEARCH: '/api/notes/search',
  RELATED: (id) => `/api/notes/${id}/related`,
  RELATED_LIVE: '/api/notes/related-live',
};

export const LIMITS = {
  MAX_TITLE_LENGTH: 200,
  MAX_CONTENT_LENGTH: 50000,
  MAX_TAGS: 10,
  MAX_TAG_LENGTH: 30,
  DEFAULT_SEARCH_LIMIT: 10,
  DEFAULT_RELATED_LIMIT: 5,
};

export const DEBOUNCE_DELAYS = {
  SEARCH: 500,
  RELATED_NOTES: 800,
  AUTO_SAVE: 2000,
};

export const MESSAGES = {
  NOTE_CREATED: 'Note created successfully',
  NOTE_UPDATED: 'Note updated successfully',
  NOTE_DELETED: 'Note deleted successfully',
  LOADING: 'Loading...',
  NO_NOTES: 'No notes found',
  NO_RESULTS: 'No search results found',
  ERROR_GENERIC: 'Something went wrong. Please try again.',
  ERROR_NETWORK: 'Network error. Please check your connection.',
};

export const VECTOR_DIMENSIONS = 768;

export const TAG_COLORS = [
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#10B981', // green
  '#F59E0B', // amber
  '#3B82F6', // blue
  '#EF4444', // red
  '#14B8A6', // teal
  '#F97316', // orange
];

export const KEYBOARD_SHORTCUTS = {
  NEW_NOTE: 'ctrl+n',
  SAVE_NOTE: 'ctrl+s',
  SEARCH: 'ctrl+k',
  DELETE_NOTE: 'ctrl+delete',
};
