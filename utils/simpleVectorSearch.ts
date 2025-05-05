import natural from 'natural';

// Initialize TF-IDF vectorizer
const vectorizer = new natural.TfIdf();

// Function to add a document to the vectorizer
export function addDocument(id: string, text: string) {
  vectorizer.addDocument(text);
  return id;
}

// Function to search for similar documents
export function searchSimilar(query: string, topK: number = 5) {
  // Add the query as a document
  vectorizer.addDocument(query);
  
  // Get the document vectors
  const vectors = vectorizer.documents;
  
  // Calculate similarity scores
  const scores = vectors.map((vector, index) => {
    // Skip the query document (last one)
    if (index === vectors.length - 1) return { id: 'query', score: 0 };
    
    // Calculate cosine similarity
    const similarity = natural.CosineSimilarity(vector, vectors[vectors.length - 1]);
    
    return {
      id: index.toString(),
      score: similarity
    };
  });
  
  // Sort by score and get top K
  const topResults = scores
    .filter(item => item.id !== 'query')
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  
  // Remove the query document
  vectorizer.documents.pop();
  
  return topResults;
}

// Function to create a text representation of a user
export function userToText(user: any) {
  return `
    ${user.name}
    ${user.interests.join(' ')}
    ${user.personality}
    ${user.bio}
    ${user.career.current}
    ${user.career.skills.join(' ')}
  `.toLowerCase();
} 