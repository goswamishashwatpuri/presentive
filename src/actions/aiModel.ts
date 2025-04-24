import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from '@google/genai';
import mime from 'mime';
import { createRandomString } from "@/lib/utils";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);


const outlinesModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: "You're a helpful assistant that generates outlines for a presentations.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};


const layoutGenerationModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: "You generate JSON layouts for presentations.",
});

const layoutGenerationConfig = {
  maxOutputTokens: 16000,
  temperature: 0.7,
  responseMimeType: "application/json",
}

export const outlineGenerationSession = outlinesModel.startChat({
  generationConfig,
  history: [
  ],
});

export const layoutGenerationSession = layoutGenerationModel.startChat({
  generationConfig: layoutGenerationConfig,
  history: [
  ],
});
