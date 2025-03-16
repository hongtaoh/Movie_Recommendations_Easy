// lib/gemini.js
export async function getGeminiEmbedding(text) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
            model: "models/text-embedding-004",
            content: {
                parts: [{ text }]
            }
        })
    });
    const data = await response.json();
    return data.embedding.values;
}