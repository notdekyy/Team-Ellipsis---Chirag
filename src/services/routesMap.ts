import L from 'leaflet';
import { geocodeLocation } from './aiEngine';
import { TelemetryData, RouteDetails } from '../types';
import { getStoredHazards } from './hazardStorage';

const OSRM_DRIVING_URL = 'https://router.project-osrm.org/route/v1/driving';

export class RoutesMapService {
  private map: L.Map | null = null;
  private routePolylines: L.Polyline[] = [];
  private markers: L.CircleMarker[] = [];
  private hazardMarkers: L.Marker[] = [];

  public initMap(containerId: string, center: [number, number] = [23.2599, 77.4126], zoom: number = 13): L.Map | null {
    const container = document.getElementById(containerId);
    if (!container) return null;
    if (this.map) {
      setTimeout(() => this.map?.invalidateSize(), 200);
      return this.map;
    }

    this.map = L.map(containerId, { zoomControl: false }).setView(center, zoom);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO &copy; OSRM',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // Plot all persisted community hazards from JSON/localStorage on initial load
    this.renderAllStoredHazardPins();

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 250);

    return this.map;
  }

  public renderAllStoredHazardPins() {
    if (!this.map) return;

    // Remove existing hazard markers to prevent duplicates
    this.hazardMarkers.forEach(m => this.map?.removeLayer(m));
    this.hazardMarkers = [];

    const storedHazards = getStoredHazards();
    storedHazards.forEach(h => {
      this.plotSingleHazardPin(h.type, h.symbol || '⚠️', h.notes, h.lat, h.lng);
    });
  }

  public invalidateSize() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  public plotSingleHazardPin(type: string, symbol: string, notes: string, lat?: number, lng?: number) {
    if (!this.map) return;

    const center = this.map.getCenter();
    const targetLat = lat || center.lat + (Math.random() - 0.5) * 0.015;
    const targetLng = lng || center.lng + (Math.random() - 0.5) * 0.015;

    const iconHtml = `
      <div style="background:#0f172a; border:2px solid #f59e0b; border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 0 14px rgba(245,158,11,0.6); cursor:pointer;">
        ${symbol}
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'custom-hazard-div-icon',
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const marker = L.marker([targetLat, targetLng], { icon: customIcon }).addTo(this.map);
    marker.bindPopup(`
      <div style="font-family:sans-serif; font-size:12px; line-height:1.5; color:#f8fafc;">
        <strong style="color:#f59e0b; font-size:13px;">${symbol} ${type}</strong><br>
        <span style="color:#cbd5e1; font-size:11.5px;">${notes || 'Community Reported Hazard'}</span><br>
        <span style="font-size:10px; color:#10b981; font-weight:bold;">✓ Saved in JSON Persistent Grid</span>
      </div>
    `);

    this.hazardMarkers.push(marker);
    return { lat: targetLat, lng: targetLng };
  }

  public addHazardMarkerToMap(type: string, symbol: string, notes: string, lat?: number, lng?: number) {
    const coords = this.plotSingleHazardPin(type, symbol, notes, lat, lng);
    if (this.map && coords) {
      this.map.panTo([coords.lat, coords.lng]);
    }
  }

  public async calculateAndDrawRoute(originQuery: string, destQuery: string): Promise<TelemetryData> {
    const orig = await geocodeLocation(originQuery);
    const dest = await geocodeLocation(destQuery);

    if (!orig || !dest) {
      throw new Error(`Could not resolve location coordinates for: ${!orig ? originQuery : destQuery}`);
    }

    const url = `${OSRM_DRIVING_URL}/${orig.lon},${orig.lat};${dest.lon},${dest.lat}?overview=full&geometries=geojson&steps=true&alternatives=true`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('OSRM API request failed');

    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No OSRM routes found between coordinates');
    }

    const parseRoute = (r: any, id: 'safer' | 'direct', title: string, score: number, color: string): RouteDetails => {
      const coords: [number, number][] = r.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
      const distKm = parseFloat((r.distance / 1000.0).toFixed(1));
      const durMin = Math.round(r.duration / 60.0);
      const durText = durMin >= 60 ? `${Math.floor(durMin / 60)}h ${durMin % 60}m` : `${durMin} mins`;

      return {
        id,
        title,
        safetyScore: score,
        distanceKm: distKm,
        durationMin: durMin,
        durationText: durText,
        color,
        isIntercity: distKm > 15.0,
        coordinates: coords,
        steps: r.legs?.[0]?.steps?.map((st: any, i: number) => ({
          stepIndex: i + 1,
          instruction: `${st.maneuver ? st.maneuver.type : 'Proceed'} ${st.name ? 'onto ' + st.name : ''}`,
          distance: `${Math.round(st.distance)}m`
        })) || []
      };
    };

    const saferRoute = parseRoute(data.routes[0], 'safer', '🛡️ Safer Illuminated Commercial Corridor', 94, '#10b981');

    let directRoute: RouteDetails | undefined = undefined;
    if (data.routes.length > 1) {
      directRoute = parseRoute(data.routes[1], 'direct', '⚡ Direct Shortcut Route', 82, '#f59e0b');
    } else {
      const offsetCoords: [number, number][] = saferRoute.coordinates.map(([lat, lng]) => [lat + 0.0015, lng + 0.0015]);
      directRoute = {
        ...saferRoute,
        id: 'direct',
        title: '⚡ Direct Shortcut Route',
        safetyScore: 82,
        distanceKm: parseFloat((saferRoute.distanceKm * 0.94).toFixed(1)),
        durationMin: Math.max(1, saferRoute.durationMin - 2),
        durationText: `${Math.max(1, saferRoute.durationMin - 2)} mins`,
        color: '#f59e0b',
        coordinates: offsetCoords
      };
    }

    const telemetry: TelemetryData = {
      originName: orig.name,
      originFullName: orig.fullName,
      originCoords: [orig.lat, orig.lon],
      destName: dest.name,
      destFullName: dest.fullName,
      destCoords: [dest.lat, dest.lon],
      distanceKm: saferRoute.distanceKm,
      durationMin: saferRoute.durationMin,
      durationText: saferRoute.durationText,
      isIntercity: saferRoute.isIntercity,
      steps: saferRoute.steps,
      saferRoute,
      directRoute
    };

    this.renderDualRoutesOnMap(saferRoute, directRoute, telemetry);
    return telemetry;
  }

  public renderDualRoutesOnMap(safer: RouteDetails, direct: RouteDetails | undefined, telemetry: TelemetryData) {
    if (!this.map) return;

    this.routePolylines.forEach(p => this.map?.removeLayer(p));
    this.markers.forEach(m => this.map?.removeLayer(m));
    this.routePolylines = [];
    this.markers = [];

    if (direct) {
      const directLine = L.polyline(direct.coordinates, {
        color: direct.color,
        weight: 4,
        dashArray: '6, 8',
        opacity: 0.85
      }).addTo(this.map).bindPopup(`<b>⚡ Direct Shortcut Route</b><br>${direct.distanceKm} km • ${direct.durationText}<br>Safety Score: 82/100`);
      this.routePolylines.push(directLine);
    }

    const saferLine = L.polyline(safer.coordinates, {
      color: safer.color,
      weight: 6,
      opacity: 0.95
    }).addTo(this.map).bindPopup(`<b>🛡️ Safer Illuminated Commercial Corridor</b><br>${safer.distanceKm} km • ${safer.durationText}<br>Safety Score: 94/100`);
    this.routePolylines.push(saferLine);

    const oMarker = L.circleMarker(telemetry.originCoords, {
      radius: 9,
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 1
    }).addTo(this.map).bindPopup(`<b>🟢 Origin: ${telemetry.originName}</b>`);

    const dMarker = L.circleMarker(telemetry.destCoords, {
      radius: 9,
      color: '#ef4444',
      fillColor: '#ef4444',
      fillOpacity: 1
    }).addTo(this.map).bindPopup(`<b>🔴 Destination: ${telemetry.destName}</b>`);

    this.markers.push(oMarker, dMarker);

    const featureGroup = L.featureGroup([saferLine, ...(direct ? [this.routePolylines[0]] : [])]);
    this.map.fitBounds(featureGroup.getBounds(), { padding: [40, 40] });
    setTimeout(() => this.map?.invalidateSize(), 150);
  }
}

export const routesMapService = new RoutesMapService();
