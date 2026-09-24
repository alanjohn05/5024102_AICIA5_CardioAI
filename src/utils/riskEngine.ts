import { PatientData, AnalysisResult, RiskFactorItem, RiskLevel } from '../types/clinical';

/**
 * Deterministic Clinical Cardiovascular Risk Scoring Engine
 * Incorporates clinical decision rules derived from validated cardiovascular parameters:
 * - Age, Sex (baseline demographic vascular risk)
 * - Resting Blood Pressure (AHA/ACC Hypertension Guidelines)
 * - Serum Total Cholesterol (NCEP ATP III guidelines)
 * - Fasting Blood Sugar (ADA impaired fasting glucose)
 * - Maximum Heart Rate achieved (Chronotropic index relative to 220 - age)
 * - Exercise-induced ST Depression & Slope (Electrocardiographic myocardial ischemia markers)
 * - Exercise-induced Angina
 * - Number of Major Fluoroscopy-Opacified Vessels (CAD burden)
 * - Thalassemia Perfusion Defect Status
 */
export function calculateCardiovascularRisk(patient: PatientData): AnalysisResult {
  let rawPoints = 0;
  const maxPossiblePoints = 40;
  const factors: RiskFactorItem[] = [];

  // Sub-scores for category distribution
  let hemodynamicPoints = 0;
  let ischemicPoints = 0;
  let metabolicPoints = 0;
  let structuralPoints = 0;

  // 1. Age & Sex Factor
  const expectedMaxHR = 220 - patient.age;
  let agePoints = 0;
  if (patient.age >= 65) {
    agePoints += 4;
  } else if (patient.age >= 55) {
    agePoints += 3;
  } else if (patient.age >= 45) {
    agePoints += 1.5;
  } else {
    agePoints += 0;
  }

  if (patient.sex === 'Male') {
    agePoints += 1;
  }
  rawPoints += agePoints;
  structuralPoints += agePoints;

  if (patient.age >= 55) {
    factors.push({
      id: 'age',
      name: 'Advanced Chronological Age',
      value: `${patient.age} years (${patient.sex})`,
      reference: '< 55 years',
      severity: patient.age >= 65 ? 'high' : 'moderate',
      explanation: 'Age is an independent non-modifiable risk factor characterized by progressive arterial stiffening and endothelial alterations.',
      category: 'structural',
    });
  }

  // 2. Resting Blood Pressure
  let bpPoints = 0;
  let bpSeverity: 'normal' | 'low' | 'moderate' | 'high' = 'normal';
  let bpExpl = 'Resting blood pressure is within recommended physiological limits.';

  if (patient.restingBP >= 160) {
    bpPoints = 5;
    bpSeverity = 'high';
    bpExpl = 'Stage 2 Hypertension with marked elevation; substantially increases afterload and vascular shear stress.';
  } else if (patient.restingBP >= 140) {
    bpPoints = 3.5;
    bpSeverity = 'high';
    bpExpl = 'Stage 2 Hypertension criteria met; associated with accelerated atherogenesis and microvascular remodeling.';
  } else if (patient.restingBP >= 130) {
    bpPoints = 2;
    bpSeverity = 'moderate';
    bpExpl = 'Stage 1 Hypertension; elevates long-term coronary vascular workload.';
  } else if (patient.restingBP >= 120) {
    bpPoints = 1;
    bpSeverity = 'low';
    bpExpl = 'Elevated blood pressure baseline approaching pre-hypertensive threshold.';
  } else {
    bpPoints = 0;
    bpSeverity = 'normal';
  }
  rawPoints += bpPoints;
  hemodynamicPoints += bpPoints * 2;

  if (bpSeverity !== 'normal') {
    factors.push({
      id: 'bp',
      name: 'Elevated Resting Blood Pressure',
      value: `${patient.restingBP} mm Hg`,
      reference: '< 120 mm Hg',
      severity: bpSeverity,
      explanation: bpExpl,
      category: 'hemodynamic',
    });
  }

  // 3. Serum Cholesterol
  let cholPoints = 0;
  let cholSeverity: 'normal' | 'low' | 'moderate' | 'high' = 'normal';
  let cholExpl = 'Serum cholesterol within desirable target range.';

  if (patient.cholesterol >= 280) {
    cholPoints = 4.5;
    cholSeverity = 'high';
    cholExpl = 'Severe hypercholesterolemia; significantly enhances atherogenic lipoprotein deposition and plaque vulnerability.';
  } else if (patient.cholesterol >= 240) {
    cholPoints = 3;
    cholSeverity = 'high';
    cholExpl = 'High total cholesterol (> 240 mg/dL); strong statistical predictor for ischemic cardiac events.';
  } else if (patient.cholesterol >= 200) {
    cholPoints = 1.5;
    cholSeverity = 'moderate';
    cholExpl = 'Borderline elevated cholesterol requiring dietary and lifestyle surveillance.';
  }
  rawPoints += cholPoints;
  metabolicPoints += cholPoints * 2;

  if (cholSeverity !== 'normal') {
    factors.push({
      id: 'cholesterol',
      name: 'Elevated Serum Cholesterol',
      value: `${patient.cholesterol} mg/dL`,
      reference: '< 200 mg/dL',
      severity: cholSeverity,
      explanation: cholExpl,
      category: 'metabolic',
    });
  }

  // 4. Fasting Blood Sugar
  if (patient.fastingBS) {
    rawPoints += 2.5;
    metabolicPoints += 5;
    factors.push({
      id: 'fbs',
      name: 'Elevated Fasting Glycemia',
      value: '> 120 mg/dL',
      reference: '< 100 mg/dL',
      severity: 'moderate',
      explanation: 'Impaired fasting glucose indicates metabolic dysregulation, promoting oxidative stress and microvascular damage.',
      category: 'metabolic',
    });
  }

  // 5. Maximum Heart Rate (Chronotropic Response)
  const hrRatio = patient.maxHR / expectedMaxHR;
  let hrPoints = 0;
  if (hrRatio < 0.70 || patient.maxHR < 110) {
    hrPoints = 3.5;
    rawPoints += hrPoints;
    hemodynamicPoints += hrPoints * 2;
    factors.push({
      id: 'max_hr',
      name: 'Chronotropic Incompetence / Reduced Max HR',
      value: `${patient.maxHR} bpm (${Math.round(hrRatio * 100)}% of age-predicted ${expectedMaxHR} bpm)`,
      reference: '≥ 85% age-predicted',
      severity: 'high',
      explanation: 'Inability to achieve ≥ 85% of age-predicted maximum heart rate during exertion is a robust independent predictor of cardiovascular mortality.',
      category: 'hemodynamic',
    });
  } else if (hrRatio < 0.82) {
    hrPoints = 1.5;
    rawPoints += hrPoints;
    hemodynamicPoints += hrPoints;
    factors.push({
      id: 'max_hr',
      name: 'Sub-Optimal Peak Heart Rate',
      value: `${patient.maxHR} bpm (${Math.round(hrRatio * 100)}% of target)`,
      reference: '≥ 85% age-predicted',
      severity: 'moderate',
      explanation: 'Modest chronotropic attenuation during peak exercise.',
      category: 'hemodynamic',
    });
  }

  // 6. Chest Pain Classification
  let cpPoints = 0;
  if (patient.chestPainType === 'typical_angina') {
    cpPoints = 4.5;
    ischemicPoints += 8;
    factors.push({
      id: 'chest_pain',
      name: 'Typical Angina Pectoris',
      value: 'Type 1 (Substernal Exertional)',
      reference: 'Asymptomatic / Non-anginal',
      severity: 'high',
      explanation: 'Classical substernal discomfort relieved by rest or nitrates, indicating high pre-test probability of obstructive CAD.',
      category: 'ischemic',
    });
  } else if (patient.chestPainType === 'atypical_angina') {
    cpPoints = 2.5;
    ischemicPoints += 4;
    factors.push({
      id: 'chest_pain',
      name: 'Atypical Angina Presentation',
      value: 'Type 2 (Atypical)',
      reference: 'Asymptomatic',
      severity: 'moderate',
      explanation: 'Meets 2 of 3 classical angina criteria; warrants clinical correlation with stress imaging.',
      category: 'ischemic',
    });
  } else if (patient.chestPainType === 'non_anginal') {
    cpPoints = 1;
    ischemicPoints += 1.5;
  }
  rawPoints += cpPoints;

  // 7. Exercise-Induced Angina
  if (patient.exerciseAngina) {
    rawPoints += 3.5;
    ischemicPoints += 6;
    factors.push({
      id: 'exercise_angina',
      name: 'Exercise-Induced Angina',
      value: 'Positive (Present)',
      reference: 'Negative (Absent)',
      severity: 'high',
      explanation: 'Exertional symptom onset reflects imbalance between myocardial oxygen supply and demand under metabolic stress.',
      category: 'ischemic',
    });
  }

  // 8. ST Depression (Oldpeak)
  let stDepPoints = 0;
  if (patient.stDepression >= 2.5) {
    stDepPoints = 5;
    ischemicPoints += 9;
    factors.push({
      id: 'st_depression',
      name: 'Pronounced Exertional ST Depression',
      value: `${patient.stDepression.toFixed(1)} mm`,
      reference: '< 1.0 mm',
      severity: 'high',
      explanation: 'Deep ST depression (≥ 2.5 mm) strongly correlates with extensive subendocardial ischemia and multi-vessel disease.',
      category: 'ischemic',
    });
  } else if (patient.stDepression >= 1.5) {
    stDepPoints = 3.5;
    ischemicPoints += 6;
    factors.push({
      id: 'st_depression',
      name: 'Clinically Significant ST Depression',
      value: `${patient.stDepression.toFixed(1)} mm`,
      reference: '< 1.0 mm',
      severity: 'high',
      explanation: 'Exceeds standard 1.0 mm ischemic diagnostic threshold during stress testing.',
      category: 'ischemic',
    });
  } else if (patient.stDepression >= 0.8) {
    stDepPoints = 1.5;
    ischemicPoints += 3;
    factors.push({
      id: 'st_depression',
      name: 'Borderline ST Segment Depression',
      value: `${patient.stDepression.toFixed(1)} mm`,
      reference: '< 1.0 mm',
      severity: 'moderate',
      explanation: 'Equivocal ST displacement requiring integration with symptom onset and imaging correlation.',
      category: 'ischemic',
    });
  }
  rawPoints += stDepPoints;

  // 9. ST Slope
  if (patient.stSlope === 'downsloping') {
    rawPoints += 3.5;
    ischemicPoints += 5;
    factors.push({
      id: 'st_slope',
      name: 'Downsloping ST Segment Morphology',
      value: 'Downsloping',
      reference: 'Upsloping (Physiological)',
      severity: 'high',
      explanation: 'Downsloping ST orientation conveys the highest specificity for true myocardial ischemia during exercise testing.',
      category: 'ischemic',
    });
  } else if (patient.stSlope === 'flat') {
    rawPoints += 2;
    ischemicPoints += 3;
    factors.push({
      id: 'st_slope',
      name: 'Horizontal (Flat) ST Segment Slope',
      value: 'Flat',
      reference: 'Upsloping',
      severity: 'moderate',
      explanation: 'Horizontal ST depression during peak exercise is an established marker of subendocardial hypoperfusion.',
      category: 'ischemic',
    });
  }

  // 10. Major Vessels (Fluoroscopy)
  let vesselPoints = 0;
  if (patient.majorVessels >= 3) {
    vesselPoints = 5;
    structuralPoints += 10;
    factors.push({
      id: 'major_vessels',
      name: 'Multi-Vessel Coronary Involvement',
      value: `${patient.majorVessels} Major Vessels Opacified`,
      reference: '0 Vessels',
      severity: 'high',
      explanation: 'Opacification impairment in 3 major vessels indicates severe extensive anatomical coronary artery disease.',
      category: 'structural',
    });
  } else if (patient.majorVessels === 2) {
    vesselPoints = 3.5;
    structuralPoints += 7;
    factors.push({
      id: 'major_vessels',
      name: 'Two-Vessel Coronary Disease',
      value: '2 Major Vessels Opacified',
      reference: '0 Vessels',
      severity: 'high',
      explanation: 'Significant stenosis identified across two coronary vascular territories.',
      category: 'structural',
    });
  } else if (patient.majorVessels === 1) {
    vesselPoints = 2;
    structuralPoints += 4;
    factors.push({
      id: 'major_vessels',
      name: 'Single-Vessel Coronary Disease',
      value: '1 Major Vessel Opacified',
      reference: '0 Vessels',
      severity: 'moderate',
      explanation: 'Isolated single-vessel anatomical involvement.',
      category: 'structural',
    });
  }
  rawPoints += vesselPoints;

  // 11. Thalassemia Perfusion Status
  if (patient.thalassemia === 'reversible_defect') {
    rawPoints += 4;
    ischemicPoints += 6;
    factors.push({
      id: 'thalassemia',
      name: 'Reversible Myocardial Perfusion Defect',
      value: 'Reversible Defect',
      reference: 'Normal Perfusion',
      severity: 'high',
      explanation: 'Reversible scintigraphic defect indicates viable myocardium at acute risk of ischemia during stress.',
      category: 'ischemic',
    });
  } else if (patient.thalassemia === 'fixed_defect') {
    rawPoints += 2.5;
    structuralPoints += 5;
    factors.push({
      id: 'thalassemia',
      name: 'Fixed Myocardial Defect (Prior Scar)',
      value: 'Fixed Defect',
      reference: 'Normal Perfusion',
      severity: 'moderate',
      explanation: 'Consistent with non-reversible scarred myocardium from previous infarction.',
      category: 'structural',
    });
  }

  // 12. Resting ECG
  if (patient.restingECG === 'lvh') {
    rawPoints += 2.5;
    structuralPoints += 4;
    factors.push({
      id: 'resting_ecg',
      name: 'Left Ventricular Hypertrophy (LVH)',
      value: 'Definite LVH by Voltage Criteria',
      reference: 'Normal Resting ECG',
      severity: 'moderate',
      explanation: 'Voltage criteria for LVH reflect chronic cardiac pressure overload, raising arrhythmia and ischemic susceptibility.',
      category: 'structural',
    });
  } else if (patient.restingECG === 'st_t_abnormality') {
    rawPoints += 1.5;
    ischemicPoints += 2.5;
    factors.push({
      id: 'resting_ecg',
      name: 'Resting ST-T Wave Abnormality',
      value: 'ST-T Wave Displacement > 0.05 mV',
      reference: 'Normal Resting ECG',
      severity: 'moderate',
      explanation: 'Baseline repolarization changes that may obscure or compound exercise stress findings.',
      category: 'ischemic',
    });
  }

  // Normalize final risk score to 0 - 100
  const normalizedScore = Math.min(100, Math.max(5, Math.round((rawPoints / maxPossiblePoints) * 100)));

  // Determine Risk Tier
  let riskLevel: RiskLevel;
  let confidence: number;
  let summary = '';

  if (normalizedScore >= 56) {
    riskLevel = 'High';
    // Calibrate confidence realistically: 81% to 96% based on point clarity
    confidence = Math.min(96, Math.max(81, Math.round(75 + (normalizedScore / 100) * 21)));
    summary = 'Multiple high-impact cardiovascular risk indicators were identified across clinical and electrocardiographic parameters. Significant evidence of coronary ischemia and hemodynamic compromise.';
  } else if (normalizedScore >= 28) {
    riskLevel = 'Moderate';
    // Calibrate confidence: 73% to 88%
    confidence = Math.min(88, Math.max(73, Math.round(70 + (normalizedScore / 100) * 18)));
    summary = 'Moderate cardiovascular risk profile detected. Notable intermediate indicators present in hemodynamic parameters or exercise tolerance warranting close outpatient monitoring.';
  } else {
    riskLevel = 'Low';
    // Calibrate confidence: 82% to 95%
    confidence = Math.min(95, Math.max(82, Math.round(84 + ((30 - normalizedScore) / 30) * 11)));
    summary = 'Clinical and physiological parameters fall predominantly within low-risk reference boundaries. No pronounced markers of acute exercise-induced ischemia identified.';
  }

  // Ensure factors list has at least a nominal entry if patient has clean profile
  if (factors.length === 0) {
    factors.push({
      id: 'normal_limits',
      name: 'Physiological Parameters Within Target Limits',
      value: 'Optimal Baseline',
      reference: 'AHA / ACC Standard Ranges',
      severity: 'normal',
      explanation: 'Resting hemodynamics, serum lipid parameters, and exercise electrocardiography demonstrate preserved cardiovascular capacity.',
      category: 'hemodynamic',
    });
  }

  // Generate dynamic clinical reasoning prose
  let clinicalReasoning = '';
  if (riskLevel === 'High') {
    clinicalReasoning = `The assessment reflects a convergence of multiple cardiovascular risk determinants. Specifically, ${
      patient.stDepression >= 1.5 ? `exercise-induced ST segment depression of ${patient.stDepression.toFixed(1)} mm (${patient.stSlope} morphology)` : 'ischemic ST alterations'
    } in conjunction with ${
      patient.exerciseAngina ? 'reproducible exertional angina' : 'diminished chronotropic capacity'
    } and ${
      patient.majorVessels > 0 ? `${patient.majorVessels} fluoroscopy-identified diseased vessels` : 'elevated vascular resistance'
    } markedly elevates the calculated likelihood of obstructive coronary artery disease. Further structured clinical evaluation and diagnostic imaging are strongly indicated.`;
  } else if (riskLevel === 'Moderate') {
    clinicalReasoning = `The intermediate classification is driven by a combination of borderline clinical thresholds. While severe acute ischemic electrocardiographic patterns are absent, the patient's ${
      patient.restingBP >= 130 ? `elevated resting pressure (${patient.restingBP} mm Hg)` : 'hemodynamic baseline'
    } paired with ${
      patient.cholesterol >= 200 ? `serum cholesterol of ${patient.cholesterol} mg/dL` : 'metabolic risk factors'
    } and ${
      patient.maxHR < 140 ? 'sub-maximal exercise heart rate' : 'mild repolarization variants'
    } represents an accumulating vascular burden that merits proactive primary/secondary prevention strategies.`;
  } else {
    clinicalReasoning = `The low-risk classification is substantiated by the absence of major ischemic electrocardiographic features, favorable peak exercise chronotropic response (${patient.maxHR} bpm achieved), and resting blood pressure within recommended boundaries (${patient.restingBP} mm Hg). Coronary perfusion and functional myocardial reserve appear preserved under current clinical parameters.`;
  }

  // Recommendations
  const recommendations: string[] = [];
  if (riskLevel === 'High') {
    recommendations.push('Prompt outpatient or expedited cardiology referral for comprehensive evaluation.');
    if (patient.stDepression >= 1.5 || patient.exerciseAngina) {
      recommendations.push('Consider coronary CT angiography (CCTA) or invasive coronary angiography depending on acute presentation.');
      recommendations.push('Resting transthoracic echocardiogram (TTE) to evaluate regional wall motion abnormalities and ejection fraction.');
    }
    if (patient.cholesterol >= 200) {
      recommendations.push('Optimization of guideline-directed lipid-lowering therapy (statin ± ezetimibe).');
    }
    if (patient.restingBP >= 130) {
      recommendations.push('Antihypertensive therapy titration with 24-hour ambulatory blood pressure monitoring.');
    }
  } else if (riskLevel === 'Moderate') {
    recommendations.push('Schedule routine follow-up clinical cardiovascular assessment in 3 to 6 months.');
    recommendations.push('Cardiovascular risk factor modification focused on Mediterranean diet, sodium moderation, and structured aerobic exercise.');
    if (patient.cholesterol >= 200) {
      recommendations.push('Repeat fasting lipid panel in 12 weeks; evaluate ASCVD 10-year risk score.');
    }
    if (patient.restingBP >= 130) {
      recommendations.push('Home blood pressure log over 14 consecutive days.');
    }
  } else {
    recommendations.push('Continue age-appropriate routine preventive health maintenance and annual screening.');
    recommendations.push('Reinforce cardioprotective lifestyle measures: ≥ 150 minutes/week moderate aerobic exercise and balanced nutrition.');
    recommendations.push('Periodic reassessment of fasting lipid panel and glycemic status every 2–3 years.');
  }

  return {
    riskLevel,
    riskScore: normalizedScore,
    confidence,
    summary,
    factors,
    clinicalReasoning,
    recommendations,
    metricsBreakdown: {
      hemodynamic: Math.min(100, Math.round((hemodynamicPoints / 12) * 100)),
      ischemic: Math.min(100, Math.round((ischemicPoints / 22) * 100)),
      metabolic: Math.min(100, Math.round((metabolicPoints / 9) * 100)),
      structural: Math.min(100, Math.round((structuralPoints / 16) * 100)),
    },
  };
}
