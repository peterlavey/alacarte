# Requirements Document

## Introduction
The goal of this project is to develop a Geolocation-based File Retrieval System. The application utilizes a user's real-world location to serve specific content (files). If the location is not recognized, the system falls back to a QR code scanner to "learn" the location and associate it with content for future visits, thereby eliminating the need for repeated scanning.

## Requirements

### 1. Geolocation-Based Content Retrieval
**User Story:**
> As a user, I want the application to automatically show me the relevant file for my current location so that I don't have to manually search or scan a code.

**Acceptance Criteria:**
- **WHEN** the application loads, **THEN** it SHALL retrieve the user's geographic coordinates (latitude, longitude).
- **WHEN** the coordinates are sent to the server, **THEN** the system SHALL check for an existing record within a 10-meter radius.
- **WHEN** a record is found within range, **THEN** the system SHALL return the associated file content.
- **WHEN** no record is found within range, **THEN** the system SHALL indicate that no content exists for this location.

### 2. QR Code Fallback & Registration
**User Story:**
> As a user, I want to scan a QR code if my location is not recognized so that I can view the file and save this location for next time.

**Acceptance Criteria:**
- **WHEN** the system determines no file exists for the current location, **THEN** it SHALL activate the camera for QR code scanning.
- **WHEN** a QR code is successfully scanned, **THEN** the system SHALL register the current coordinates and the QR content as a new record.
- **WHEN** the registration is successful, **THEN** the system SHALL display the content from the QR code immediately.

### 3. Manual Data Entry (BFF Requirement)
**User Story:**
> As a developer or power user, I want to manually input JSON data representing coordinates so that I can test the system without moving physically.

**Acceptance Criteria:**
- **WHEN** a user enters JSON data (e.g., `{ "lat": 10, "lon": 20 }`) into a text input, **THEN** the system SHALL allow submission to the API.
- **WHEN** the manual data is submitted, **THEN** the system SHALL process it exactly as it would real geolocation data (searching or registering).

### 4. Execution History & Visualization
**User Story:**
> As a user, I want to see a history of my location lookups and visualized results so that I can track where I have been and what I accessed.

**Acceptance Criteria:**
- **WHEN** the application is active, **THEN** it SHALL display a list of past execution results (found files or registrations).
- **WHEN** a user selects a history item, **THEN** the "Canvas" area SHALL visualize the stored input coordinates and the resulting file/content.
- **WHEN** data is displayed, **THEN** it SHALL be rendered in a clear, readable format on the canvas.

### 5. Data Persistence & Integrity
**User Story:**
> As a system administrator, I want location data to be stored reliably so that the "learn once, use everywhere" promise is kept.

**Acceptance Criteria:**
- **WHEN** a new location is registered, **THEN** it SHALL be persisted in the backend storage.
- **WHEN** multiple requests occur, **THEN** the system SHALL maintain data integrity (no lost writes).
- **WHEN** querying for results, **THEN** the system SHALL support efficient retrieval based on coordinate proximity.

### 6. CI/CD & Deployment (Netlify & GitHub Actions)
**Stakeholder Need:**
> As a developer and maintainer, I want automated builds, tests, and deployments via GitHub Actions and Netlify so that the application can be reliably delivered without manual steps.

**Acceptance Criteria:**
- **WHEN** code is pushed to GitHub, **THEN** Netlify SHALL build the client from `client/` and publish `client/dist` with SPA routing enabled.
- **WHEN** the API is deployed, **THEN** a single Netlify Function SHALL wrap the existing Express app and expose endpoints under `/.netlify/functions/api`.
- **WHEN** the Netlify site is built, **THEN** the client SHALL use `VITE_API_BASE=/.netlify/functions/api` (configurable in Netlify env vars).
- **WHEN** PRs are opened on GitHub, **THEN** Netlify Deploy Previews SHALL be generated.
- **WHEN** code is pushed to any branch or a PR is created, **THEN** GitHub Actions SHOULD run server and client tests.
- **WHEN** the GitHub pipeline runs, **THEN** acceptance tests (Newman) MAY run against the Deploy Preview or Production URLs, publishing JUnit artifacts.
- **WHEN** the pipeline runs, **THEN** secrets (e.g., database credentials) SHALL be provided through environment variables (GitHub Secrets or Netlify Env); repository-stored `.env` secrets SHALL NOT be required for successful builds.

### 7. UI Code Guidelines Compliance
**Stakeholder Need:**
> As a maintainer, I want the UI code to follow project guidelines so that the codebase remains consistent, testable, and easy to evolve.

**Acceptance Criteria:**
- **WHEN** UI components are added or updated, **THEN** they SHOULD be authored in TypeScript and define explicit props interfaces.
- **WHEN** styles are applied, **THEN** inline `style` objects SHOULD be avoided in favor of CSS Modules or Tailwind.
- **WHEN** new logic is introduced, **THEN** unit tests SHALL be added using Vitest under a `__tests__` directory adjacent to the file.
- **WHEN** code is committed, **THEN** it SHOULD pass ESLint and Prettier formatting checks.