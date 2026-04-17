import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const groqApiKey = process.env.GROQ_API_KEY || "";
    if (!groqApiKey) throw new Error("Missing GROQ_API_KEY in server environment.");

    const body = await request.json();
    const { firstName, lastName, role, experience, skills } = body;

    const promptText = `
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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: promptText }],
        temperature: 0.3,
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
    console.error('Error generating resume:', error);
    return NextResponse.json({ error: 'Failed to generate resume' }, { status: 500 });
  }
}
