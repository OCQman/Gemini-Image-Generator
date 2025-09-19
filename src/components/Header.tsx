
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg w-full p-4">
      <div className="container mx-auto flex items-center justify-center">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zM12 7a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H8a1 1 0 110-2h3V8a1 1 0 011-1z" />
        </svg>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Gemini Image Generator
        </h1>
      </div>
    </header>
  );
};

export default Header;