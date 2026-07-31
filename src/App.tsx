import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Module1_Routes } from './components/Module1_Routes';
import { Module2_Analytics } from './components/Module2_Analytics';
import { Module3_GuardianSOS } from './components/Module3_GuardianSOS';
import { Module4_AIAssistant } from './components/Module4_AIAssistant';
import { AdminControlRoom } from './components/AdminControlRoom';
import { RoutesMapView } from './components/RoutesMapView';
import { ApiConfigModal } from './components/ApiConfigModal';
import { audioSynth } from './services/audioSynth';
import { TelemetryData } from './types';
import { Siren, VolumeX } from 'lucide-react';

export function App() {
  const [activeModule, setActiveModule] = useState<'m1' | 'm2' | 'm3' | 'm4' | 'admin'>('m1');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [activeTelemetry, setActiveTelemetry] = useState<TelemetryData | null>(null);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);

  // Check URL query param or hash for direct admin link access (e.g. ?admin=true or #admin)
  useEffect(() => {
    if (window.location.search.includes('admin') || window.location.hash.includes('admin')) {
      setActiveModule('admin');
    }
  }, []);

  const handleTriggerSOS = () => {
    setIsAlarmRinging(true);
    audioSynth.startSirenAlarm();
    alert('🚨 EMERGENCY SOS ACTIVATED!\n\nAudible Siren Alarm Ringing.\nLocation Beacon: Broadcasting live GPS coordinates to Guardian Network & Emergency Dispatch.');
  };

  const handleSilenceAlarm = () => {
    setIsAlarmRinging(false);
    audioSynth.stopSirenAlarm();
  };

  const handleSaveConfig = (newProvider: string, newKey: string) => {
    setProvider(newProvider);
    setApiKey(newKey);
    setIsConfigOpen(false);
  };

  return (
    <div className="h-screen bg-[#121212] text-white flex flex-col font-sans overflow-hidden selection:bg-[#3B82F6] selection:text-white w-full">
      {/* Alarm Active Top Banner */}
      {isAlarmRinging && (
        <div className="bg-[#EF4444] text-white px-4 sm:px-6 py-3 flex items-center justify-between text-sm sm:text-base font-extrabold shadow-sm sticky top-0 z-50 animate-pulse w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <Siren className="w-5 h-5 shrink-0 animate-spin" />
            <span className="whitespace-nowrap truncate">EMERGENCY SOS SIREN ALARM ACTIVE</span>
          </div>
          <button
            onClick={handleSilenceAlarm}
            className="min-h-[38px] px-4 py-1.5 bg-white text-[#EF4444] hover:bg-gray-100 rounded-xl text-xs sm:text-sm font-black shrink-0 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-1.5">
              <VolumeX className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">SILENCE ALARM</span>
            </div>
          </button>
        </div>
      )}

      <Header
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        onTriggerSOS={handleTriggerSOS}
        onOpenConfig={() => setIsConfigOpen(true)}
      />

      {/* Standalone View Mode Switcher */}
      {activeModule === 'admin' ? (
        <div className="flex-1 overflow-y-auto custom-module-scrollbar w-full">
          <AdminControlRoom />
        </div>
      ) : (
        <main className="flex-1 p-4 sm:p-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-5rem)] overflow-hidden">
          {/* Left Map Column (4 out of 12 grid columns) */}
          <div className="lg:col-span-4 h-full min-h-0">
            <RoutesMapView telemetry={activeTelemetry} />
          </div>

          {/* Right Active Module Column (8 out of 12 grid columns) - Visible Scrollbar across all modules */}
          <div className="lg:col-span-8 h-full min-h-0 overflow-y-auto custom-module-scrollbar flex flex-col pr-1">
            {activeModule === 'm1' && <Module1_Routes onTelemetryCalculated={setActiveTelemetry} />}
            {activeModule === 'm2' && <Module2_Analytics />}
            {activeModule === 'm3' && (
              <Module3_GuardianSOS
                onTriggerSOS={handleTriggerSOS}
                isAlarmRinging={isAlarmRinging}
                onSilenceAlarm={handleSilenceAlarm}
              />
            )}
            {activeModule === 'm4' && (
              <Module4_AIAssistant
                onOpenConfig={() => setIsConfigOpen(true)}
                apiKey={apiKey}
                provider={provider}
                onTelemetryUpdate={setActiveTelemetry}
              />
            )}
          </div>
        </main>
      )}

      <ApiConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={handleSaveConfig}
        currentProvider={provider}
        currentKey={apiKey}
      />
    </div>
  );
}

export default App;
