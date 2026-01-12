
import React, { useState } from 'react';

interface StartScreenProps {
  onStart: (name: string, password: string, language: string) => void;
}

const LANGUAGES = [
  { code: 'English', label: 'English' },
  { code: 'Spanish', label: 'Español' },
  { code: 'French', label: 'Français' },
  { code: 'German', label: 'Deutsch' },
  { code: 'Chinese', label: '中文' },
  { code: 'Japanese', label: '日本語' }
];

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('English');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && password) {
      onStart(name, password, language);
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl border border-[#e7e5e4] p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-medium text-[#4a453e]">Welcome</h2>
        <p className="text-[#a8a29e] text-sm mt-1">Identify yourself to begin.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-[#a8a29e] uppercase tracking-wider mb-1.5">Name</label>
          <input 
            type="text" 
            required
            className="w-full px-3 py-2 rounded-lg bg-[#faf9f6] border border-[#e7e5e4] focus:border-[#8b7e6a] outline-none transition-all text-sm"
            value={name}
            placeholder="Enter name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[#a8a29e] uppercase tracking-wider mb-1.5">Password</label>
          <input 
            type="password" 
            required
            className="w-full px-3 py-2 rounded-lg bg-[#faf9f6] border border-[#e7e5e4] focus:border-[#8b7e6a] outline-none transition-all text-sm"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[#a8a29e] uppercase tracking-wider mb-1.5">Language</label>
          <select 
            className="w-full px-3 py-2 rounded-lg bg-[#faf9f6] border border-[#e7e5e4] focus:border-[#8b7e6a] outline-none transition-all text-sm"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-[#8b7e6a] hover:bg-[#7a6d59] text-white font-medium rounded-lg transition-all active:scale-[0.98] mt-2 shadow-sm"
        >
          Enter
        </button>
      </form>
    </div>
  );
};

export default StartScreen;
