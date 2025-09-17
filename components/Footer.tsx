
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-800/50 border-t border-gray-700 py-4 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
        <p>&copy; {currentYear} Zahid Hydri. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
