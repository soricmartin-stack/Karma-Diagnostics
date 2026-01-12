
import React from 'react';
import { FullSoulDiagnostic } from '../types';

interface FullSoulDiagnosticResultProps {
  result: FullSoulDiagnostic;
  onBack: () => void;
  t: any;
}

const FullSoulDiagnosticResult: React.FC<FullSoulDiagnosticResultProps> = ({ result, onBack, t }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-[#1c1917] p-8 md:p-12 rounded-3xl border border-[#44403c] shadow-2xl text-[#f5f1ea]">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full border border-[#8b7e6a] text-[#8b7e6a] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            {t.greatTransform}
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6">{t.grandSoulDiag}</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#8b7e6a] to-transparent mx-auto"></div>
        </div>

        <div className="space-y-16">
          <Section 
            title={t.rootAttach} 
            content={result.deepInsights} 
            accentColor="text-[#8b7e6a]"
          />

          <div className="relative group">
            <div className="absolute -inset-4 bg-red-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Section 
              title={t.harshTruth} 
              content={result.harshTruth} 
              accentColor="text-red-400"
              isItalic
            />
          </div>

          <Section 
            title={t.hardInstruct} 
            content={result.hardInstructions} 
            accentColor="text-white"
            bg="bg-[#292524] border border-[#44403c]"
          />

          <div className="text-center py-12 border-t border-[#44403c]">
            <h3 className="text-[11px] font-bold text-[#8b7e6a] uppercase tracking-widest mb-6">{t.tuneDivine}</h3>
            <p className="text-2xl font-light italic leading-relaxed max-w-2xl mx-auto">
              "{result.divineConnection}"
            </p>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-[#44403c] text-center">
          <button 
            onClick={onBack}
            className="px-10 py-4 bg-[#8b7e6a] hover:bg-[#a89882] text-white font-medium rounded-xl transition-all shadow-lg active:scale-[0.98]"
          >
            {t.returnDash}
          </button>
        </div>
      </div>
      
      <p className="text-center text-[10px] text-[#a8a29e] uppercase tracking-widest font-bold">
        {t.basedOnJourney}
      </p>
    </div>
  );
};

const Section: React.FC<{ 
  title: string; 
  content: string; 
  accentColor: string;
  isItalic?: boolean;
  bg?: string;
}> = ({ title, content, accentColor, isItalic, bg }) => (
  <div className={`p-8 rounded-2xl ${bg || ''}`}>
    <h3 className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-6 ${accentColor}`}>
      {title}
    </h3>
    <p className={`text-lg md:text-xl leading-relaxed ${isItalic ? 'italic font-light' : 'font-light'} text-[#d6d3d1]`}>
      {content}
    </p>
  </div>
);

export default FullSoulDiagnosticResult;
