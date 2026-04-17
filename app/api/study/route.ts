import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetRole, experienceLevel, domain, skillFocus } = body;

    if (!targetRole || !experienceLevel) {
      return NextResponse.json({ error: "Missing required fields: targetRole and experienceLevel" }, { status: 400 });
    }

    // Direct string injection for Groq API key (known working with quota)
    const groqApiKey = process.env.GROQ_API_KEY || "";
    if (!groqApiKey) throw new Error("Missing GROQ_API_KEY in server environment.");

    const promptText = `
You are an expert technical mentor. Generate a structured learning roadmap for a ${targetRole} at ${experienceLevel} level.
${domain ? `Domain Specialization: ${domain}` : ""}
${skillFocus ? `Skill Focus: ${skillFocus}` : ""}

Ensure the roadmap is divided into exactly 3 to 4 phases (e.g. Fundamentals, Core Concepts, Advanced, Interview Prep).
Each phase must contain topics in logical order.

For each topic, provide:
1. "name": The concept name.
2. "explanation": A short 2-3 line simple explanation.
3. "importance": Why it matters for tech interviews.
4. "example": One practical use case or coding example.
5. "importanceLevel": Strictly one of "High", "Medium", or "Low".
6. "frequency": Strictly one of "Common", "Occasional", or "Rare".
7. "practice": An array of 1-2 actionable practice tasks.
8. "miniProject": A string suggesting a mini project (or "N/A" if not applicable).

YOU MUST RETURN EXACTLY AND ONLY A RAW JSON ARRAY. NO MARKDOWN CODE BLOCKS. NO EXTRA TEXT.
Format:
[
  {
    "phase": "Fundamentals",
    "topics": [
      {
        "name": "...",
        "explanation": "...",
        "importance": "...",
        "example": "...",
        "importanceLevel": "High",
        "frequency": "Common",
        "practice": ["...", "..."],
        "miniProject": "..."
      }
    ]
  }
]
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
        temperature: 0.7,
      })
    });

    if (!response.ok) {
       const err = await response.text();
       throw new Error("Groq API Error: " + err);
    }

    const jsonRes = await response.json();
    let responseText = jsonRes.choices[0].message.content;
    
    // Indestructible JSON extraction: slice from first [ to last ]
    const match = responseText.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("AI did not output a valid JSON array. Response: " + responseText.substring(0, 100));
    
    const data = JSON.parse(match[0]);

    return NextResponse.json({ roadmap: data });
  } catch (error) {
    console.error("Study Concept Generation Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
