import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const groqApiKey = process.env.GROQ_API_KEY || "";
    if (!groqApiKey) throw new Error("Missing GROQ_API_KEY in server environment.");

    const body = await request.json();
    const { currentRole, targetRole, timeline, education, experience, context, linkedin } = body;

    if (!currentRole || !targetRole || !timeline) {
       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const promptText = `
      You are an elite career development architect specialized in the modern tech ecosystem.
      A user wants a complete roadmap to shift roles.
      
      --- CANDIDATE PROFILE ---
      - Current Role: ${currentRole}
      - Target Dream Role: ${targetRole}
      - Desired Timeline: ${timeline}
      - Education Background: ${education || "Not provided"}
      - Years of Experience: ${experience || "Not provided"}
      - LinkedIn Profile / Online Presence: ${linkedin || "Not provided"}
      - Additional Context/Skills: ${context || "Not provided"}
      -------------------------

      Create a precise, structured timeline broken into milestones.
      Take into account their existing education, explicitly note how their current years of experience translates to the dream role, and use any additional context provided to tailor the roadmap. Calculate exactly what they need to learn, what they need to build, and actionable career steps.

      Output MUST be a valid JSON object with the following structure exactly:
      {
        "overview": "A brief, highly encouraging summary of this specific transition.",
        "milestones": [
          {
            "id": 1,
            "timeframe": "Month 1 - 2 (e.g., depending on timeline)",
            "title": "Foundation Phase",
            "requiredSkills": ["Skill 1", "Skill 2"],
            "actionSteps": ["Actionable step 1", "Actionable step 2"]
          }
        ],
        "finalAdvice": "One piece of crucial closing advice."
      }
      
      Do not include any markdown backticks in the final output, just pure JSON data.
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
        temperature: 0.4,
      })
    });

    if (!response.ok) {
       const errText = await response.text();
       throw new Error(`Groq API Error: ${errText}`);
    }

    const jsonRes = await response.json();
    let responseText = jsonRes.choices[0].message.content;
    
    // Indestructible JSON extraction (finding the outermost braces)
    const match = responseText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found in LLM response");
    
    const parsed = JSON.parse(match[0]);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Error generating career roadmap:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
