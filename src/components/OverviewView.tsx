import React, { useState } from 'react';
import {
  Users,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  FileText,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { PatientRecord, RiskLevel, ActiveTab } from '../types/clinical';
import { StatCard } from './StatCard';
import { RiskBadge } from './RiskBadge';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface OverviewViewProps {
  patients: PatientRecord[];
  onSelectPatient: (patient: PatientRecord) => void;
  onNavigateToTab: (tab: ActiveTab) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  patients,
  onSelectPatient,
  onNavigateToTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | RiskLevel>('All');

  // Counts
  const totalCount = 1428; // Populated clinical registry size
  const highCount = 342;
  const moderateCount = 486;
  const lowCount = 600;

  // Donut chart data
  const pieData = [
    { name: 'Low Risk', value: lowCount, color: '#059669' },
    { name: 'Moderate Risk', value: moderateCount, color: '#d97706' },
    { name: 'High Risk', value: highCount, color: '#dc2626' },
  ];

  // Filter recent patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRisk = riskFilter === 'All' || p.result.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
          Cardiovascular Health Overview
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          AI-assisted analysis of clinical and physiological indicators.
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Patients Analysed"
          value={totalCount.toLocaleString()}
          trend={{ value: '+4.8%', direction: 'up', label: 'vs last quarter' }}
          icon={Users}
          variant="blue"
        />
        <StatCard
          label="High Risk Cases"
          value={highCount.toLocaleString()}
          trend={{ value: '24.0%', direction: 'neutral', label: 'of total cohort' }}
          icon={AlertCircle}
          variant="rose"
        />
        <StatCard
          label="Moderate Risk Cases"
          value={moderateCount.toLocaleString()}
          trend={{ value: '34.0%', direction: 'neutral', label: 'under surveillance' }}
          icon={AlertTriangle}
          variant="amber"
        />
        <StatCard
          label="Low Risk Cases"
          value={lowCount.toLocaleString()}
          trend={{ value: '42.0%', direction: 'neutral', label: 'routine screening' }}
          icon={CheckCircle2}
          variant="emerald"
        />
      </div>

      {/* Middle Section: Recent Patient Analyses Table & Risk Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Patient Analyses Table (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-lg p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Recent Patient Analyses
                </h2>
                <p className="text-xs text-slate-500">
                  Active patient registry with clinical risk classifications
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search ID or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-36 sm:w-44"
                  />
                </div>

                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value as 'All' | RiskLevel)}
                  className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden text-slate-700"
                >
                  <option value="All">All Risks</option>
                  <option value="High">High</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Patient ID</th>
                    <th className="py-2.5 px-3">Age / Sex</th>
                    <th className="py-2.5 px-3">Analysis Date</th>
                    <th className="py-2.5 px-3">Risk Level</th>
                    <th className="py-2.5 px-3 text-right">Confidence</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                    <th className="py-2.5 px-2 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredPatients.slice(0, 6).map((patient) => (
                    <tr
                      key={patient.id}
                      onClick={() => onSelectPatient(patient)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-3">
                        <span className="font-mono font-semibold text-blue-600 block">
                          {patient.id}
                        </span>
                        {patient.name && (
                          <span className="text-[11px] text-slate-500">{patient.name}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 tabular-nums text-slate-700">
                        {patient.age}y · {patient.sex === 'Male' ? 'M' : 'F'}
                      </td>
                      <td className="py-3 px-3 text-slate-500 tabular-nums">
                        {patient.analysisDate}
                      </td>
                      <td className="py-3 px-3">
                        <RiskBadge level={patient.result.riskLevel} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-medium tabular-nums text-slate-900">
                        {patient.result.confidence}%
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded ${
                            patient.status === 'Referred to Cardiology'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : patient.status === 'Pending Follow-up'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right text-slate-400 group-hover:text-blue-600">
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPatients.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500">
                  No patient evaluations match the selected search criteria.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing top recent evaluations</span>
            <button
              onClick={() => onNavigateToTab('reports')}
              className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
            >
              <span>View all in Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Risk Distribution Donut Chart (1 col) */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Risk Distribution</h2>
            <p className="text-xs text-slate-500">Clinical cohort patient stratification</p>

            <div className="h-56 mt-3 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} patients (${((Number(val || 0) / totalCount) * 100).toFixed(1)}%)`, 'Volume']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold tabular-nums text-slate-900">
                  {totalCount.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Analysed
                </span>
              </div>
            </div>

            {/* Clean metadata list */}
            <div className="space-y-2 mt-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-slate-600">Low Risk Cases</span>
                </div>
                <div className="font-mono tabular-nums text-slate-800">
                  600 <span className="text-slate-400 text-[11px]">(42.0%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <span className="text-slate-600">Moderate Risk Cases</span>
                </div>
                <div className="font-mono tabular-nums text-slate-800">
                  486 <span className="text-slate-400 text-[11px]">(34.0%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span className="text-slate-600">High Risk Cases</span>
                </div>
                <div className="font-mono tabular-nums text-slate-800">
                  342 <span className="text-slate-400 text-[11px]">(24.0%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateToTab('patient-analysis')}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-2xs text-center cursor-pointer"
            >
              Analyze New Patient
            </button>
          </div>
        </div>
      </div>

      {/* Model Performance Preview Card */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-blue-50 text-blue-600">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Model Performance & Validation Summary
              </h2>
              <p className="text-xs text-slate-500">
                Supervised classification metrics based on multi-center benchmark cohort evaluation
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('model-performance')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            <span>View Full Confusion Matrix & Feature Weights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 block">Accuracy</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                89.4%
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">± 1.2%</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">10-Fold Stratified CV</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 block">Precision</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                88.1%
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">Positive Pred.</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Low false positive rate</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 block">Recall (Sensitivity)</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                91.2%
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">True Pos. Rate</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Ischemia detection rate</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 block">F1 Score</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                89.6%
              </span>
              <span className="text-[11px] text-slate-500 font-mono">AUC 0.94</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Harmonic mean</span>
          </div>
        </div>
      </div>
    </div>
  );
};
