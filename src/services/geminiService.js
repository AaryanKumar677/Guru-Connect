/**
 * Gemini API Integration Service
 * 
 * This service provides methods to interact with Google's Gemini AI API.
 * Replace GEMINI_API_KEY with your actual API key.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

/**
 * Send a message to Gemini AI and get a response
 * @param {string} prompt - The user's question or prompt
 * @param {Array} history - Previous conversation history (optional)
 * @returns {Promise<string>} - The AI's response
 */
export const sendToGemini = async (prompt, history = []) => {
    try {
        const contents = [
            // System instruction for educational context
            {
                role: 'user',
                parts: [{ text: 'You are an educational AI assistant helping students learn. Be helpful, clear, and explain concepts step by step. Use examples when possible.' }]
            },
            {
                role: 'model',
                parts: [{ text: 'I understand. I\'m here to help students learn. I\'ll explain concepts clearly with step-by-step explanations and examples.' }]
            },
            // Include conversation history
            ...history.map(msg => ({
                role: msg.type === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            })),
            // Current prompt
            {
                role: 'user',
                parts: [{ text: prompt }]
            }
        ]

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
                safetySettings: [
                    {
                        category: 'HARM_CATEGORY_HARASSMENT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_HATE_SPEECH',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    }
                ]
            })
        })

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text
        }

        throw new Error('No response from AI')
    } catch (error) {
        console.error('Gemini API Error:', error)
        throw error
    }
}

/**
 * Check if the API key is configured
 * @returns {boolean}
 */
export const isApiConfigured = () => {
    return GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_API_KEY_HERE'
}

/**
 * Get usage stats (mock implementation)
 * In production, this would track actual API usage
 */
export const getUsageStats = () => {
    const stored = localStorage.getItem('gemini_usage')
    if (stored) {
        return JSON.parse(stored)
    }
    return {
        queriesUsed: 0,
        dailyLimit: 10,
        resetTime: new Date().setHours(24, 0, 0, 0)
    }
}

/**
 * Increment usage counter
 */
export const incrementUsage = () => {
    const stats = getUsageStats()

    // Reset if new day
    if (Date.now() > stats.resetTime) {
        stats.queriesUsed = 0
        stats.resetTime = new Date().setHours(24, 0, 0, 0)
    }

    stats.queriesUsed++
    localStorage.setItem('gemini_usage', JSON.stringify(stats))
    return stats
}

/**
 * Check if user can make more queries
 * @returns {boolean}
 */
export const canMakeQuery = () => {
    const stats = getUsageStats()

    // Reset if new day
    if (Date.now() > stats.resetTime) {
        return true
    }

    return stats.queriesUsed < stats.dailyLimit
}

/**
 * Get remaining queries for today
 * @returns {number}
 */
export const getRemainingQueries = () => {
    const stats = getUsageStats()

    // Reset if new day
    if (Date.now() > stats.resetTime) {
        return stats.dailyLimit
    }

    return Math.max(0, stats.dailyLimit - stats.queriesUsed)
}

export default {
    sendToGemini,
    isApiConfigured,
    getUsageStats,
    incrementUsage,
    canMakeQuery,
    getRemainingQueries
}
