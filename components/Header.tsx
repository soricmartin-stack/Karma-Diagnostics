
import React from 'react';

interface HeaderProps {
  subText?: string;
}

const Header: React.FC<HeaderProps> = ({ subText }) => {
  return (
    <header className="py-4 md:py-8 text-center">
      <h1 className="text-2xl md:text-4xl font-semibold text-[#4a453e] mb-1">Soul Development</h1>
      <p className="max-w-sm mx-auto text-[10px] md:text-sm text-[#7c7267] font-light px-4 leading-tight">
        {subText || "A quiet space to reflect on your life."}
      </p>
    </header>
  );
};

export default Header;
