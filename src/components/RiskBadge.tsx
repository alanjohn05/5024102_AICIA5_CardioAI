import React from 'react';
import { RiskLevel } from '../types/clinical';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const config = {
    Low: {
      text: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-50 border-emerald-200/80',
      dot: 'bg-emerald-500',
      icon: CheckCircle2,
      label: 'Low Risk',
    },
    Moderate: {
      text: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50 border-amber-200/80',
      dot: 'bg-amber-500',
      icon: AlertTriangle,
      label: 'Moderate Risk',
    },
    High: {
      text: 'text-rose-700 dark:text-rose-400',
      bg: 'bg-rose-50 border-rose-200/80',
      dot: 'bg-rose-500',
      icon: AlertCircle,
      label: 'High Risk',
    },
  }[level];

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded border ${config.bg} ${config.text} ${sizeClasses} whitespace-nowrap`}
    >
      {showIcon && <Icon className={`${iconSizes} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
};
