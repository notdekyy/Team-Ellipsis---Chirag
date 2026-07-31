import React, { useEffect } from 'react';
import { Route, ShieldCheck } from 'lucide-react';
import { routesMapService } from '../services/routesMap';
import { TelemetryData } from '../types';

interface RoutesMapViewProps {
  telemetry: TelemetryData | null;
}

export const RoutesMapView: React.FC<RoutesMapViewProps> = ({ telemetry }) => {
  useEffect(() => {
    routesMapService.initMap('all-in-one-map-container');

    const handleResize = () => {
      routesMapService.invalidateSize();
    };

    window.addEventListener('resize', handleResize);
    const timer = setTimeout(() => {
      routesMapService.invalidateSize();
    }, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[#121212] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div
        id="all-in-one-map-container"
        className="w-full h-full flex-1 bg-[#121212]"
        style={{ width: '100%', height: '100%', minHeight: '100%' }}
      ></div>
      
      {telemetry && (
        <div className="absolute bottom-4 left-4 right-4 bg-[#1E1E1E]/95 backdrop-blur-md border border-[#2A2A2A] p-4.5 rounded-2xl flex items-center justify-between text-xs sm:text-sm z-[1000] shadow-sm overflow-hidden">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center border border-[#3B82F6]/30 shrink-0">
              <Route className="w-5 h-5 shrink-0" />
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-white text-xs sm:text-sm md:text-base whitespace-nowrap truncate flex items-center gap-2">
                <span className="text-[#22C55E]">🟢 {telemetry.originName}</span>
                <span className="text-gray-500">➔</span>
                <span className="text-[#EF4444]">🔴 {telemetry.destName}</span>
              </div>
              <div className="text-gray-300 font-medium text-xs sm:text-sm mt-0.5 whitespace-nowrap truncate">
                {telemetry.distanceKm} km • {telemetry.durationText} ({telemetry.isIntercity ? 'Intercity Highway Corridor' : 'Local Urban Corridor'})
              </div>
            </div>
          </div>

          <span className="px-3.5 py-2 rounded-xl bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30 text-xs font-extrabold uppercase shrink-0 flex items-center gap-1.5 ml-2">
            <ShieldCheck className="w-4 h-4 text-[#22C55E] shrink-0" />
            <span className="whitespace-nowrap">OSRM Active</span>
          </span>
        </div>
      )}
    </div>
  );
};
