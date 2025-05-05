import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: process.env.PINECONE_ENVIRONMENT!,
});

// Get the index
const index = pinecone.index(process.env.PINECONE_INDEX!);

// Function to generate embeddings
export async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

// Function to search for similar users
export async function searchSimilarUsers(query: string, topK: number = 5) {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);
  
  // Search in Pinecone
  const searchResponse = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  });
  
  return searchResponse.matches || [];
}

// Function to index a user
export async function indexUser(user: any) {
  // Create a text representation of the user for embedding
  const userText = `
    ${user.name}
    ${user.interests.join(', ')}
    ${user.personality}
    ${user.bio}
    ${user.career.current}
    ${user.career.skills.join(', ')}
  `;
  
  // Generate embedding
  const embedding = await generateEmbedding(userText);
  
  // Upsert to Pinecone
  await index.upsert({
    vectors: [{
      id: user.id.toString(),
      values: embedding,
      metadata: {
        name: user.name,
        interests: user.interests,
        personality: user.personality,
        bio: user.bio,
        career: user.career,
        photo: user.photo,
      }
    }]
  });
} 