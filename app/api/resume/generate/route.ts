import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    const body = await request.json();
    const { firstName, lastName, role, experience, skills } = body;

    const prompt = `
      You are an expert technical recruiter and resume writer. 
      Given the following details from a candidate, generate an ATS-optimized resume.
      
      Candidate Details:
      - Name: ${firstName} ${lastName}
      - Target Role: ${role}
      - Skills: ${skills}
      - Experience / Draft Bullet Points: ${experience}

      Output MUST be a valid JSON object with the following structure:
      {
        "atsScore": 95,
        "name": "Jane Doe",
        "role": "Senior Frontend Engineer",
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const textResponse = response.text || "{}";
    const parsed = JSON.parse(textResponse);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error generating resume:', error);
    return NextResponse.json({ error: 'Failed to generate resume' }, { status: 500 });
  }
}
