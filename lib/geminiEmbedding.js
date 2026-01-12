// lib/gemini.js
export async function getGeminiEmbedding(text) {
    // 1. Updated to v1beta, which supports gemini-embedding-001
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            taskType: "RETRIEVAL_QUERY",
            content: {
                parts: [{ text }]
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching embedding:", errorData);
        // Better error reporting for debugging
        throw new Error(`API error ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // Note: The structure is data.embedding.values
    return data.embedding.values;
}