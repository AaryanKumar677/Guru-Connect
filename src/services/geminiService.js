import { OpenRouter } from "@openrouter/sdk";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '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'
const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
const SITE_NAME = 'GuruConnect'

const openrouter = new OpenRouter({
    apiKey: OPENROUTER_API_KEY
});

export const sendToGemini = async (prompt, history = []) => {
    const messages = [
        ...history.map(msg => ({
            role: msg.type === 'bot' ? 'assistant' : 'user',
            content: msg.content
        })),
        {
            role: 'user',
            content: `(System: You are an educational AI assistant helping students learn. Be helpful, clear, and explain concepts step by step.)\n\n${prompt}`
        }
    ];

    try {
        console.log("Sending request to OpenRouter (gemma-3-12b-it:free)....");

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': SITE_URL,
                'X-Title': SITE_NAME,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "model": "google/gemma-3-12b-it:free",
                "messages": messages,
                "temperature": 0.7,
                "top_p": 1,
                "repetition_penalty": 1
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`OpenRouter Error Result (${response.status}):`, errorText);

            if (response.status === 404) {
                throw new Error("Model not found or unavailable. Please check API key/permissions.");
            } else if (response.status === 429) {
                throw new Error("Rate limit exceeded. Please try again in a moment.");
            }
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.choices || data.choices.length === 0 || !data.choices[0].message?.content) {
            throw new Error("Empty or invalid response from AI service");
        }

        return data.choices[0].message.content;

    } catch (err) {
        console.error("Gemini Service Error:", err);
        throw err;
    }
};

export const isApiConfigured = () => {
    return !!OPENROUTER_API_KEY && OPENROUTER_API_KEY !== 'YOUR_API_KEY_HERE'
}

export const getUsageStats = () => {
    const stored = localStorage.getItem('gemini_usage')
    if (stored) {
        return JSON.parse(stored)
    }
    return {
        queriesUsed: 0,
        dailyLimit: 20,
        resetTime: new Date().setHours(24, 0, 0, 0)
    }
}

export const incrementUsage = () => {
    const stats = getUsageStats()

    if (Date.now() > stats.resetTime) {
        stats.queriesUsed = 0
        stats.resetTime = new Date().setHours(24, 0, 0, 0)
    }

    stats.queriesUsed++
    localStorage.setItem('gemini_usage', JSON.stringify(stats))
    return stats
}

export const canMakeQuery = () => {
    const stats = getUsageStats()

    if (Date.now() > stats.resetTime) {
        return true
    }

    return stats.queriesUsed < stats.dailyLimit
}

export const getRemainingQueries = () => {
    const stats = getUsageStats()

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
