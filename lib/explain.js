// lib/explain.js

import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatDeepSeek } from "@langchain/deepseek";
import {ChatGoogleGenerativeAI } from '@langchain/google-genai';

const MODEL_CONFIG = {
    gemini: {
        class: ChatGoogleGenerativeAI,
        options: {
            apiKey: process.env.GEMINI_API_KEY,
            model: "gemini-1.5-flash-latest",
            temperature: 0.7
        }
    },
    deepseek: {
        class: ChatDeepSeek,
        options: {
            apiKey: process.env.DEEPSEEK_API_KEY,
            // model: "deepseek-chat"
            model: "deepseek-reasoner"
        }
    }
};

export async function generateExplanation(query, movies, modelName) {
    const movieDetails = movies 
    .map(m => `- ${m.title}: ${m.overview}`) 
    .join('\n');

    const selectedConfig = MODEL_CONFIG[modelName]
    const chatModel = new selectedConfig.class(selectedConfig.options);

    const prompt = ChatPromptTemplate.fromMessages([
        ['system', "You are a helpful movie recommendation assistant."],
        ['user', `Explain in 2-3 sentences why these movies match the query "{query}".
            Consider both titles and plot details. Use everyday language. 

            Query: {query}
            Movies: {movies}`]
    ]);

    const chain = prompt.pipe(chatModel);
    const response = await chain.invoke({
        query: query,
        movies: movieDetails
    });
    return response.content;
}