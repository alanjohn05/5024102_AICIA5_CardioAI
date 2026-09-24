import React from 'react';
import { AnalysisResult, PatientData } from '../types/clinical';
import { ConfidenceGauge } from './ConfidenceGauge';
import { RiskBadge } from './RiskBadge';
import {
  FileText,
  Activity,
  ArrowRight,
  ShieldAlert,
  Save,
  Check,
  Stethoscope,
} from 'lucide-react';

interface ResultCardProps {
  result: AnalysisResult;
  patient: PatientData;
  onNavigateToReports: () => void;
  onNavigateToECG: () => void;
  onSaveToRegistry: () => void;
  isSaved?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  patient,
  onNavigateToReports,
  onNavigateToECG,
  onSaveToRegistry,
  isSaved = false,
}) => {
  const { riskLevel, confidence, summary, riskScore, metricsBreakdown } = result;

  const headerColors = {
    Low: 'border-l-4 border-l-emerald-500 bg-emerald-50/20',
    Moderate: 'border-l-4 border-l-amber-500 bg-amber-50/20',
    High: 'border-l-4 border-l-rose-500 bg-rose-50/20',
  }[riskLevel];

  return (
    <div className={`bg-white border border-slate-200/90 rounded-lg p-6 shadow-2xs ${headerColors}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              AI Risk Assessment
            </span>
            <RiskBadge level={riskLevel} size="md" />
          </div>

          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
              {riskLevel} Risk
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Composite Index: {riskScore}/100
            </span>
          </div>

          <p className="text-sm text-slate-700 max-w-2xl leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Circular Gauge */}
        <div className="flex items-center justify-center shrink-0 self-center md:self-auto p-2 bg-slate-50 rounded-xl border border-slate-100">
          <ConfidenceGauge confidence={confidence} riskLevel={riskLevel} size={110} />
        </div>
      </div>

      {/* Domain Vector Breakdown */}
      <div className="py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-medium text-slate-500 block">Hemodynamic</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-base font-bold text-slate-900 tabular-nums">
              {metricsBreakdown.hemodynamic}%
            </span>
            <span className="text-[10px] text-slate-400">load</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${metricsBreakdown.hemodynamic}%` }}
            />
          </div>
        </div>

        <div>
          <span className="text-[11px] font-medium text-slate-500 block">Ischemic</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-base font-bold text-slate-900 tabular-nums">
              {metricsBreakdown.ischemic}%
            </span>
            <span className="text-[10px] text-slate-400">stress</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full ${
                metricsBreakdown.ischemic > 60
                  ? 'bg-rose-600'
                  : metricsBreakdown.ischemic > 30
                  ? 'bg-amber-600'
                  : 'bg-emerald-600'
              }`}
              style={{ width: `${metricsBreakdown.ischemic}%` }}
            />
          </div>
        </div>

        <div>
          <span className="text-[11px] font-medium text-slate-500 block">Metabolic</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-base font-bold text-slate-900 tabular-nums">
              {metricsBreakdown.metabolic}%
            </span>
            <span className="text-[10px] text-slate-400">lipid/glucose</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-purple-600 h-1.5 rounded-full"
              style={{ width: `${metricsBreakdown.metabolic}%` }}
            />
          </div>
        </div>

        <div>
          <span className="text-[11px] font-medium text-slate-500 block">Structural/Anatomic</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-base font-bold text-slate-900 tabular-nums">
              {metricsBreakdown.structural}%
            </span>
            <span className="text-[10px] text-slate-400">vessel/age</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-slate-700 h-1.5 rounded-full"
              style={{ width: `${metricsBreakdown.structural}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action controls */}
      <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onSaveToRegistry}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
              isSaved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Saved to Registry</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Patient Record</span>
              </>
            )}
          </button>

          <button
            onClick={onNavigateToECG}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>Correlate ECG Signal</span>
          </button>
        </div>

        <button
          onClick={onNavigateToReports}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View Detailed Clinical Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
