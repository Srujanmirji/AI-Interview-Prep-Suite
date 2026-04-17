'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateContent(prompt: string, systemInstruction?: string) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite',
      systemInstruction: systemInstruction 
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content.");
  }
}
