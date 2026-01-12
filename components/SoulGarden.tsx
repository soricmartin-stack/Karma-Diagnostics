
import React from 'react';

interface SoulGardenProps {
  reflectionCount: number;
  stageLabel: string;
}

const SoulGarden: React.FC<SoulGardenProps> = ({ reflectionCount, stageLabel }) => {
  // Determine growth progress based on count (0 to 10+)
  const progress = Math.min(reflectionCount / 10, 1);
  const glowIntensity = 0.2 + progress * 0.8;

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Glow effect */}
        <div 
          className="absolute inset-0 bg-[#8b7e6a]/10 rounded-full blur-2xl animate-breathe"
          style={{ opacity: glowIntensity }}
        ></div>
        
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-sm">
          {/* Ground */}
          <path d="M20 85 Q50 80 80 85" fill="none" stroke="#e7e5e4" strokeWidth="1" strokeLinecap="round" />
          
          {/* Stem */}
          <path 
            d={`M50 85 Q${50 - progress * 5} ${85 - progress * 20} 50 ${85 - progress * 50}`} 
            fill="none" 
            stroke="#8b7e6a" 
            strokeWidth="2" 
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
          
          {/* Seed / Bulb */}
          {reflectionCount === 0 && (
            <ellipse cx="50" cy="85" rx="4" ry="3" fill="#8b7e6a" opacity="0.6" />
          )}

          {/* Leaves */}
          {reflectionCount >= 2 && (
            <path 
              d="M50 70 Q40 65 35 72 Q40 75 50 72" 
              fill="#8b7e6a" 
              opacity="0.4"
              className="animate-pulse"
            />
          )}
          {reflectionCount >= 5 && (
            <path 
              d="M50 60 Q60 55 65 62 Q60 65 50 62" 
              fill="#8b7e6a" 
              opacity="0.5"
            />
          )}

          {/* Flower / Bloom */}
          {reflectionCount >= 8 && (
            <g className="animate-breathe" style={{ transformOrigin: '50px 35px' }}>
              <circle cx="50" cy="35" r="6" fill="#8b7e6a" opacity="0.8" />
              <path d="M50 35 Q50 25 55 30 Q60 35 50 35" fill="#8b7e6a" opacity="0.3" />
              <path d="M50 35 Q50 25 45 30 Q40 35 50 35" fill="#8b7e6a" opacity="0.3" />
              <path d="M50 35 Q60 35 55 40 Q50 45 50 35" fill="#8b7e6a" opacity="0.3" />
              <path d="M50 35 Q40 35 45 40 Q50 45 50 35" fill="#8b7e6a" opacity="0.3" />
            </g>
          )}
        </svg>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-bold text-[#8b7e6a] uppercase tracking-[0.3em] mb-1">
          {stageLabel}
        </p>
        <div className="w-24 h-0.5 bg-[#e7e5e4] rounded-full mx-auto overflow-hidden">
          <div 
            className="h-full bg-[#8b7e6a] transition-all duration-1000 ease-out"
            style={{ width: `${progress * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SoulGarden;
