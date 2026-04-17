import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const groqApiKey = process.env.GROQ_API_KEY || "";
    if (!groqApiKey) throw new Error("Missing GROQ_API_KEY in server environment.");

    const body = await request.json();
    const { role, step, previousQuestions } = body;

    const promptText = `
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
       throw new Error("Groq API Error");
    }

    const jsonRes = await response.json();
    let responseText = jsonRes.choices[0].message.content;

    return NextResponse.json({ question: responseText });
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 });
  }
}
