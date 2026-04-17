import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Valid messages array is required' }, { status: 400 });
    }

    // Add system instruction for Voice Interview
    const systemPrompt = {
      role: 'system',
      content: `You are an expert technical interviewer engaging in a highly realistic spoken interview. 
Keep your responses conversational, direct, and under 3 or 4 sentences so that it sounds natural when spoken aloud via Text-to-Speech. 
Do not use markdown formatting like asterisks or bolding, as this will be spoken verbatim. 
Ask one clear follow-up question per response.`
    };
    
    // Process input messages to strip any system roles if they exist to keep it simple
    // We prefix our system prompt.
    // Map 'text' to 'content' and 'bot' to 'assistant' for OpenAI standard format.
    const mappedMessages = messages
      .filter((m:any) => m.role !== 'system')
      .map((m:any) => ({
         role: m.role === 'bot' ? 'assistant' : m.role,
         content: m.text || ""
      }));

    const groqMessages = [systemPrompt, ...mappedMessages];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 256,
      }),
    });

    if (!response.ok) {
        const err = await response.json().catch(()=>({}));
        console.error("Groq Chat Error: ", err);
        return NextResponse.json({ error: 'Failed to fetch from Groq' }, { status: response.status });
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ result: replyText });

  } catch (error) {
    console.error('Groq LLM error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
