import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Predefined categories for auto-categorization
const AVAILABLE_TAGS = [
  'Travel',
  'Health',
  'Work',
  'Personal',
  'Ideas',
  'Learning',
  'Goals',
  'Memories',
  'Finance',
  'Relationships',
  'Creativity',
  'Wellness',
  'Technology',
  'Food',
  'Entertainment',
  'Nature',
  'Gratitude',
  'Reflection'
];

/**
 * Auto-categorize a note based on its content using Gemini AI
 * @param {string} content - The note content to categorize
 * @returns {Promise<string[]>} - Array of suggested tags
 */
export async function categorizeNote(content) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `You are a note categorization assistant. Given a note, suggest 1-3 relevant tags from this list: ${AVAILABLE_TAGS.join(', ')}.

Return ONLY a JSON array of tag strings, nothing else. Example: ["Travel", "Memories"]

If none fit well, return an empty array: []

Note to categorize: "${content}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    try {
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      const tags = JSON.parse(cleanText);
      // Filter to only include valid tags
      return tags.filter(tag => AVAILABLE_TAGS.includes(tag));
    } catch {
      console.warn('Failed to parse tags response:', text);
      return [];
    }
  } catch (error) {
    console.error('Error categorizing note with Gemini:', error);
    return [];
  }
}

/**
 * Generate a brief summary of a note using Gemini
 * @param {string} content - The note content
 * @returns {Promise<string>} - Brief summary
 */
export async function generateSummary(content) {
  try {
    if (content.length < 100) {
      return content;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Generate a brief 1-sentence summary of the following note. Be concise.\n\n${content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating summary with Gemini:', error);
    return content.substring(0, 100) + '...';
  }
}

export { AVAILABLE_TAGS };
