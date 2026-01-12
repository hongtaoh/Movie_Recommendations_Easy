// app/api/recommend/route.js 

import { NextResponse } from "next/server";
import { getGeminiEmbedding } from "@/lib/geminiEmbedding";
import { pineconeSearch } from "@/lib/pinecone";
import { generateExplanation } from "@/lib/explain";

// POST here because we are sending query, and results to LLM to get the explanation
export async function POST(req) {
    try {
        const {query, model} = await req.json();

        if (!['gemini', 'deepseek'].includes(model)) {
            return NextResponse.json(
                {'error': "Invalid model selection"},
                { status: 400 }
            );
        }

        const embedding = await getGeminiEmbedding(query);
        const pineconeResults = await pineconeSearch(embedding, 5);
        const explanation = await generateExplanation(query, pineconeResults, model)

        return NextResponse.json({ movies: pineconeResults, explanation})
    } catch (error) {
        return NextResponse.json(
          { error: error.message || "Recommendation failed" },
          { status: 500 }
        );
      }
    }