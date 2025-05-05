import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { originalMessage, identifiedEmotions, userResponse, level } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert in emotional intelligence and relationship communication.
    Analyze this emotional interaction and provide specific, constructive feedback:

    Original Message: "${originalMessage}"
    Identified Emotions: ${identifiedEmotions.join(', ')}
    User's Response: "${userResponse}"
    Level: ${level}

    Please provide:
    1. A rating from 1-5 based on:
       - How well they identified the emotions
       - How empathetic and supportive their response was
       - How natural and authentic their response sounded
       - How well they validated the other person's feelings
    2. Brief, specific feedback that:
       - Focuses on the emotional content and supportiveness
       - Acknowledges what they did well
       - Points out 1-2 areas for improvement
       - Suggests how to improve
       - Keeps it encouraging and constructive
    3. Three improved response suggestions that:
       - Build on the user's response style and language
       - Maintain the same level of formality/casualness
       - Keep the same language if the user wrote in Telugu
       - Show different ways to improve their response
       - Focus on better emotional validation and support
    4. Keep the feedback concise (2-3 sentences max)
    5. Do not comment on language choice - focus on emotional content
    6. If the response is in Telugu, keep the feedback in English but make it more casual and friendly
    7. For Telugu responses, consider cultural context and casual speech patterns

    Format your response exactly like this:
    Rating: [number 1-5]
    Feedback: [your feedback]
    Suggestion 1: [first improved response]
    Suggestion 2: [second improved response]
    Suggestion 3: [third improved response]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response
    const ratingMatch = text.match(/Rating: (\d+)/);
    const feedbackMatch = text.match(/Feedback: (.*?)(?=\nSuggestion|$)/s);
    const suggestionsMatch = text.match(/Suggestion \d+: (.*?)(?=\nSuggestion \d+:|$)/gs);

    if (!ratingMatch || !feedbackMatch || !suggestionsMatch) {
      throw new Error('Failed to parse AI response');
    }

    const suggestions = suggestionsMatch
      .map(s => s.replace(/Suggestion \d+: /, '').trim());

    return NextResponse.json({
      rating: Math.min(5, Math.max(1, parseInt(ratingMatch[1]))),
      feedback: feedbackMatch[1].trim(),
      suggestions
    });
  } catch (error) {
    console.error('Error analyzing response:', error);
    return NextResponse.json(
      { error: 'Failed to analyze response' },
      { status: 500 }
    );
  }
} 