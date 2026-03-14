# Development Plan

## Overview
This plan outlines the strategy to build the full-stack Geolocation Restaurant Menu Retrieval application. It prioritizes the logic to find the nearest restaurant using the Google Places API, followed by a premium React-based UI.

## Phase 1: Project Foundation (Priority: High)
**Goal:** Establish the repository structure and development environment for a full-stack JavaScript application.
- **1.1 Project Setup**
    - Initialize a monorepo-style structure with `server` and `client` directories.
    - Configure shared tooling (linting, formatting).
    - *Relates to Requirements: All*

## Phase 2: BFF Layer - New Google Places API (v1) Integration (Priority: High)
**Goal:** Implement the Node.js backend to handle New Google Places API (v1) queries.
- **2.1 Server Initialization**
    - Setup Express.js server with necessary middleware (CORS, Body Parsing).
- **2.2 New Google Places API (v1) Module**
    - Implement the logic to query New Google Places API (v1) for nearby restaurants/bars within a 30-meter radius.
- **2.3 API Endpoints**
    - `POST /api/resolve`: For finding the nearest restaurant menu.

## Phase 3: Web UI - Components & Integration (Priority: Medium)
**Goal:** Build the React frontend to interact with the physical world (Geo/Cam) and the API.
- **3.1 React Foundation**
    - Initialize React app and API client services.
    - *Relates to Requirements: All*
- **3.2 Geolocation & Manual Input**
    - Implement `Navigator.geolocation` logic.
    - Implement input fields for manual coordinate testing.
- **3.4 Visualization**
    - Create the "Canvas" to display restaurant menu content.
- **3.5 Intelligent Home Page**
    - Implement a Home page that automatically resolves the nearest restaurant menu based on location.

## Phase 4: Polish & Verification (Priority: Low)
**Goal:** Ensure usability, error handling, and responsiveness.
- **4.1 Error & Permission Handling**
    - Handle browser permission denials (Location).
- **4.2 UI/UX Refinement**
    - Ensure responsive layout for mobile use.


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
- **6.3 Secrets & API Keys**
    - Configure Google Places API Key in environment variables.
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
- **7.9 Local Development API Configuration**
    - Ensure `dev:local` script correctly sets `VITE_API_BASE` for local development.
    - Remove hardcoded production defaults from API service.
    - *Relates to Requirements: 7*

## Phase 8: Connectivity & Feedback (Priority: Medium)
**Goal:** Improve user experience by handling offline scenarios and providing redirection feedback.
- **8.1 Internet Connection Check**
    - Implement a mechanism to detect internet connection status on startup and during usage.
    - Create a dedicated "Offline" page to inform the user.
    - *Relates to Requirements: 8*
- **8.2 Availability Feedback**
    - Implement feedback for missing restaurant matches.
- **8.3 Google Drive Validation**
    - Implement validation for Google Drive URLs before redirection.
    - Integrate validation into the Home page redirection flow.
    - *Relates to Requirements: 10*
- **8.4 Robustness**
    - Ensure failed resolution shows appropriate feedback.

## Phase 9: APK Export & PWABuilder Integration (Priority: Low)
**Goal:** Optimize the PWA for native app generation using PWABuilder.
- **9.1 Enhanced Web Manifest**
    - Update `vite-plugin-pwa` configuration to include all recommended fields for PWABuilder (orientation, categories, screenshots metadata, etc.).
    - *Relates to Requirements: 12*
- **9.2 Deployment & Verification**
    - Deploy the updated manifest and verify its quality score on PWABuilder.
    - *Relates to Requirements: 12*

## Phase 10: Premium UI & UX (Priority: Medium)
**Goal:** Create an elegant, sophisticated UI for a restaurant menu app.
- **10.1 Design System & Typography**
    - Define a calm, sober color palette and select premium fonts.
    - *Relates to Requirements: 13*
- **10.2 Layout & Component Redesign**
    - Implement card-based layouts with ample white space and clear hierarchy.
    - *Relates to Requirements: 13*
- **10.3 Microinteractions & Animations**
    - Add smooth transitions and hover/tap states.
    - *Relates to Requirements: 13*
- **10.4 Accessibility & Mobile Optimization**
    - Ensure high contrast and large tappable targets for a mobile-first experience.
    - *Relates to Requirements: 13*

## Phase 16: Google Places API Upgrade (Priority: High)
**Goal:** Upgrade to the New Google Places API (v1).
- **16.1 Migrate to New Google Places API (v1)**
    - Update `server/utils/googlePlaces.js` to use the v1 REST API.
    - Implement field masking and POST requests.
    - *Relates to Requirements: 9*
