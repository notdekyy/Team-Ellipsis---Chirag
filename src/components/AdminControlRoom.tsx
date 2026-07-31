import React, { useState, useEffect, useRef } from 'react';
import { Shield, Radio, Video, AlertTriangle, CheckCircle2, XCircle, Send, Home, Lightbulb, Clock, Car, Footprints, Bike, Eye, Activity, Siren, Layers, Navigation } from 'lucide-react';
import L from 'leaflet';

export const AdminControlRoom: React.FC = () => {
  // Drone Mission Control State
  const [droneStatus, setDroneStatus] = useState<'STANDBY' | 'DISPATCHED' | 'RTL'>('STANDBY');
  const [droneBattery, setDroneBattery] = useState(98);
  const [droneAltitude, setDroneAltitude] = useState(45);
  const [droneSpeed, setDroneSpeed] = useState(0);
  const [dronePos, setDronePos] = useState<[number, number]>([23.2599, 77.4126]);
  const [spotlightOn, setSpotlightOn] = useState(false);

  // References for map and drone marker
  const mapRef = useRef<L.Map | null>(null);
  const droneMarkerRef = useRef<L.Marker | null>(null);
  const droneFlightInterval = useRef<any>(null);

  // Moderation Queue State
  const [moderationItems, setModerationItems] = useState([
    {
      id: 'mod-1',
      title: 'Blocked Sidewalk Obstruction',
      status: 'Pending',
      details: 'CCTV automated detection (human review required): scaffolding collapse blocking primary pedestrian path.',
      source: 'cctv',
    },
  ]);

  // CCTV Incident Stream State
  const [cam2Verified, setCam2Verified] = useState(false);
  const [cam2Dismissed, setCam2Dismissed] = useState(false);

  // Leaflet Admin Map Initialization
  useEffect(() => {
    const container = document.getElementById('admin-control-room-map');
    if (!container) return;

    const map = L.map('admin-control-room-map', { zoomControl: false }).setView([23.2599, 77.4126], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add active user beacon markers
    const users = [
      { name: 'Jane Doe (Walk)', coords: [23.262, 77.415], color: '#22C55E' },
      { name: 'Alex Vance (Auto)', coords: [23.251, 77.408], color: '#F59E0B' },
      { name: 'Sam Taylor (Bike)', coords: [23.268, 77.421], color: '#3B82F6' },
      { name: 'Priya Patel (Cab)', coords: [23.245, 77.432], color: '#22C55E' },
    ];

    users.forEach(u => {
      L.circleMarker(u.coords as [number, number], {
        radius: 8,
        color: u.color,
        fillColor: u.color,
        fillOpacity: 0.9,
      }).addTo(map).bindPopup(`<b>${u.name}</b>`);
    });

    // High-Tech Custom Quadcopter Drone SVG Icon
    const getDroneSVGHtml = (isSpotlight: boolean) => `
      <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
        ${isSpotlight ? `
          <div style="position:absolute; top:20px; left:-20px; width:84px; height:84px; background:radial-gradient(circle, rgba(245,158,11,0.5) 0%, rgba(245,158,11,0) 70%); border-radius:50%; pointer-events:none;"></div>
        ` : ''}
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 0px 8px rgba(59, 130, 246, 0.9));">
          <circle cx="12" cy="12" r="3" fill="#3B82F6" stroke="#ffffff" stroke-width="1.5"/>
          <line x1="6" y1="6" x2="18" y2="18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="18" y1="6" x2="6" y2="18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="5" cy="5" r="2.5" fill="#121212" stroke="#22C55E" stroke-width="1.5"/>
          <circle cx="19" cy="5" r="2.5" fill="#121212" stroke="#22C55E" stroke-width="1.5"/>
          <circle cx="5" cy="19" r="2.5" fill="#121212" stroke="#3B82F6" stroke-width="1.5"/>
          <circle cx="19" cy="19" r="2.5" fill="#121212" stroke="#3B82F6" stroke-width="1.5"/>
          <circle cx="12" cy="12" r="1" fill="#EF4444"/>
        </svg>
      </div>
    `;

    const customDroneIcon = L.divIcon({
      html: getDroneSVGHtml(spotlightOn),
      className: 'drone-svg-div-icon',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const dMarker = L.marker(dronePos, { icon: customDroneIcon }).addTo(map);
    dMarker.bindPopup('<b>AURA Escort Drone #1 (ArduPilot SITL)</b>');
    droneMarkerRef.current = dMarker;

    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      map.remove();
    };
  }, []);

  // Update Drone Marker icon on spotlight toggle
  useEffect(() => {
    if (!droneMarkerRef.current) return;
    const getDroneSVGHtml = (isSpotlight: boolean) => `
      <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
        ${isSpotlight ? `
          <div style="position:absolute; top:20px; left:-20px; width:84px; height:84px; background:radial-gradient(circle, rgba(245,158,11,0.5) 0%, rgba(245,158,11,0) 70%); border-radius:50%; pointer-events:none;"></div>
        ` : ''}
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 0px 8px rgba(59, 130, 246, 0.9));">
          <circle cx="12" cy="12" r="3" fill="#3B82F6" stroke="#ffffff" stroke-width="1.5"/>
          <line x1="6" y1="6" x2="18" y2="18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="18" y1="6" x2="6" y2="18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="5" cy="5" r="2.5" fill="#121212" stroke="#22C55E" stroke-width="1.5"/>
          <circle cx="19" cy="5" r="2.5" fill="#121212" stroke="#22C55E" stroke-width="1.5"/>
          <circle cx="5" cy="19" r="2.5" fill="#121212" stroke="#3B82F6" stroke-width="1.5"/>
          <circle cx="19" cy="19" r="2.5" fill="#121212" stroke="#3B82F6" stroke-width="1.5"/>
          <circle cx="12" cy="12" r="1" fill="#EF4444"/>
        </svg>
      </div>
    `;
    droneMarkerRef.current.setIcon(
      L.divIcon({
        html: getDroneSVGHtml(spotlightOn),
        className: 'drone-svg-div-icon',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      })
    );
  }, [spotlightOn]);

  // Handle Drone Flight Trajectory Animation
  const handleDispatchDrone = () => {
    setDroneStatus('DISPATCHED');
    setDroneSpeed(28);
    setDroneAltitude(55);

    if (droneFlightInterval.current) clearInterval(droneFlightInterval.current);

    const startLat = 23.2599;
    const startLng = 77.4126;
    const targetLat = 23.2620;
    const targetLng = 77.4150;

    let step = 0;
    const totalSteps = 20;

    droneFlightInterval.current = setInterval(() => {
      step++;
      const currentLat = startLat + (targetLat - startLat) * (step / totalSteps);
      const currentLng = startLng + (targetLng - startLng) * (step / totalSteps);

      setDronePos([currentLat, currentLng]);
      setDroneBattery(prev => Math.max(70, prev - 1));

      if (droneMarkerRef.current) {
        droneMarkerRef.current.setLatLng([currentLat, currentLng]);
      }
      if (mapRef.current) {
        mapRef.current.panTo([currentLat, currentLng]);
      }

      if (step >= totalSteps) {
        clearInterval(droneFlightInterval.current);
        setDroneSpeed(0);
      }
    }, 400);

    alert('🚁 ARDUPILOT SITL QUADCOPTER DISPATCHED!\nSVG Drone flying along trajectory to emergency coordinates [23.2620, 77.4150].');
  };

  const handleRTLDrone = () => {
    setDroneStatus('RTL');
    setSpotlightOn(false);
    setDroneSpeed(32);

    if (droneFlightInterval.current) clearInterval(droneFlightInterval.current);

    const startLat = dronePos[0];
    const startLng = dronePos[1];
    const homeLat = 23.2599;
    const homeLng = 77.4126;

    let step = 0;
    const totalSteps = 15;

    droneFlightInterval.current = setInterval(() => {
      step++;
      const currentLat = startLat + (homeLat - startLat) * (step / totalSteps);
      const currentLng = startLng + (homeLng - startLng) * (step / totalSteps);

      setDronePos([currentLat, currentLng]);

      if (droneMarkerRef.current) {
        droneMarkerRef.current.setLatLng([currentLat, currentLng]);
      }

      if (step >= totalSteps) {
        clearInterval(droneFlightInterval.current);
        setDroneSpeed(0);
        setDroneStatus('STANDBY');
        setDroneAltitude(45);
      }
    }, 350);

    alert('🏠 RTL (Return to Launch) Engaged. SVG Drone returning to Hangar Base.');
  };

  const handleApproveMod = (id: string) => {
    setModerationItems(prev => prev.filter(item => item.id !== id));
    alert('✓ Moderation item approved and broadcasted to public safety grid.');
  };

  const handleRejectMod = (id: string) => {
    setModerationItems(prev => prev.filter(item => item.id !== id));
    alert('✕ Moderation item dismissed.');
  };

  return (
    <div className="bg-[#121212] text-white p-5 sm:p-7 space-y-7 max-w-full mx-auto min-h-screen">
      {/* Standardized Header Card Matching All Other Modules (M1, M2, M3, M4) */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#2A2A2A] bg-[#121212]">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center border border-[#22C55E]/30 shrink-0">
              <Radio className="w-6 h-6 shrink-0 animate-pulse" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <h2 className="text-lg sm:text-xl font-extrabold text-white whitespace-nowrap truncate leading-normal">
                Admin Control Room Command Center
              </h2>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#22C55E] flex items-center gap-2 whitespace-nowrap truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse shrink-0"></span>
                Module 4 • ArduPilot SITL & CCTV AI Surveillance
              </span>
            </div>
          </div>

          <span className="px-4 py-2 rounded-xl bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 text-xs sm:text-sm font-extrabold uppercase flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse"></span>
            100% OPERATIONAL
          </span>
        </div>

        {/* Command Center Key Metrics Bar */}
        <div className="p-6 sm:p-7">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs sm:text-sm w-full">
            <div className="p-4 bg-[#121212] rounded-xl border border-[#2A2A2A] space-y-1">
              <div className="text-gray-400 text-xs font-extrabold uppercase tracking-wider">Active Journeys</div>
              <div className="text-xl font-extrabold text-[#22C55E]">4</div>
            </div>

            <div className="p-4 bg-[#121212] rounded-xl border border-[#2A2A2A] space-y-1">
              <div className="text-gray-400 text-xs font-extrabold uppercase tracking-wider">Escort Drones</div>
              <div className="text-xl font-extrabold text-[#3B82F6]">{droneStatus === 'DISPATCHED' ? '1 Active Flight' : '3 Standby'}</div>
            </div>

            <div className="p-4 bg-[#121212] rounded-xl border border-[#2A2A2A] space-y-1">
              <div className="text-gray-400 text-xs font-extrabold uppercase tracking-wider">CCTV AI Towers</div>
              <div className="text-xl font-extrabold text-[#F59E0B]">3 Connected</div>
            </div>

            <div className="p-4 bg-[#121212] rounded-xl border border-[#2A2A2A] space-y-1">
              <div className="text-gray-400 text-xs font-extrabold uppercase tracking-wider">Pending Moderation</div>
              <div className="text-xl font-extrabold text-[#EF4444]">{moderationItems.length}</div>
            </div>

            <div className="p-4 bg-[#121212] rounded-xl border border-[#2A2A2A] space-y-1">
              <div className="text-gray-400 text-xs font-extrabold uppercase tracking-wider">Avg Response Time</div>
              <div className="text-xl font-extrabold text-white">2.1 mins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Citywide Live Telemetry Grid (Map) */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
          <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#3B82F6] shrink-0" />
            <span>Citywide Live Telemetry Grid</span>
          </h3>
          <span className="text-xs sm:text-sm font-semibold text-gray-400">Real-time GPS updates & SVG Drone Flight Tracking</span>
        </div>

        <div className="relative w-full h-[420px] bg-[#121212] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-sm">
          <div id="admin-control-room-map" className="w-full h-full"></div>
        </div>
      </div>

      {/* AURA Drone / UAV ArduPilot SITL Mission Control */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
          <div className="flex items-center gap-3">
            <Navigation className="w-6 h-6 text-[#3B82F6] shrink-0" />
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              AURA Quadcopter Drone #1 (ArduPilot SITL) Mission Control
            </h3>
          </div>
          <span className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase border ${
            droneStatus === 'DISPATCHED' ? 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30 animate-pulse' : 'bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30'
          }`}>
            {droneStatus}
          </span>
        </div>

        {/* Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div className="p-4.5 bg-[#121212] rounded-2xl border border-[#2A2A2A]">
            <span className="text-gray-400 font-extrabold block text-xs uppercase tracking-wider">Battery Level</span>
            <span className="text-xl font-extrabold text-[#22C55E]">{droneBattery}% (4.12V)</span>
          </div>

          <div className="p-4.5 bg-[#121212] rounded-2xl border border-[#2A2A2A]">
            <span className="text-gray-400 font-extrabold block text-xs uppercase tracking-wider">Ground Speed</span>
            <span className="text-xl font-extrabold text-white">{droneSpeed} km/h</span>
          </div>

          <div className="p-4.5 bg-[#121212] rounded-2xl border border-[#2A2A2A]">
            <span className="text-gray-400 font-extrabold block text-xs uppercase tracking-wider">Altitude</span>
            <span className="text-xl font-extrabold text-white">{droneAltitude}m</span>
          </div>

          <div className="p-4.5 bg-[#121212] rounded-2xl border border-[#2A2A2A]">
            <span className="text-gray-400 font-extrabold block text-xs uppercase tracking-wider">Distance to Target</span>
            <span className="text-xl font-extrabold text-white">{droneStatus === 'DISPATCHED' ? '120m' : '45m'}</span>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-gray-300 font-medium bg-[#121212] p-4.5 rounded-2xl border border-[#2A2A2A] flex flex-wrap items-center justify-between gap-3">
          <span>📍 Real-time SVG Drone GPS: <strong>{dronePos[0].toFixed(4)}, {dronePos[1].toFixed(4)}</strong> • Pitch/Roll: 0° / 0°</span>
          <span>Searchlight Beam: <strong className={spotlightOn ? 'text-[#F59E0B]' : 'text-gray-500'}>{spotlightOn ? 'ACTIVE SPOTLIGHT ON' : 'OFF'}</strong></span>
        </div>

        {/* Drone Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handleDispatchDrone}
            className="min-h-[52px] px-6 py-3.5 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            <Send className="w-5 h-5 shrink-0" /> Dispatch to SOS Target
          </button>

          <button
            onClick={handleRTLDrone}
            className="min-h-[52px] px-6 py-3.5 bg-[#121212] hover:bg-slate-800 border border-[#2A2A2A] text-gray-200 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-5 h-5 text-[#F59E0B] shrink-0" /> RTL Hangar
          </button>

          <button
            onClick={() => setSpotlightOn(!spotlightOn)}
            className={`min-h-[52px] px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              spotlightOn ? 'bg-[#F59E0B] text-slate-950 border-amber-500 shadow-sm' : 'bg-[#121212] border-[#2A2A2A] text-gray-300'
            }`}
          >
            <Lightbulb className="w-5 h-5 shrink-0" /> Spotlight Toggle
          </button>
        </div>
      </div>

      {/* CCTV AI Automated Incident Stream with Real Playable MP4 Video Feeds */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5">
              <Video className="w-6 h-6 text-[#F59E0B] shrink-0" />
              <span>CCTV AI Automated Incident Stream</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">
              Live Stock Video Feeds Playing from <code className="text-[#3B82F6] bg-[#121212] px-2 py-0.5 rounded border border-[#2A2A2A]">public/videos/cam1.mp4</code>, <code className="text-[#3B82F6] bg-[#121212] px-2 py-0.5 rounded border border-[#2A2A2A]">cam2.mp4</code>, <code className="text-[#3B82F6] bg-[#121212] px-2 py-0.5 rounded border border-[#2A2A2A]">cam3.mp4</code>
            </p>
          </div>
          <span className="px-3.5 py-1.5 bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 rounded-xl text-xs font-extrabold uppercase shrink-0">
            Human Operator Review Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CAM-01 */}
          <div className="p-5 bg-[#121212] border border-[#2A2A2A] rounded-2xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="font-extrabold text-white">CAM-01 • Subway Entrance</span>
                <span className="text-[#22C55E] font-bold text-xs">92% Light</span>
              </div>
              
              {/* Real HTML5 Video Player */}
              <div className="relative w-full h-48 bg-black border border-[#2A2A2A] rounded-xl overflow-hidden shadow-inner">
                <video
                  src="/videos/cam1.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <p className="text-xs text-gray-400 font-medium leading-relaxed">Commercial Corridor • 24/7 CCTV AI Motion Detection Active</p>
          </div>

          {/* CAM-02 */}
          {!cam2Dismissed && (
            <div className={`p-5 bg-[#121212] border-2 rounded-2xl space-y-4 flex flex-col justify-between shadow-sm ${cam2Verified ? 'border-[#22C55E]' : 'border-[#F59E0B]'}`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="font-extrabold text-white">CAM-02 • 4th Ave Trail</span>
                  <span className="text-[#F59E0B] font-extrabold text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> UNLIT ZONE
                  </span>
                </div>

                {/* Real HTML5 Video Player */}
                <div className="relative w-full h-48 bg-black border border-[#2A2A2A] rounded-xl overflow-hidden shadow-inner">
                  <video
                    src="/videos/cam2.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[#F59E0B] font-extrabold leading-tight">
                  HIGH HAZARD: Dark Zone & Unmonitored Corridor.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setCam2Verified(true); alert('✓ Hazard verified! Dispatched street lighting crew.'); }}
                    className="min-h-[42px] px-3.5 py-2 bg-[#22C55E] hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex-1 justify-center"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Verify
                  </button>
                  <button
                    onClick={() => setCam2Dismissed(true)}
                    className="min-h-[42px] px-3.5 py-2 bg-[#1E1E1E] hover:bg-slate-800 border border-[#2A2A2A] text-gray-300 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex-1 justify-center"
                  >
                    <XCircle className="w-4 h-4 shrink-0" /> Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CAM-03 */}
          <div className="p-5 bg-[#121212] border border-[#2A2A2A] rounded-2xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="font-extrabold text-white">CAM-03 • Commercial Plaza</span>
                <span className="text-[#22C55E] font-bold text-xs">Safe Haven</span>
              </div>

              {/* Real HTML5 Video Player */}
              <div className="relative w-full h-48 bg-black border border-[#2A2A2A] rounded-xl overflow-hidden shadow-inner">
                <video
                  src="/videos/cam3.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <p className="text-xs text-gray-400 font-medium leading-relaxed">SECURITY ACTIVE: 24/7 OPEN PHARMACY & POLICE BEACON</p>
          </div>
        </div>
      </div>

      {/* Active Monitored User Telemetry */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
          <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5">
            <Eye className="w-6 h-6 text-[#22C55E] shrink-0" />
            <span>Active Monitored User Telemetry</span>
          </h3>
          <span className="px-3.5 py-1.5 bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 rounded-xl text-xs font-extrabold uppercase">
            Live Stream
          </span>
        </div>

        <div className="space-y-3.5">
          {/* User 1 */}
          <div className="p-5 bg-[#121212] border border-[#2A2A2A] rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center font-extrabold border border-[#22C55E]/30 shrink-0">
                JD
              </div>
              <div>
                <div className="font-extrabold text-white text-base">Jane Doe</div>
                <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                  <Footprints className="w-4 h-4 shrink-0 text-gray-400" /> Walk • Safer Corridor
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-300 font-semibold">Distance: 1.4 km</span>
              <span className="text-[#22C55E] font-extrabold">Safety Score: 92/100</span>
              <span className="text-gray-400 font-mono">ETA: 14 min</span>
              <span className="px-3 py-1 bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 rounded-xl font-bold uppercase">ON ROUTE</span>
            </div>
          </div>

          {/* User 2 */}
          <div className="p-5 bg-[#121212] border border-[#2A2A2A] rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center font-extrabold border border-[#F59E0B]/30 shrink-0">
                AV
              </div>
              <div>
                <div className="font-extrabold text-white text-base">Alex Vance</div>
                <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                  <Bike className="w-4 h-4 shrink-0 text-[#F59E0B]" /> Auto Rickshaw • Highway Corridor
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-300 font-semibold">Distance: 7.8 km</span>
              <span className="text-[#F59E0B] font-extrabold">Safety Score: 88/100</span>
              <span className="text-gray-400 font-mono">ETA: 18 min</span>
              <span className="px-3 py-1 bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 rounded-xl font-bold uppercase animate-pulse">CHECKIN_PENDING</span>
            </div>
          </div>

          {/* User 3 */}
          <div className="p-5 bg-[#121212] border border-[#2A2A2A] rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center font-extrabold border border-[#3B82F6]/30 shrink-0">
                ST
              </div>
              <div>
                <div className="font-extrabold text-white text-base">Sam Taylor</div>
                <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                  <Bike className="w-4 h-4 shrink-0 text-[#3B82F6]" /> Rapido Bike • Balanced Express
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-300 font-semibold">Distance: 4.2 km</span>
              <span className="text-[#22C55E] font-extrabold">Safety Score: 94/100</span>
              <span className="text-gray-400 font-mono">ETA: 9 min</span>
              <span className="px-3 py-1 bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 rounded-xl font-bold uppercase">ON ROUTE</span>
            </div>
          </div>

          {/* User 4 */}
          <div className="p-5 bg-[#121212] border border-[#2A2A2A] rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center font-extrabold border border-[#22C55E]/30 shrink-0">
                PP
              </div>
              <div>
                <div className="font-extrabold text-white text-base">Priya Patel</div>
                <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                  <Car className="w-4 h-4 shrink-0 text-[#22C55E]" /> Uber Cab • Lit Arterial Route
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-300 font-semibold">Distance: 12.5 km</span>
              <span className="text-[#22C55E] font-extrabold">Safety Score: 96/100</span>
              <span className="text-gray-400 font-mono">ETA: 22 min</span>
              <span className="px-3 py-1 bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 rounded-xl font-bold uppercase">ON ROUTE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Community & Sensor Moderation Queue */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4">
          <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-[#F59E0B] shrink-0" />
            <span>Community & Sensor Moderation Queue</span>
          </h3>
          <span className="text-xs font-mono text-gray-400">{moderationItems.length} pending</span>
        </div>

        {moderationItems.length === 0 ? (
          <p className="text-xs sm:text-sm text-gray-400 font-medium p-4 bg-[#121212] rounded-xl">✓ All moderation items cleared.</p>
        ) : (
          moderationItems.map(item => (
            <div key={item.id} className="p-5 bg-[#121212] border border-[#2A2A2A] rounded-2xl space-y-3.5">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="font-extrabold text-white text-base">{item.title}</span>
                <span className="px-3 py-1 bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 rounded-xl font-bold text-xs uppercase">
                  {item.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">{item.details}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-mono text-gray-500">Source: {item.source}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleApproveMod(item.id)}
                    className="min-h-[44px] px-5 py-2 bg-[#22C55E] hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Approve
                  </button>
                  <button
                    onClick={() => handleRejectMod(item.id)}
                    className="min-h-[44px] px-5 py-2 bg-[#1E1E1E] hover:bg-slate-800 border border-[#2A2A2A] text-gray-300 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <XCircle className="w-4 h-4 shrink-0" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Live System Event Timeline */}
      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
        <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5 border-b border-[#2A2A2A] pb-4">
          <Activity className="w-6 h-6 text-[#EF4444] shrink-0" />
          <span>Live System Event Timeline</span>
        </h3>

        <div className="space-y-3.5 text-xs sm:text-sm">
          <div className="p-4 bg-[#121212] border border-[#2A2A2A] rounded-2xl flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5 animate-pulse" />
            <div>
              <div className="font-extrabold text-white">SOS Emergency Alert Fired</div>
              <div className="text-xs text-gray-400 mt-0.5">SOS hold action confirmed • 6:52:00 PM</div>
            </div>
          </div>

          <div className="p-4 bg-[#121212] border border-[#2A2A2A] rounded-2xl flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-white">SOS Emergency Alert Fired</div>
              <div className="text-xs text-gray-400 mt-0.5">SOS hold action confirmed • 6:51:34 PM</div>
            </div>
          </div>

          <div className="p-4 bg-[#121212] border border-[#2A2A2A] rounded-2xl flex items-start gap-3.5">
            <Siren className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-white">Route deviation warning</div>
              <div className="text-xs text-gray-400 mt-0.5">User deviated 85m from Safer Route segment • 6:51:04 PM</div>
            </div>
          </div>

          <div className="p-4 bg-[#121212] border border-[#2A2A2A] rounded-2xl flex items-start gap-3.5">
            <Clock className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-white">Timed check-in confirmed</div>
              <div className="text-xs text-gray-400 mt-0.5">User responded to 30s check-in prompt • 6:50:54 PM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
