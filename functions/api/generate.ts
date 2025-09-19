// @ts-nocheck
// Cloudflare Pages Function to securely proxy image generation requests.
// This runs on the server, not in the user's browser.

import { GoogleGenAI } from "https://esm.sh/@google/genai";

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // IMPORTANT: 'API_KEY' must be set as an environment variable in your
    // Cloudflare Pages project settings. It should be bound to your secret.
    if (!env.API_KEY) {
      const errorResponse = { error: 'Server configuration error: API key not found.' };
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      const errorResponse = { error: 'A valid text prompt is required.' };
      return new Response(JSON.stringify(errorResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey: env.API_KEY });

    const apiResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (apiResponse.generatedImages && apiResponse.generatedImages.length > 0) {
      const base64ImageBytes = apiResponse.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

      return new Response(JSON.stringify({ imageUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error("API did not return any images.");
    }
  } catch (error) {
    console.error("Error in Cloudflare Function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";

    const errorResponse = { error: `Image generation failed: ${errorMessage}` };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
