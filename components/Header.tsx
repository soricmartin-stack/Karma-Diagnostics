
import React from 'react';

interface HeaderProps {
  subText?: string;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ subText, title }) => {
  return (
    <header className="py-4 md:py-8 text-center flex flex-col items-center">
      <div className="w-12 h-12 md:w-16 md:h-16 mb-4 rounded-2xl app-icon-gradient shadow-xl flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-white opacity-20 transform -translate-y-1/2 rounded-full scale-150 blur-xl"></div>
        <svg className="w-8 h-8 md:w-10 md:h-10 text-white opacity-90 drop-shadow-md" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <circle cx="6" cy="6" r="1.5" fill="currentColor" />
          <circle cx="18" cy="6" r="1.5" fill="currentColor" />
          <circle cx="6" cy="18" r="1.5" fill="currentColor" />
          <circle cx="18" cy="18" r="1.5" fill="currentColor" />
          <circle cx="12" cy="5" r="1" fill="currentColor" />
          <circle cx="12" cy="19" r="1" fill="currentColor" />
          <path d="M6 6L12 12M18 6L12 12M6 18L12 12M18 18L12 12M12 5L6 6M12 5L18 6M12 19L6 18M12 19L18 18M6 6V18M18 6V18" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
        </svg>
      </div>
      <h1 className="text-2xl md:text-4xl font-semibold text-[#4a453e] mb-1">
        {title || "Soul Development"}
      </h1>
      <p className="max-w-sm mx-auto text-[10px] md:text-sm text-[#7c7267] font-light px-4 leading-tight">
        {subText || "A quiet space to reflect on your life."}
      </p>
    </header>
  );
};

export default Header;
