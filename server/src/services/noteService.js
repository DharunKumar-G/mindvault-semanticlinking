import { getDatabase } from '../config/database.js';
import { generateEmbedding } from './embeddingService.js';
import { categorizeNote } from './categorizationService.js';

const COLLECTION_NAME = process.env.COLLECTION_NAME || 'notes';
const VECTOR_INDEX_NAME = 'vector_index';

/**
 * Create a new note with embedding
 * @param {Object} noteData - Note data { title, content }
 * @returns {Promise<Object>} - Created note
 */
export async function createNote(noteData) {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  const { title, content, tags: providedTags } = noteData;
  
  // Generate embedding for the note content
  const textToEmbed = `${title} ${content}`;
  const embedding = await generateEmbedding(textToEmbed);
  
  // Auto-categorize if no tags provided
  let tags = providedTags || [];
  if (tags.length === 0) {
    tags = await categorizeNote(content);
  }

  const note = {
    title,
    content,
    tags,
    embedding,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(note);
  
  return {
    _id: result.insertedId,
    title,
    content,
    tags,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}

/**
 * Get all notes (without embeddings for performance)
 * @returns {Promise<Array>} - Array of notes
 */
export async function getAllNotes() {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  const notes = await collection
    .find({}, { projection: { embedding: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  return notes;
}

/**
 * Get a note by ID
 * @param {string} id - Note ID
 * @returns {Promise<Object>} - Note object
 */
export async function getNoteById(id) {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);
  const { ObjectId } = await import('mongodb');

  const note = await collection.findOne(
    { _id: new ObjectId(id) },
    { projection: { embedding: 0 } }
  );

  return note;
}

/**
 * Update a note
 * @param {string} id - Note ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated note
 */
export async function updateNote(id, updateData) {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);
  const { ObjectId } = await import('mongodb');

  const { title, content, tags } = updateData;
  
  // Regenerate embedding if content or title changed
  const textToEmbed = `${title} ${content}`;
  const embedding = await generateEmbedding(textToEmbed);

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        title,
        content,
        tags,
        embedding,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after', projection: { embedding: 0 } }
  );

  return result;
}

/**
 * Delete a note
 * @param {string} id - Note ID
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteNote(id) {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);
  const { ObjectId } = await import('mongodb');

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

/**
 * Semantic search for notes using MongoDB Atlas Vector Search
 * @param {string} query - Search query
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} - Array of matching notes with scores
 */
export async function semanticSearch(query, limit = 10) {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  // Generate embedding for the search query
  const queryEmbedding = await generateEmbedding(query);

  // Use MongoDB Atlas Vector Search ($vectorSearch aggregation)
  const pipeline = [
    {
      $vectorSearch: {
        index: VECTOR_INDEX_NAME,
        path: 'embedding',
        queryVector: queryEmbedding,
        numCandidates: limit * 10, // Consider more candidates for better results
        limit: limit,
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        tags: 1,
        createdAt: 1,
        updatedAt: 1,
        score: { $meta: 'vectorSearchScore' },
      },
    },
  ];

  const results = await collection.aggregate(pipeline).toArray();
  return results;
}

/**
 * Find related notes for a given note
 * @param {string} noteId - The note ID to find related notes for
 * @param {number} limit - Number of related notes to return
 * @returns {Promise<Array>} - Array of related notes
 */
export async function findRelatedNotes(noteId, limit = 5) {
  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);
  const { ObjectId } = await import('mongodb');

  // Get the note's embedding
  const note = await collection.findOne({ _id: new ObjectId(noteId) });
  
  if (!note || !note.embedding) {
    return [];
  }

  // Use vector search to find similar notes
  const pipeline = [
    {
      $vectorSearch: {
        index: VECTOR_INDEX_NAME,
        path: 'embedding',
        queryVector: note.embedding,
        numCandidates: (limit + 1) * 10,
        limit: limit + 1, // +1 to exclude the note itself
      },
    },
    {
      $match: {
        _id: { $ne: new ObjectId(noteId) }, // Exclude the current note
      },
    },
    {
      $limit: limit,
    },
    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        tags: 1,
        createdAt: 1,
        score: { $meta: 'vectorSearchScore' },
      },
    },
  ];

  const results = await collection.aggregate(pipeline).toArray();
  return results;
}

/**
 * Find related notes based on text content (for real-time suggestions)
 * @param {string} text - Text content to find related notes for
 * @param {number} limit - Number of related notes to return
 * @returns {Promise<Array>} - Array of related notes
 */
export async function findRelatedByContent(text, limit = 5) {
  if (!text || text.trim().length < 10) {
    return [];
  }

  const db = await getDatabase();
  const collection = db.collection(COLLECTION_NAME);

  // Generate embedding for the text
  const textEmbedding = await generateEmbedding(text);

  // Use vector search to find similar notes
  const pipeline = [
    {
      $vectorSearch: {
        index: VECTOR_INDEX_NAME,
        path: 'embedding',
        queryVector: textEmbedding,
        numCandidates: limit * 10,
        limit: limit,
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        tags: 1,
        createdAt: 1,
        score: { $meta: 'vectorSearchScore' },
      },
    },
  ];

  const results = await collection.aggregate(pipeline).toArray();
  return results;
}
