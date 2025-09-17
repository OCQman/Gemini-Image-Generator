export const generateImage = async (prompt: string): Promise<string> => {
  // The frontend now calls our own serverless function, which will securely call the Cloudflare API.
  const url = '/api/generate';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate image. Server said: ${errorText}`);
    }

    // The response from our function is the image binary data
    const imageBlob = await response.blob();
    
    // Create a temporary URL for the blob to display in an <img> tag
    return URL.createObjectURL(imageBlob);

  } catch (error) {
    console.error("Error calling backend function:", error);
    if (error instanceof Error) {
      // Re-throw a more user-friendly error
      throw new Error(`Request failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};