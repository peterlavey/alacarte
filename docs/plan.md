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
    - Integrate a database (e.g., MongoDB) for persistent storage.
    - *Relates to Requirements: 5*
- **5.2 Repository Abstraction**
    - Abstract storage behind a repository layer to decouple from DB vendor specifics.
    - *Relates to Requirements: 5*
- **5.3 Persistence Tests**
    - Add tests to validate storage operations and proximity queries.
    - *Relates to Requirements: 5*

## Phase 6: CI/CD & Deployment (Priority: Medium)
**Goal:** Automate build, test, and deployment using GitLab CI/CD.
- **6.1 CI Pipeline Definition**
    - Add `.gitlab-ci.yml` with stages: test, build, deploy.
    - *Relates to Requirements: 6*
- **6.2 Frontend Deployment (Pages)**
    - Build the Vite client and publish via GitLab Pages on default branch.
    - *Relates to Requirements: 6*
- **6.3 Backend Container Image**
    - Add Dockerfile for server and publish image to GitLab Container Registry on default branch.
    - *Relates to Requirements: 6*
- **6.4 Secrets Management**
    - Use GitLab CI/CD variables instead of committing secrets; document required variables.
    - *Relates to Requirements: 6*
 - **6.5 Acceptance Tests (Server Image)**
    - Add an Acceptance stage that runs a Postman/Newman collection against the server container image started as a CI service (with alias `server`).
    - Export JUnit reports as CI artifacts and fail the pipeline on API regressions.
    - *Relates to Requirements: 6*