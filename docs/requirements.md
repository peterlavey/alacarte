# Requirements Document

## Introduction
The goal of this project is to develop a Geolocation-based Restaurant Menu Retrieval System. The application utilizes a user's real-world location to automatically find the nearest restaurant or bar using the Google Places API and redirect them directly to its digital menu or website.

## Requirements

### 1. Geolocation-Based Content Retrieval
**User Story:**
> As a user, I want the application to automatically show me the relevant menu for my current location so that I don't have to manually search or scan a code.

**Acceptance Criteria:**
- **WHEN** the application loads, **THEN** it SHALL retrieve the user's geographic coordinates (latitude, longitude).
- **WHEN** the coordinates are sent to the server, **THEN** the system SHALL consult the New Google Places API (v1) to find the nearest restaurant or bar within a 30-meter radius.
- **WHEN** a place is found within range, **THEN** the system SHALL return its website or Google Maps URL as content.
- **WHEN** no place is found within range, **THEN** the system SHALL indicate that no restaurant or bar was found for this location.


### 2. Manual Data Entry (BFF Requirement)
**User Story:**
> As a developer or power user, I want to manually input coordinates so that I can test the system without moving physically.

**Acceptance Criteria:**
- **WHEN** a user enters coordinates (e.g., lat: 10, lon: 20) into a form, **THEN** the system SHALL allow submission to the API.
- **WHEN** the manual data is submitted, **THEN** the system SHALL process it exactly as it would real geolocation data (searching New Google Places API).



### 6. CI/CD & Deployment (Netlify & GitHub Actions)
**Stakeholder Need:**
> As a developer and maintainer, I want automated builds, tests, and deployments via GitHub Actions and Netlify so that the application can be reliably delivered without manual steps.

**Acceptance Criteria:**
- **WHEN** code is pushed to GitHub, **THEN** Netlify SHALL build the client from `client/` and publish `client/dist` with SPA routing enabled.
- **WHEN** the API is deployed, **THEN** a single Netlify Function SHALL wrap the existing Express app and expose endpoints under `/.netlify/functions/api`.
- **WHEN** the Netlify site is built, **THEN** the client SHALL use `VITE_API_BASE=/.netlify/functions/api` (configurable in Netlify env vars).

### 7. UI Code Guidelines Compliance
**Stakeholder Need:**
> As a maintainer, I want the UI code to follow project guidelines so that the codebase remains consistent, testable, and easy to evolve.

**Acceptance Criteria:**
- **WHEN** UI components are added or updated, **THEN** they SHOULD be authored in TypeScript and define explicit props interfaces.
- **WHEN** styles are applied, **THEN** inline `style` objects SHOULD be avoided in favor of CSS Modules or Tailwind.
- **WHEN** new logic is introduced, **THEN** unit tests SHALL be added using Vitest under a `__tests__` directory adjacent to the file.
- **WHEN** code is committed, **THEN** it SHOULD pass ESLint and Prettier formatting checks.

### 5. Internet Connection Verification
**User Story:**
> As a user, I want the application to inform me when I don't have an internet connection so that I understand why the application might not be working correctly.

**Acceptance Criteria:**
- **WHEN** the application starts, **THEN** it SHALL verify if the device has an active internet connection.
- **WHEN** no internet connection is detected, **THEN** the system SHALL display a dedicated "Offline" page.
- **WHEN** the connection is restored, **THEN** the system SHALL allow the user to continue or automatically refresh.

### 6. Google Drive Content Validation
**User Story:**
> As a user, I want the application to verify that a Google Drive link is valid before trying to open it so that I don't get redirected to a broken link and instead get the option to scan a new QR code.

**Acceptance Criteria:**
- **WHEN** the content URL is a Google Drive link, **THEN** the system SHALL validate the response from that URL before redirecting.
- **WHEN** the Google Drive link is valid, **THEN** the system SHALL redirect the user to the content.
- **WHEN** the Google Drive link is invalid or the response is an error, **THEN** the system SHALL display the "Menu not available" message and provide an option to scan a new QR code.


### 7. APK Export Support
**User Story:**
> As a user, I want to be able to download and install the application as an Android APK so that I can have a native-like experience on my mobile device.

**Acceptance Criteria:**
- **WHEN** the application is built, **THEN** it SHALL include a web manifest that meets PWABuilder's requirements for APK generation.
- **WHEN** the manifest is validated by PWABuilder, **THEN** it SHALL provide all necessary metadata (name, icons, start_url, display, orientation, screenshots, etc.) to ensure a high-quality native wrapper.

### 8. Premium Restaurant Menu UI
**User Story:**
> As a customer at a high-end restaurant, I want an elegant and sophisticated digital menu interface so that my dining experience feels premium and refined.

**Acceptance Criteria:**
118:- **WHEN** the application is loaded, **THEN** it SHALL use a calm, sober color palette (elegant blue, charcoal, warm beige, and subtle gold accents).
- **WHEN** text is displayed, **THEN** it SHALL use a refined serif font for headings (e.g., Playfair Display) and a clean sans-serif for body text (e.g., Inter or Roboto), with clear hierarchy and generous spacing.
- **WHEN** content is found, **THEN** it SHALL be presented in card-based layouts with ample white space, subtle dividers, and consistent padding.
- **WHEN** food photography is present, **THEN** it SHALL have soft rounded corners and low-saturation filters.
- **WHEN** the user interacts with the UI, **THEN** it SHALL provide smooth microinteractions (hover/tap states, subtle shadows) and unobtrusive transition animations.
- **WHEN** navigating the app, **THEN** it SHALL maintain a mobile-first, easy-to-scan, and minimalist layout.
- **WHEN** displaying text and targets, **THEN** it SHALL meet accessibility standards for contrast and tappable size.


### 9. New Google Places API (v1) Integration
**User Story:**
> As a user, I want the system to automatically find my current restaurant using Google's new API database, so that the app works "out of the box" in any established business.

**Acceptance Criteria:**
- **WHEN** the user's location is resolved, **THEN** the system SHALL consult the New Google Places API (v1).
- **WHEN** a restaurant or bar is found via the new API within the threshold, **THEN** the system SHALL return its website or Google Maps URL as content.