import React, { useState } from 'react';
import { Route, Navigation, ShieldCheck, AlertCircle, Loader2, Footprints, Car, Bike, Bus, MapPin, Zap, CheckCircle2, Train } from 'lucide-react';
import { routesMapService } from '../services/routesMap';
import { TelemetryData, RouteDetails } from '../types';

interface Module1Props {
  onTelemetryCalculated: (telemetry: TelemetryData) => void;
}

export const Module1_Routes: React.FC<Module1Props> = ({ onTelemetryCalculated }) => {
  const [origin, setOrigin] = useState('');
  const [dest, setDest] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<'safer' | 'direct'>('safer');
  const [isLoading, setIsLoading] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    if (!origin.trim() || !dest.trim()) {
      setError('Please enter both origin and destination locations!');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const data = await routesMapService.calculateAndDrawRoute(origin, dest);
      setTelemetry(data);
      onTelemetryCalculated(data);
    } catch (err: any) {
      setError(err.message || 'Could not calculate OSRM route.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateFares = (km: number) => {
    return {
      auto: Math.max(30, Math.round(km * 15)),
      bike: Math.max(20, Math.round(km * 9)),
      cab: Math.max(60, Math.round(km * 22)),
      bus: Math.max(15, Math.round(km * 3)),
    };
  };

  const activeRouteData: RouteDetails | undefined = telemetry
    ? selectedRouteId === 'safer'
      ? telemetry.saferRoute
      : telemetry.directRoute || telemetry.saferRoute
    : undefined;

  return (
    <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 sm:p-7 shadow-sm space-y-7">
      {/* Module Title Header */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center border border-[#3B82F6]/30 shrink-0">
            <Route className="w-6 h-6 shrink-0" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-white whitespace-nowrap truncate leading-normal">
              Module 1: Safe Route Navigation
            </h2>
            <p className="text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap truncate">
              OSRM GIS Telemetry & Dual Route Engine
            </p>
          </div>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30 shrink-0">
          OSRM Active
        </span>
      </div>

      {/* Input Form Controls */}
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300">
            Start Location (Origin)
          </label>
          <div className="relative">
            <MapPin className="w-5 h-5 text-[#22C55E] absolute left-4 top-4 shrink-0" />
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter origin (e.g. MP Nagar, Bhopal or Connaught Place, Delhi)"
              className="w-full min-h-[52px] bg-[#121212] border border-[#2A2A2A] rounded-xl pl-12 pr-5 py-3.5 text-xs sm:text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300">
            Destination
          </label>
          <div className="relative">
            <MapPin className="w-5 h-5 text-[#EF4444] absolute left-4 top-4 shrink-0" />
            <input
              type="text"
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              placeholder="Enter destination (e.g. DB Mall, Bhopal or Hauz Khas, Delhi)"
              className="w-full min-h-[52px] bg-[#121212] border border-[#2A2A2A] rounded-xl pl-12 pr-5 py-3.5 text-xs sm:text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={isLoading}
          className="w-full min-h-[52px] px-6 py-4 bg-[#3B82F6] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm md:text-base font-extrabold flex items-center justify-center gap-3 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin shrink-0" /> : <Navigation className="w-5 h-5 shrink-0" />}
          <span className="whitespace-nowrap">Calculate Dual Routes (Safer & Direct)</span>
        </button>
      </div>

      {error && (
        <div className="p-5 bg-red-500/10 border border-[#EF4444]/30 rounded-2xl text-xs sm:text-sm font-medium text-red-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Dual Route Options Selector Cards */}
      {telemetry && telemetry.saferRoute && (
        <div className="space-y-5 pt-2">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300">
            Available Route Telemetry Options
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Route 1: Safer Illuminated Route */}
            <div
              onClick={() => setSelectedRouteId('safer')}
              className={`p-5 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                selectedRouteId === 'safer'
                  ? 'bg-[#22C55E]/10 border-[#22C55E] shadow-sm'
                  : 'bg-[#121212] border-[#2A2A2A] hover:border-[#3B82F6]/60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm font-extrabold text-[#22C55E] flex items-center gap-2 whitespace-nowrap">
                  <ShieldCheck className="w-5 h-5 shrink-0" /> Safer Corridor
                </span>
                {selectedRouteId === 'safer' && <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />}
              </div>

              <div className="text-base sm:text-lg font-extrabold text-white whitespace-nowrap">
                {telemetry.saferRoute.distanceKm} km • {telemetry.saferRoute.durationText}
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-400 mt-1.5 whitespace-nowrap truncate">
                96% Lit Commercial Avenues
              </div>
              <div className="mt-3 text-xs font-extrabold text-[#22C55E] bg-[#22C55E]/20 px-3.5 py-1.5 rounded-xl inline-block">
                Score: 94/100
              </div>
            </div>

            {/* Route 2: Direct Route */}
            {telemetry.directRoute && (
              <div
                onClick={() => setSelectedRouteId('direct')}
                className={`p-5 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  selectedRouteId === 'direct'
                    ? 'bg-[#F59E0B]/10 border-[#F59E0B] shadow-sm'
                    : 'bg-[#121212] border-[#2A2A2A] hover:border-[#3B82F6]/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs sm:text-sm font-extrabold text-[#F59E0B] flex items-center gap-2 whitespace-nowrap">
                    <Zap className="w-5 h-5 shrink-0" /> Direct Shortcut
                  </span>
                  {selectedRouteId === 'direct' && <CheckCircle2 className="w-5 h-5 text-[#F59E0B] shrink-0" />}
                </div>

                <div className="text-base sm:text-lg font-extrabold text-white whitespace-nowrap">
                  {telemetry.directRoute.distanceKm} km • {telemetry.directRoute.durationText}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-400 mt-1.5 whitespace-nowrap truncate">
                  Direct Highway Path
                </div>
                <div className="mt-3 text-xs font-extrabold text-[#F59E0B] bg-[#F59E0B]/20 px-3.5 py-1.5 rounded-xl inline-block">
                  Score: 82/100
                </div>
              </div>
            )}
          </div>

          {/* Active Selected Route Details Card */}
          {activeRouteData && (
            <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between pb-1 border-b border-[#2A2A2A]">
                <div className="flex items-center gap-2.5 text-white font-extrabold text-xs sm:text-sm md:text-base">
                  <ShieldCheck className="w-5 h-5 text-[#22C55E] shrink-0" />
                  <span className="whitespace-nowrap truncate">Selected: {activeRouteData.title}</span>
                </div>
                <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-xl bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 shrink-0">
                  Safety: {activeRouteData.safetyScore}/100
                </span>
              </div>

              {/* Status Telemetry Horizontal Rows */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A] text-xs sm:text-sm">
                  <span className="text-gray-400 font-medium whitespace-nowrap">Origin</span>
                  <span className="font-extrabold text-white whitespace-nowrap truncate ml-3">{telemetry.originName}</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A] text-xs sm:text-sm">
                  <span className="text-gray-400 font-medium whitespace-nowrap">Destination</span>
                  <span className="font-extrabold text-white whitespace-nowrap truncate ml-3">{telemetry.destName}</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A] text-xs sm:text-sm">
                  <span className="text-gray-400 font-medium whitespace-nowrap">Road Distance</span>
                  <span className="font-extrabold text-white whitespace-nowrap">{activeRouteData.distanceKm} km</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A] text-xs sm:text-sm">
                  <span className="text-gray-400 font-medium whitespace-nowrap">Travel Duration</span>
                  <span className="font-extrabold text-white whitespace-nowrap">{activeRouteData.durationText}</span>
                </div>
              </div>

              {/* Multi-Modal Transport Fare Comparison */}
              <div className="space-y-3.5 pt-2">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300">
                  Multi-Modal Ride Fare Breakdown
                </h4>

                {activeRouteData.isIntercity ? (
                  <div className="space-y-3.5">
                    <div className="p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-2xl text-xs sm:text-sm text-[#F59E0B] font-medium leading-relaxed">
                      ⚠️ <strong>Physical Feasibility Warning:</strong> Walking {activeRouteData.distanceKm} km, local Auto-Rickshaws, or 2-wheeler scooters (Rapido) are <strong>UNFEASIBLE & UNSAFE</strong> for high-speed intercity highways.
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
                      <div className="p-4 bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl text-center">
                        <Car className="w-5 h-5 text-[#3B82F6] mx-auto mb-1.5 shrink-0" />
                        <div className="font-extrabold text-white whitespace-nowrap">Uber Outstation</div>
                        <div className="text-xs sm:text-sm text-gray-400 mt-1">₹{calculateFares(activeRouteData.distanceKm).cab}</div>
                      </div>

                      <div className="p-4 bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl text-center">
                        <Bus className="w-5 h-5 text-[#F59E0B] mx-auto mb-1.5 shrink-0" />
                        <div className="font-extrabold text-white whitespace-nowrap">Volvo AC Bus</div>
                        <div className="text-xs sm:text-sm text-gray-400 mt-1">₹{calculateFares(activeRouteData.distanceKm).bus}</div>
                      </div>

                      <div className="p-4 bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl text-center">
                        <Train className="w-5 h-5 text-[#22C55E] mx-auto mb-1.5 shrink-0" />
                        <div className="font-extrabold text-white whitespace-nowrap">Vande Bharat</div>
                        <div className="text-xs sm:text-sm text-gray-400 mt-1">Express Rail</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                    <div className="p-4 bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl text-center">
                      <Bike className="w-5 h-5 text-[#F59E0B] mx-auto mb-1.5 shrink-0" />
                      <div className="font-extrabold text-white whitespace-nowrap">Ola Auto</div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1">₹{calculateFares(activeRouteData.distanceKm).auto}</div>
                    </div>

                    <div className="p-4 bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl text-center">
                      <Bike className="w-5 h-5 text-[#3B82F6] mx-auto mb-1.5 shrink-0" />
                      <div className="font-extrabold text-white whitespace-nowrap">Rapido Bike</div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1">₹{calculateFares(activeRouteData.distanceKm).bike}</div>
                    </div>

                    <div className="p-4 bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl text-center">
                      <Car className="w-5 h-5 text-[#22C55E] mx-auto mb-1.5 shrink-0" />
                      <div className="font-extrabold text-white whitespace-nowrap">Uber Cab</div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1">₹{calculateFares(activeRouteData.distanceKm).cab}</div>
                    </div>

                    <div className="p-4 bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl text-center">
                      <Footprints className="w-5 h-5 text-gray-400 mx-auto mb-1.5 shrink-0" />
                      <div className="font-extrabold text-white whitespace-nowrap">Safe Walk</div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1">{activeRouteData.distanceKm <= 3.0 ? 'Feasible' : 'Unfeasible'}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Turn by Turn Steps */}
              {activeRouteData.steps && activeRouteData.steps.length > 0 && (
                <div className="pt-4 border-t border-[#2A2A2A] space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300">
                    Turn-by-Turn Telemetry Steps
                  </h4>
                  <div className="space-y-2.5 max-h-44 overflow-y-auto no-scrollbar">
                    {activeRouteData.steps.slice(0, 5).map((step, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs sm:text-sm text-gray-200 bg-[#1E1E1E] p-3.5 rounded-xl border border-[#2A2A2A]">
                        <span className="whitespace-nowrap truncate">{idx + 1}. {step.instruction}</span>
                        <span className="text-gray-400 font-mono text-xs whitespace-nowrap ml-3">{step.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
