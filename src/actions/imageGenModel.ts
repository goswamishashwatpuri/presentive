'use server'
import { GoogleGenAI } from "@google/genai";
import mime from 'mime';
import { createRandomString } from "@/lib/utils";
import { uploadFile } from '@uploadcare/upload-client'

// image generation model config
export async function generateImageWithGeiminiTest(prompt: string) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    responseModalities: [
      'image',
      'text'
    ],
    responseMimeType: 'text/plain',
  };
  const model = 'gemini-2.0-flash-exp-image-generation';
  const contents = [{ role: 'user', parts: [{ text: prompt }] }];

  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  });
  const inlineData = response?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
  if (!inlineData || !inlineData.data || !inlineData.mimeType) {
    throw new Error("Invalid response structure");
  }

  const buffer = Buffer.from(inlineData.data, 'base64');
  const fileName = createRandomString(10) + '.' + mime.getExtension(inlineData.mimeType);
  const res = await uploadFile(buffer, {
    publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
    fileName: fileName,
  })
  
  return res?.cdnUrl ?? "https://plus.unsplash.com/premium_vector-1721386085379-8df3c43a062d"
}