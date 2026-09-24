import { PatientRecord, PatientData, ECGWaveformSample } from '../types/clinical';
import { calculateCardiovascularRisk } from '../utils/riskEngine';

// Baseline patient profiles
export const INITIAL_PATIENTS: PatientData[] = [
  {
    id: 'PT-8821',
    name: 'Robert C.',
    age: 63,
    sex: 'Male',
    restingBP: 158,
    cholesterol: 284,
    fastingBS: true,
    maxHR: 114,
    stDepression: 2.8,
    chestPainType: 'typical_angina',
    restingECG: 'lvh',
    exerciseAngina: true,
    stSlope: 'downsloping',
    majorVessels: 2,
    thalassemia: 'reversible_defect',
    analysisDate: '2026-09-21',
    notes: 'Exertional retrosternal tightness on moderate incline; historical hypertension.',
  },
  {
    id: 'PT-9402',
    name: 'Eleanor V.',
    age: 58,
    sex: 'Female',
    restingBP: 142,
    cholesterol: 256,
    fastingBS: false,
    maxHR: 132,
    stDepression: 1.9,
    chestPainType: 'atypical_angina',
    restingECG: 'st_t_abnormality',
    exerciseAngina: true,
    stSlope: 'flat',
    majorVessels: 1,
    thalassemia: 'reversible_defect',
    analysisDate: '2026-09-22',
    notes: 'Atypical epigastric and chest discomfort during treadmill protocol Stage 2.',
  },
  {
    id: 'PT-7319',
    name: 'Marcus K.',
    age: 52,
    sex: 'Male',
    restingBP: 134,
    cholesterol: 228,
    fastingBS: false,
    maxHR: 148,
    stDepression: 1.1,
    chestPainType: 'non_anginal',
    restingECG: 'normal',
    exerciseAngina: false,
    stSlope: 'flat',
    majorVessels: 0,
    thalassemia: 'normal',
    analysisDate: '2026-09-23',
    notes: 'Annual executive physical screening; mild borderline lipid elevation.',
  },
  {
    id: 'PT-6190',
    name: 'Diana T.',
    age: 47,
    sex: 'Female',
    restingBP: 126,
    cholesterol: 215,
    fastingBS: false,
    maxHR: 164,
    stDepression: 0.6,
    chestPainType: 'asymptomatic',
    restingECG: 'normal',
    exerciseAngina: false,
    stSlope: 'upsloping',
    majorVessels: 0,
    thalassemia: 'normal',
    analysisDate: '2026-09-23',
    notes: 'Routine cardiovascular checkup; asymptomatic with active lifestyle.',
  },
  {
    id: 'PT-5542',
    name: 'Julian B.',
    age: 39,
    sex: 'Male',
    restingBP: 118,
    cholesterol: 178,
    fastingBS: false,
    maxHR: 182,
    stDepression: 0.2,
    chestPainType: 'asymptomatic',
    restingECG: 'normal',
    exerciseAngina: false,
    stSlope: 'upsloping',
    majorVessels: 0,
    thalassemia: 'normal',
    analysisDate: '2026-09-24',
    notes: 'Competitive marathon runner baseline physical assessment.',
  },
  {
    id: 'PT-4210',
    name: 'Walter S.',
    age: 69,
    sex: 'Male',
    restingBP: 164,
    cholesterol: 272,
    fastingBS: true,
    maxHR: 108,
    stDepression: 3.2,
    chestPainType: 'typical_angina',
    restingECG: 'lvh',
    exerciseAngina: true,
    stSlope: 'downsloping',
    majorVessels: 3,
    thalassemia: 'reversible_defect',
    analysisDate: '2026-09-20',
    notes: 'Previous CABG evaluation; reported increasing exertional dyspnea.',
  },
  {
    id: 'PT-3891',
    name: 'Patricia H.',
    age: 61,
    sex: 'Female',
    restingBP: 138,
    cholesterol: 236,
    fastingBS: false,
    maxHR: 138,
    stDepression: 1.4,
    chestPainType: 'atypical_angina',
    restingECG: 'st_t_abnormality',
    exerciseAngina: false,
    stSlope: 'flat',
    majorVessels: 1,
    thalassemia: 'fixed_defect',
    analysisDate: '2026-09-19',
    notes: 'Referred from primary care for secondary cardiovascular evaluation.',
  },
  {
    id: 'PT-1049',
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
    analysisDate: '2026-09-24',
    notes: 'Current active consult. Symptoms reproduced at 6.0 METs on Bruce protocol.',
  },
];

