import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Gemini embedding model - text-embedding-004 produces 768-dimensional vectors
const EMBEDDING_MODEL = 'text-embedding-004';
const EMBEDDING_DIMENSIONS = 768;

/**
 * Generate embedding vector for a given text using Gemini
 * @param {string} text - The text to embed
 * @returns {Promise<number[]>} - The embedding vector
 */
export async function generateEmbedding(text) {
  try {
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    
    return embedding.values;
  } catch (error) {
    console.error('Error generating embedding with Gemini:', error);
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
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    
    // Gemini processes embeddings one at a time, so we batch manually
    const embeddings = await Promise.all(
      texts.map(async (text) => {
        const result = await model.embedContent(text);
        return result.embedding.values;
      })
    );
    
    return embeddings;
  } catch (error) {
    console.error('Error generating batch embeddings with Gemini:', error);
    throw error;
  }
}

export { EMBEDDING_MODEL, EMBEDDING_DIMENSIONS };
