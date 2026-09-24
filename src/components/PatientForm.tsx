import React, { useState } from 'react';
import {
  User,
  Heart,
  Activity,
  Sparkles,
  RotateCcw,
  HelpCircle,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import {
  PatientData,
  ChestPainType,
  RestingECGType,
  STSlopeType,
  ThalassemiaType,
  Sex,
} from '../types/clinical';

interface PatientFormProps {
  initialData?: PatientData;
  isAnalyzing: boolean;
  onAnalyze: (data: PatientData) => void;
  onLoadPreset: (presetType: 'high' | 'moderate' | 'low') => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  initialData,
  isAnalyzing,
  onAnalyze,
  onLoadPreset,
}) => {
  const [formData, setFormData] = useState<PatientData>(
    initialData || {
      id: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: 'Arthur M.',
      age: 57,
      sex: 'Male',
      restingBP: 152,
      cholesterol: 268,
      fastingBS: true,
      maxHR: 122,
      stDepression: 2.4,
      chestPainType: 'typical_angina',
      restingECG: 'st_t_abnormality',
      exerciseAngina: true,
      stSlope: 'flat',
      majorVessels: 2,
      thalassemia: 'reversible_defect',
      analysisDate: new Date().toISOString().split('T')[0],
      notes: 'Consultation following abnormal Bruce stress test protocol.',
    }
  );

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // When initialData changes (e.g. from preset)
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = <K extends keyof PatientData>(key: K, value: PatientData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    // clear error for this field
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.age || formData.age < 18 || formData.age > 110) {
      errors.age = 'Age must be between 18 and 110 years.';
    }
    if (!formData.restingBP || formData.restingBP < 60 || formData.restingBP > 260) {
      errors.restingBP = 'Resting BP must be between 60 and 260 mm Hg.';
    }
    if (!formData.cholesterol || formData.cholesterol < 90 || formData.cholesterol > 600) {
      errors.cholesterol = 'Cholesterol must be between 90 and 600 mg/dL.';
    }
    if (!formData.maxHR || formData.maxHR < 40 || formData.maxHR > 240) {
      errors.maxHR = 'Max Heart Rate must be between 40 and 240 bpm.';
    }
    if (formData.stDepression === undefined || formData.stDepression < 0 || formData.stDepression > 8) {
      errors.stDepression = 'ST Depression must be between 0.0 and 8.0 mm.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAnalyze(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-100/80 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700">Clinical Presets:</span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Load validated clinical cohort profiles
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onLoadPreset('high')}
            className="px-2.5 py-1 text-xs font-medium text-rose-700 bg-white border border-rose-200 rounded hover:bg-rose-50 transition-colors shadow-2xs"
          >
            High Risk Profile
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset('moderate')}
            className="px-2.5 py-1 text-xs font-medium text-amber-700 bg-white border border-amber-200 rounded hover:bg-amber-50 transition-colors shadow-2xs"
          >
            Moderate Risk Profile
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset('low')}
            className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-white border border-emerald-200 rounded hover:bg-emerald-50 transition-colors shadow-2xs"
          >
            Low Risk Profile
          </button>
        </div>
      </div>

      {/* SECTION A: Patient Information */}
      <div className="p-5 bg-white border border-slate-200/90 rounded-lg">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center justify-center w-6 h-6 rounded bg-blue-50 text-blue-600 font-semibold text-xs">
            A
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Patient Demographics</h3>
            <p className="text-xs text-slate-500">Baseline biological indicators and case identifier</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Patient ID */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Patient Registry ID
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => handleChange('id', e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="e.g. PT-1049"
              required
            />
          </div>

          {/* Age */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-700">
                Age <span className="text-slate-400">(Years)</span>
              </label>
              <span className="text-[11px] text-slate-400">Range: 18–100</span>
            </div>
            <input
              type="number"
              min="18"
              max="110"
              value={formData.age}
              onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 text-sm font-mono border rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                validationErrors.age ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
              }`}
              required
            />
            {validationErrors.age && (
              <p className="mt-1 text-xs text-rose-600">{validationErrors.age}</p>
            )}
          </div>

          {/* Sex */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Biological Sex</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Male', 'Female'] as Sex[]).map((sex) => (
                <button
                  key={sex}
                  type="button"
                  onClick={() => handleChange('sex', sex)}
                  className={`px-3 py-2 text-xs font-medium rounded-md border text-center transition-colors cursor-pointer ${
                    formData.sex === sex
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {sex}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: Clinical Parameters */}
      <div className="p-5 bg-white border border-slate-200/90 rounded-lg">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center justify-center w-6 h-6 rounded bg-blue-50 text-blue-600 font-semibold text-xs">
            B
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Clinical & Metabolic Parameters</h3>
            <p className="text-xs text-slate-500">Resting vitals, lipid profile, and stress response</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Resting Blood Pressure */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-700">
                Resting Blood Pressure
              </label>
              <span className="text-[11px] text-slate-400">mm Hg (Systolic)</span>
            </div>
            <input
              type="number"
              min="60"
              max="260"
              value={formData.restingBP}
              onChange={(e) => handleChange('restingBP', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 text-sm font-mono border rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                validationErrors.restingBP ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Target: &lt; 120</span>
              <span
                className={`font-medium ${
                  formData.restingBP >= 140
                    ? 'text-rose-600'
                    : formData.restingBP >= 130
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {formData.restingBP >= 140
                  ? 'Stage 2 HTN'
                  : formData.restingBP >= 130
                  ? 'Stage 1 HTN'
                  : 'Normal'}
              </span>
            </div>
          </div>

          {/* Serum Cholesterol */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-700">
                Serum Cholesterol
              </label>
              <span className="text-[11px] text-slate-400">mg/dL</span>
            </div>
            <input
              type="number"
              min="90"
              max="600"
              value={formData.cholesterol}
              onChange={(e) => handleChange('cholesterol', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 text-sm font-mono border rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                validationErrors.cholesterol ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Target: &lt; 200</span>
              <span
                className={`font-medium ${
                  formData.cholesterol >= 240
                    ? 'text-rose-600'
                    : formData.cholesterol >= 200
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {formData.cholesterol >= 240
                  ? 'High'
                  : formData.cholesterol >= 200
                  ? 'Borderline'
                  : 'Desirable'}
              </span>
            </div>
          </div>

          {/* Fasting Blood Sugar */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Fasting Blood Sugar &gt; 120 mg/dL
            </label>
            <div className="grid grid-cols-2 gap-2 mt-0.5">
              <button
                type="button"
                onClick={() => handleChange('fastingBS', false)}
                className={`px-3 py-2 text-xs font-medium rounded-md border text-center transition-colors cursor-pointer ${
                  !formData.fastingBS
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                No (≤ 120 mg/dL)
              </button>
              <button
                type="button"
                onClick={() => handleChange('fastingBS', true)}
                className={`px-3 py-2 text-xs font-medium rounded-md border text-center transition-colors cursor-pointer ${
                  formData.fastingBS
                    ? 'bg-amber-50 text-amber-700 border-amber-300 font-semibold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Yes (&gt; 120 mg/dL)
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Screening marker for diabetes mellitus</p>
          </div>

          {/* Maximum Heart Rate */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-700">
                Max Achieved Heart Rate
              </label>
              <span className="text-[11px] text-slate-400">bpm</span>
            </div>
            <input
              type="number"
              min="40"
              max="240"
              value={formData.maxHR}
              onChange={(e) => handleChange('maxHR', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Predicted max: {220 - formData.age} bpm</span>
              <span className="text-slate-600 font-medium">
                {Math.round((formData.maxHR / (220 - formData.age)) * 100)}% achieved
              </span>
            </div>
          </div>

          {/* ST Depression */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-700">
                ST Depression (Oldpeak)
              </label>
              <span className="text-[11px] text-slate-400">mm displacement</span>
            </div>
            <input
              type="number"
              step="0.1"
              min="0.0"
              max="8.0"
              value={formData.stDepression}
              onChange={(e) => handleChange('stDepression', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Normal: &lt; 1.0 mm</span>
              <span
                className={`font-medium ${
                  formData.stDepression >= 2.0
                    ? 'text-rose-600'
                    : formData.stDepression >= 1.0
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {formData.stDepression >= 2.0
                  ? 'Severe Ischemia'
                  : formData.stDepression >= 1.0
                  ? 'Ischemic'
                  : 'Normal'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION C: Cardiovascular Indicators */}
      <div className="p-5 bg-white border border-slate-200/90 rounded-lg">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center justify-center w-6 h-6 rounded bg-blue-50 text-blue-600 font-semibold text-xs">
            C
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Cardiovascular & Diagnostic Indicators</h3>
            <p className="text-xs text-slate-500">Angina patterns, resting ECG, fluoroscopy, and perfusion defect status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Chest Pain Type */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Chest Pain Classification
            </label>
            <select
              value={formData.chestPainType}
              onChange={(e) => handleChange('chestPainType', e.target.value as ChestPainType)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="typical_angina">Type 1: Typical Angina</option>
              <option value="atypical_angina">Type 2: Atypical Angina</option>
              <option value="non_anginal">Type 3: Non-Anginal Pain</option>
              <option value="asymptomatic">Type 4: Asymptomatic</option>
            </select>
          </div>

          {/* Resting ECG */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Resting Electrocardiogram (ECG)
            </label>
            <select
              value={formData.restingECG}
              onChange={(e) => handleChange('restingECG', e.target.value as RestingECGType)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="normal">Normal Baseline</option>
              <option value="st_t_abnormality">ST-T Wave Abnormality (&gt; 0.05 mV)</option>
              <option value="lvh">Left Ventricular Hypertrophy (LVH)</option>
            </select>
          </div>

          {/* Exercise-Induced Angina */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Exercise-Induced Angina
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleChange('exerciseAngina', false)}
                className={`px-3 py-2 text-xs font-medium rounded-md border text-center transition-colors cursor-pointer ${
                  !formData.exerciseAngina
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                No (Absent)
              </button>
              <button
                type="button"
                onClick={() => handleChange('exerciseAngina', true)}
                className={`px-3 py-2 text-xs font-medium rounded-md border text-center transition-colors cursor-pointer ${
                  formData.exerciseAngina
                    ? 'bg-rose-50 text-rose-700 border-rose-300 font-semibold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Yes (Present)
              </button>
            </div>
          </div>

          {/* ST Slope */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Peak Exercise ST Segment Slope
            </label>
            <select
              value={formData.stSlope}
              onChange={(e) => handleChange('stSlope', e.target.value as STSlopeType)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="upsloping">Upsloping (Physiological)</option>
              <option value="flat">Flat (Subendocardial Ischemia)</option>
              <option value="downsloping">Downsloping (Severe Ischemia)</option>
            </select>
          </div>

          {/* Number of Major Vessels */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Major Fluoroscopy Vessels (0–3)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleChange('majorVessels', num)}
                  className={`py-2 text-xs font-mono font-medium rounded border text-center transition-colors cursor-pointer ${
                    formData.majorVessels === num
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Vessels opacified by fluoroscopy</p>
          </div>

          {/* Thalassemia */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Thallium Scintigraphy Perfusion
            </label>
            <select
              value={formData.thalassemia}
              onChange={(e) => handleChange('thalassemia', e.target.value as ThalassemiaType)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="normal">Normal Perfusion</option>
              <option value="fixed_defect">Fixed Defect (Prior Scar)</option>
              <option value="reversible_defect">Reversible Defect (Active Ischemia)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action / Analyze Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900 text-white rounded-lg">
        <div className="text-center sm:text-left">
          <p className="text-xs font-semibold text-white">Generate Cardiovascular Assessment</p>
          <p className="text-[11px] text-slate-400">
            Computes deterministic feature weights and multi-factorial clinical rules.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="submit"
            disabled={isAnalyzing}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-md transition-all shadow-sm ${
              isAnalyzing
                ? 'opacity-80 cursor-wait'
                : 'hover:bg-blue-500 active:bg-blue-700 cursor-pointer'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Synthesizing Clinical Rules...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Patient</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
