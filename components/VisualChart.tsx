
import React from 'react';
import { KarmaScores } from '../types';

interface VisualChartProps {
  scores: KarmaScores;
}

const VisualChart: React.FC<VisualChartProps> = ({ scores }) => {
  const keys: (keyof KarmaScores)[] = [
    'intentionClarity',
    'actionIntegrity',
    'positiveImpact',
    'lessonDepth',
    'spiritualGrowth'
  ];

  const labels = ['Intent', 'Integrity', 'Impact', 'Wisdom', 'Growth'];

  const size = 200;
  const center = size / 2;
  const radius = size * 0.35;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / keys.length - Math.PI / 2;
    const r = (value / 10) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const points = keys.map((key, i) => getPoint(i, scores[key]));
  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg width={size} height={size} className="overflow-visible">
      {[0.5, 1].map((scale, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={radius * scale}
          fill="none"
          stroke="#e7e5e4"
          strokeWidth="1"
        />
      ))}

      {keys.map((_, i) => {
        const p = getPoint(i, 10);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="#e7e5e4"
            strokeWidth="1"
          />
        );
      })}

      <polygon
        points={polygonPath}
        fill="rgba(139, 126, 106, 0.2)"
        stroke="#8b7e6a"
        strokeWidth="1.5"
      />

      {labels.map((label, i) => {
        const p = getPoint(i, 11.5);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            className="text-[8px] font-bold fill-[#a8a29e] uppercase tracking-tighter"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
};

export default VisualChart;
