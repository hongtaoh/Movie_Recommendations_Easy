// app/api/search/route.js
// API endpoint: /api/search?q=your_query&k=5

import { NextResponse } from "next/server";
import { getGeminiEmbedding } from "@/lib/geminiEmbedding";
import { qdrantSearch } from "@/lib/qdrant";

export async function GET(request) {
    try {
        // Get query parameter from URL
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const k = Number(searchParams.get('k')) || 5; // Default to 5 movies

        // Validate query parameter
        if (!query) {
            return NextResponse.json(
                { error: "Missing query parameter 'q'" },
                { status: 400 }
            );
        }

        // Generate embedding for the query
        const embedding = await getGeminiEmbedding(query);
        
        // Search Qdrant with the embedding
        const searchResults = await qdrantSearch(embedding, k);

        // Return search results
        return NextResponse.json({ 
            query,
            results: searchResults,
            count: searchResults.length
        });
    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json(
            { error: error.message || "Search failed" },
            { status: 500 }
        );
    }
}