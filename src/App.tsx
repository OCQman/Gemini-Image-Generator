
import React, { useState } from 'react';
import Header from './components/Header';
import ImageGenerator from './components/ImageGenerator';
import Footer from './components/Footer';
import { generateImage as generateImageFromApi } from './services/geminiService';

const App: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const url = await generateImageFromApi(prompt);
      setImageUrl(url);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 font-sans">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <ImageGenerator
          onGenerate={handleGenerateImage}
          imageUrl={imageUrl}
          isLoading={isLoading}
          error={error}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;