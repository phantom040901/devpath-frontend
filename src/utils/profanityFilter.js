// src/utils/profanityFilter.js
// Profanity Filter - Blocks inappropriate language

/**
 * List of prohibited words (expandable)
 * Note: This is a basic list. You can expand it or use a library like 'bad-words' for more coverage
 */
const PROFANITY_LIST = [
  // Common profanity
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'hell', 'crap',
  'bastard', 'asshole', 'dick', 'cock', 'pussy', 'whore',
  'slut', 'fag', 'nigger', 'nigga', 'retard', 'retarded',

  // Variations and l33t speak
  'f*ck', 'sh*t', 'b*tch', 'a**', 'f u c k', 's h i t',
  'fuk', 'fck', 'shyt', 'azz', 'arse', 'biatch', 'biotch',

  // Filipino/Tagalog profanity
  'putangina', 'gago', 'tangina', 'bobo', 'tanga', 'puta',
  'tarantado', 'ulol', 'inutil', 'leche', 'pakyu',
  'punyeta', 'hayop', 'shet', 'peste', 'yawa',

  // Bisaya/Cebuano profanity
  'yawa', 'pisti', 'atay', 'bilat', 'buang', 'bugo',

  // Offensive/discriminatory terms
  'rape', 'kill yourself', 'kys', 'die', 'suicide',

  // Spam/scam indicators
  'click here', 'buy now', 'limited offer', 'act now',
  'congratulations you won', 'claim your prize',

  // Add more as needed
];

/**
 * Check if text contains profanity
 * @param {string} text - Text to check
 * @returns {object} - { isClean: boolean, detectedWords: array }
 */
export function checkProfanity(text) {
  if (!text || typeof text !== 'string') {
    return { isClean: true, detectedWords: [] };
  }

  const normalizedText = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();

  const detectedWords = [];

  // Check each word in the profanity list
  for (const badWord of PROFANITY_LIST) {
    const pattern = new RegExp(`\\b${badWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');

    if (pattern.test(normalizedText) || normalizedText.includes(badWord)) {
      detectedWords.push(badWord);
    }
  }

  return {
    isClean: detectedWords.length === 0,
    detectedWords: detectedWords
  };
}

/**
 * Sanitize text by replacing profanity with asterisks
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
export function sanitizeText(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let sanitized = text;

  for (const badWord of PROFANITY_LIST) {
    const pattern = new RegExp(badWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const replacement = '*'.repeat(badWord.length);
    sanitized = sanitized.replace(pattern, replacement);
  }

  return sanitized;
}

/**
 * Validate message before sending
 * @param {string} text - Message text
 * @param {string} type - Message type ('message' or 'announcement')
 * @returns {object} - { isValid: boolean, error: string }
 */
export function validateMessage(text, type = 'message') {
  // Check if empty
  if (!text || !text.trim()) {
    return {
      isValid: false,
      error: `${type === 'announcement' ? 'Announcement' : 'Message'} cannot be empty.`
    };
  }

  // Check minimum length
  if (text.trim().length < 2) {
    return {
      isValid: false,
      error: `${type === 'announcement' ? 'Announcement' : 'Message'} is too short.`
    };
  }

  // Check maximum length
  const maxLength = type === 'announcement' ? 1000 : 500;
  if (text.length > maxLength) {
    return {
      isValid: false,
      error: `${type === 'announcement' ? 'Announcement' : 'Message'} is too long (max ${maxLength} characters).`
    };
  }

  // Check for profanity
  const profanityCheck = checkProfanity(text);
  if (!profanityCheck.isClean) {
    return {
      isValid: false,
      error: `Your ${type} contains inappropriate language. Please remove offensive words and try again.`
    };
  }

  // Check for excessive caps (spam indicator)
  const capsPercentage = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsPercentage > 0.7 && text.length > 10) {
    return {
      isValid: false,
      error: 'Please avoid using excessive capital letters.'
    };
  }

  // Check for repeated characters (spam indicator)
  if (/(.)\1{5,}/.test(text)) {
    return {
      isValid: false,
      error: 'Please avoid repeating characters excessively.'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Get a user-friendly error message for profanity detection
 * @param {array} detectedWords - Array of detected profane words
 * @returns {string} - User-friendly error message
 */
export function getProfanityErrorMessage(detectedWords) {
  if (!detectedWords || detectedWords.length === 0) {
    return 'Your message contains inappropriate language.';
  }

  return `⚠️ Inappropriate Language Detected\n\nYour message was blocked because it contains offensive or inappropriate words. Please revise your message and maintain respectful communication.\n\nDevPath promotes a safe and professional environment for all users.`;
}

/**
 * Log profanity attempts (for admin monitoring)
 * @param {string} userId - User ID
 * @param {string} text - Attempted message
 * @param {array} detectedWords - Detected profane words
 */
export function logProfanityAttempt(userId, text, detectedWords) {
  const timestamp = new Date().toISOString();
  console.warn('🚫 Profanity Filter Triggered:', {
    timestamp,
    userId,
    detectedWords,
    messagePreview: text.substring(0, 50) + (text.length > 50 ? '...' : '')
  });

  // You could also send this to Firestore for admin monitoring
  // This is optional and can be implemented if needed
}

export default {
  checkProfanity,
  sanitizeText,
  validateMessage,
  getProfanityErrorMessage,
  logProfanityAttempt
};
