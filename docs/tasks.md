# Task List

## Phase 1: Project Foundation
- [x] **Initialize Project Root**
    - Create root directory, `server/`, and `client/`.
    - Initialize git repository.
    - *(Plan: 1.1)*
- [x] **Backend Configuration**
    - Initialize `server/package.json`.
    - Install `express`, `cors`, `body-parser`, `nodemon`.
    - *(Plan: 1.1)*
- [x] **Frontend Configuration**
    - Initialize React app in `client/` (e.g., Create React App or Vite).
    - Install `axios` and `react-qr-reader`.
    - *(Plan: 1.1)*

## Phase 2: BFF Layer - Core Logic
- [x] **Server Entry Point**
    - Create `server/index.js`.
    - Configure Express app with CORS and JSON middleware.
    - Start server on port 3001.
    - *(Plan: 2.1)*
- [x] **Spatial Utility**
    - Create `server/utils/geo.js`.
    - Implement `getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2)`.
    - *(Plan: 2.2, Req: 1)*
- [x] **Storage Module**
    - Create `server/storage.js`.
    - Implement `saveRecord(record)` (in-memory array or file).
    - Implement `findNearestRecord(lat, lon, thresholdMeters)`.
    - *(Plan: 2.3, Req: 5)*
- [x] **Resolve API**
    - Create route `POST /api/resolve`.
    - Accept `{ lat, lon }`.
    - Use `findNearestRecord`; return file content if found, else 404.
    - *(Plan: 2.4, Req: 1)*
- [x] **Register API**
    - Create route `POST /api/register`.
    - Accept `{ lat, lon, content }`.
    - Call `saveRecord`.
    - *(Plan: 2.4, Req: 2)*
- [x] **History API**
    - Create route `GET /api/history`.
    - Return all stored records.
    - *(Plan: 2.4, Req: 4)*

## Phase 3: Web UI - Components & Integration
- [x] **API Service**
    - Create `client/src/api.js`.
    - specific methods: `resolve(coords)`, `register(data)`, `fetchHistory()`.
    - *(Plan: 3.1)*
- [x] **Geolocation Hook/Component**
    - Create `components/GeoHandler.jsx`.
    - Get current position on mount; handle errors.
    - *(Plan: 3.2, Req: 1)*
- [x] **Manual Input Component**
    - Create `components/JsonInput.jsx`.
    - Textarea for JSON input and Submit button.
    - *(Plan: 3.2, Req: 3)*
- [x] **QR Scanner Component**
    - Create `components/Scanner.jsx`.
    - Render QR reader when active; emit result on scan.
    - *(Plan: 3.3, Req: 2)*
- [x] **Visualization Canvas**
    - Create `components/Canvas.jsx`.
    - Display current content (file/text).
    - *(Plan: 3.4, Req: 4)*
- [x] **History Sidebar**
    - Create `components/History.jsx`.
    - List items; handle click to view details.
    - *(Plan: 3.4, Req: 4)*
- [x] **Main App Integration**
    - Stitch components in `App.jsx`.
    - State: `status` (checking -> found/scanning), `content`, `history`.
    - *(Plan: 3.1)*

## Phase 4: Polish & Verification
- [ ] **Permission UI**
    - Add friendly UI prompts for allowing camera/location access.
    - *(Plan: 4.1)*
- [ ] **Mobile Layout**
    - Apply CSS media queries for mobile-first view.
    - *(Plan: 4.2)*node_modules/
      dist/
      .env
      .DS_Store
      coverage/