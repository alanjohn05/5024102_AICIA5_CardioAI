import React, { useState } from 'react';
import {
  Heart,
  Activity,
  Flame,
  Dna,
  Footprints,
  Clock,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export const RiskFactorsView: React.FC = () => {
  // Interactive Simulator State
  const [simAge, setSimAge] = useState<number>(55);
  const [simSystolic, setSimSystolic] = useState<number>(135);
  const [simChol, setSimChol] = useState<number>(225);
  const [simSmoker, setSimSmoker] = useState<boolean>(false);
  const [simDiabetic, setSimDiabetic] = useState<boolean>(false);

  // Compute simulated relative risk multiplier
  const computeSimulatedRisk = () => {
    let score = 1.0;
    if (simAge >= 65) score *= 1.8;
    else if (simAge >= 50) score *= 1.35;

    if (simSystolic >= 160) score *= 2.4;
    else if (simSystolic >= 140) score *= 1.7;
    else if (simSystolic >= 130) score *= 1.25;

    if (simChol >= 240) score *= 2.1;
    else if (simChol >= 200) score *= 1.4;

    if (simSmoker) score *= 2.0;
    if (simDiabetic) score *= 1.9;

    const projectedPercent = Math.min(65, Math.round(score * 4.5));
    return {
      multiplier: score.toFixed(1),
      tenYearPercent: projectedPercent,
      tier: projectedPercent >= 20 ? 'High' : projectedPercent >= 10 ? 'Moderate' : 'Low',
    };
  };

  const simResult = computeSimulatedRisk();

  // Epidemiological Chart Data
  const bpDistributionData = [
    { category: 'Optimal (<120)', hazardRatio: 1.0, populationPercent: 42 },
    { category: 'Elevated (120-129)', hazardRatio: 1.2, populationPercent: 18 },
    { category: 'Stage 1 (130-139)', hazardRatio: 1.6, populationPercent: 24 },
    { category: 'Stage 2 (≥140)', hazardRatio: 2.5, populationPercent: 16 },
  ];

  const cholesterolTrendData = [
    { range: '<160', relativeRisk: 0.8 },
    { range: '160-199', relativeRisk: 1.0 },
    { range: '200-239', relativeRisk: 1.45 },
    { range: '240-279', relativeRisk: 2.1 },
    { range: '≥280', relativeRisk: 3.3 },
  ];

  const factorsOverview = [
    {
      name: 'Resting Blood Pressure',
      clinicalCategory: 'Hemodynamic',
      impact: 'High',
      optimalTarget: '< 120/80 mm Hg',
      modifiable: true,
      mechanism: 'Excess hydrostatic shear accelerates atherosclerotic plaque rupture and left ventricular remodeling.',
    },
    {
      name: 'Atherogenic Cholesterol (ApoB/LDL)',
      clinicalCategory: 'Metabolic',
      impact: 'High',
      optimalTarget: 'Total < 200 mg/dL, LDL < 70 mg/dL',
      modifiable: true,
      mechanism: 'Subendothelial retention of apolipoprotein B-containing lipoproteins triggers chronic arterial wall inflammation.',
    },
    {
      name: 'Impaired Fasting Glycemia / Diabetes',
      clinicalCategory: 'Endocrine',
      impact: 'High',
      optimalTarget: 'HbA1c < 5.7%, FBS < 100 mg/dL',
      modifiable: true,
      mechanism: 'Advanced glycation end-products promote diffuse microvascular ischemia and endothelial dysfunction.',
    },
    {
      name: 'Tobacco Exposure & Smoking',
      clinicalCategory: 'Environmental',
      impact: 'High',
      optimalTarget: 'Complete abstinence',
      modifiable: true,
      mechanism: 'Carbon monoxide reduces oxygen delivery while nicotine induces coronary vasoconstriction and platelet aggregation.',
    },
    {
      name: 'Physical Inactivity & Sedentary Habit',
      clinicalCategory: 'Lifestyle',
      impact: 'Moderate',
      optimalTarget: '≥ 150 min/wk moderate aerobic exercise',
      modifiable: true,
      mechanism: 'Reduced shear stress diminishes endothelial nitric oxide synthase (eNOS) phosphorylation.',
    },
    {
      name: 'Premature Family History of CAD',
      clinicalCategory: 'Genomic',
      impact: 'Moderate',
      optimalTarget: 'First-degree relative onset > 55y (M) / > 65y (F)',
      modifiable: false,
      mechanism: 'Polygenic risk scores for lipoprotein(a), vascular tone, and lipid handling pathways.',
    },
    {
      name: 'Chronological Age & Biological Sex',
      clinicalCategory: 'Demographic',
      impact: 'High',
      optimalTarget: 'Non-modifiable reference baseline',
      modifiable: false,
      mechanism: 'Accumulated oxidative stress, arterial elastin degradation, and collagen cross-linking over lifetime.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
          Cardiovascular Risk Factors Analysis
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Epidemiological parameters, clinical thresholds, and population risk correlations.
        </p>
      </div>

      {/* Interactive Risk Simulator Card */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Cardiovascular Risk Factor Simulator
              </h2>
              <p className="text-xs text-slate-500">
                Adjust clinical parameters to observe simulated 10-year ASCVD risk impact
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                Relative Multiplier
              </span>
              <span className="text-lg font-bold font-mono text-slate-900">
                {simResult.multiplier}×
              </span>
            </div>
            <div className="w-px h-7 bg-slate-200" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                10-Year Projected
              </span>
              <span
                className={`text-lg font-bold font-mono ${
                  simResult.tier === 'High'
                    ? 'text-rose-600'
                    : simResult.tier === 'Moderate'
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {simResult.tenYearPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
          {/* Age Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-slate-700">Patient Age:</span>
              <span className="font-mono font-bold text-blue-600 tabular-nums">
                {simAge} years
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="80"
              value={simAge}
              onChange={(e) => setSimAge(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>30y</span>
              <span>55y</span>
              <span>80y</span>
            </div>
          </div>

          {/* Blood Pressure Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-slate-700">Systolic Blood Pressure:</span>
              <span className="font-mono font-bold text-blue-600 tabular-nums">
                {simSystolic} mm Hg
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="190"
              value={simSystolic}
              onChange={(e) => setSimSystolic(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>100</span>
              <span>140 (HTN)</span>
              <span>190</span>
            </div>
          </div>

          {/* Cholesterol Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-slate-700">Total Cholesterol:</span>
              <span className="font-mono font-bold text-blue-600 tabular-nums">
                {simChol} mg/dL
              </span>
            </div>
            <input
              type="range"
              min="140"
              max="320"
              value={simChol}
              onChange={(e) => setSimChol(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>140</span>
              <span>200 (Target)</span>
              <span>320</span>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={simSmoker}
              onChange={(e) => setSimSmoker(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-slate-700 font-medium">Active Smoker (+2.0× hazard)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={simDiabetic}
              onChange={(e) => setSimDiabetic(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-slate-700 font-medium">Diabetic Glycemic Profile (+1.9× hazard)</span>
          </label>
        </div>
      </div>

      {/* Epidemiological Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blood Pressure vs Hazard Ratio */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Blood Pressure Category vs Ischemic Hazard
              </h3>
              <p className="text-xs text-slate-500">ACC/AHA classification and relative risk ratio</p>
            </div>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bpDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  label={{ value: 'Hazard Ratio', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }}
                />
                <Tooltip
                  formatter={(val: any) => [`${val}× Baseline Hazard`, 'Hazard Ratio']}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px' }}
                />
                <Bar dataKey="hazardRatio" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 text-center">
            Linear rise in myocardial infarction probability for each 10 mm Hg systolic increment
          </div>
        </div>

        {/* Serum Cholesterol Curve */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Total Serum Cholesterol vs Relative Risk
              </h3>
              <p className="text-xs text-slate-500">Curvilinear relationship from multi-cohort meta-analyses</p>
            </div>
            <Heart className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cholesterolTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  label={{ value: 'Relative Risk', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }}
                />
                <Tooltip
                  formatter={(val: any) => [`${val}× Risk`, 'Coronary Risk']}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="relativeRisk"
                  stroke="#dc2626"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#dc2626' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 text-center">
            Exponential plaque formation rate at levels exceeding 240 mg/dL
          </div>
        </div>
      </div>

      {/* Risk Factor Overview Table */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Risk Factor Overview</h2>
          <p className="text-xs text-slate-500">
            Comprehensive categorization of modifiable and non-modifiable cardiovascular determinants
          </p>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Risk Factor</th>
                <th className="py-2.5 px-3">Physiological Category</th>
                <th className="py-2.5 px-3">Impact Tier</th>
                <th className="py-2.5 px-3">Optimal Target</th>
                <th className="py-2.5 px-3">Modifiability</th>
                <th className="py-2.5 px-3">Pathophysiological Mechanism</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {factorsOverview.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">{item.name}</td>
                  <td className="py-3 px-3 text-slate-600">{item.clinicalCategory}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        item.impact === 'High'
                          ? 'text-rose-700 bg-rose-50 border-rose-200'
                          : 'text-amber-700 bg-amber-50 border-amber-200'
                      }`}
                    >
                      {item.impact}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">{item.optimalTarget}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded ${
                        item.modifiable
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.modifiable ? 'Modifiable' : 'Non-Modifiable'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 max-w-xs">{item.mechanism}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
