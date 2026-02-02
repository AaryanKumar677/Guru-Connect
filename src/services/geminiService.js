/**
 * OpenRouter AI Integration Service
 * 
 * This service provides methods to interact with OpenRouter API (using Google Gemma model).
 * Uses API Key from environment or fallback.
 */

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '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'
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const SITE_URL = 'http://localhost:5173' // Localhost for dev, update for prod
const SITE_NAME = 'GuruConnect'

/**
 * Send a message to OpenRouter AI and get a response
 * @param {string} prompt - The user's question or prompt
 * @param {Array} history - Previous conversation history (optional)
 * @returns {Promise<string>} - The AI's response
 */
export const sendToGemini = async (prompt, history = []) => {
    try {
        // Format messages for OpenAI-compatible API
        const messages = [
            // Conversation history
            ...history.map(msg => ({
                role: msg.type === 'bot' ? 'assistant' : 'user',
                content: msg.content
            })),
            // Current prompt with system instruction integrated
            {
                role: 'user',
                content: `(System: You are an educational AI assistant helping students learn. Be helpful, clear, and explain concepts step by step.)\n\n${prompt}`
            }
        ]

        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': SITE_URL,
                'X-Title': SITE_NAME,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "model": "google/gemma-3-27b-it:free",
                "messages": messages
            })
        })

        if (!response.ok) {
            const errText = await response.text().catch(() => 'No error text')
            console.error('OpenRouter API Response Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errText
            })
            // Parse JSON error if possible
            try {
                const errJson = JSON.parse(errText)
                if (errJson.error) {
                    throw new Error(`API Error: ${errJson.error.message || response.status}`)
                }
            } catch (e) {
                // Ignore parse error
            }

            throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        if (data.choices && data.choices[0]?.message?.content) {
            return data.choices[0].message.content
        }

        throw new Error('No response from AI')
    } catch (error) {
        console.error('OpenRouter/AI API Error:', error)
        throw error
    }
}

/**
 * Check if the API key is configured
 * @returns {boolean}
 */
export const isApiConfigured = () => {
    return !!OPENROUTER_API_KEY && OPENROUTER_API_KEY !== 'YOUR_API_KEY_HERE'
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
        dailyLimit: 20, // Increased limit for demo
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
