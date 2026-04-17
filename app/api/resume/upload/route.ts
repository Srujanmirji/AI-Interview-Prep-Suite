import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 1. Extract plain text from PDF Buffer using dynamic require to bypass Next.js compilation caching
    const pdfParse = require('pdf-parse');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text;

    // 2. Safely parse via Groq Llama 3 API using known-good quota
    const groqApiKey = process.env.GROQ_API_KEY || "";
    if (!groqApiKey) throw new Error("Missing GROQ_API_KEY in server environment.");

    const promptText = `
You are an expert technical recruiter and resume extractor.
Extract information exactly from the provided resume text below.

RESUME TEXT:
"""
${resumeText.substring(0, 5000)}
"""

You MUST output EXACTLY and ONLY a raw JSON object. No markdown wrappers.
Use this structure:
{
  "atsScore": 90, 
  "name": "Extracted Name",
  "role": "Current or Target Role",
  "experience": [
    {
      "company": "Company Name",
      "title": "Role Title",
      "date": "Date Range",
      "bullets": ["Bullet 1", "Bullet 2"]
    }
  ],
  "skills": ["Skill 1", "Skill 2"]
}
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: promptText }],
        temperature: 0.1,
      })
    });

    if (!response.ok) {
       throw new Error("Groq API Error");
    }

    const jsonRes = await response.json();
    let responseText = jsonRes.choices[0].message.content;
    
    // Indestructible JSON extraction
    const match = responseText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found");
    
    const parsed = JSON.parse(match[0]);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Error processing resume via Groq:', error);
    return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 });
  }
}
