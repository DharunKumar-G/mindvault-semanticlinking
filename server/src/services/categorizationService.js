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
 * @param {string} title - The note title (optional)
 * @returns {Promise<string>} - Brief summary
 */
export async function summarizeNote(content, title = '') {
  try {
    if (content.length < 100) {
      return content;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Generate a concise, informative summary of the following note in 2-3 sentences. Capture the main points and key ideas.

${title ? `Title: ${title}\n\n` : ''}Content: ${content}

Summary:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error summarizing note with Gemini:', error);
    return content.substring(0, 150) + '...';
  }
}

/**
 * Generate a brief summary of a note using Gemini (legacy method)
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

/**
 * Get AI-powered writing suggestions for improving note content
 * @param {string} content - The current note content
 * @param {string} title - The note title (optional)
 * @returns {Promise<Array>} - Array of suggestion objects
 */
export async function getWritingSuggestions(content, title = '') {
  try {
    if (!content || content.length < 100) {
      return [];
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `You are a helpful writing assistant. Analyze the following note and suggest 2-3 specific improvements to make it clearer, more structured, or more detailed. Be concise and actionable.

${title ? `Title: ${title}\n\n` : ''}Content: ${content}

Return ONLY a JSON array of objects with this format:
[
  {
    "type": "clarity|structure|detail|grammar",
    "suggestion": "specific suggestion text here"
  }
]

Keep each suggestion under 80 characters. Focus on the most impactful improvements.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    try {
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      const suggestions = JSON.parse(cleanText);
      
      // Validate and limit to 3 suggestions
      if (Array.isArray(suggestions)) {
        return suggestions
          .filter(s => s.type && s.suggestion)
          .slice(0, 3);
      }
      return [];
    } catch {
      console.warn('Failed to parse suggestions response:', text);
      return [];
    }
  } catch (error) {
    console.error('Error getting writing suggestions with Gemini:', error);
    return [];
  }
}

export { AVAILABLE_TAGS };
