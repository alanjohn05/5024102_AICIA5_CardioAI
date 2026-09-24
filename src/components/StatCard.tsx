import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  icon: LucideIcon;
  variant?: 'default' | 'rose' | 'amber' | 'emerald' | 'blue';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  trend,
  icon: Icon,
  variant = 'default',
  onClick,
}) => {
  const variantStyles = {
    default: 'text-slate-700 bg-slate-100',
    rose: 'text-rose-700 bg-rose-50',
    amber: 'text-amber-700 bg-amber-50',
    emerald: 'text-emerald-700 bg-emerald-50',
    blue: 'text-blue-700 bg-blue-50',
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200/90 rounded-lg p-5 transition-colors ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:bg-slate-50/50' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {value}
          </p>
        </div>
        <div className={`p-2.5 rounded-md ${variantStyles}`}>
          <Icon className="w-5 h-5 shrink-0" />
        </div>
      </div>

      {(trend || subtext) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          {trend ? (
            <div className="flex items-center gap-1.5">
              {trend.direction === 'up' && (
                <TrendingUp className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              )}
              {trend.direction === 'down' && (
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              )}
              {trend.direction === 'neutral' && (
                <Minus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              <span
                className={`font-semibold tabular-nums ${
                  trend.direction === 'up'
                    ? 'text-rose-600'
                    : trend.direction === 'down'
                    ? 'text-emerald-600'
                    : 'text-slate-600'
                }`}
              >
                {trend.value}
              </span>
              <span className="text-slate-500">{trend.label}</span>
            </div>
          ) : (
            <span>{subtext}</span>
          )}
        </div>
      )}
    </div>
  );
};
