import { OpenRouter } from "@openrouter/sdk";

const API_KEY = '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';

const openrouter = new OpenRouter({
    apiKey: API_KEY
});

async function testSdk() {
    console.log("Testing OpenRouter SDK with model: google/gemma-2-9b-it:free");
    try {
        const stream = await openrouter.chat.send({
            model: "google/gemma-2-9b-it:free",
            messages: [
                {
                    role: "user",
                    content: "What is 2 + 2? Answer in one word."
                }
            ],
            stream: true
        });

        console.log("Stream started...");
        let response = "";

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                process.stdout.write(content);
                response += content;
            }
        }
        console.log("\n\nTest Complete. Full response received.");

    } catch (e) {
        console.error("SDK Error:", e);
    }
}

testSdk();
