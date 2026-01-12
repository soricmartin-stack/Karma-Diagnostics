
import React from 'react';
import { LanguageCode } from '../types';

interface LanguageSelectorProps {
  onSelect: (lang: LanguageCode) => void;
}

const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hr', label: 'Hrvatski', flag: '🇭🇷' }
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect }) => {
  return (
    <div className="max-w-md mx-auto py-12 flex flex-col items-center gap-8">
      <h2 className="text-xl font-medium text-[#4a453e] tracking-tight">Choose your path / Odaberite svoj put</h2>
      <div className="grid grid-cols-2 gap-6 w-full">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className="group flex flex-col items-center justify-center p-8 bg-white rounded-[2.5rem] border border-[#e7e5e4] hover:border-[#8b7e6a] hover:shadow-xl transition-all active:scale-[0.98] animate-slow-fade"
          >
            <span className="text-5xl mb-3 grayscale group-hover:grayscale-0 transition-all">
              {lang.flag}
            </span>
            <span className="text-sm font-semibold text-[#7c7267] group-hover:text-[#4a453e] uppercase tracking-widest">
              {lang.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
