
import React from 'react';
import { KarmaDiagnostic, UserProfile } from '../types';
import VisualChart from './VisualChart';
import GrandSoulWidget from './GrandSoulWidget';

interface DiagnosticResultProps {
  result: KarmaDiagnostic;
  user: UserProfile | null;
  onRefine: (mode: 'specific' | 'wide') => void;
  onRestart: () => void;
  onWriteAgain: () => void;
  onFullDiagnostic: () => void;
  isRefining: boolean;
  t: any;
}

const DiagnosticResult: React.FC<DiagnosticResultProps> = ({ result, user, onRefine, onRestart, onWriteAgain, onFullDiagnostic, isRefining, t }) => {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-[#e7e5e4] shadow-sm">
        
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
             <h3 className="text-[9px] font-bold text-[#a8a29e] uppercase tracking-widest">{t.simpleReflect}</h3>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-[#4a453e] leading-snug">
            {result.simpleSummary}
          </p>
        </div>

        <div className="mb-8 md:mb-12 bg-[#f5f1ea] p-6 md:p-8 rounded-2xl border border-[#e7e5e4] shadow-inner">
          <h3 className="text-[9px] font-bold text-[#8b7e6a] uppercase tracking-widest mb-3">{t.nextStep}</h3>
          <p className="text-base md:text-lg leading-relaxed text-[#4a453e] font-medium italic">
            "{result.remedy}"
          </p>
        </div>

        <div className="mb-8 md:mb-12 px-2">
          <h3 className="text-[9px] font-bold text-[#a8a29e] uppercase tracking-widest mb-3">{t.deeperInsight}</h3>
          <p className="text-sm md:text-base text-[#7c7267] leading-relaxed italic border-l-2 border-[#8b7e6a] pl-5 md:pl-6 py-1">
            {result.wisdom}
          </p>
        </div>

        <div className="flex flex-col items-center py-8 md:py-10 bg-[#faf9f6] rounded-2xl border border-[#e7e5e4] mb-8 md:mb-12 shadow-inner">
          <h3 className="text-[9px] font-bold text-[#a8a29e] uppercase tracking-widest mb-6">{t.growthMap}</h3>
          <VisualChart scores={result.scores} labels={t.chartLabels} />
          <div className="mt-6 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase border border-[#e7e5e4] bg-white text-[#8b7e6a] shadow-sm">
            {result.overallBalance}
          </div>
        </div>

        <div className="mb-8 md:mb-12 pt-6 md:pt-8 border-t border-[#e7e5e4]">
          <h3 className="text-[9px] font-bold text-[#a8a29e] uppercase tracking-widest mb-6 md:mb-8 text-center">{t.causalTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            <Section title={t.seed} content={result.intent} />
            <Section title={t.act} content={result.action} />
            <Section title={t.harvest} content={result.ripening} />
          </div>
        </div>

        <div className="mb-8 md:mb-12 p-6 bg-[#fdfbf7] rounded-xl border border-dashed border-[#e7e5e4] text-center">
          <h3 className="text-[9px] font-bold text-[#8b7e6a] uppercase tracking-widest mb-2">{t.soulAdviceTitle}</h3>
          <p className="text-sm md:text-base text-[#4a453e] leading-relaxed font-light italic">
            {result.soulAdvice}
          </p>
        </div>

        <div className="mb-8 md:mb-12">
          {user && (
            <GrandSoulWidget 
              historyCount={user.history.length} 
              onFullDiagnostic={onFullDiagnostic} 
              t={t} 
            />
          )}
        </div>

        <div className="pt-6 md:pt-8 border-t border-[#e7e5e4] space-y-4">
          <p className="text-center text-[9px] font-bold text-[#a8a29e] uppercase tracking-widest">{t.continueExplore}</p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button 
              onClick={() => onRefine('specific')}
              disabled={isRefining}
              className="flex-1 py-3 md:py-4 bg-[#8b7e6a] hover:bg-[#7a6d59] text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-[0.98] disabled:bg-[#d6d3d1]"
            >
              {isRefining ? '...' : t.goDeeper}
            </button>
            <button 
              onClick={() => onRefine('wide')}
              disabled={isRefining}
              className="flex-1 py-3 md:py-4 bg-[#4a453e] hover:bg-[#3d3933] text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-[0.98] disabled:bg-[#d6d3d1]"
            >
              {isRefining ? '...' : t.bigPicture}
            </button>
          </div>
          
          <button 
            onClick={onWriteAgain}
            className="w-full py-3 md:py-4 bg-white border-2 border-[#8b7e6a] text-[#8b7e6a] text-xs font-bold uppercase tracking-widest rounded-xl transition-all hover:bg-[#8b7e6a]/5 active:scale-[0.98] shadow-sm"
          >
            {t.newSession}
          </button>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="space-y-2">
    <h3 className="text-[10px] font-bold text-[#8b7e6a] uppercase tracking-wider">
      {title}
    </h3>
    <p className="text-xs md:text-sm text-[#4a453e] leading-relaxed">
      {content}
    </p>
  </div>
);

export default DiagnosticResult;
