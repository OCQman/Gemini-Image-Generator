
// IMPORTANT: To use this service, you must set the following environment variables
// in your Cloudflare Pages project settings:
// 1. VITE_CLOUDFLARE_ACCOUNT_ID: Your Cloudflare account ID.
// 2. VITE_CLOUDFLARE_API_TOKEN: An API token with "Workers AI" permissions.

const accountId = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;
const apiToken = import.meta.env.VITE_CLOUDFLARE_API_TOKEN;

const model = '@cf/stabilityai/stable-diffusion-xl-base-1.0';

if (!accountId || !apiToken) {
  throw new Error("Cloudflare Account ID and API Token must be set as environment variables.");
}

export const generateImage = async (prompt: string): Promise<string> => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate image. Status: ${response.status}. Message: ${errorText}`);
    }

    // The response is the image binary data
    const imageBlob = await response.blob();
    
    // Create a temporary URL for the blob to display in an <img> tag
    return URL.createObjectURL(imageBlob);

  } catch (error) {
    console.error("Error generating image with Cloudflare AI:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};
