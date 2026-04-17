'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateContent(prompt: string, systemInstruction?: string) {
  try {
    const groqApiKey = process.env.GROQ_API_KEY || "";
    if (!groqApiKey) throw new Error("Missing GROQ_API_KEY in server environment.");
    const messages = [];
    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }
    messages.push({ role: "user", content: prompt });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
       const err = await response.text();
       throw new Error("API Error: " + err);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Action Error:", error);
    throw new Error("Failed to generate content.");
  }
}
