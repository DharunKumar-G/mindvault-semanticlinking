import pool from '../config/database.js';
import { generateEmbedding } from './embeddingService.js';
import { categorizeNote } from './categorizationService.js';
import pgvector from 'pgvector/pg';

/**
 * Create a new note with embedding
 * @param {Object} noteData - Note data { title, content, tags }
 * @returns {Promise<Object>} - Created note
 */
export async function createNote(noteData) {
  const { title, content, tags: providedTags } = noteData;
  
  // Generate embedding for the note content
  const textToEmbed = `${title} ${content}`;
  const embedding = await generateEmbedding(textToEmbed);
  
  // Auto-categorize if no tags provided
  let tags = providedTags || [];
  if (tags.length === 0) {
    tags = await categorizeNote(content);
  }

  const query = `
    INSERT INTO notes (title, content, tags, embedding, created_at, updated_at)
    VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id, title, content, tags, created_at, updated_at
  `;
  
  const values = [title, content, tags, pgvector.toSql(embedding)];
  const result = await pool.query(query, values);
  
  return result.rows[0];
}

/**
 * Get all notes (without embeddings for performance)
 * @returns {Promise<Array>} - Array of notes
 */
export async function getAllNotes() {
  const query = `
    SELECT id, title, content, tags, created_at, updated_at
    FROM notes
    ORDER BY created_at DESC
  `;
  
  const result = await pool.query(query);
  return result.rows;
}

/**
 * Get a note by ID
 * @param {string} id - Note ID
 * @returns {Promise<Object>} - Note object
 */
export async function getNoteById(id) {
  const query = `
    SELECT id, title, content, tags, created_at, updated_at
    FROM notes
    WHERE id = $1
  `;
  
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

/**
 * Update a note
 * @param {string} id - Note ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated note
 */
export async function updateNote(id, updateData) {
  const { title, content, tags } = updateData;
  
  // Regenerate embedding if content or title changed
  const textToEmbed = `${title} ${content}`;
  const embedding = await generateEmbedding(textToEmbed);

  const query = `
    UPDATE notes
    SET title = $1, content = $2, tags = $3, embedding = $4, updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING id, title, content, tags, created_at, updated_at
  `;
  
  const values = [title, content, tags, pgvector.toSql(embedding), id];
  const result = await pool.query(query, values);
  
  return result.rows[0];
}

/**
 * Delete a note
 * @param {string} id - Note ID
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteNote(id) {
  const query = 'DELETE FROM notes WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rowCount > 0;
}

/**
 * Semantic search for notes using PostgreSQL pgvector
 * @param {string} query - Search query
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} - Array of matching notes with scores
 */
export async function semanticSearch(searchQuery, limit = 10) {
  // Generate embedding for the search query
  const queryEmbedding = await generateEmbedding(searchQuery);

  // Use pgvector's cosine distance operator (<=>)
  // Lower distance = more similar
  const query = `
    SELECT 
      id, 
      title, 
      content, 
      tags, 
      created_at, 
      updated_at,
      1 - (embedding <=> $1) as score
    FROM notes
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> $1
    LIMIT $2
  `;
  
  const values = [pgvector.toSql(queryEmbedding), limit];
  const result = await pool.query(query, values);
  
  return result.rows;
}

/**
 * Find related notes for a given note
 * @param {string} noteId - The note ID to find related notes for
 * @param {number} limit - Number of related notes to return
 * @returns {Promise<Array>} - Array of related notes
 */
export async function findRelatedNotes(noteId, limit = 5) {
  // Get the note's embedding
  const noteQuery = 'SELECT embedding FROM notes WHERE id = $1';
  const noteResult = await pool.query(noteQuery, [noteId]);
  
  if (noteResult.rows.length === 0 || !noteResult.rows[0].embedding) {
    return [];
  }

  const embedding = noteResult.rows[0].embedding;

  // Find similar notes using vector similarity
  const query = `
    SELECT 
      id, 
      title, 
      content, 
      tags, 
      created_at,
      1 - (embedding <=> $1) as score
    FROM notes
    WHERE id != $2 AND embedding IS NOT NULL
    ORDER BY embedding <=> $1
    LIMIT $3
  `;
  
  const values = [pgvector.toSql(embedding), noteId, limit];
  const result = await pool.query(query, values);
  
  return result.rows;
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

  // Generate embedding for the text
  const textEmbedding = await generateEmbedding(text);

  // Find similar notes using vector similarity
  const query = `
    SELECT 
      id, 
      title, 
      content, 
      tags, 
      created_at,
      1 - (embedding <=> $1) as score
    FROM notes
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> $1
    LIMIT $2
  `;
  
  const values = [pgvector.toSql(textEmbedding), limit];
  const result = await pool.query(query, values);
  
  return result.rows;
}
