import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { context, complexity, level, mode, intensity } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert in emotional intelligence and relationship communication. 
    Generate a realistic, natural-sounding message for level ${level} that demonstrates ${complexity} emotional complexity.
    
    Mode: ${mode}
    Intensity: ${intensity}
    
    For level 1 (Beginner):
    - Keep messages short and casual (1-2 sentences)
    - Use simple, everyday language
    - Emotions should be more obvious but not explicitly stated
    - Focus on basic, clear emotional situations
    - Avoid complex emotional dynamics
    
    For level 2 (Intermediate):
    - Medium length messages (2-3 sentences)
    - More nuanced language
    - Emotions might be implied through context
    - Include some emotional complexity
    - Can involve mixed feelings
    
    For level 3 (Advanced):
    - Can be longer (3-4 sentences)
    - More complex emotional expressions
    - Mixed or subtle emotions
    - Include layered emotional dynamics
    - Can involve conflicting feelings
    
    Mode Guidelines:
    - Positive mode: Focus on uplifting, encouraging, or happy emotions
    - Negative mode: Focus on challenging, difficult, or sad emotions
      * Use natural, varied expressions of negative emotions
      * Avoid starting messages with interjections like "Ugh" or "Oh"
      * Express negative emotions through context and situation
      * Use subtle cues and implications rather than direct statements
      * Vary the way negative emotions are expressed
      * Consider different cultural and personal expression styles
    
    Intensity Guidelines:
    - Mild: Subtle emotional expressions, gentle language
    - Moderate: Clear emotional expressions, balanced language
    - Intense: Strong emotional expressions, powerful language
    
    General guidelines:
    - Sound like how real people actually talk
    - Use casual language and contractions
    - Include realistic emotional expressions
    - Be specific about the situation
    - Show vulnerability naturally
    - Keep it authentic and relatable
    - Adjust emotional intensity based on the selected mode and intensity level
    - Create unique, varied scenarios - avoid generic examples
    - Use different contexts and situations for each message
    - Vary the emotional triggers and circumstances
    - Include specific details that make the situation feel real
    - Avoid cliché or overused emotional expressions
    
    After generating the message, provide:
    1. The primary emotions present in the message (2-3 emotions)
    2. A list of 6 possible emotions that could be identified in the message:
       - Include the correct emotions from #1
       - Add 3-4 plausible but incorrect emotions that someone might mistakenly identify
       - Make sure the incorrect emotions are somewhat related to the context
    3. 3 empathetic response examples that:
       - Validate the emotions expressed
       - Show understanding and support
       - Use natural, conversational language
       - Match the complexity level of the message
       - If the message is in Telugu, provide responses in Telugu with a casual, friendly tone
    
    Format your response exactly like this:
    Message: [the practice message]
    Correct Emotions: [comma-separated list of 2-3 primary emotions]
    Possible Emotions: [comma-separated list of 6 emotions including correct ones]
    Response 1: [first suggested response]
    Response 2: [second suggested response]
    Response 3: [third suggested response]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response
    const messageMatch = text.match(/Message: (.*?)(?=\nCorrect Emotions:|$)/s);
    const correctEmotionsMatch = text.match(/Correct Emotions: (.*?)(?=\nPossible Emotions:|$)/s);
    const possibleEmotionsMatch = text.match(/Possible Emotions: (.*?)(?=\nResponse|$)/s);
    const responsesMatch = text.match(/Response \d+: (.*?)(?=\nResponse \d+:|$)/gs);

    if (!messageMatch || !correctEmotionsMatch || !possibleEmotionsMatch || !responsesMatch) {
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
      text: messageMatch[1].trim(),
      correctEmotions,
      possibleEmotions,
      suggestedResponses,
      level
    });
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    );
  }
} 