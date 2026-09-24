import React, { useState } from 'react';
import {
  Bell,
  Menu,
  PlusCircle,
  CheckCircle,
  AlertTriangle,
  Heart,
  X,
} from 'lucide-react';
import doctorAvatar from '../assets/images/doctor_alex_avatar_1790243494151.jpg';

interface TopBarProps {
  onOpenMobileMenu: () => void;
  onNewAnalysis: () => void;
  onOpenProfile: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileMenu,
  onNewAnalysis,
  onOpenProfile,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'High-Risk Consultation Alert',
      desc: 'Patient PT-8821 flagged for multi-vessel CAD profile.',
      time: '12m ago',
      type: 'high',
      read: false,
    },
    {
      id: '2',
      title: 'ECG Morphological Scan Complete',
      desc: 'Lead V5 ST depression segment processed for PT-1049.',
      time: '45m ago',
      type: 'normal',
      read: false,
    },
    {
      id: '3',
      title: 'Model Validation Cohort Updated',
      desc: 'Multi-center Cleveland & Hungarian test benchmarks reconciled.',
      time: '3h ago',
      type: 'info',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-slate-200/90 shadow-2xs">
      {/* Left Zone: Brand & Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="p-1.5 text-slate-500 rounded-md lg:hidden hover:bg-slate-100 hover:text-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-base md:text-lg font-bold tracking-tight text-slate-900">
            CardioAI
          </span>
          <span className="hidden sm:inline-block text-slate-300">/</span>
          <span className="hidden sm:inline-block text-xs md:text-sm text-slate-500 font-normal">
            AI-powered cardiovascular risk analysis
          </span>
        </div>
      </div>

      {/* Right Zone: Actions & User Info */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick New Analysis Action */}
        <button
          onClick={onNewAnalysis}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden md:inline">New Analysis</span>
          <span className="md:hidden">New</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Clinical notifications"
            className="relative p-2 text-slate-500 rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900">Clinical Alerts</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-1.5 py-0.5 rounded">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 hover:bg-slate-50 transition-colors ${
                      !item.read ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {item.type === 'high' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-slate-900 truncate">{item.title}</p>
                          <span className="text-[10px] text-slate-500 tabular-nums shrink-0">
                            {item.time}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Close alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div className="w-px h-6 bg-slate-200" aria-hidden="true" />

        {/* User Avatar & Name */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 p-1 rounded-md hover:bg-slate-100 transition-colors text-left"
        >
          <img
            src={doctorAvatar}
            alt="Dr. Alex Morgan"
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0"
          />
          <div className="hidden sm:block text-left">
            <span className="text-xs font-semibold text-slate-900 block leading-tight">
              Dr. Alex
            </span>
            <span className="text-[11px] text-slate-500 block leading-tight">
              Cardiology Specialist
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
