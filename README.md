# AURA Safety Platform — Master All-In-One Unified Application (React + Vite + TypeScript)

This project combines **Modules 1, 2, 3 & 4** of the AURA Night-Safety Platform into a single unified web application, keeping all features of each module intact.

## 🚀 Features & Detailed Module Highlights

### 🗺️ Module 1: Safe Route Navigation & GIS Telemetry
- User enters Origin & Destination (starts empty).
- Real-world Nominatim geocoding & OSRM driving/walking polyline rendering on Leaflet dark map.
- Auto-fit map bounds & dynamic route telemetry calculation.

### 📊 Module 2: Safety Analytics & Community Reports
- Neighborhood Safety Score Meter (`94/100 CommercialLit`).
- Community Hazard Reporting Modal (Lighting Audit, Poor Lighting, Suspicious Activity, Isolated Area).

### 🚨 Module 3: Guardian SOS & Emergency Dispatch
- Emergency SOS Button with pulsing red alert and countdown timer.
- Guardian Heartbeat Status Indicator ("● Guardian SOS Watch Active").
- Live GPS tracking link generator.

### 🤖 Module 4: AURA AI Companion & Navigation Assistant
- Multi-Region Spatial Bounding Box Engine (Delhi NCR & Bhopal/MP Viewboxes).
- Real OSRM Routing Telemetry Injection before AI generation.
- Multi-modal transport safety rules ($\le 3$ km Walk, $3-15$ km Urban Auto/Bike/Cab, $>15$ km Intercity Cab/Bus/Train).
- Context-aware multi-turn memory (`contextMemory`) with Reset Memory controls.
- Interactive Quick-Action Chips (`Bhopal ➔ Indore`, `Delhi ➔ Solan`, `Compare Travel Modes`, `Python GPS Code`).

## 🛠️ Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build
```
