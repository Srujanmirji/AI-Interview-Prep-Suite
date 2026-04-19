import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const groqApiKey = process.env.GROQ_API_KEY || "";
    if (!groqApiKey) throw new Error("Missing GROQ_API_KEY in server environment.");

    const body = await request.json();
    const { firstName, lastName, role, experience, skills, education, linkedin, github, details } = body;

    // --- GitHub Pipeline Retrieval ---
    let githubContext = "None provided.";
    if (github && typeof github === 'string' && github.trim() !== "") {
       try {
          const ghRes = await fetch(`https://api.github.com/users/${github.trim()}/repos?sort=pushed&per_page=4`);
          if (ghRes.ok) {
             const repos = await ghRes.json();
             if (Array.isArray(repos) && repos.length > 0) {
                githubContext = repos.map((r: any) => `Repo [${r.name}] (${r.language || 'Unknown'}): ${r.description || 'No desc'}`).join(' || ');
             } else {
                githubContext = "No public repositories found.";
             }
          } else {
             githubContext = "Could not fetch repos correctly.";
          }
       } catch (err) {
          githubContext = "GitHub fetch error block.";
       }
    }

    const promptText = `
You are an expert technical recruiter and resume writer. 
Generate a JSON resume perfectly formatted and optimized to beat ATS systems for a ${role}.

Input Data:
Name: ${firstName} ${lastName}
Role: ${role}
Skills: ${skills}
Experience Profile: ${experience}
Education Background: ${education || "Not specified."}
LinkedIn / URLs: ${linkedin || "Not specified."}
GitHub Public Portfolio: ${githubContext}
Extra Details/Projects/Context: ${details || "None provided."}

Ensure the generated bullets in the experience section are highly actionable, include metrics if possible, and flow perfectly with the contextual details provided above. Include all of the candidate's custom details and natively parse the GitHub repositories into the 'projects' array effortlessly.

Output your response ONLY as valid, parsable JSON matching this exact structure:
      {
        "atsScore": 95,
        "name": "Jane Doe",
        "role": "Software Engineer",
        "linkedin": "https://linkedin.com/in/...",
        "education": "B.S. in Computer Science - University Name",
        "skills": ["React", "Node", "TypeScript"],
        "projects": [
          {
             "title": "Personal Project / Custom Detail",
             "description": "Short description of project from extra details."
          }
        ],
        "experience": [
          {
             "title": "Software Engineer",
             "company": "Tech Corp",
             "date": "2021 - Present",
             "bullets": ["Did x", "Did y"]
          }
        ]
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
