import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} AspireAI. All rights reserved.</p>
        <p>
          Built with <span className="text-red-500">❤</span> by AI enthusiasts.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
