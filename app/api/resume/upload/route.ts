import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');

    const prompt = `
      You are an expert technical recruiter and resume extractor.
      Extract information from the provided resume PDF.
      
      Output MUST be a valid JSON object with the following structure:
      {
        "atsScore": 90, 
        "name": "Jane Doe",
        "role": "Current or Target Role",
        "experience": [
          {
            "company": "Company Name",
            "title": "Role Title",
            "date": "Date Range",
            "bullets": ["Action-oriented bullet point with metrics..."]
          }
        ],
        "skills": ["Skill 1", "Skill 2"]
      }
      
      Do not include any markdown backticks in the final output, just raw JSON.
    `;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: file.type || 'application/pdf'
        }
      }
    ]);

    const textResponse = result.response.text() || "{}";
    const parsed = JSON.parse(textResponse);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error processing resume:', error);
    return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 });
  }
}
