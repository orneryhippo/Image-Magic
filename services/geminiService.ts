import { GoogleGenAI, Modality } from "@google/genai";
import { ImageData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateImageFromPromptAndImage = async (
    image: ImageData,
    prompt: string
  ): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: image.base64,
              mimeType: image.mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image was generated. Please try a different prompt.");
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    if (error instanceof Error) {
        return Promise.reject(error.message);
    }
    return Promise.reject("An unknown error occurred while generating the image.");
  }
};


export const editImage = (image: ImageData, prompt: string): Promise<string> => {
    return generateImageFromPromptAndImage(image, prompt);
}

export const generateHistoricalImage = (image: ImageData, scenePrompt: string): Promise<string> => {
    const fullPrompt = `Take the person from the provided image and realistically place them into the following historical scene: "${scenePrompt}". Ensure the lighting, style, and clothing match the scene. The final image should be a cohesive whole.`;
    return generateImageFromPromptAndImage(image, fullPrompt);
}
