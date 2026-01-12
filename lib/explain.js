// lib/explain.js

import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatDeepSeek } from "@langchain/deepseek";
import {ChatGoogleGenerativeAI } from '@langchain/google-genai';

const MODEL_CONFIG = {
    gemini: {
        class: ChatGoogleGenerativeAI,
        options: {
            // Use the stable 'gemini-2.5-flash' model
            model: "gemini-2.5-flash",
            apiKey: process.env.GEMINI_API_KEY,
            temperature: 0.7 // Keep a reasonable temperature for creative but grounded explanations
        }
    },
    deepseek: {
        class: ChatDeepSeek,
        options: {
            apiKey: process.env.DEEPSEEK_API_KEY,
            model: "deepseek-reasoner",
            temperature: 0.7,  // Added for consistency
            maxTokens: 500  // Added token limit
        }
    }
};

/**
 * Generates an explanation for why a set of movies match a given query.
 *
 * @param {string} query The user's search query.
 * @param {Array<{title: string, overview: string}>} movies An array of movie objects, each with a title and overview.
 * @param {string} modelName The name of the LLM to use ('gemini' or 'deepseek').
 * @returns {Promise<string>} A promise that resolves to the generated explanation string.
 */

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
            Movies: 
            {movies}`]
    ]);

    const chain = prompt.pipe(chatModel);
    try {
        const response = await chain.invoke({
            query: query,
            movies: movieDetails
        });
        return response.content;
    } catch (error) {
        console.error(`Error generating explanation with ${modelName} model:`, error);
        // You might want to return a default explanation or re-throw a custom error
        return "I apologize, but I couldn't generate an explanation for these movies at this time. Please try again later.";
    }
}