import React, { useState } from 'react';
import { BarChart3, Send, CheckCircle2, AlertOctagon, Lightbulb, ShieldAlert, ThumbsUp, Layers, Eye, MapPin, Moon, AlertTriangle, UserCheck, Siren } from 'lucide-react';
import { routesMapService } from '../services/routesMap';
import { HazardReport } from '../types';

export const Module2_Analytics: React.FC = () => {
  const [hazardType, setHazardType] = useState('Street Lighting Audit');
  const [locationName, setLocationName] = useState('');
  const [notes, setNotes] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'lights' | 'hazards' | 'police'>('all');

  const getSymbolForCategory = (type: string) => {
    switch (type) {
      case 'Street Lighting Audit': return '💡';
      case 'Poor / Broken Lighting': return '🌑';
      case 'Suspicious Activity': return '⚠️';
      case 'Isolated Pedestrian Walk': return '🚶';
      case 'Police / Safe Haven Patrol': return '🚓';
      default: return '⚠️';
    }
  };

  const getIconForCategory = (type: string) => {
    switch (type) {
      case 'Street Lighting Audit': return <Lightbulb className="w-5 h-5 text-[#F59E0B] shrink-0" />;
      case 'Poor / Broken Lighting': return <Moon className="w-5 h-5 text-purple-400 shrink-0" />;
      case 'Suspicious Activity': return <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0" />;
      case 'Isolated Pedestrian Walk': return <UserCheck className="w-5 h-5 text-gray-400 shrink-0" />;
      case 'Police / Safe Haven Patrol': return <Siren className="w-5 h-5 text-[#3B82F6] shrink-0" />;
      default: return <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />;
    }
  };

  const [reports, setReports] = useState<HazardReport[]>([
    {
      id: 'h-1',
      type: 'Street Lighting Audit',
      notes: 'Commercial avenue 96% lit by high-mast LED lights.',
      timestamp: '10:14 PM',
    },
    {
      id: 'h-2',
      type: 'Poor / Broken Lighting',
      notes: 'Streetlamp flickering near North Gate alleyway.',
      timestamp: '09:42 PM',
    },
    {
      id: 'h-3',
      type: 'Suspicious Activity',
      notes: 'Unattended parked vehicle near bus stop.',
      timestamp: '08:15 PM',
    },
  ]);

  const [submitted, setSubmitted] = useState<HazardReport | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim() && !locationName.trim()) return;

    const symbol = getSymbolForCategory(hazardType);
    const detailText = locationName ? `[${locationName}] ${notes}` : notes;

    const newReport: HazardReport = {
      id: 'h-' + Date.now(),
      type: hazardType,
      notes: detailText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setReports(prev => [newReport, ...prev]);
    setSubmitted(newReport);

    routesMapService.addHazardMarkerToMap(hazardType, symbol, detailText);

    setNotes('');
    setLocationName('');
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 sm:p-7 shadow-sm space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center border border-[#F59E0B]/30 shrink-0">
            <BarChart3 className="w-6 h-6 shrink-0" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-white whitespace-nowrap truncate leading-normal">
              Module 2: Safety Analytics Engine
            </h2>
            <p className="text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap truncate">
              Neighborhood Safety Index & Community Reporting
            </p>
          </div>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 shrink-0">
          Analytics Active
        </span>
      </div>

      {/* Safety Index Gauge Card */}
      <div className="bg-[#121212] border border-[#2A2A2A] p-5 sm:p-6 rounded-2xl space-y-5">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-gray-200 font-extrabold whitespace-nowrap">Neighborhood Safety Index Meter</span>
          <span className="text-[#22C55E] font-black text-lg sm:text-xl whitespace-nowrap">94 / 100</span>
        </div>

        <div className="w-full bg-[#1E1E1E] h-4 rounded-full overflow-hidden border border-[#2A2A2A]">
          <div className="bg-[#22C55E] h-full w-[94%] shadow-sm"></div>
        </div>

        {/* Detailed Safety Metrics Horizontal Rows */}
        <div className="grid grid-cols-3 gap-3.5 pt-2 border-t border-[#2A2A2A] text-xs sm:text-sm">
          <div className="p-4 bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] text-center">
            <Lightbulb className="w-5 h-5 text-[#F59E0B] mx-auto mb-1.5 shrink-0" />
            <div className="text-gray-400 text-xs uppercase font-bold tracking-wider">Street Lighting</div>
            <div className="font-extrabold text-white mt-1 whitespace-nowrap">96% Lit</div>
          </div>

          <div className="p-4 bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] text-center">
            <Eye className="w-5 h-5 text-[#3B82F6] mx-auto mb-1.5 shrink-0" />
            <div className="text-gray-400 text-xs uppercase font-bold tracking-wider">CCTV Coverage</div>
            <div className="font-extrabold text-white mt-1 whitespace-nowrap">88% Monitored</div>
          </div>

          <div className="p-4 bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] text-center">
            <ShieldAlert className="w-5 h-5 text-[#22C55E] mx-auto mb-1.5 shrink-0" />
            <div className="text-gray-400 text-xs uppercase font-bold tracking-wider">Police Proximity</div>
            <div className="font-extrabold text-white mt-1 whitespace-nowrap">1.2 km Near</div>
          </div>
        </div>
      </div>

      {/* Map Filter Toggles */}
      <div className="space-y-3">
        <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#3B82F6] shrink-0" />
          <span>Interactive Hazard Map Overlay Filters</span>
        </label>

        <div className="grid grid-cols-4 gap-3 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`min-h-[48px] px-4 py-3 rounded-xl border font-extrabold text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              activeFilter === 'all' ? 'bg-[#3B82F6] border-blue-500 text-white shadow-sm' : 'bg-[#121212] border-[#2A2A2A] text-gray-300'
            }`}
          >
            All Pins
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('lights')}
            className={`min-h-[48px] px-4 py-3 rounded-xl border font-extrabold text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              activeFilter === 'lights' ? 'bg-[#F59E0B] border-amber-500 text-slate-950 shadow-sm' : 'bg-[#121212] border-[#2A2A2A] text-gray-300'
            }`}
          >
            Lights
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('hazards')}
            className={`min-h-[48px] px-4 py-3 rounded-xl border font-extrabold text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              activeFilter === 'hazards' ? 'bg-[#EF4444] border-red-500 text-white shadow-sm' : 'bg-[#121212] border-[#2A2A2A] text-gray-300'
            }`}
          >
            Hazards
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('police')}
            className={`min-h-[48px] px-4 py-3 rounded-xl border font-extrabold text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              activeFilter === 'police' ? 'bg-[#22C55E] border-emerald-500 text-white shadow-sm' : 'bg-[#121212] border-[#2A2A2A] text-gray-300'
            }`}
          >
            Police
          </button>
        </div>
      </div>

      {/* Report Hazard Form */}
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2.5">
          <AlertOctagon className="w-5 h-5 text-[#F59E0B] shrink-0" />
          <span>Report Community Safety Telemetry</span>
        </h3>

        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300">
            Hazard Activity Category
          </label>
          <select
            value={hazardType}
            onChange={(e) => setHazardType(e.target.value)}
            className="w-full min-h-[52px] bg-[#121212] border border-[#2A2A2A] rounded-xl px-5 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-[#F59E0B] transition-colors"
          >
            <option value="Street Lighting Audit">Street Lighting Audit (Lit Corridor Pin)</option>
            <option value="Poor / Broken Lighting">Poor / Broken Lighting (Dark Moon Pin)</option>
            <option value="Suspicious Activity">Suspicious Activity (Alert Triangle Pin)</option>
            <option value="Isolated Pedestrian Walk">Isolated Pedestrian Walk (Walk Pin)</option>
            <option value="Police / Safe Haven Patrol">Police / Safe Haven Patrol (Police Pin)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300">
            Street Name / Location Landmark
          </label>
          <div className="relative">
            <MapPin className="w-5 h-5 text-gray-500 absolute left-4 top-4 shrink-0" />
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. North Gate Commercial Avenue"
              className="w-full min-h-[52px] bg-[#121212] border border-[#2A2A2A] rounded-xl pl-12 pr-5 py-3.5 text-xs sm:text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-[#F59E0B] transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300">
            Additional Telemetry Details
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Provide brief details regarding street lighting or safety conditions..."
            rows={2}
            className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl p-4.5 text-xs sm:text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-[#F59E0B] resize-none transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full min-h-[52px] px-6 py-4 bg-[#F59E0B] hover:bg-amber-500 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm md:text-base flex items-center justify-center gap-3 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Send className="w-5 h-5 shrink-0" />
          <span className="whitespace-nowrap">Broadcast Telemetry & Plot Hazard Pin on Map</span>
        </button>
      </form>

      {submitted && (
        <div className="p-5 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-2xl text-xs sm:text-sm text-[#22C55E] space-y-1.5">
          <div className="flex items-center gap-2.5 font-extrabold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Hazard Telemetry Broadcasted & Map Pin Plotted!</span>
          </div>
          <p className="text-xs text-gray-400 font-medium">
            Category: {submitted.type} • Timestamp: {submitted.timestamp}
          </p>
        </div>
      )}

      {/* Live Community Reports Stream */}
      <div className="pt-3 border-t border-[#2A2A2A] space-y-4">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300">
          Live Community Telemetry Feed Stream
        </h3>

        <div className="space-y-3.5 max-h-56 overflow-y-auto no-scrollbar">
          {reports.map(r => (
            <div key={r.id} className="p-4.5 bg-[#121212] border border-[#2A2A2A] rounded-2xl space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-[#F59E0B] text-xs sm:text-sm flex items-center gap-2">
                  {getIconForCategory(r.type)}
                  <span className="whitespace-nowrap truncate">{r.type}</span>
                </span>
                <span className="text-xs font-mono text-gray-500 shrink-0">{r.timestamp}</span>
              </div>
              <p className="text-gray-200 font-medium text-xs sm:text-sm leading-relaxed">{r.notes}</p>
              <div className="flex items-center gap-3.5 pt-1 text-xs text-gray-400 font-medium">
                <button className="flex items-center gap-2 hover:text-[#3B82F6] transition-colors">
                  <ThumbsUp className="w-4 h-4 shrink-0" /> Verify Report (12)
                </button>
                <span>• Verified by AURA Patrol</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
