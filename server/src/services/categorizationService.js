import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
 * Auto-categorize a note based on its content using AI
 * @param {string} content - The note content to categorize
 * @returns {Promise<string[]>} - Array of suggested tags
 */
export async function categorizeNote(content) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a note categorization assistant. Given a note, suggest 1-3 relevant tags from this list: ${AVAILABLE_TAGS.join(', ')}. 
          
          Return ONLY a JSON array of tag strings, nothing else. Example: ["Travel", "Memories"]
          
          If none fit well, return an empty array: []`
        },
        {
          role: 'user',
          content: `Categorize this note: "${content}"`
        }
      ],
      temperature: 0.3,
      max_tokens: 100,
    });

    const result = response.choices[0].message.content.trim();
    
    try {
      const tags = JSON.parse(result);
      // Filter to only include valid tags
      return tags.filter(tag => AVAILABLE_TAGS.includes(tag));
    } catch {
      console.warn('Failed to parse tags response:', result);
      return [];
    }
  } catch (error) {
    console.error('Error categorizing note:', error);
    return [];
  }
}

/**
 * Generate a brief summary of a note
 * @param {string} content - The note content
 * @returns {Promise<string>} - Brief summary
 */
export async function generateSummary(content) {
  try {
    if (content.length < 100) {
      return content;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Generate a brief 1-sentence summary of the following note. Be concise.'
        },
        {
          role: 'user',
          content: content
        }
      ],
      temperature: 0.3,
      max_tokens: 50,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    return content.substring(0, 100) + '...';
  }
}

export { AVAILABLE_TAGS };
