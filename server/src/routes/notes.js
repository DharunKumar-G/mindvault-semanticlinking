import express from 'express';
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  semanticSearch,
  findRelatedNotes,
  findRelatedByContent,
} from '../services/noteService.js';
import { categorizeNote, summarizeNote, answerQuestion } from '../services/categorizationService.js';
import { AVAILABLE_TAGS } from '../services/categorizationService.js';

const router = express.Router();

// GET /api/notes - Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await getAllNotes();
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// GET /api/notes/search - Semantic search
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await semanticSearch(q, parseInt(limit));
    res.json(results);
  } catch (error) {
    console.error('Error searching notes:', error);
    res.status(500).json({ error: 'Failed to search notes' });
  }
});

// GET /api/notes/tags - Get available tags
router.get('/tags', (req, res) => {
  res.json(AVAILABLE_TAGS);
});

// POST /api/notes/categorize - Get AI-suggested tags for content
router.post('/categorize', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const tags = await categorizeNote(content);
    res.json({ tags });
  } catch (error) {
    console.error('Error categorizing:', error);
    res.status(500).json({ error: 'Failed to categorize content' });
  }
});

// POST /api/notes/related-by-content - Find related notes by content (real-time)
router.post('/related-by-content', async (req, res) => {
  try {
    const { content, limit = 5 } = req.body;
    
    if (!content) {
      return res.json([]);
    }

    const related = await findRelatedByContent(content, parseInt(limit));
    res.json(related);
  } catch (error) {
    console.error('Error finding related notes:', error);
    res.status(500).json({ error: 'Failed to find related notes' });
  }
});

// GET /api/notes/:id - Get a specific note
router.get('/:id', async (req, res) => {
  try {
    const note = await getNoteById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// GET /api/notes/:id/related - Get related notes
router.get('/:id/related', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const related = await findRelatedNotes(req.params.id, parseInt(limit));
    res.json(related);
  } catch (error) {
    console.error('Error finding related notes:', error);
    res.status(500).json({ error: 'Failed to find related notes' });
  }
});

// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const note = await createNote({ title, content, tags });
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// PUT /api/notes/:id - Update a note
router.put('/:id', async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const note = await updateNote(req.params.id, { title, content, tags });
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const success = await deleteNote(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// POST /api/notes/summarize - Summarize note content
router.post('/summarize', async (req, res) => {
  try {
    const { content, title } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const summary = await summarizeNote(content, title);
    res.json({ summary });
  } catch (error) {
    console.error('Error summarizing:', error);
    res.status(500).json({ error: 'Failed to summarize content' });
  }
});

// POST /api/notes/check-duplicates - Check for duplicate/similar notes
router.post('/check-duplicates', async (req, res) => {
  try {
    const { title, content, limit = 3 } = req.body;
    
    if (!title || !content) {
      return res.json([]);
    }

    const textToCheck = `${title} ${content}`;
    const duplicates = await findRelatedByContent(textToCheck, parseInt(limit));
    
    // Filter to only show high similarity matches (> 0.75)
    const highSimilarity = duplicates.filter(note => note.score > 0.75);
    res.json(highSimilarity);
  } catch (error) {
    console.error('Error checking duplicates:', error);
    res.status(500).json({ error: 'Failed to check duplicates' });
  }
});

// POST /api/notes/writing-suggestions - Get AI writing suggestions
router.post('/writing-suggestions', async (req, res) => {
  try {
    const { content, title } = req.body;
    
    if (!content) {
      return res.json([]);
    }

    const { getWritingSuggestions } = await import('../services/categorizationService.js');
    const suggestions = await getWritingSuggestions(content, title);
    res.json(suggestions);
  } catch (error) {
    console.error('Error getting writing suggestions:', error);
    res.status(500).json({ error: 'Failed to get writing suggestions' });
  }
});

// POST /api/notes/ask - Ask a question and get an AI answer based on notes
router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Use semantic search to find relevant notes
    const relevantNotes = await semanticSearch(question, 5);
    
    // Get AI answer based on those notes
    const result = await answerQuestion(question, relevantNotes);
    res.json(result);
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ error: 'Failed to answer question' });
  }
});

export default router;
