import { GoogleGenAI } from "@google/genai";

// Define the shape of the environment variables available to the function
interface Env {
  API_KEY: string;
}

// Define the shape of the incoming request body from the frontend
interface RequestBody {
  prompt: string;
}

/**
 * Cloudflare Pages Function handler for POST requests.
 * This function acts as a secure proxy to the Google Gemini API.
 */
// FIX: Corrected the function signature to resolve "Cannot find name 'PagesFunction'"
// and migrated the implementation to use the Google Gemini API for image generation.
export const onRequestPost: (context: { request: Request; env: Env }) => Promise<Response> = async (context) => {
  try {
    const { request, env } = context;
    const body: RequestBody = await request.json();
    const prompt = body.prompt;

    if (!prompt) {
      return new Response('Prompt is required in the request body.', { status: 400 });
    }

    const apiKey = env.API_KEY;

    if (!apiKey) {
        console.error("Google Gemini API key (API_KEY) is not configured in the environment.");
        return new Response("Application is not configured correctly.", { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Call the Gemini API from the backend function
    const aiResponse = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    const base64ImageBytes: string = aiResponse.generatedImages[0].image.imageBytes;

    // Decode base64 to binary. atob is available in the Cloudflare Workers runtime.
    const binaryString = atob(base64ImageBytes);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Stream the image data directly back to the client
    return new Response(bytes.buffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });

  } catch (error) {
    console.error("Error in Cloudflare function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return new Response(`Internal Server Error: ${errorMessage}`, { status: 500 });
  }
};
