import React from 'react';
import { X, Award, ShieldCheck, Mail, Building, MapPin } from 'lucide-react';
import doctorAvatar from '../assets/images/doctor_alex_avatar_1790243494151.jpg';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
        {/* Header Banner */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <img
              src={doctorAvatar}
              alt="Dr. Alex Morgan"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border-2 border-white/80 shadow-md shrink-0"
            />
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Dr. Alex Morgan</h2>
              <p className="text-xs text-blue-300 font-medium">MD, FACC · Cardiology Specialist</p>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                <Building className="w-3 h-3" />
                <span>St. Jude Cardiovascular Institute</span>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials & Details */}
        <div className="p-5 space-y-4 text-xs text-slate-700">
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded border border-slate-200/80">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Medical License
              </span>
              <span className="font-mono font-bold text-slate-900">#CD-49821</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                NPI Number
              </span>
              <span className="font-mono font-bold text-slate-900">1948201948</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Department
              </span>
              <span className="font-semibold text-slate-900">Cardiovascular Medicine</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Role
              </span>
              <span className="font-semibold text-slate-900">Attending Cardiologist</span>
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-900 block mb-1">Clinical Specialties</span>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                Ischemic Heart Disease
              </span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                Stress Electrocardiography
              </span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                Coronary Atherosclerosis
              </span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                Hemodynamic Monitoring
              </span>
            </div>
          </div>

          <div className="p-3 rounded bg-blue-50/70 border border-blue-200/80 flex items-start gap-2 text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-[11px]">
              Active verified clinical session. Full access to AI-assisted cardiovascular risk inference, ECG lead telemetry, and patient records.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
