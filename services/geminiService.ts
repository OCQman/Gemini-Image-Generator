
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      // If the server responded with an error, use its message
      throw new Error(data.error || 'An unknown error occurred from the server.');
    }

    if (data.imageUrl) {
      return data.imageUrl;
    } else {
      throw new Error("Server did not return an image URL.");
    }
  } catch (error) {
    console.error("Error calling image generation API:", error);
    if (error instanceof Error) {
      // Re-throw the error with a more user-friendly prefix.
      throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the server.");
  }
};
