export interface TelemetryStep {
  stepIndex: number;
  instruction: string;
  distance: string;
}

export interface RouteDetails {
  id: 'safer' | 'direct';
  title: string;
  safetyScore: number;
  distanceKm: number;
  durationMin: number;
  durationText: string;
  color: string;
  isIntercity: boolean;
  coordinates: [number, number][];
  steps: TelemetryStep[];
}

export interface TelemetryData {
  originName: string;
  originFullName?: string;
  originCoords: [number, number];
  destName: string;
  destFullName?: string;
  destCoords: [number, number];
  distanceKm: number;
  durationMin: number;
  durationText: string;
  isIntercity: boolean;
  steps: TelemetryStep[];
  saferRoute?: RouteDetails;
  directRoute?: RouteDetails;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  telemetry?: TelemetryData | null;
}

export interface HazardReport {
  id: string;
  type: string;
  notes: string;
  timestamp: string;
  coords?: [number, number];
}
