
import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, StoredResult, LanguageCode } from '../types';
import SoulGarden from './SoulGarden';
import GrandSoulWidget from './GrandSoulWidget';

interface ProgressDashboardProps {
  user: UserProfile;
  // Added language prop to handle localized time string logic
  language: LanguageCode;
  onNewSession: () => void;
  onViewResult: (result: StoredResult) => void;
  onFullDiagnostic: () => void;
  t: any;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ user, language, onNewSession, onViewResult, onFullDiagnostic, t }) => {
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHistory(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const averageGrowth = useMemo(() => {
    return user.history.length > 0 
      ? (user.history.reduce((acc, curr) => acc + curr.diagnostic.scores.spiritualGrowth, 0) / user.history.length).toFixed(1)
      : "0.0";
  }, [user.history]);

  const lastLightMessage = useMemo(() => {
    if (!user.lastReflectionDate) return null;
    const last = new Date(user.lastReflectionDate);
    const now = new Date();
    const diffMs = now.getTime() - last.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    let timeStr = "";
    // Fixed: Replaced non-existent 'state.language' with 'language' prop
    if (diffHours < 1) timeStr = language === 'en' ? "less than an hour" : "manje od sat vremena";
    else if (diffHours < 24) timeStr = `${diffHours} ${language === 'en' ? 'hour' : 'sat'}${(diffHours === 1 || language === 'hr') ? '' : 's'}`;
    else timeStr = `${Math.floor(diffHours / 24)} ${language === 'en' ? 'day' : 'dan'}${Math.floor(diffHours / 24) === 1 ? '' : 's'}`;
    
    return t.lastFoundPeace.replace('{time}', timeStr);
    // Added language to dependency array
  }, [user.lastReflectionDate, t.lastFoundPeace, language]);

  const gardenStage = useMemo(() => {
    const count = user.history.length;
    if (count === 0) return t.gardenStageSeed;
    if (count < 4) return t.gardenStageSprout;
    if (count < 8) return t.gardenStageLeafy;
    return t.gardenStageFlowering;
  }, [user.history.length, t]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 pb-12">
      <div className="text-center space-y-2 py-4 animate-slow-fade">
        <div className="flex items-center justify-center gap-1.5 text-[8px] font-bold text-[#8b7e6a] uppercase tracking-[0.2em] mb-2 opacity-60">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          {t.syncActive}
        </div>
        <h2 className="text-3xl md:text-5xl font-semibold text-[#4a453e] leading-tight tracking-tight px-4">
          {t.heartGreeting.replace('{name}', user.name)}
        </h2>
        {lastLightMessage && (
          <p className="text-[#8b7e6a] text-[10px] md:text-sm font-medium opacity-80 animate-slow-fade stagger-1">
            {lastLightMessage}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch animate-slow-fade stagger-1 px-4 md:px-0">
        <div className="glass-panel p-6 md:p-8 rounded-[2rem] flex flex-col justify-between shadow-sm">
          <div className="mb-4">
            <div className="text-[9px] text-[#a8a29e] font-bold uppercase tracking-widest mb-1">{t.growthAvg}</div>
            <div className="text-4xl md:text-5xl font-bold text-[#8b7e6a]">{averageGrowth}</div>
          </div>
          <button onClick={onNewSession} className="w-full py-3 bg-[#8b7e6a] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-[0.98]">
            {t.newSession}
          </button>
        </div>

        <div className="glass-panel p-6 md:p-8 rounded-[2rem] flex flex-col items-center justify-center shadow-sm">
           <SoulGarden reflectionCount={user.history.length} stageLabel={gardenStage} />
        </div>

        <GrandSoulWidget historyCount={user.history.length} onFullDiagnostic={onFullDiagnostic} t={t} />
      </div>

      <div className={`space-y-6 transition-all duration-1000 ${showHistory ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} px-4 md:px-0`}>
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-[#e7e5e4]"></div>
          <span className="text-[9px] font-bold text-[#a8a29e] uppercase tracking-[0.3em]">{t.universalHistory}</span>
          <div className="h-px flex-1 bg-[#e7e5e4]"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {user.history.length === 0 ? (
            <div className="col-span-full py-12 text-center glass-panel rounded-[2rem] border-dashed border-[#e7e5e4]">
               <p className="text-[#a8a29e] text-xs italic">{t.noEntries}</p>
            </div>
          ) : (
            [...user.history].reverse().map((item, idx) => (
              <button key={item.id} onClick={() => onViewResult(item)} className="glass-panel p-6 rounded-[1.5rem] hover:border-[#8b7e6a] text-left transition-all shadow-sm hover:shadow-lg animate-slow-fade">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[8px] font-bold text-[#a8a29e] uppercase tracking-widest">{new Date(item.date).toLocaleDateString()}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${item.diagnostic.overallBalance === 'Positive' ? 'bg-green-400' : item.diagnostic.overallBalance === 'Neutral' ? 'bg-blue-400' : 'bg-orange-400'}`}></div>
                </div>
                <h4 className="font-medium text-[#4a453e] text-sm line-clamp-2 mb-4 h-10">{item.situation}</h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[8px] font-bold text-[#a8a29e] uppercase tracking-tighter">
                    <span>{t.soulGrowth}</span>
                    <span>{item.diagnostic.scores.spiritualGrowth}/10</span>
                  </div>
                  <div className="w-full bg-[#f5f1ea] h-0.5 rounded-full overflow-hidden">
                    <div className="bg-[#8b7e6a] h-full" style={{ width: `${(item.diagnostic.scores.spiritualGrowth / 10) * 100}%` }} />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
