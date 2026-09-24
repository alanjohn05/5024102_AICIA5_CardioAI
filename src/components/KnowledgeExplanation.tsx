import React from 'react';
import { AnalysisResult, RiskFactorItem } from '../types/clinical';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Stethoscope,
  Lightbulb,
  ShieldAlert,
  ArrowUpRight,
  HeartPulse,
} from 'lucide-react';

interface KnowledgeExplanationProps {
  result: AnalysisResult;
}

export const KnowledgeExplanation: React.FC<KnowledgeExplanationProps> = ({ result }) => {
  const { factors, clinicalReasoning, recommendations, riskLevel } = result;

  const severityIcons = {
    high: AlertCircle,
    moderate: AlertTriangle,
    low: Info,
    normal: CheckCircle2,
  };

  const severityStyles = {
    high: {
      badge: 'text-rose-700 bg-rose-50 border-rose-200/80',
      icon: 'text-rose-600',
      border: 'border-rose-100',
    },
    moderate: {
      badge: 'text-amber-700 bg-amber-50 border-amber-200/80',
      icon: 'text-amber-600',
      border: 'border-amber-100',
    },
    low: {
      badge: 'text-blue-700 bg-blue-50 border-blue-200/80',
      icon: 'text-blue-600',
      border: 'border-blue-100',
    },
    normal: {
      badge: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
      icon: 'text-emerald-600',
      border: 'border-emerald-100',
    },
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: Analysis Explanation (Major Factor Breakdown) */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Analysis Explanation</h3>
            <p className="text-xs text-slate-500">
              Dynamically identified clinical factors contributing to the calculated risk index
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 tabular-nums">
            {factors.length} {factors.length === 1 ? 'Indicator' : 'Indicators'} Flagged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {factors.map((factor) => {
            const Icon = severityIcons[factor.severity];
            const style = severityStyles[factor.severity];

            return (
              <div
                key={factor.id}
                className={`p-4 rounded-lg border ${style.border} bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${style.icon} shrink-0`} />
                      <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                        {factor.name}
                      </h4>
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${style.badge} whitespace-nowrap`}
                    >
                      {factor.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {factor.explanation}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-slate-400">Observed: </span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {factor.value}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Reference: </span>
                    <span className="text-slate-600 font-mono">{factor.reference}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Clinical Reasoning & Medical Rules */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-6">
        <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-slate-100">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-700">
            <Stethoscope className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Clinical Reasoning</h3>
            <p className="text-xs text-slate-500">
              Rule-based synthesis explaining physiological interactions and ischemic pathways
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 text-sm text-slate-700 leading-relaxed">
          {clinicalReasoning}
        </div>

        {/* Actionable Clinical Recommendations */}
        <div className="mt-5">
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Decision Support Considerations</span>
          </h4>
          <ul className="space-y-2">
            {recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs text-slate-700 leading-normal"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Subtle Clinical Safety Disclaimer */}
      <div className="p-4 rounded-lg bg-slate-100/70 border border-slate-200 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-700">Clinical Decision Support Advisory: </span>
          This assessment is intended to support clinical decision-making and should not replace professional medical evaluation. Further clinical evaluation and physician correlation may be appropriate.
        </p>
      </div>
    </div>
  );
};
