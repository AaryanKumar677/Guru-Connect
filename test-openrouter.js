// Retrying with native fetch (Node 18+)// If native fetch is available (Node 18+), we don't need require. 
// I'll try native fetch logic wrapped in a self-executing async function.

const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function testApi() {
    console.log("Testing OpenRouter API...");
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': 'http://localhost:5173',
                'X-Title': 'GuruConnect',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "model": "google/gemma-3-27b-it:free",
                "messages": [
                    { "role": "user", "content": "Say hello in one word." }
                ]
            })
        });

        if (!response.ok) {
            console.error(`Status: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Body:", text);
        } else {
            const data = await response.json();
            console.log("Success!");
            console.log("Response:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

testApi();
