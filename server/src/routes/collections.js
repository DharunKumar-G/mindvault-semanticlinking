import express from 'express';
import {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  moveNoteToCollection
} from '../services/collectionService.js';

const router = express.Router();

// GET /api/collections - Get all collections
router.get('/', async (req, res) => {
  try {
    const collections = await getAllCollections();
    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// GET /api/collections/:id - Get a collection with its notes
router.get('/:id', async (req, res) => {
  try {
    const collection = await getCollectionById(req.params.id);
    
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

// POST /api/collections - Create a new collection
router.post('/', async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Collection name is required' });
    }

    const collection = await createCollection({ name, description, color });
    res.status(201).json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'Failed to create collection' });
  }
});

// PUT /api/collections/:id - Update a collection
router.put('/:id', async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Collection name is required' });
    }

    const collection = await updateCollection(req.params.id, { name, description, color });
    
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json(collection);
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ error: 'Failed to update collection' });
  }
});

// DELETE /api/collections/:id - Delete a collection
router.delete('/:id', async (req, res) => {
  try {
    const success = await deleteCollection(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: 'Failed to delete collection' });
  }
});

// POST /api/collections/:id/move-note - Move a note to this collection
router.post('/:id/move-note', async (req, res) => {
  try {
    const { noteId } = req.body;
    
    if (!noteId) {
      return res.status(400).json({ error: 'Note ID is required' });
    }

    const success = await moveNoteToCollection(noteId, req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note moved successfully' });
  } catch (error) {
    console.error('Error moving note:', error);
    res.status(500).json({ error: 'Failed to move note' });
  }
});

export default router;
