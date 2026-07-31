import React, { useState, useEffect } from 'react';
import { AlertTriangle, Share2, Check, PhoneCall, UserPlus, Mic, MicOff, Clock, Car, Play, Pause, GitBranch, CheckCircle2, Siren, VolumeX, Shield, Bike } from 'lucide-react';
import { audioSynth } from '../services/audioSynth';

interface Module3Props {
  onTriggerSOS: () => void;
  isAlarmRinging?: boolean;
  onSilenceAlarm?: () => void;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export const Module3_GuardianSOS: React.FC<Module3Props> = ({
  onTriggerSOS,
  isAlarmRinging = false,
  onSilenceAlarm,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [simProgress, setSimProgress] = useState(35);
  const [isOffRoute, setIsOffRoute] = useState(false);
  const [isMicMonitoring, setIsMicMonitoring] = useState(false);
  const [micDecibel, setMicDecibel] = useState(38);
  const [checkInActive, setCheckInActive] = useState(false);
  const [checkInTimer, setCheckInTimer] = useState(30);

  const [selectedVehicleMode, setSelectedVehicleMode] = useState<'CAB' | 'AUTO' | 'BIKE'>('CAB');

  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: 'c-1', name: 'Emergency Services (Police)', phone: '112', relation: 'Police Hotline' },
    { id: 'c-2', name: 'Primary Guardian (Family)', phone: '+91 98765 43210', relation: 'Family' },
    { id: 'c-3', name: 'AURA Private Security Patrol', phone: '+91 91234 56789', relation: 'Security Beacon' },
  ]);

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Simulator Progress Loop
  useEffect(() => {
    let interval: any = null;
    if (!isPaused && simProgress < 100) {
      interval = setInterval(() => {
        setSimProgress(prev => (prev >= 100 ? 100 : prev + 1));
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPaused, simProgress]);

  // Mic decibel simulator with automatic scream detection (> 65 dB triggers alarm!)
  useEffect(() => {
    let interval: any = null;
    if (isMicMonitoring) {
      interval = setInterval(() => {
        const randomDb = Math.floor(Math.random() * 30) + 38;
        setMicDecibel(randomDb);
        if (randomDb >= 65) {
          onTriggerSOS();
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isMicMonitoring, onTriggerSOS]);

  // Timed Check-in countdown
  useEffect(() => {
    let timer: any = null;
    if (checkInActive && checkInTimer > 0) {
      timer = setInterval(() => {
        setCheckInTimer(prev => prev - 1);
      }, 1000);
    } else if (checkInActive && checkInTimer === 0) {
      onTriggerSOS();
      setCheckInActive(false);
    }
    return () => clearInterval(timer);
  }, [checkInActive, checkInTimer, onTriggerSOS]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://aura-safety.app/track/live-beacon-g${Date.now()}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    setContacts(prev => [
      ...prev,
      {
        id: 'c-' + Date.now(),
        name: newContactName.trim(),
        phone: newContactPhone.trim(),
        relation: 'Custom Guardian',
      },
    ]);
    setNewContactName('');
    setNewContactPhone('');
  };

  const handleToggleDetour = () => {
    const nextState = !isOffRoute;
    setIsOffRoute(nextState);

    if (nextState) {
      onTriggerSOS();
    }
  };

  const triggerCheckIn = () => {
    audioSynth.playCheckInPing();
    setCheckInActive(true);
    setCheckInTimer(30);
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 sm:p-7 shadow-sm space-y-7">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center border border-[#EF4444]/30 shrink-0">
            <Shield className="w-6 h-6 shrink-0" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-white whitespace-nowrap truncate leading-normal">
              Module 3: Guardian SOS Dashboard
            </h2>
            <p className="text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap truncate">
              Live Guardian Telemetry Watch & Dispatch
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {isAlarmRinging && (
            <button
              onClick={onSilenceAlarm}
              className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#EF4444] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 animate-pulse shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <VolumeX className="w-4.5 h-4.5 shrink-0" /> Silence Siren
            </button>
          )}
          <span className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2.5 border ${
            isAlarmRinging || isOffRoute
              ? 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30 animate-pulse'
              : 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${isAlarmRinging || isOffRoute ? 'bg-[#EF4444]' : 'bg-[#22C55E]'} animate-pulse shrink-0`}></span>
            {isAlarmRinging || isOffRoute ? 'SIREN ACTIVE' : 'Active Heartbeat'}
          </span>
        </div>
      </div>

      {/* Vehicle Mode Switcher & Realistic Driver Badge */}
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
          <button
            onClick={() => setSelectedVehicleMode('CAB')}
            className={`min-h-[48px] px-4 py-3 rounded-xl border text-center font-extrabold flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              selectedVehicleMode === 'CAB' ? 'bg-[#3B82F6] border-blue-500 text-white shadow-sm' : 'bg-[#121212] border-[#2A2A2A] text-gray-300'
            }`}
          >
            <Car className="w-5 h-5 shrink-0" /> Uber Cab
          </button>
          <button
            onClick={() => setSelectedVehicleMode('AUTO')}
            className={`min-h-[48px] px-4 py-3 rounded-xl border text-center font-extrabold flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              selectedVehicleMode === 'AUTO' ? 'bg-[#F59E0B] border-amber-500 text-slate-950 shadow-sm' : 'bg-[#121212] border-[#2A2A2A] text-gray-300'
            }`}
          >
            <Bike className="w-5 h-5 shrink-0" /> Ola Auto
          </button>
          <button
            onClick={() => setSelectedVehicleMode('BIKE')}
            className={`min-h-[48px] px-4 py-3 rounded-xl border text-center font-extrabold flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              selectedVehicleMode === 'BIKE' ? 'bg-[#22C55E] border-emerald-500 text-white shadow-sm' : 'bg-[#121212] border-[#2A2A2A] text-gray-300'
            }`}
          >
            <Bike className="w-5 h-5 shrink-0" /> Rapido Bike
          </button>
        </div>

        {/* Horizontal Driver Info Row Card */}
        <div className="flex items-center justify-between p-5 rounded-2xl bg-[#121212] border border-[#2A2A2A] text-xs sm:text-sm">
          <div className="space-y-1">
            <div className="font-extrabold text-white text-sm sm:text-base whitespace-nowrap">
              {selectedVehicleMode === 'CAB' && 'Uber Cab Premier • KA-03-MB-8210'}
              {selectedVehicleMode === 'AUTO' && 'Ola Auto Rickshaw • KA-01-EQ-4920'}
              {selectedVehicleMode === 'BIKE' && 'Rapido Bike / Scooter • KA-05-JY-1102'}
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">
              {selectedVehicleMode === 'CAB' && 'Driver: Vikram S. (4.9 ★)'}
              {selectedVehicleMode === 'AUTO' && 'Driver: Ramesh K. (4.8 ★)'}
              {selectedVehicleMode === 'BIKE' && 'Rider: Arjun M. (4.9 ★)'}
            </div>
          </div>
          <span className="px-4 py-2 bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30 rounded-xl text-xs font-extrabold uppercase shrink-0">
            {selectedVehicleMode === 'CAB' && 'OTP Verified'}
            {selectedVehicleMode === 'AUTO' && 'GPS Tracked'}
            {selectedVehicleMode === 'BIKE' && 'Helmet Beacon'}
          </span>
        </div>
      </div>

      {/* Immediate Off-Route Emergency SOS Warning Banner */}
      {isOffRoute && (
        <div className="p-5 bg-[#EF4444]/15 border-2 border-[#EF4444] rounded-2xl text-xs sm:text-sm text-red-200 flex items-start gap-4 shadow-sm animate-pulse">
          <Siren className="w-7 h-7 text-[#EF4444] shrink-0 mt-0.5 animate-spin" />
          <div className="space-y-1.5">
            <strong className="block text-white font-extrabold text-sm sm:text-base flex items-center gap-2">
              AUTOMATIC EMERGENCY SOS ACTIVATED!
            </strong>
            <p className="text-xs sm:text-sm font-medium leading-relaxed text-gray-200">
              Vehicle/Driver deviated 85 meters from recommended safe corridor. Emergency siren ringing, PCR Patrol Van #4, and contacts notified!
            </p>
          </div>
        </div>
      )}

      {/* Live Transit Telemetry Simulator Box */}
      <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="font-extrabold text-white whitespace-nowrap">Live Transit Telemetry Simulator</span>
          <span className="text-gray-300 font-mono font-bold whitespace-nowrap">{simProgress}% completed</span>
        </div>

        <div className="w-full bg-[#1E1E1E] h-3.5 rounded-full overflow-hidden border border-[#2A2A2A]">
          <div
            className={`h-full transition-all duration-300 ${isOffRoute ? 'bg-[#EF4444]' : 'bg-[#3B82F6]'}`}
            style={{ width: `${simProgress}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="min-h-[48px] px-4 py-3 bg-[#1E1E1E] hover:bg-slate-800 border border-[#2A2A2A] text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isPaused ? <Play className="w-4.5 h-4.5 text-[#22C55E] shrink-0" /> : <Pause className="w-4.5 h-4.5 text-[#F59E0B] shrink-0" />}
            <span className="whitespace-nowrap">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            onClick={handleToggleDetour}
            className={`min-h-[48px] px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold border flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              isOffRoute ? 'bg-[#EF4444] text-white border-red-500 shadow-sm' : 'bg-[#1E1E1E] border-[#2A2A2A] text-gray-300'
            }`}
          >
            <GitBranch className="w-4.5 h-4.5 text-[#F59E0B] shrink-0" />
            <span className="whitespace-nowrap">{isOffRoute ? 'Off Route' : 'Detour'}</span>
          </button>

          <button
            onClick={triggerCheckIn}
            className="min-h-[48px] px-4 py-3 bg-[#1E1E1E] hover:bg-slate-800 border border-[#2A2A2A] text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Clock className="w-4.5 h-4.5 text-[#22C55E] shrink-0" />
            <span className="whitespace-nowrap">Check-in</span>
          </button>
        </div>
      </div>

      {/* Smart Scream Monitoring Card */}
      <div className="p-5 bg-[#121212] border border-[#2A2A2A] rounded-2xl flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isMicMonitoring ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 animate-pulse' : 'bg-[#1E1E1E] text-gray-500'}`}>
            {isMicMonitoring ? <Mic className="w-5 h-5 shrink-0" /> : <MicOff className="w-5 h-5 shrink-0" />}
          </div>
          <div>
            <div className="font-extrabold text-white text-xs sm:text-sm whitespace-nowrap">Smart Scream & Audio Monitor</div>
            <div className="text-xs font-medium text-gray-400 mt-1 whitespace-nowrap">
              {isMicMonitoring ? `Active Listening • ${micDecibel} dB Ambient` : 'Disabled'}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsMicMonitoring(!isMicMonitoring)}
          className={`min-h-[48px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
            isMicMonitoring ? 'bg-[#22C55E] text-white border-emerald-500 shadow-sm' : 'bg-[#1E1E1E] text-gray-300 border-[#2A2A2A]'
          }`}
        >
          {isMicMonitoring ? 'Active' : 'Enable Mic'}
        </button>
      </div>

      {/* Timed Check-in Active Overlay */}
      {checkInActive && (
        <div className="p-6 bg-[#F59E0B]/15 border border-[#F59E0B]/30 rounded-2xl text-center space-y-4">
          <div className="text-xs sm:text-sm font-extrabold text-[#F59E0B]">Are you okay? Unanswered check-in alerts contacts in:</div>
          <div className="text-4xl font-black text-white font-mono">{checkInTimer}s</div>
          <button
            onClick={() => setCheckInActive(false)}
            className="w-full min-h-[52px] px-6 py-4 bg-[#22C55E] hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm md:text-base font-extrabold shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            ✓ I am Safe & Okay
          </button>
        </div>
      )}

      {/* SOS Button & Share Link */}
      <div className="space-y-4 pt-1">
        <button
          onClick={onTriggerSOS}
          className="w-full min-h-[60px] px-6 py-4.5 bg-[#EF4444] hover:bg-red-600 text-white rounded-2xl font-extrabold text-sm sm:text-base md:text-lg flex items-center justify-center gap-3 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-pulse"
        >
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <span className="whitespace-nowrap">HOLD FOR EMERGENCY SOS ALARM</span>
        </button>

        {isAlarmRinging && onSilenceAlarm && (
          <button
            onClick={onSilenceAlarm}
            className="w-full min-h-[52px] px-6 py-4 bg-[#EF4444] hover:bg-red-600 text-white rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <VolumeX className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap">MUTE AUDIBLE SIREN ALARM</span>
          </button>
        )}

        <button
          onClick={handleCopyLink}
          className="w-full min-h-[52px] px-6 py-4 bg-[#121212] hover:bg-slate-800 border border-[#2A2A2A] text-gray-200 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          {copied ? <Check className="w-5 h-5 text-[#22C55E] shrink-0" /> : <Share2 className="w-5 h-5 text-[#3B82F6] shrink-0" />}
          <span className="whitespace-nowrap">{copied ? 'Live Tracking Link Copied!' : 'Copy Live GPS Tracking Link'}</span>
        </button>
      </div>

      {/* Emergency Contacts Management */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center justify-between">
          <span className="flex items-center gap-2.5 text-white font-extrabold">
            <PhoneCall className="w-5 h-5 text-[#22C55E] shrink-0" />
            Notified Emergency Contacts
          </span>
          <span className="text-gray-400 font-mono">{contacts.length} Active</span>
        </h3>

        <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
          {contacts.map(c => (
            <div key={c.id} className="p-4.5 bg-[#121212] border border-[#2A2A2A] rounded-2xl flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center font-extrabold text-xs sm:text-sm border border-[#3B82F6]/30 shrink-0">
                  {c.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <div className="font-extrabold text-white whitespace-nowrap">{c.name} ({c.relation})</div>
                  <div className="text-xs font-medium text-gray-400 mt-1 whitespace-nowrap">{c.phone}</div>
                </div>
              </div>

              <a
                href={`tel:${c.phone}`}
                className="min-h-[42px] px-4 py-2 bg-[#22C55E]/15 hover:bg-[#22C55E]/30 text-[#22C55E] border border-[#22C55E]/30 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all duration-200 shrink-0"
              >
                <PhoneCall className="w-4 h-4 shrink-0" /> Call
              </a>
            </div>
          ))}
        </div>

        {/* Add Contact Form */}
        <form onSubmit={handleAddContact} className="pt-4 border-t border-[#2A2A2A] space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#3B82F6] shrink-0" /> Add Guardian Contact
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              placeholder="Contact Name"
              className="min-h-[52px] bg-[#121212] border border-[#2A2A2A] rounded-xl px-5 py-3.5 text-xs sm:text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6]"
            />
            <input
              type="text"
              value={newContactPhone}
              onChange={(e) => setNewContactPhone(e.target.value)}
              placeholder="Phone Number"
              className="min-h-[52px] bg-[#121212] border border-[#2A2A2A] rounded-xl px-5 py-3.5 text-xs sm:text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[52px] px-6 py-3.5 bg-[#1E1E1E] hover:bg-slate-800 text-gray-200 border border-[#2A2A2A] rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Add to Emergency Dispatch List
          </button>
        </form>
      </div>

      {/* Arrived Safely Button */}
      <button
        onClick={() => {
          setSimProgress(100);
          setIsOffRoute(false);
          if (onSilenceAlarm) onSilenceAlarm();
          alert('Arrived safely! Journey ended.');
        }}
        className="w-full min-h-[52px] px-6 py-4 bg-[#121212] hover:bg-slate-800 text-[#22C55E] border border-[#22C55E]/40 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        <span className="whitespace-nowrap">Arrived Safely (End Journey)</span>
      </button>
    </div>
  );
};
