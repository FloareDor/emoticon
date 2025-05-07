import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { message, level } = await request.json();

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert in emotional intelligence and relationship communication.
    
    Analyze this message from a friend: "${message}"
    
    Identify the emotions present in this message (2-3 primary emotions).
    
    You're helping someone practice emotional intelligence. They need to identify the emotions in this message and respond with empathy.
    
    Based on the message, provide:
    1. The primary emotions present in the message (2-3 emotions)
    2. A list of 6 possible emotions that could be identified in the message:
       - Include the correct emotions from #1
       - Add plausible but incorrect emotions that someone might mistakenly identify
       - Make sure the incorrect emotions are somewhat related to the context
    3. 3 empathetic response examples that:
       - Validate the emotions expressed
       - Show understanding and support
       - Use natural, conversational language
       - Match the complexity level (level ${level} where 1 is beginner, 2 is intermediate, 3 is advanced)
    
    Format your response exactly like this:
    Correct Emotions: [comma-separated list of 2-3 primary emotions]
    Possible Emotions: [comma-separated list of 6 emotions including correct ones]
    Response 1: [first suggested response]
    Response 2: [second suggested response]
    Response 3: [third suggested response]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response
    const correctEmotionsMatch = text.match(/Correct Emotions: (.*?)(?=\nPossible Emotions:|$)/s);
    const possibleEmotionsMatch = text.match(/Possible Emotions: (.*?)(?=\nResponse|$)/s);
    const responsesMatch = text.match(/Response \d+: (.*?)(?=\nResponse \d+:|$)/gs);

    if (!correctEmotionsMatch || !possibleEmotionsMatch || !responsesMatch) {
      throw new Error('Failed to parse AI response');
    }

    const correctEmotions = correctEmotionsMatch[1]
      .split(',')
      .map(e => e.trim().toLowerCase());

    const possibleEmotions = possibleEmotionsMatch[1]
      .split(',')
      .map(e => e.trim().toLowerCase());

    const suggestedResponses = responsesMatch
      .map(r => r.replace(/Response \d+: /, '').trim());

    return NextResponse.json({
      id: Date.now().toString(),
      text: message,
      correctEmotions,
      possibleEmotions,
      suggestedResponses,
      level
    });
  } catch (error) {
    console.error('Error analyzing custom message:', error);
    return NextResponse.json(
      { error: 'Failed to analyze message' },
      { status: 500 }
    );
  }
} 