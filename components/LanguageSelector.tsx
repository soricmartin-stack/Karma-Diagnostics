
import React from 'react';
import { LanguageCode } from '../types';

interface LanguageSelectorProps {
  onSelect: (lang: LanguageCode) => void;
}

const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'hr', label: 'Hrvatski', flag: '🇭🇷' }
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect }) => {
  return (
    <div className="max-w-md mx-auto py-2">
      <div className="grid grid-cols-3 gap-3">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className="group flex flex-col items-center justify-center p-3 md:p-6 bg-white rounded-2xl border border-[#e7e5e4] hover:border-[#8b7e6a] hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <span className="text-2xl md:text-4xl mb-1 grayscale group-hover:grayscale-0 transition-all">
              {lang.flag}
            </span>
            <span className="text-[10px] md:text-xs font-medium text-[#7c7267] group-hover:text-[#4a453e]">
              {lang.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
