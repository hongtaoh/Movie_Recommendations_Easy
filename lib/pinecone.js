import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export async function pineconeSearch(
    embedding, k = 5, indexName = process.env.PINECONE_INDEX_NAME) {
  const index = pinecone.index(indexName);
  
  const queryResponse = await index.query({
    vector: embedding,
    topK: k,
    includeMetadata: true,
    includeValues: false, // Set to true if wanting vectors back
  });
  
  return queryResponse.matches.map(item => ({
    id: item.id,
    title: item.metadata?.title,
    overview: item.metadata?.overview,
    revenue: item.metadata?.revenue,
    poster_path: item.metadata?.poster_path,
    score: item.score
  }))
}