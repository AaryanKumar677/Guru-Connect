/**
 * OpenRouter AI Integration Service
 * 
 * This service provides methods to interact with OpenRouter API (using Google Gemma model).
 * Uses API Key from environment or fallback.
 */

import { OpenRouter } from "@openrouter/sdk";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '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'
const SITE_URL = 'http://localhost:5173' // Localhost for dev, update for prod
const SITE_NAME = 'GuruConnect'

const openrouter = new OpenRouter({
    apiKey: OPENROUTER_API_KEY
});

/**
 * Send a message to OpenRouter AI and get a response
 * @param {string} prompt - The user's question or prompt
 * @param {Array} history - Previous conversation history (optional)
 * @returns {Promise<string>} - The AI's response
 */
export const sendToGemini = async (prompt, history = []) => {
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
    ];

    try {
        console.log("Sending request to OpenRouter (gpt-oss-120b)....");

        // Stream the response
        const stream = await openrouter.chat.send({
            model: "google/gemma-3-12b-it:free",
            messages: messages,
            stream: true,
            headers: {
                'HTTP-Referer': SITE_URL,
                'X-Title': SITE_NAME,
            }
        });

        let fullResponse = "";

        // Consume the stream
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                fullResponse += content;
            }
            // Usage information comes in the final chunk if available
            if (chunk.usage) {
                console.log("Reasoning tokens:", chunk.usage.reasoningTokens);
            }
        }

        if (!fullResponse) {
            throw new Error("Empty response from AI service");
        }

        return fullResponse;

    } catch (err) {
        console.error("OpenRouter SDK Error:", err);

        // Fallback or re-throw friendlier error
        if (err.message && err.message.includes("404")) {
            throw new Error("Model not found or unavailable. Please check API key/permissions.");
        } else if (err.message && err.message.includes("429")) {
            throw new Error("Rate limit exceeded. Please try again in a moment.");
        }

        throw err;
    }
};

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
