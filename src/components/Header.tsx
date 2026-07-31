import React from 'react';
import { Shield, Route, BarChart3, AlertTriangle, Bot, Key } from 'lucide-react';

interface HeaderProps {
  activeModule: 'm1' | 'm2' | 'm3' | 'm4';
  onSelectModule: (module: 'm1' | 'm2' | 'm3' | 'm4') => void;
  onTriggerSOS: () => void;
  onOpenConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule,
  onTriggerSOS,
  onOpenConfig,
}) => {
  return (
    <header className="h-20 sm:h-24 bg-[#1E1E1E] border-b border-[#2A2A2A] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm w-full">
      {/* Brand Group */}
      <div className="flex items-center gap-4 shrink-0 overflow-hidden pr-4">
        <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center border border-[#3B82F6]/30 shrink-0">
          <Shield className="w-6 h-6 shrink-0" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <h1 className="text-lg sm:text-xl font-extrabold text-white whitespace-nowrap truncate leading-normal">
            AURA Safety Platform
          </h1>
          <span className="text-xs font-bold uppercase tracking-wider text-[#22C55E] flex items-center gap-2 whitespace-nowrap truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse shrink-0"></span>
            Live Telemetry Engine
          </span>
        </div>
      </div>

      {/* Module Navigation Tabs with generous padding & spacing */}
      <nav className="hidden lg:flex items-center gap-2.5 bg-[#121212] border border-[#2A2A2A] p-2 rounded-2xl">
        <button
          onClick={() => onSelectModule('m1')}
          className={`min-h-[48px] px-5 py-2.5 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
            activeModule === 'm1'
              ? 'bg-[#3B82F6] text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:border-[#3B82F6]/60 border border-transparent'
          }`}
        >
          <Route className="w-4.5 h-4.5 shrink-0" />
          <span className="whitespace-nowrap">M1: Routes Map</span>
        </button>

        <button
          onClick={() => onSelectModule('m2')}
          className={`min-h-[48px] px-5 py-2.5 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
            activeModule === 'm2'
              ? 'bg-[#F59E0B] text-slate-950 shadow-sm'
              : 'text-gray-400 hover:text-white hover:border-[#F59E0B]/60 border border-transparent'
          }`}
        >
          <BarChart3 className="w-4.5 h-4.5 shrink-0" />
          <span className="whitespace-nowrap">M2: Analytics</span>
        </button>

        <button
          onClick={() => onSelectModule('m3')}
          className={`min-h-[48px] px-5 py-2.5 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
            activeModule === 'm3'
              ? 'bg-[#EF4444] text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:border-[#EF4444]/60 border border-transparent'
          }`}
        >
          <Shield className="w-4.5 h-4.5 shrink-0" />
          <span className="whitespace-nowrap">M3: Guardian SOS</span>
        </button>

        <button
          onClick={() => onSelectModule('m4')}
          className={`min-h-[48px] px-5 py-2.5 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
            activeModule === 'm4'
              ? 'bg-[#3B82F6] text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:border-[#3B82F6]/60 border border-transparent'
          }`}
        >
          <Bot className="w-4.5 h-4.5 shrink-0" />
          <span className="whitespace-nowrap">M4: AI Companion</span>
        </button>
      </nav>

      {/* Action Controls with generous padding */}
      <div className="flex items-center gap-3.5 shrink-0">
        <button
          onClick={onOpenConfig}
          className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#121212] border border-[#2A2A2A] text-gray-300 hover:text-white hover:border-[#3B82F6]/60 text-xs sm:text-sm font-extrabold flex items-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Key className="w-4.5 h-4.5 text-[#3B82F6] shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap">API Config</span>
        </button>

        <button
          onClick={onTriggerSOS}
          className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#EF4444] hover:bg-red-600 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2.5 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-pulse"
        >
          <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
          <span className="whitespace-nowrap">EMERGENCY SOS</span>
        </button>
      </div>
    </header>
  );
};
