// app/api/recommend/route.js 

import { NextResponse } from "next/server";
import { getGeminiEmbedding } from "@/lib/geminiEmbedding";
import { qdrantSearch } from "@/lib/qdrant";
import { generateExplanation } from "@/lib/explain";

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
        const qdrantResults = await qdrantSearch(embedding, 5);
        const explanation = await generateExplanation(query, qdrantResults, model)

        return NextResponse.json({ movies: qdrantResults, explanation})
    } catch (error) {
        return NextResponse.json(
          { error: error.message || "Recommendation failed" },
          { status: 500 }
        );
      }
    }