import React from 'react';

const Preloader: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <img
        src="/path/to/your/logo.png" // Replace with the path to your logo
        alt="Logo"
        className="w-32 h-32 animate-spin" // Adjust size and add animation if needed
      />
    </div>
  );
};

export default Preloader;