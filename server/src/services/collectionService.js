import pool from '../config/database.js';

/**
 * Get all collections
 * @returns {Promise<Array>} - Array of collections
 */
export async function getAllCollections() {
  const query = `
    SELECT c.*, COUNT(n.id) as note_count
    FROM collections c
    LEFT JOIN notes n ON c.id = n.collection_id
    GROUP BY c.id
    ORDER BY c.name ASC
  `;
  
  const result = await pool.query(query);
  return result.rows;
}

/**
 * Get a collection by ID with its notes
 * @param {number} id - Collection ID
 * @returns {Promise<Object>} - Collection with notes
 */
export async function getCollectionById(id) {
  const collectionQuery = 'SELECT * FROM collections WHERE id = $1';
  const collectionResult = await pool.query(collectionQuery, [id]);
  
  if (collectionResult.rows.length === 0) {
    return null;
  }
  
  const notesQuery = `
    SELECT id, title, content, tags, created_at, updated_at
    FROM notes
    WHERE collection_id = $1
    ORDER BY created_at DESC
  `;
  const notesResult = await pool.query(notesQuery, [id]);
  
  return {
    ...collectionResult.rows[0],
    notes: notesResult.rows
  };
}

/**
 * Create a new collection
 * @param {Object} data - Collection data { name, description, color }
 * @returns {Promise<Object>} - Created collection
 */
export async function createCollection(data) {
  const { name, description, color = 'slate' } = data;
  
  const query = `
    INSERT INTO collections (name, description, color, created_at, updated_at)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING *
  `;
  
  const result = await pool.query(query, [name, description, color]);
  return result.rows[0];
}

/**
 * Update a collection
 * @param {number} id - Collection ID
 * @param {Object} data - Data to update
 * @returns {Promise<Object>} - Updated collection
 */
export async function updateCollection(id, data) {
  const { name, description, color } = data;
  
  const query = `
    UPDATE collections
    SET name = $1, description = $2, color = $3, updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *
  `;
  
  const result = await pool.query(query, [name, description, color, id]);
  return result.rows[0];
}

/**
 * Delete a collection (notes will be moved to null collection)
 * @param {number} id - Collection ID
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteCollection(id) {
  const query = 'DELETE FROM collections WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rowCount > 0;
}

/**
 * Move note to collection
 * @param {number} noteId - Note ID
 * @param {number|null} collectionId - Collection ID (null for no collection)
 * @returns {Promise<boolean>} - Success status
 */
export async function moveNoteToCollection(noteId, collectionId) {
  const query = 'UPDATE notes SET collection_id = $1 WHERE id = $2';
  const result = await pool.query(query, [collectionId, noteId]);
  return result.rowCount > 0;
}
