'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateInterviewQuestion(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert technical interviewer.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate content.");
  }
}
