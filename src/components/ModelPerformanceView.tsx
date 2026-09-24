import React from 'react';
import {
  BrainCircuit,
  BarChart2,
  CheckCircle2,
  Cpu,
  Layers,
  FileCheck,
  TrendingUp,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export const ModelPerformanceView: React.FC = () => {
  // Feature importance data
  const featureImportanceData = [
    { feature: 'ST Depression (Oldpeak)', weight: 18.4, rank: 1 },
    { feature: 'Major Vessels (ca)', weight: 16.2, rank: 2 },
    { feature: 'Max Heart Rate (thalach)', weight: 14.8, rank: 3 },
    { feature: 'Chest Pain Type (cp)', weight: 13.5, rank: 4 },
    { feature: 'Thalassemia (thal)', weight: 11.2, rank: 5 },
    { feature: 'Age', weight: 9.1, rank: 6 },
    { feature: 'Serum Cholesterol', weight: 7.6, rank: 7 },
    { feature: 'Resting Blood Pressure', weight: 5.4, rank: 8 },
    { feature: 'Exercise-Induced Angina', weight: 3.8, rank: 9 },
  ];

  // Benchmark model comparison
  const modelComparisonData = [
    { model: 'Random Forest (Ensemble)', accuracy: 89.4, f1: 89.6, recall: 91.2 },
    { model: 'Gradient Boosting (XGB)', accuracy: 88.7, f1: 88.9, recall: 90.1 },
    { model: 'Support Vector Machine', accuracy: 85.2, f1: 85.0, recall: 86.4 },
    { model: 'Multi-layer Perceptron (NN)', accuracy: 84.6, f1: 84.8, recall: 85.9 },
    { model: 'Logistic Regression', accuracy: 83.1, f1: 82.9, recall: 83.7 },
  ];

  // ROC Curve points
  const rocCurveData = [
    { fpr: 0.0, tpr: 0.0 },
    { fpr: 0.04, tpr: 0.42 },
    { fpr: 0.08, tpr: 0.68 },
    { fpr: 0.12, tpr: 0.84 },
    { fpr: 0.16, tpr: 0.91 },
    { fpr: 0.24, tpr: 0.95 },
    { fpr: 0.38, tpr: 0.98 },
    { fpr: 0.60, tpr: 0.99 },
    { fpr: 1.0, tpr: 1.0 },
  ];

  // Confusion Matrix numbers (309 benchmark test cohort)
  // TP = 142, FN = 13 (Sensitivity = 142/155 = 91.6%)
  // FP = 19, TN = 135 (Specificity = 135/154 = 87.7%)
  const cm = {
    tp: 142,
    fn: 13,
    fp: 19,
    tn: 135,
    total: 309,
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
          Model Performance & Validation Analytics
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Supervised machine learning evaluation on multi-center benchmark clinical cohorts
        </p>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200/90 rounded-lg shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Overall Accuracy</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              89.4%
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">95% CI</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">10-Fold Stratified CV</span>
        </div>

        <div className="p-4 bg-white border border-slate-200/90 rounded-lg shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Precision</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              88.2%
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">PPV</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Positive Predictive Value</span>
        </div>

        <div className="p-4 bg-white border border-slate-200/90 rounded-lg shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Recall (Sensitivity)</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              91.5%
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">TPR</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Ischemia Detection Rate</span>
        </div>

        <div className="p-4 bg-white border border-slate-200/90 rounded-lg shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">F1 Score & AUC</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              89.8%
            </span>
            <span className="text-[11px] text-blue-600 font-mono">AUC 0.942</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Harmonic balanced mean</span>
        </div>
      </div>

      {/* Row 2: Confusion Matrix & ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix Card */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Confusion Matrix
                </h2>
                <p className="text-xs text-slate-500">
                  Validation cohort test partition (N = {cm.total} patient cases)
                </p>
              </div>
              <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                Binary Split
              </span>
            </div>

            {/* Matrix Visual Grid */}
            <div className="mt-5 max-w-sm mx-auto">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {/* Header Row */}
                <div />
                <div className="font-semibold text-slate-600 py-1 bg-slate-50 rounded">
                  Pred. Positive
                </div>
                <div className="font-semibold text-slate-600 py-1 bg-slate-50 rounded">
                  Pred. Negative
                </div>

                {/* Actual Positive Row */}
                <div className="flex items-center justify-center font-semibold text-slate-600 bg-slate-50 rounded px-1">
                  Actual Positive
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-center">
                  <span className="text-xl font-bold font-mono text-emerald-800 tabular-nums block">
                    {cm.tp}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 uppercase">
                    True Pos (TP)
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">Sensitivity 91.6%</span>
                </div>
                <div className="p-4 bg-rose-50 border border-rose-200 rounded text-center">
                  <span className="text-xl font-bold font-mono text-rose-800 tabular-nums block">
                    {cm.fn}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-700 uppercase">
                    False Neg (FN)
                  </span>
                  <span className="text-[10px] text-rose-600 block mt-0.5">Missed rate 8.4%</span>
                </div>

                {/* Actual Negative Row */}
                <div className="flex items-center justify-center font-semibold text-slate-600 bg-slate-50 rounded px-1">
                  Actual Negative
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded text-center">
                  <span className="text-xl font-bold font-mono text-amber-800 tabular-nums block">
                    {cm.fp}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-700 uppercase">
                    False Pos (FP)
                  </span>
                  <span className="text-[10px] text-amber-600 block mt-0.5">Type I error 12.3%</span>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-center">
                  <span className="text-xl font-bold font-mono text-emerald-800 tabular-nums block">
                    {cm.tn}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 uppercase">
                    True Neg (TN)
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">Specificity 87.7%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Specificity: 87.7%</span>
            <span>Negative Predictive Value: 91.2%</span>
            <span>Balanced Accuracy: 89.6%</span>
          </div>
        </div>

        {/* ROC Curve Card */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Receiver Operating Characteristic (ROC)
                </h2>
                <p className="text-xs text-slate-500">
                  True positive rate vs false positive rate across discriminant thresholds
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                AUC = 0.942
              </span>
            </div>

            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rocCurveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="fpr"
                    domain={[0, 1]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    label={{ value: '1 - Specificity (FPR)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#94a3b8' }}
                  />
                  <YAxis
                    domain={[0, 1]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    label={{ value: 'Sensitivity (TPR)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }}
                  />
                  <Tooltip
                    formatter={(val: any) => [`${(Number(val || 0) * 100).toFixed(1)}%`, 'Rate']}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tpr"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#2563eb' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 text-center">
            AUC of 0.942 demonstrates high discriminatory capability in clinical risk stratification
          </div>
        </div>
      </div>

      {/* Row 3: Feature Importance Horizontal Chart */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
        <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Clinical Feature Importance (Gini Impurity & SHAP Weights)
            </h2>
            <p className="text-xs text-slate-500">
              Contribution of clinical parameters to random forest decision trees
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Sum = 100% Relative Weight</span>
        </div>

        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={featureImportanceData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 140, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" horizontal={false} />
              <XAxis
                type="number"
                unit="%"
                tick={{ fontSize: 11, fill: '#64748b' }}
                domain={[0, 22]}
              />
              <YAxis
                dataKey="feature"
                type="category"
                tick={{ fontSize: 11, fill: '#1e293b' }}
                width={135}
              />
              <Tooltip
                formatter={(val: any) => [`${val}% Weight`, 'Feature Weight']}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px' }}
              />
              <Bar dataKey="weight" fill="#2563eb" radius={[0, 4, 4, 0]}>
                {featureImportanceData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index < 3 ? '#1d4ed8' : index < 6 ? '#3b82f6' : '#93c5fd'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 4: Classifier Comparison Table & Model Architecture Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Comparison Table (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">
              Algorithm Benchmark Comparison
            </h2>
            <p className="text-xs text-slate-500">
              Evaluated architectures across identical 10-fold cross-validation folds
            </p>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Architecture</th>
                  <th className="py-2.5 px-3 text-right">Accuracy</th>
                  <th className="py-2.5 px-3 text-right">F1 Score</th>
                  <th className="py-2.5 px-3 text-right">Recall</th>
                  <th className="py-2.5 px-3 text-right">Selection Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modelComparisonData.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      idx === 0 ? 'bg-blue-50/40 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-slate-900 flex items-center gap-2">
                      {idx === 0 && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                      <span>{item.model}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-800">
                      {item.accuracy}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-800">
                      {item.f1}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-800">
                      {item.recall}%
                    </td>
                    <td className="py-3 px-3 text-right">
                      {idx === 0 ? (
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                          Production Model
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Evaluated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Model Information Metadata (1 col) */}
        <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Cpu className="w-4.5 h-4.5 text-blue-600" />
              <div>
                <h3 className="text-base font-semibold text-slate-900">Model Information</h3>
                <p className="text-xs text-slate-500">Architecture specifications</p>
              </div>
            </div>

            <dl className="mt-3 space-y-2.5 text-xs">
              <div>
                <dt className="text-slate-400 font-medium">Model Architecture</dt>
                <dd className="font-semibold text-slate-900 mt-0.5">
                  Random Forest Classifier (150 Estimators)
                </dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Learning Paradigm</dt>
                <dd className="font-semibold text-slate-900 mt-0.5">
                  Supervised Machine Learning
                </dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Validation Protocol</dt>
                <dd className="font-semibold text-slate-900 mt-0.5">
                  10-Fold Stratified Cross-Validation
                </dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Input Feature Space</dt>
                <dd className="font-semibold text-slate-900 mt-0.5">
                  13 Clinical & Cardiovascular Parameters
                </dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Output Classification</dt>
                <dd className="font-semibold text-slate-900 mt-0.5">
                  Stratified Cardiovascular Risk Tiers (Low / Mod / High)
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Trained on multi-center benchmark clinical datasets with zero data leakage.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