// Helper to instantiate records
export function getInitialRecords(): PatientRecord[] {
  return INITIAL_PATIENTS.map((p, idx) => {
    const result = calculateCardiovascularRisk(p);
    let status: 'Reviewed' | 'Pending Follow-up' | 'Referred to Cardiology' = 'Reviewed';
    if (result.riskLevel === 'High') {
      status = idx % 2 === 0 ? 'Referred to Cardiology' : 'Pending Follow-up';
    } else if (result.riskLevel === 'Moderate') {
      status = 'Pending Follow-up';
    }
    return {
      ...p,
      result,
      status,
      ecgSampleId: result.riskLevel === 'High' ? 'ecg-ischemia' : result.riskLevel === 'Moderate' ? 'ecg-st-depression' : 'ecg-normal',
    };
  });
}

// Generates mathematical coordinates for realistic ECG waveforms
function generateECGPoints(type: 'normal' | 'ischemia' | 'st-depression' | 'afib'): number[] {
  const points: number[] = [];
  const totalSamples = 300; // 3 full beats
  const beats = type === 'afib' ? 4 : 3;
  const samplesPerBeat = totalSamples / beats;

  for (let i = 0; i < totalSamples; i++) {
    const beatPos = (i % samplesPerBeat) / samplesPerBeat;
    let y = 0;

    if (type === 'normal') {
      // P wave (0.12 - 0.20)
      if (beatPos > 0.10 && beatPos < 0.20) {
        y += Math.sin((beatPos - 0.10) / 0.10 * Math.PI) * 0.15;
      }
      // PR segment baseline
      // Q wave (0.28 - 0.30)
      if (beatPos >= 0.28 && beatPos < 0.31) {
        y -= Math.sin((beatPos - 0.28) / 0.03 * Math.PI) * 0.18;
      }
      // R peak (0.31 - 0.36)
      if (beatPos >= 0.31 && beatPos < 0.36) {
        y += Math.sin((beatPos - 0.31) / 0.05 * Math.PI) * 1.0;
      }
      // S wave (0.36 - 0.40)
      if (beatPos >= 0.36 && beatPos < 0.40) {
        y -= Math.sin((beatPos - 0.36) / 0.04 * Math.PI) * 0.28;
      }
      // T wave (0.50 - 0.68)
      if (beatPos >= 0.50 && beatPos < 0.68) {
        y += Math.sin((beatPos - 0.50) / 0.18 * Math.PI) * 0.32;
      }
      // Add very subtle physiological noise
      y += (Math.sin(i * 0.4) * 0.015);
    } else if (type === 'ischemia' || type === 'st-depression') {
      // Ischemia with ST depression and T wave inversion
      if (beatPos > 0.10 && beatPos < 0.20) {
        y += Math.sin((beatPos - 0.10) / 0.10 * Math.PI) * 0.12;
      }
      // Q wave
      if (beatPos >= 0.28 && beatPos < 0.31) {
        y -= Math.sin((beatPos - 0.28) / 0.03 * Math.PI) * 0.22;
      }
      // R peak
      if (beatPos >= 0.31 && beatPos < 0.36) {
        y += Math.sin((beatPos - 0.31) / 0.05 * Math.PI) * 0.88;
      }
      // S wave & depressed ST segment
      if (beatPos >= 0.36 && beatPos < 0.42) {
        y -= Math.sin((beatPos - 0.36) / 0.06 * Math.PI) * 0.35;
      }
      // Depressed horizontal / downsloping ST segment
      if (beatPos >= 0.42 && beatPos < 0.55) {
        y -= 0.28 + (beatPos - 0.42) * 0.25; // depressed below baseline
      }
      // Inverted / biphasic T wave
      if (beatPos >= 0.55 && beatPos < 0.72) {
        y -= Math.sin((beatPos - 0.55) / 0.17 * Math.PI) * 0.24;
      }
      y += (Math.sin(i * 0.5) * 0.015);
    } else if (type === 'afib') {
      // Rapid irregular baseline fibrillatory f-waves, absent P wave
      const fWave = Math.sin(i * 0.6) * 0.08 + Math.cos(i * 1.1) * 0.06;
      y += fWave;
      // Irregular QRS spikes
      if (beatPos >= 0.30 && beatPos < 0.35) {
        y += Math.sin((beatPos - 0.30) / 0.05 * Math.PI) * 0.95;
      }
      if (beatPos >= 0.35 && beatPos < 0.39) {
        y -= Math.sin((beatPos - 0.35) / 0.04 * Math.PI) * 0.3;
      }
      if (beatPos >= 0.45 && beatPos < 0.62) {
        y += Math.sin((beatPos - 0.45) / 0.17 * Math.PI) * 0.20;
      }
    }

    points.push(y);
  }
  return points;
}

