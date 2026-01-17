# Development Plan

## Overview
This plan outlines the strategy to build the full-stack Geolocation File Retrieval application. It prioritizes the Backend-for-Frontend (BFF) logic to handle spatial queries, followed by the React-based UI for interaction.

## Phase 1: Project Foundation (Priority: High)
**Goal:** Establish the repository structure and development environment for a full-stack JavaScript application.
- **1.1 Project Setup**
    - Initialize a monorepo-style structure with `server` and `client` directories.
    - Configure shared tooling (linting, formatting).
    - *Relates to Requirements: All*

## Phase 2: BFF Layer - Core Logic (Priority: High)
**Goal:** Implement the Node.js backend to handle spatial logic and data storage.
- **2.1 Server Initialization**
    - Setup Express.js server with necessary middleware (CORS, Body Parsing).
    - *Relates to Requirements: N/A (Infrastructure)*
- **2.2 Spatial Logic Module**
    - Implement the logic to calculate distances between coordinates (e.g., Haversine formula) to satisfy the "10-meter" rule.
    - *Relates to Requirements: 1, 5*
- **2.3 Persistence Layer**
    - Implement a storage mechanism (in-memory or file-based) to store records as `{ coordinates, content, timestamp }`.
    - *Relates to Requirements: 5*
- **2.4 API Endpoints**
    - `POST /api/resolve`: For checking location existence.
    - `POST /api/register`: For saving new QR-scanned locations.
    - `GET /api/history`: For retrieving past activity.
    - *Relates to Requirements: 1, 2, 3, 4*
 - **2.5 Route Layer Modularization**
    - Extract endpoint handlers into modular routers under `server/routes/` (`health`, `register`, `resolve`, `history`) and mount them at `/api` from `server/index.js`.
    - No behavior changes; maintain existing payloads and status codes.
    - *Relates to Requirements: 1, 2, 4*

## Phase 3: Web UI - Components & Integration (Priority: Medium)
**Goal:** Build the React frontend to interact with the physical world (Geo/Cam) and the API.
- **3.1 React Foundation**
    - Initialize React app and API client services.
    - *Relates to Requirements: All*
- **3.2 Geolocation & Manual Input**
    - Implement `Navigator.geolocation` logic.
    - Implement JSON text input for manual testing.
    - *Relates to Requirements: 1, 3*
- **3.3 QR Scanner Integration**
    - Integrate a QR reader library to handle the fallback scenario.
    - *Relates to Requirements: 2*
- **3.4 Visualization & History**
    - Create the "Canvas" to display file content.
    - Create the History sidebar to list past interactions.
    - *Relates to Requirements: 4*
- **3.5 Intelligent Home Page**
    - Implement a Home page that automatically resolves content based on location or prompts for QR scan.
    - *Relates to Requirements: 1, 2*

## Phase 4: Polish & Verification (Priority: Low)
**Goal:** Ensure usability, error handling, and responsiveness.
- **4.1 Error & Permission Handling**
    - Handle browser permission denials (Location/Camera).
    - *Relates to Requirements: 1, 2*
- **4.2 UI/UX Refinement**
    - Ensure responsive layout for mobile use.
    - *Relates to Requirements: 4*

## Phase 5: Persistence (Priority: Medium)
**Goal:** Provide reliable data storage for location records.
- **5.1 Database Integration**
    - Integrate a database (e.g., Supabase, MongoDB) for persistent storage.
    - *Relates to Requirements: 5*
- **5.2 Repository Abstraction**
    - Abstract storage behind a repository layer to decouple from DB vendor specifics.
    - Support multiple backends (memory, mongo, supabase).
    - *Relates to Requirements: 5*
- **5.3 Persistence Tests**
    - Add tests to validate storage operations and proximity queries across different backends.
    - *Relates to Requirements: 5*

## Phase 6: CI/CD & Deployment (Netlify & GitHub Actions) (Priority: Medium)
**Goal:** Automate build, test, and deployment using GitHub Actions and Netlify.
- **6.1 Netlify Integration**
    - Connect Netlify to GitHub. Build base: `client`, command: `npm ci && npm run build`, publish: `dist`.
    - Add SPA redirects and configure `VITE_API_BASE` via Netlify env vars.
    - *Relates to Requirements: 6*
