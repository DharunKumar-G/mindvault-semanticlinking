import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Embedding model - text-embedding-3-small produces 1536-dimensional vectors
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 1536;

/**
 * Generate embedding vector for a given text
 * @param {string} text - The text to embed
 * @returns {Promise<number[]>} - The embedding vector
 */
export async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts
 * @param {string[]} texts - Array of texts to embed
 * @returns {Promise<number[][]>} - Array of embedding vectors
 */
export async function generateBatchEmbeddings(texts) {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts,
      encoding_format: 'float',
    });

    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('Error generating batch embeddings:', error);
    throw error;
  }
}

export { EMBEDDING_MODEL, EMBEDDING_DIMENSIONS };
