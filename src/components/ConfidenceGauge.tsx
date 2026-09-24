import React from 'react';
import { RiskLevel } from '../types/clinical';

interface ConfidenceGaugeProps {
  confidence: number; // 0 - 100
  riskLevel: RiskLevel;
  size?: number; // px diameter
  strokeWidth?: number;
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({
  confidence,
  riskLevel,
  size = 120,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;

  const colorConfig = {
    Low: {
      stroke: '#059669', // emerald-600
      track: '#d1fae5', // emerald-100
      text: 'text-emerald-700',
    },
    Moderate: {
      stroke: '#d97706', // amber-600
      track: '#fef3c7', // amber-100
      text: 'text-amber-700',
    },
    High: {
      stroke: '#dc2626', // rose-600
      track: '#fee2e2', // rose-100
      text: 'text-rose-700',
    },
  }[riskLevel];

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorConfig.track}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorConfig.stroke}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`text-2xl font-bold tracking-tight tabular-nums ${colorConfig.text}`}>
          {confidence}%
        </span>
        <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
          Confidence
        </span>
      </div>
    </div>
  );
};
