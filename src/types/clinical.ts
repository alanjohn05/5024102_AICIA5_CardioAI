export type RiskLevel = 'Low' | 'Moderate' | 'High';

export type Sex = 'Male' | 'Female';

export type ChestPainType = 
  | 'typical_angina'      // Typical angina (substernal chest pain provoked by exertion)
  | 'atypical_angina'     // Atypical angina (features inconsistent with typical angina)
  | 'non_anginal'         // Non-anginal pain
  | 'asymptomatic';       // Asymptomatic

export type RestingECGType = 
  | 'normal'              // Normal resting ECG
  | 'st_t_abnormality'    // ST-T wave abnormality (T wave inversions and/or ST elevation/depression > 0.05 mV)
  | 'lvh';                // Showing probable or definite left ventricular hypertrophy

export type STSlopeType = 
  | 'upsloping'           // Upsloping (normal during exercise)
  | 'flat'                // Flat (subendocardial ischemia)
  | 'downsloping';        // Downsloping (severe ischemia)

export type ThalassemiaType = 
  | 'normal'              // Normal perfusion
  | 'fixed_defect'        // Fixed defect (previous infarct / scar)
  | 'reversible_defect';  // Reversible defect (viable ischemic myocardium)

export interface PatientData {
  id: string;
  name?: string;
  age: number;
  sex: Sex;
  restingBP: number;       // mm Hg (systolic)
  cholesterol: number;     // mg/dL
  fastingBS: boolean;      // fasting blood sugar > 120 mg/dL (true/false)
  maxHR: number;           // maximum heart rate achieved (bpm)
  stDepression: number;    // ST depression induced by exercise relative to rest (mm, e.g. 1.8)
  chestPainType: ChestPainType;
  restingECG: RestingECGType;
  exerciseAngina: boolean; // exercise-induced angina (true/false)
  stSlope: STSlopeType;
  majorVessels: number;    // number of major vessels (0-3) colored by fluoroscopy
  thalassemia: ThalassemiaType;
  analysisDate: string;
  notes?: string;
}

export interface RiskFactorItem {
  id: string;
  name: string;
  value: string;
  reference: string;
  severity: 'normal' | 'low' | 'moderate' | 'high';
  explanation: string;
  category: 'hemodynamic' | 'ischemic' | 'metabolic' | 'structural';
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  riskScore: number;       // 0 to 100
  confidence: number;      // 60 to 98%
  summary: string;
  factors: RiskFactorItem[];
  clinicalReasoning: string;
  recommendations: string[];
  metricsBreakdown: {
    hemodynamic: number;   // 0 - 100
    ischemic: number;      // 0 - 100
    metabolic: number;     // 0 - 100
    structural: number;    // 0 - 100
  };
}

export interface ECGWaveformSample {
  id: string;
  name: string;
  description: string;
  heartRate: number;
  rhythm: string;
  classification: 'Normal' | 'Abnormal';
  confidence: number;
  stElevationMm: number;
  prIntervalMs: number;
  qrsDurationMs: number;
  qtcIntervalMs: number;
  detectedPatterns: string[];
  clinicalSignificance: string;
  points: number[]; // normalized Y coordinates for waveform
}

export interface PatientRecord extends PatientData {
  result: AnalysisResult;
  status: 'Reviewed' | 'Pending Follow-up' | 'Referred to Cardiology';
  ecgSampleId?: string;
}

export type ActiveTab = 
  | 'overview' 
  | 'patient-analysis' 
  | 'ecg-analysis' 
  | 'risk-factors' 
  | 'model-performance' 
  | 'reports';
