// app/api/recommend/route.js 

import { NextResponse } from "next/server";
import movies from '@/data/movies.json';
import { getGeminiEmbedding } from "@/lib/geminiEmbedding";
import { qdrantSearch } from "@/lib/qdrant";
import { generateExplaination } from "@/lib/explain";

export async function POST(req) {
    try {
        const [query, model] = await req.json();

        if (!['gemini', 'deepseek'].includes(model)) {
            return NextResponse.json(
                {'error': "Invalid model selection"},
                { status: 400 }
            );
        }

        const embedding = await getGeminiEmbedding(query);
        const qdrantResults = await qdrantSearch(embedding, 5);
        const explantion = await generateExplaination(query, qdrantResults, model)

        return NextResponse.json({ movies, explantion})
    } catch (error) {
        return NextResponse.json(
          { error: error.message || "Recommendation failed" },
          { status: 500 }
        );
      }
    }