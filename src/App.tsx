/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, PatientData, AnalysisResult, PatientRecord } from './types/clinical';
import { getInitialRecords, INITIAL_PATIENTS } from './data/samplePatients';
import { calculateCardiovascularRisk } from './utils/riskEngine';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { OverviewView } from './components/OverviewView';
import { PatientForm } from './components/PatientForm';
import { ResultCard } from './components/ResultCard';
import { KnowledgeExplanation } from './components/KnowledgeExplanation';
import { ECGViewer } from './components/ECGViewer';
import { RiskFactorsView } from './components/RiskFactorsView';
import { ModelPerformanceView } from './components/ModelPerformanceView';
import { ReportsView } from './components/ReportsView';
import { SettingsModal } from './components/SettingsModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [patients, setPatients] = useState<PatientRecord[]>(() => getInitialRecords());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Active Patient in the Patient Analysis form
  const [activePatientData, setActivePatientData] = useState<PatientData>(() => INITIAL_PATIENTS[7]); // PT-1049
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(() =>
    calculateCardiovascularRisk(INITIAL_PATIENTS[7])
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);
  const [isSavedToRegistry, setIsSavedToRegistry] = useState(false);

  // Patient selected for detailed view in Reports tab
  const [selectedPatientForReport, setSelectedPatientForReport] = useState<string>('PT-1049');

  // Trigger patient analysis calculation
  const handleAnalyzePatient = (data: PatientData) => {
    setIsAnalyzing(true);
    setIsSavedToRegistry(false);

    // Realistic clinical computation delay for multi-tier scoring
    setTimeout(() => {
      const result = calculateCardiovascularRisk(data);
      setActivePatientData(data);
      setAnalysisResult(result);
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 650);
  };

  // Load Presets
  const handleLoadPreset = (presetType: 'high' | 'moderate' | 'low') => {
    let preset: PatientData;
    if (presetType === 'high') {
      preset = { ...INITIAL_PATIENTS[0], id: `PT-${Math.floor(1000 + Math.random() * 9000)}` };
    } else if (presetType === 'moderate') {
      preset = { ...INITIAL_PATIENTS[2], id: `PT-${Math.floor(1000 + Math.random() * 9000)}` };
    } else {
      preset = { ...INITIAL_PATIENTS[4], id: `PT-${Math.floor(1000 + Math.random() * 9000)}` };
    }
    setActivePatientData(preset);
    const result = calculateCardiovascularRisk(preset);
    setAnalysisResult(result);
    setHasAnalyzed(true);
    setIsSavedToRegistry(false);
  };

  // Save current evaluated patient into registry
  const handleSaveToRegistry = () => {
    const newRecord: PatientRecord = {
      ...activePatientData,
      result: analysisResult,
      status: analysisResult.riskLevel === 'High' ? 'Referred to Cardiology' : 'Reviewed',
      ecgSampleId: analysisResult.riskLevel === 'High' ? 'ecg-ischemia' : 'ecg-normal',
    };

    setPatients((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === newRecord.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = newRecord;
        return updated;
      }
      return [newRecord, ...prev];
    });

    setSelectedPatientForReport(newRecord.id);
    setIsSavedToRegistry(true);
  };

  // Select patient from overview table
  const handleSelectPatientFromOverview = (patient: PatientRecord) => {
    setActivePatientData(patient);
    setAnalysisResult(patient.result);
    setSelectedPatientForReport(patient.id);
    setActiveTab('reports');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <TopBar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNewAnalysis={() => {
            setActiveTab('patient-analysis');
            handleLoadPreset('high');
          }}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <OverviewView
                patients={patients}
                onSelectPatient={handleSelectPatientFromOverview}
                onNavigateToTab={setActiveTab}
              />
            )}

            {/* Tab 2: Patient Analysis */}
            {activeTab === 'patient-analysis' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                    Patient Risk Analysis
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500">
                    Enter clinical parameters to generate an AI-assisted cardiovascular risk assessment.
                  </p>
                </div>

                {/* Structured Clinical Input Form */}
                <PatientForm
                  initialData={activePatientData}
                  isAnalyzing={isAnalyzing}
                  onAnalyze={handleAnalyzePatient}
                  onLoadPreset={handleLoadPreset}
                />

                {/* AI Result Card & Knowledge Explanation */}
                {hasAnalyzed && (
                  <div className="space-y-6 pt-4">
                    <ResultCard
                      result={analysisResult}
                      patient={activePatientData}
                      onNavigateToReports={() => {
                        setSelectedPatientForReport(activePatientData.id);
                        handleSaveToRegistry();
                        setActiveTab('reports');
                      }}
                      onNavigateToECG={() => setActiveTab('ecg-analysis')}
                      onSaveToRegistry={handleSaveToRegistry}
                      isSaved={isSavedToRegistry}
                    />

                    <KnowledgeExplanation result={analysisResult} />
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: ECG Analysis */}
            {activeTab === 'ecg-analysis' && <ECGViewer />}

            {/* Tab 4: Risk Factors */}
            {activeTab === 'risk-factors' && <RiskFactorsView />}

            {/* Tab 5: Model Performance */}
            {activeTab === 'model-performance' && <ModelPerformanceView />}

            {/* Tab 6: Reports */}
            {activeTab === 'reports' && (
              <ReportsView
                patients={patients}
                selectedPatientId={selectedPatientForReport}
              />
            )}
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
