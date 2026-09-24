import React, { useState } from 'react';
import { X, Sliders, Check, Shield, Bell, Database } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [cholUnit, setCholUnit] = useState<'mg/dL' | 'mmol/L'>('mg/dL');
  const [sensitivity, setSensitivity] = useState<'standard' | 'aggressive' | 'conservative'>('standard');
  const [defaultLead, setDefaultLead] = useState<'Lead V5' | 'Lead II'>('Lead V5');
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Clinical Settings & Thresholds</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs text-slate-700">
          {/* Unit Settings */}
          <div>
            <label className="font-semibold text-slate-900 block mb-1.5">
              Laboratory Units
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCholUnit('mg/dL')}
                className={`py-2 px-3 rounded border text-center font-medium transition-colors ${
                  cholUnit === 'mg/dL'
                    ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                mg/dL (US Standard)
              </button>
              <button
                type="button"
                onClick={() => setCholUnit('mmol/L')}
                className={`py-2 px-3 rounded border text-center font-medium transition-colors ${
                  cholUnit === 'mmol/L'
                    ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                mmol/L (SI Standard)
              </button>
            </div>
          </div>

          {/* Model Sensitivity */}
          <div>
            <label className="font-semibold text-slate-900 block mb-1.5">
              Risk Decision Threshold Sensitivity
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSensitivity('conservative')}
                className={`py-2 px-2 rounded border text-center font-medium transition-colors ${
                  sensitivity === 'conservative'
                    ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                Conservative
                <span className="block text-[10px] text-slate-400">Cutoff 65%</span>
              </button>
              <button
                type="button"
                onClick={() => setSensitivity('standard')}
                className={`py-2 px-2 rounded border text-center font-medium transition-colors ${
                  sensitivity === 'standard'
                    ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                Standard
                <span className="block text-[10px] text-slate-400">Cutoff 55%</span>
              </button>
              <button
                type="button"
                onClick={() => setSensitivity('aggressive')}
                className={`py-2 px-2 rounded border text-center font-medium transition-colors ${
                  sensitivity === 'aggressive'
                    ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                High Sensitivity
                <span className="block text-[10px] text-slate-400">Cutoff 45%</span>
              </button>
            </div>
          </div>

          {/* Default Lead */}
          <div>
            <label className="font-semibold text-slate-900 block mb-1.5">
              Default Stress ECG Lead
            </label>
            <select
              value={defaultLead}
              onChange={(e) => setDefaultLead(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white"
            >
              <option value="Lead V5">Lead V5 (Lateral Precordial – Sensitive to ST changes)</option>
              <option value="Lead II">Lead II (Inferior Rhythm Strip)</option>
            </select>
          </div>

          {/* Registry Auto-save */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900 block">Automatic Registry Retention</span>
              <span className="text-[11px] text-slate-500">
                Retain analysed patient profiles in local registry store
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{savedSuccess ? 'Preferences Saved' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
