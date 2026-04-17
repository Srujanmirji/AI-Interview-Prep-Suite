import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    const body = await request.json();
    const { role, step, previousQuestions } = body;

    const prompt = `
      You are an expert technical interviewer for a top-tier tech company.
      The candidate is applying for the role of: ${role || 'Software Engineer'}.
      This is question number ${step + 1} of the interview.
      Previous questions asked in this session: ${previousQuestions ? previousQuestions.join(" | ") : "None"}.
      
      Generate ONE realistic and challenging interview question. 
      If step < 2, make it a behavioral or past-experience question.
      If step >= 2, make it a technical, system design, or scenario-based question.
      Make sure the question is NOT one of the previous questions.

      Output ONLY the text of the question, no introductory text.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const result = await model.generateContent(prompt);

    return NextResponse.json({ question: result.response.text() });
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 });
  }
}
