
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800/30 w-full p-4 mt-auto">
      <div className="container mx-auto text-center text-gray-500 text-sm">
        {/* FIX: Updated text to credit Google Gemini */}
        <p>Powered by Google Gemini. Deployed on Cloudflare Pages.</p>
      </div>
    </footer>
  );
};

export default Footer;
