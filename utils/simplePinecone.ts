import { Pinecone } from '@pinecone-database/pinecone';

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

// Get the index
const index = pinecone.index(process.env.PINECONE_INDEX!);

// Simple function to create a vector from text
// This is a very basic approach - in production you'd use a proper embedding model
function textToVector(text: string): number[] {
  // Convert text to lowercase and split into words
  const words = text.toLowerCase().split(/\s+/);
  
  // Create a simple hash-based vector (1536 dimensions to match OpenAI's embedding size)
  const vector = new Array(1536).fill(0);
  
  // Fill the vector with simple hash values based on words
  words.forEach((word, i) => {
    // Simple hash function
    let hash = 0;
    for (let j = 0; j < word.length; j++) {
      hash = ((hash << 5) - hash) + word.charCodeAt(j);
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Use the hash to set values in the vector
    // Set multiple positions for each word to increase match sensitivity
    for (let k = 0; k < 3; k++) {
      const position = (Math.abs(hash) + k * 100) % 1536;
      vector[position] = 1;
    }
    
    // Also set positions for substrings to catch partial matches
    if (word.length > 3) {
      for (let start = 0; start < word.length - 2; start++) {
        const substring = word.substring(start, start + 3);
        let subHash = 0;
        for (let j = 0; j < substring.length; j++) {
          subHash = ((subHash << 5) - subHash) + substring.charCodeAt(j);
          subHash = subHash & subHash;
        }
        const position = Math.abs(subHash) % 1536;
        vector[position] = 1;
      }
    }
  });
  
  return vector;
}

// Function to search for similar users
export async function searchSimilarUsers(query: string, topK: number = 10) {
  // Create a vector from the query
  const queryVector = textToVector(query);
  
  // Search in Pinecone
  const searchResponse = await index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
  });
  
  return searchResponse.matches || [];
}

// Function to index a user
export async function indexUser(user: any) {
  // Create a text representation of the user
  const userText = `
    ${user.name}
    ${user.interests.join(' ')}
    ${user.personality}
    ${user.bio}
    ${user.career.current}
    ${user.career.skills.join(' ')}
  `;
  
  // Create a vector from the user text
  const vector = textToVector(userText);
  
  // Upsert to Pinecone
  await index.upsert([{
    id: user.id.toString(),
    values: vector,
    metadata: {
      name: user.name,
      interests: user.interests,
      personality: user.personality,
      bio: user.bio,
      career: user.career,
      photo: user.photo,
    }
  }]);
} 