import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const groqApiKey = process.env.GROQ_API_KEY || "";
    if (!groqApiKey) throw new Error("Missing GROQ_API_KEY in server environment.");

    const body = await request.json();
    const { question, answer } = body;

    const promptText = `
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
    console.error('Error evaluating answer:', error);
    return NextResponse.json({ error: 'Failed to evaluate answer' }, { status: 500 });
  }
}
