import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    const body = await request.json();
    const { question, answer } = body;

    const prompt = `
      You are an expert technical interviewer for a top-tier tech company.
      You asked the candidate the following question:
      "${question}"
      
      The candidate responded:
      "${answer}"

      Please evaluate their answer based on technical accuracy, completeness, pacing (if discernible from text), and filler words (assume any stuttering or conversational filler in text is what they said).
      
      Output MUST be a valid JSON object with the following structure:
      {
        "feedback": "A concise paragraph giving constructive feedback.",
        "pacingText": "Good / Too Fast / Too Slow",
        "pacingScore": 80, 
        "fillerWordsCount": 2,
        "actionableTip": "One specific tip to improve next time."
      }
      
      Do not include any markdown backticks in the final output, just raw JSON.
    `;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text() || "{}";
    const parsed = JSON.parse(textResponse);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return NextResponse.json({ error: 'Failed to evaluate answer' }, { status: 500 });
  }
}
