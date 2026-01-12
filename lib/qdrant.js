// lib/qdrant.js 
export async function qdrantSearch(embedding, topK=5) {
    const response = await fetch(`${process.env.QDRANT_URL}/collections/movies_genai/points/search`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'api-key': process.env.QDRANT_API_KEY
        },
        body: JSON.stringify({
            vector: embedding,
            limit: topK,
            with_payload: ['title', 'overview', 'revenue', 'poster_path'],
            with_vector: false
        })
    })

    if (!response.ok) throw new Error('Qdrant search failed');

    const data = await response.json()
    return data.result.map(item => ({
        id: item.id,
        title: item.payload.title,
        overview: item.payload.overview,
        revenue: item.payload.revenue,
        poster_path: item.payload.poster_path,
        score: item.score
    }));
}