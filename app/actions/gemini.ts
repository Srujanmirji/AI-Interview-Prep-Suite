'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateContent(prompt: string, systemInstruction?: string) {
  try {
    const modelParams: any = { 
      model: 'gemini-2.5-flash-lite',
    };
    if (systemInstruction) {
      modelParams.systemInstruction = systemInstruction;
    }
    const model = genAI.getGenerativeModel(modelParams);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content.");
  }
}
