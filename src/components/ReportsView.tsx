import React, { useState } from 'react';
import {
  Printer,
  Download,
  Share2,
  FileText,
  User,
  Activity,
  Heart,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { PatientRecord } from '../types/clinical';
import { RiskBadge } from './RiskBadge';
import { ConfidenceGauge } from './ConfidenceGauge';

interface ReportsViewProps {
  patients: PatientRecord[];
  selectedPatientId?: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  patients,
  selectedPatientId,
}) => {
  const [activePatientId, setActivePatientId] = useState<string>(
    selectedPatientId || (patients.length > 0 ? patients[0].id : '')
  );
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Update when prop changes
  React.useEffect(() => {
    if (selectedPatientId) {
      setActivePatientId(selectedPatientId);
    }
  }, [selectedPatientId]);

  const activePatient = patients.find((p) => p.id === activePatientId) || patients[0];

  if (!activePatient) {
    return (
      <div className="bg-white p-8 rounded-lg border border-slate-200 text-center text-slate-500">
        No patient records available to display.
      </div>
    );
  }

  const { result } = activePatient;

  // Print Report Handler
  const handlePrint = () => {
    window.print();
  };

  // Download Report Handler (Structured clinical report file)
  const handleDownload = () => {
    const reportText = `================================================================================
CARDIOAI – CLINICAL DECISION SUPPORT REPORT
Cardiovascular Risk Assessment & Morphological Correlation
================================================================================
PATIENT IDENTIFIER: ${activePatient.id}
EVALUATION DATE:   ${activePatient.analysisDate}
EVALUATION STATUS: ${activePatient.status}
ATTENDING PHYSICIAN: Dr. Alex Morgan, MD, FACC (Cardiology)

--------------------------------------------------------------------------------
1. EXECUTIVE RISK CLASSIFICATION
--------------------------------------------------------------------------------
Calculated Risk Tier:    ${result.riskLevel.toUpperCase()} RISK
Model Confidence Index:  ${result.confidence}%
Composite Risk Score:    ${result.riskScore}/100
Clinical Assessment:     ${result.summary}

--------------------------------------------------------------------------------
2. RECORDED CLINICAL & ELECTROPHYSIOLOGICAL PARAMETERS
--------------------------------------------------------------------------------
Demographics:
  - Age:                     ${activePatient.age} years
  - Biological Sex:          ${activePatient.sex}

Hemodynamics & Metabolism:
  - Resting Blood Pressure:  ${activePatient.restingBP} mm Hg
  - Serum Total Cholesterol: ${activePatient.cholesterol} mg/dL
  - Fasting Blood Sugar:     ${activePatient.fastingBS ? '> 120 mg/dL (Elevated)' : '<= 120 mg/dL (Normal)'}
  - Peak Exercise Heart Rate: ${activePatient.maxHR} bpm

Diagnostic Stress Indicators:
  - ST Segment Depression:   ${activePatient.stDepression.toFixed(1)} mm
  - ST Segment Slope:        ${activePatient.stSlope}
  - Chest Pain Symptom:      ${activePatient.chestPainType}
  - Exercise-Induced Angina: ${activePatient.exerciseAngina ? 'Positive (Present)' : 'Negative (Absent)'}
  - Fluoroscopy Vessels:     ${activePatient.majorVessels} vessels opacified
  - Resting ECG Baseline:    ${activePatient.restingECG}
  - Thalassemia Perfusion:   ${activePatient.thalassemia}

--------------------------------------------------------------------------------
3. PRIMARY CARDIOVASCULAR RISK CONTRIBUTORS
--------------------------------------------------------------------------------
${result.factors.map((f, i) => `${i + 1}. [${f.severity.toUpperCase()}] ${f.name}
   Observed: ${f.value} | Reference: ${f.reference}
   Pathology: ${f.explanation}`).join('\n\n')}

--------------------------------------------------------------------------------
4. KNOWLEDGE-BASED CLINICAL REASONING
--------------------------------------------------------------------------------
${result.clinicalReasoning}

--------------------------------------------------------------------------------
5. DECISION SUPPORT RECOMMENDATIONS
--------------------------------------------------------------------------------
${result.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

================================================================================
PHYSICIAN SIGN-OFF & AUDIT TRAIL
Electronically validated by Dr. Alex Morgan, MD, FACC
License #CD-49821 · St. Jude Cardiovascular Institute
Advisory Notice: This assessment supports clinical decision-making and
should not replace comprehensive professional medical judgment.
================================================================================
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CardioAI_Report_${activePatient.id}_${activePatient.analysisDate}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Patient Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Clinical Patient Reports
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Comprehensive patient risk summaries, physiological indicators, and decision support documentation
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>{downloadSuccess ? 'Downloaded!' : 'Download Report'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Patient Record Selector Bar */}
      <div className="flex items-center gap-3 p-3 bg-white border border-slate-200/90 rounded-lg no-print">
        <label className="text-xs font-semibold text-slate-700 shrink-0">
          Select Patient Record:
        </label>
        <div className="relative flex-1 max-w-sm">
          <select
            value={activePatientId}
            onChange={(e) => setActivePatientId(e.target.value)}
            className="w-full pl-3 pr-8 py-1.5 text-xs font-mono font-medium border border-slate-300 rounded bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} – {p.name || 'Patient'} ({p.age}y {p.sex}) · {p.result.riskLevel} Risk ({p.analysisDate})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Structured Clinical Report Container */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs print:border-none print:shadow-none print:p-0 max-w-4xl mx-auto">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                CardioAI
              </span>
              <span className="text-[11px] font-mono bg-slate-900 text-white px-2 py-0.5 rounded">
                CDS REPORT
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              St. Jude Cardiovascular Institute · Advanced AI Risk Modeling Unit
            </p>
          </div>

          <div className="text-left sm:text-right text-xs space-y-1 text-slate-600">
            <div>
              <span className="text-slate-400">Document ID: </span>
              <span className="font-mono font-semibold text-slate-900">
                REP-{activePatient.id}-2026
              </span>
            </div>
            <div>
              <span className="text-slate-400">Date of Evaluation: </span>
              <span className="font-mono tabular-nums text-slate-900">{activePatient.analysisDate}</span>
            </div>
            <div>
              <span className="text-slate-400">Attending Physician: </span>
              <span className="font-semibold text-slate-900">Dr. Alex Morgan, MD, FACC</span>
            </div>
          </div>
        </div>

        {/* Patient Demographics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 bg-slate-50/50 p-4 rounded-md my-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Patient Identifier</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{activePatient.id}</span>
            {activePatient.name && (
              <span className="block text-slate-500 text-[11px]">{activePatient.name}</span>
            )}
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Age & Biological Sex</span>
            <span className="font-semibold text-slate-900">
              {activePatient.age} years · {activePatient.sex}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Clinical Status</span>
            <span className="font-semibold text-blue-700">{activePatient.status}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">ECG Trace Reference</span>
            <span className="font-mono text-slate-700">
              {activePatient.ecgSampleId || 'ECG-Standard'}
            </span>
          </div>
        </div>

        {/* Executive Risk Classification */}
        <div className="py-4 border-b border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            1. Executive Cardiovascular Risk Stratification
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <RiskBadge level={result.riskLevel} size="md" />
                <span className="text-xs text-slate-500 font-mono">
                  Composite Index: {result.riskScore}/100
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {result.riskLevel.toUpperCase()} RISK TIER
              </h3>
              <p className="text-xs text-slate-700 mt-1 max-w-xl leading-relaxed">
                {result.summary}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-center sm:self-auto bg-white p-3 rounded-lg border border-slate-200">
              <ConfidenceGauge confidence={result.confidence} riskLevel={result.riskLevel} size={90} />
            </div>
          </div>
        </div>

        {/* Clinical Parameters Matrix */}
        <div className="py-4 border-b border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            2. Recorded Clinical Parameters & Diagnostic Variables
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase">Resting Blood Pressure</span>
              <span className="font-mono font-bold text-slate-900">{activePatient.restingBP} mm Hg</span>
              <span className="block text-[10px] text-slate-500">Ref: &lt; 120 mm Hg</span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase">Serum Cholesterol</span>
              <span className="font-mono font-bold text-slate-900">{activePatient.cholesterol} mg/dL</span>
              <span className="block text-[10px] text-slate-500">Ref: &lt; 200 mg/dL</span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase">Fasting Blood Sugar</span>
              <span className="font-semibold text-slate-900">
                {activePatient.fastingBS ? '> 120 mg/dL (Elevated)' : '≤ 120 mg/dL (Normal)'}
              </span>
              <span className="block text-[10px] text-slate-500">Ref: &lt; 100 mg/dL</span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase">Max Exercise HR</span>
              <span className="font-mono font-bold text-slate-900">{activePatient.maxHR} bpm</span>
              <span className="block text-[10px] text-slate-500">Target: {220 - activePatient.age} bpm</span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase">ST Depression (Oldpeak)</span>
              <span className="font-mono font-bold text-slate-900">{activePatient.stDepression.toFixed(1)} mm</span>
              <span className="block text-[10px] text-slate-500">Ref: &lt; 1.0 mm</span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase">ST Slope Morphology</span>
              <span className="font-semibold text-slate-900 capitalize">{activePatient.stSlope}</span>
              <span className="block text-[10px] text-slate-500">Peak Bruce exercise</span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase">Chest Pain Classification</span>
              <span className="font-semibold text-slate-900 capitalize">
                {activePatient.chestPainType.replace('_', ' ')}
              </span>
              <span className="block text-[10px] text-slate-500">Pre-test probability</span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase">Major Vessels Opacified</span>
              <span className="font-mono font-bold text-slate-900">{activePatient.majorVessels} Vessels</span>
              <span className="block text-[10px] text-slate-500">Fluoroscopy finding</span>
            </div>
          </div>
        </div>

        {/* Major Contributing Factors */}
        <div className="py-4 border-b border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            3. Major Risk Factors Identified
          </h2>

          <div className="space-y-2">
            {result.factors.map((factor) => (
              <div
                key={factor.id}
                className="p-3 rounded bg-slate-50 border border-slate-200/80 flex items-start justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{factor.name}</span>
                    <span className="text-[10px] uppercase font-semibold text-slate-500">
                      ({factor.severity})
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{factor.explanation}</p>
                </div>
                <div className="text-right shrink-0 ml-4 font-mono text-[11px]">
                  <span className="font-semibold text-slate-900">{factor.value}</span>
                  <span className="text-slate-400 block text-[10px]">Ref: {factor.reference}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Reasoning & Recommendations */}
        <div className="py-4 border-b border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            4. Knowledge-Based Clinical Reasoning
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded border border-slate-200">
            {result.clinicalReasoning}
          </p>

          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-4 mb-2">
            5. Decision Support Next Steps
          </h2>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Physician Sign-Off & Audit Trail */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-xs text-slate-600">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              Physician Signature & Review
            </span>
            <div className="font-serif italic text-base text-slate-900 pb-1">
              Dr. Alex Morgan, MD, FACC
            </div>
            <p className="text-[11px] text-slate-500">
              License: #CD-49821 · Board Certified Cardiovascular Disease
            </p>
          </div>

          <div className="text-left sm:text-right space-y-0.5 text-[11px] text-slate-400">
            <p>System Hash: SHA256-49AF-7C12-88B1</p>
            <p>Model Engine: CardioAI v2.4 (Random Forest / Rule Synthesis)</p>
            <p>Session ID: {activePatient.id}-SES-901</p>
          </div>
        </div>

        {/* Subtle Regulatory Advisory Notice */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed text-center">
          Notice: This automated report is generated to augment clinical decision workflows and should not substitute for comprehensive independent medical evaluation, physical examination, and diagnostic testing by a licensed physician.
        </div>
      </div>
    </div>
  );
};