- **6.2 API via Netlify Functions (Single Wrapped Express)**
    - Add `netlify/functions/api.js` with `serverless-http` to wrap `server/index.js`.
    - Refactor server to export the Express app and avoid `listen` under Netlify; ensure storage initialization works in serverless.
    - *Relates to Requirements: 6*
- **6.3 Secrets & CORS**
    - Move secrets to Netlify environment variables (e.g., `MONGO_URL`, `MONGO_DB`).
    - If using separate origins, configure CORS to allow Netlify domain(s); prefer same-origin via `/.netlify/functions/api`.
    - *Relates to Requirements: 6*
- **6.4 GitHub Actions Acceptance Tests**
    - Add workflow to run Newman against Netlify Deploy Previews (PRs) and Production (main), publishing JUnit artifacts.
    - *Relates to Requirements: 6*
- **6.5 Documentation Update**
    - Update all documentation to reflect the move from GitLab to Netlify.
    - *Relates to Requirements: 6*

## Phase 7: Guideline Alignment (Priority: Medium)
**Goal:** Align the codebase with the JavaScript & React Project Guidelines (.junie/guidelines.md).
- **7.1 React Folder Structure**
    - Ensure components under `src/components`, utilities under `src/utils`, and pages under `src/pages`.
    - Create `src/pages` for view components and move `App.jsx` content to a new view.
    - *Relates to Requirements: 7*
- **7.2 Routing & Navigation**
    - Introduce `react-router-dom` to manage application views.
    - *Relates to Requirements: 7*
- **7.3 TypeScript Adoption for New/Updated UI**
    - Prefer TypeScript for new React components and define explicit props interfaces.
    - Incrementally migrate key components.
    - *Relates to Requirements: 7*
- **7.3 Styling Without Inline Styles**
    - Replace inline `style` with CSS Modules or Tailwind; choose CSS Modules initially.
    - *Relates to Requirements: 7*
- **7.4 Code Quality Tooling**
    - Add ESLint and Prettier configurations and scripts; ensure CI can run lint.
    - *Relates to Requirements: 7*
- **7.5 Testing Conventions**
    - Add unit tests with Vitest in `__tests__` folders adjacent to files.
    - *Relates to Requirements: 7*
- **7.6 Conventional Commits Enforcement**
    - Install and configure `husky` and `commitlint` to enforce the conventional commits specification.
    - *Relates to Requirements: 7*
- **7.7 Path Alias Implementation**
    - Configure path aliases (e.g., `@` for `src`) to simplify imports and improve maintainability.
    - *Relates to Requirements: 7*
- **7.8 PWA Conversion**
    - Convert the client to a Progressive Web App (PWA) using `vite-plugin-pwa`.
    - Configure manifest, service worker, and app icons.
    - *Relates to Requirements: 7*

## Phase 8: Connectivity & Feedback (Priority: Medium)
**Goal:** Improve user experience by handling offline scenarios and providing redirection feedback.
- **8.1 Internet Connection Check**
    - Implement a mechanism to detect internet connection status on startup and during usage.
    - Create a dedicated "Offline" page to inform the user.
    - *Relates to Requirements: 8*
- **8.2 Redirection & Availability Feedback**
    - Implement feedback for failed redirects or missing content.
    - Provide a clear path to scan a new QR code when redirection isn't possible.
    - *Relates to Requirements: 9*
- **8.3 Google Drive Validation**
    - Implement validation for Google Drive URLs before redirection.
    - Integrate validation into the Home page redirection flow.
    - *Relates to Requirements: 10*
- **8.4 Pre-Registration Validation & Robust Persistence**
    - Move URL and Google Drive validation before the `register` call in `handleScan`.
    - Implement server-side validation in the `register` endpoint as a final gatekeeper.
    - Ensure failed validation (client or server) prevents database persistence and shows appropriate feedback.
    - *Relates to Requirements: 11*