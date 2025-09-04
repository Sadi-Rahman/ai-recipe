import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ApiError, handleError } from '../errors';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();

    if (!ingredients) {
      throw new ApiError(400, 'Ingredients are required');
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      ],
      systemInstruction: 'You are a creative chef who specializes in making delicious recipes with a limited set of ingredients. Provide a unique recipe title, a list of ingredients, and clear, step-by-step instructions. The recipe should be easy to follow and should not include any ingredients that are not on the provided list.',
    });

    const prompt = `Create a recipe using the following ingredients: ${ingredients}.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    return NextResponse.json({ recipe: text });
  } catch (error) {
    const { error: errorMessage, status } = handleError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}