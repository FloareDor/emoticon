import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();
    
    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are a compassionate emotional support AI, specialized in helping people with avoidant attachment styles.
      Your role is to help users identify, understand, and feel comfortable with their emotions.
      
      Context: ${context || 'No specific context provided'}
      User message: ${message}
      
      Please respond with:
      1. A gentle acknowledgment of their feelings
      2. Help them identify specific emotions they might be experiencing
      3. Provide a safe space for them to explore these emotions
      4. Offer gentle guidance on how to process these emotions
      
      Keep your response warm, non-judgmental, and supportive. Avoid giving direct advice unless specifically asked.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error in emotions API:', error);
    return NextResponse.json(
      { error: 'Failed to process emotion request' },
      { status: 500 }
    );
  }
} 