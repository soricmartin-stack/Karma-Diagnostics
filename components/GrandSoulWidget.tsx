
import React from 'react';

interface GrandSoulWidgetProps {
  historyCount: number;
  onFullDiagnostic: () => void;
  t: any;
}

const GrandSoulWidget: React.FC<GrandSoulWidgetProps> = ({ historyCount, onFullDiagnostic, t }) => {
  return (
    <div className="bg-[#1c1917] p-6 rounded-[2rem] border border-[#44403c] text-center shadow-xl flex flex-col justify-center animate-slow-fade">
      {historyCount >= 3 ? (
        <>
          <h3 className="text-[#8b7e6a] text-[8px] font-bold uppercase tracking-[0.3em] mb-2">{t.deepPattern}</h3>
          <p className="text-[#d6d3d1] text-[10px] font-light mb-4 opacity-80 leading-relaxed">{t.deepPatternSub}</p>
          <button
            onClick={onFullDiagnostic}
            className="w-full py-3 bg-[#8b7e6a] hover:bg-[#a89882] text-white text-[9px] font-bold uppercase tracking-[0.3em] rounded-xl transition-all shadow-lg active:scale-95"
          >
            {t.runFullBtn}
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-2">
           <div className="w-10 h-10 rounded-full border border-[#44403c] flex items-center justify-center mb-3">
              <span className="text-[#8b7e6a] text-xs font-bold">{3 - historyCount}</span>
           </div>
           <p className="text-[#d6d3d1] text-[9px] font-light opacity-60 italic leading-snug">
             Share {3 - historyCount} more reflections to unlock<br/>the Grand Soul Diagnostic.
           </p>
        </div>
      )}
    </div>
  );
};

export default GrandSoulWidget;