export const SAMPLE_ECG_RECORDINGS: ECGWaveformSample[] = [
  {
    id: 'ecg-ischemia',
    name: 'PT-1049 – Stress Lead V5 (Subendocardial Ischemia)',
    description: '12-Lead rhythm strip recorded at 25 mm/s, 10 mm/mV showing planar ST depression.',
    heartRate: 122,
    rhythm: 'Sinus Tachycardia with Exertional ST Depression',
    classification: 'Abnormal',
    confidence: 93.6,
    stElevationMm: -2.4,
    prIntervalMs: 154,
    qrsDurationMs: 96,
    qtcIntervalMs: 442,
    detectedPatterns: [
      'Horizontal ST segment depression of 2.4 mm in precordial Leads V4–V6',
      'Symmetric T-wave inversion in lateral leads',
      'Preserved narrow QRS morphology (< 100 ms)',
      'Subendocardial ischemia signature consistent with multi-vessel CAD',
    ],
    clinicalSignificance: 'High-probability myocardial ischemia during metabolic demand. Correlates directly with the patient’s clinical stress risk profile.',
    points: generateECGPoints('ischemia'),
  },
  {
    id: 'ecg-normal',
    name: 'PT-5542 – Lead II (Normal Sinus Rhythm)',
    description: 'Resting diagnostic 12-lead baseline recorded at 25 mm/s, 10 mm/mV calibration.',
    heartRate: 72,
    rhythm: 'Normal Sinus Rhythm (NSR)',
    classification: 'Normal',
    confidence: 96.8,
    stElevationMm: 0.0,
    prIntervalMs: 142,
    qrsDurationMs: 84,
    qtcIntervalMs: 396,
    detectedPatterns: [
      'Normal P-wave morphology preceding every QRS complex (PR interval 142 ms)',
      'Isoelectric ST segment without elevation or depression (0.0 mm deviation)',
      'Upright T waves concordant with QRS axis in Lead II',
      'Normal electrical axis, no conduction delays or repolarization variants',
    ],
    clinicalSignificance: 'Baseline electrocardiogram within physiological standards. No acute repolarization abnormalities detected.',
    points: generateECGPoints('normal'),
  },
  {
    id: 'ecg-st-depression',
    name: 'PT-7319 – Lead V4 (Moderate Repolarization Variant)',
    description: 'Post-exercise recovery phase recording demonstrating intermediate ST displacement.',
    heartRate: 88,
    rhythm: 'Normal Sinus Rhythm with Borderline ST Deviation',
    classification: 'Abnormal',
    confidence: 86.4,
    stElevationMm: -1.1,
    prIntervalMs: 160,
    qrsDurationMs: 92,
    qtcIntervalMs: 418,
    detectedPatterns: [
      'Flat ST depression of 1.1 mm in Lead V4–V5',
      'Mild T-wave flattening across anterolateral leads',
      'Regular R-R interval without ectopic complexes',
    ],
    clinicalSignificance: 'Borderline repolarization change. Requires clinical correlation with patient symptoms and metabolic risk factors.',
    points: generateECGPoints('st-depression'),
  },
  {
    id: 'ecg-afib',
    name: 'Clinical Case 04 – Lead II (Atrial Fibrillation with RVR)',
    description: 'Emergency telemetry strip demonstrating rhythm disorganization.',
    heartRate: 128,
    rhythm: 'Atrial Fibrillation with Rapid Ventricular Response (RVR)',
    classification: 'Abnormal',
    confidence: 95.2,
    stElevationMm: -0.6,
    prIntervalMs: 0,
    qrsDurationMs: 90,
    qtcIntervalMs: 430,
    detectedPatterns: [
      'Absent discrete P-waves with fine fibrillatory baseline activity',
      'Irregularly irregular ventricular rhythm (R-R interval variation > 120 ms)',
      'Elevated ventricular rate exceeding 120 bpm',
    ],
    clinicalSignificance: 'Supraventricular tachyarrhythmia with compromised atrial kick, increasing thromboembolic risk and rate-dependent ischemia.',
    points: generateECGPoints('afib'),
  },
];
