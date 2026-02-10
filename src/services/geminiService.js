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
        console.log("Sending request to OpenRouter (gpt-oss-120b)....");

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

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                fullResponse += content;
            }
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

        if (err.message && err.message.includes("404")) {
            throw new Error("Model not found or unavailable. Please check API key/permissions.");
        } else if (err.message && err.message.includes("429")) {
            throw new Error("Rate limit exceeded. Please try again in a moment.");
        }

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
