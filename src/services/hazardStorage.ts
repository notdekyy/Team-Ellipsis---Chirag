import { HazardReport } from '../types';

export interface StoredHazard extends HazardReport {
  symbol?: string;
  lat?: number;
  lng?: number;
}

const STORAGE_KEY = 'aura_community_hazards_persistent';

const INITIAL_HAZARDS: StoredHazard[] = [
  {
    id: 'h-1',
    type: 'Street Lighting Audit',
    symbol: '💡',
    notes: '[Commercial Avenue] Commercial avenue 96% lit by high-mast LED lights.',
    lat: 23.262,
    lng: 77.415,
    timestamp: '10:14 PM',
  },
  {
    id: 'h-2',
    type: 'Poor / Broken Lighting',
    symbol: '🌑',
    notes: '[North Gate Alleyway] Streetlamp flickering near North Gate alleyway.',
    lat: 23.251,
    lng: 77.408,
    timestamp: '09:42 PM',
  },
  {
    id: 'h-3',
    type: 'Suspicious Activity',
    symbol: '⚠️',
    notes: '[Bus Stop] Unattended parked vehicle near bus stop.',
    lat: 23.268,
    lng: 77.421,
    timestamp: '08:15 PM',
  },
];

export const getStoredHazards = (): StoredHazard[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HAZARDS));
      return INITIAL_HAZARDS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading stored hazards:', err);
    return INITIAL_HAZARDS;
  }
};

export const saveHazardToStorage = (hazard: StoredHazard): StoredHazard[] => {
  try {
    const currentHazards = getStoredHazards();
    const updated = [hazard, ...currentHazards];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Generate auto-downloadable .json blob for local export
    exportHazardsToJSONFile(updated);

    return updated;
  } catch (err) {
    console.error('Error saving hazard:', err);
    return getStoredHazards();
  }
};

export const exportHazardsToJSONFile = (hazards: StoredHazard[]) => {
  try {
    const jsonString = JSON.stringify(hazards, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `community_hazards_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.warn('JSON file download prompt blocked or non-interactive:', e);
  }
};
