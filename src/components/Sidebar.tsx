import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  Activity,
  SlidersHorizontal,
  BarChart3,
  FileText,
  Settings,
  User,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { ActiveTab } from '../types/clinical';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  onOpenSettings,
  onOpenProfile,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'patient-analysis' as ActiveTab, label: 'Patient Analysis', icon: UserCheck },
    { id: 'ecg-analysis' as ActiveTab, label: 'ECG Analysis', icon: Activity },
    { id: 'risk-factors' as ActiveTab, label: 'Risk Factors', icon: SlidersHorizontal },
    { id: 'model-performance' as ActiveTab, label: 'Model Performance', icon: BarChart3 },
    { id: 'reports' as ActiveTab, label: 'Reports', icon: FileText },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 text-slate-200 border-r border-slate-800 transition-all duration-200 ease-in-out lg:static ${
          collapsed ? 'w-18' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white shrink-0 shadow-xs">
              <HeartPulse className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-white">CardioAI</span>
                  <span className="text-[10px] font-semibold text-blue-400 bg-blue-950/80 border border-blue-800/80 px-1.5 py-0.5 rounded">
                    CDS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">Clinical Decision Support</p>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex items-center justify-center w-7 h-7 text-slate-400 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-2 pb-1.5">
            {!collapsed && (
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Clinical Workflow
              </span>
            )}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                } ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* System Trust & Bottom Controls */}
        <div className="p-3 border-t border-slate-800 shrink-0 space-y-1">
          {!collapsed && (
            <div className="px-2 py-2 mb-2 rounded bg-slate-800/50 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="font-medium text-slate-200 block truncate">Clinical Safety Protocols</span>
                <span className="text-[10px] text-slate-400">HIPAA Compliant Session</span>
              </div>
            </div>
          )}

          <button
            onClick={onOpenSettings}
            title={collapsed ? 'System Settings' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Clinical Settings</span>}
          </button>

          <button
            onClick={onOpenProfile}
            title={collapsed ? 'User Profile' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Physician Profile</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
