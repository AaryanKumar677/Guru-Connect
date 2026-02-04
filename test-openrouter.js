const API_KEY = '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';

async function testApi() {
    console.log("Testing Chat Completion with google/gemma-3-12b-it:free...");
    const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

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
                "model": "google/gemma-3-12b-it:free",
                "messages": [
                    { "role": "user", "content": "Say 'API Working' if you see this." }
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
            if (data.choices && data.choices.length > 0) {
                console.log("Response:", data.choices[0].message.content);
            } else {
                console.log("Full response:", JSON.stringify(data, null, 2));
            }
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

testApi();
