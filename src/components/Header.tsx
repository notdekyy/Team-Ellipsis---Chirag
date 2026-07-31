import React from 'react';
import { Route, BarChart3, Shield, Bot, Key, Radio, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  activeModule: 'm1' | 'm2' | 'm3' | 'm4' | 'admin';
  onSelectModule: (module: 'm1' | 'm2' | 'm3' | 'm4' | 'admin') => void;
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
      {/* Brand Group with Pure Standalone Circle AURA Logo */}
      <div className="flex items-center gap-3.5 shrink-0 overflow-hidden pr-4">
        <img
          src="/aura-logo.png"
          alt="AURA Official Logo Emblem"
          className="w-11 h-11 object-contain filter drop-shadow-[0_0_10px_rgba(59,130,246,0.75)] shrink-0 hover:scale-105 transition-transform duration-200"
        />
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

      {/* Module Navigation Tabs with Generous Padding & Spacing */}
      <nav className="hidden lg:flex items-center gap-3 bg-[#121212] border border-[#2A2A2A] p-2.5 rounded-2xl shadow-sm">
        <button
          onClick={() => onSelectModule('m1')}
          className={`min-h-[50px] px-5 py-3 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
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
          className={`min-h-[50px] px-5 py-3 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
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
          className={`min-h-[50px] px-5 py-3 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
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
          className={`min-h-[50px] px-5 py-3 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
            activeModule === 'm4'
              ? 'bg-[#3B82F6] text-white shadow-sm'
              : 'text-gray-400 hover:text-white hover:border-[#3B82F6]/60 border border-transparent'
          }`}
        >
          <Bot className="w-4.5 h-4.5 shrink-0" />
          <span className="whitespace-nowrap">M4: AI Companion</span>
        </button>

        <button
          onClick={() => onSelectModule('admin')}
          className={`min-h-[50px] px-5 py-3 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
            activeModule === 'admin'
              ? 'bg-[#22C55E] text-slate-950 shadow-sm'
              : 'text-gray-400 hover:text-white hover:border-[#22C55E]/60 border border-transparent'
          }`}
        >
          <Radio className={`w-4.5 h-4.5 shrink-0 ${activeModule === 'admin' ? 'text-slate-950 stroke-[2.5]' : 'text-[#22C55E]'}`} />
          <span className="whitespace-nowrap">Admin Control Room</span>
        </button>
      </nav>

      {/* Action Controls with Explicit Standard Tailwind Padding */}
      <div className="flex items-center gap-4 shrink-0 pl-2">
        <button
          onClick={onOpenConfig}
          className="min-h-[50px] px-6 sm:px-7 py-3.5 rounded-xl bg-[#121212] border border-[#2A2A2A] text-gray-300 hover:text-white hover:border-[#3B82F6]/60 text-xs sm:text-sm font-extrabold flex items-center gap-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
        >
          <Key className="w-4.5 h-4.5 text-[#3B82F6] shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap">API Config</span>
        </button>

        <button
          onClick={onTriggerSOS}
          className="min-h-[50px] px-6 sm:px-7 py-3.5 rounded-xl bg-[#EF4444] hover:bg-red-600 text-white text-xs sm:text-sm font-extrabold flex items-center gap-3 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-pulse"
        >
          <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
          <span className="whitespace-nowrap">EMERGENCY SOS</span>
        </button>
      </div>
    </header>
  );
};
