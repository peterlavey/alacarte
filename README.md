<p align="center">
  <img src="client/public/pwa-192x192.svg" width="128" height="128" alt="alacarte icon">
</p>

### alacarte

#### Overview
alacarte is a small full‑stack JavaScript application consisting of:
- A React client built with Vite
- An Express API server with pluggable storage (in‑memory by default, Supabase or MongoDB optional)
- A Netlify Functions wrapper to run the same Express app in serverless environments

The client can talk to the API directly in local development or through the Netlify dev proxy. The API exposes endpoints to register geo‑tagged content, resolve the nearest record for given coordinates, list history, and a simple health check.

#### Stack and Tooling
- Language: JavaScript (ES Modules)
- Client: React 18 + Vite 5
- Server: Node.js + Express 4
- Storage backends: in‑memory (default), Supabase (recommended free tier), or MongoDB (optional)
- Serverless: Netlify Functions using `serverless-http`
- Testing: Vitest (client and server)
- Package manager: npm (repo contains `package-lock.json`)
- Node version: 20 (per `netlify.toml`)

#### Project Structure
```
alacarte/
├─ client/                  # React app (Vite)
│  ├─ src/                  # Front-end source code
│  ├─ .env*                 # Vite env files (see Environment Variables)
│  └─ package.json          # Client scripts (dev/build/test)
├─ server/                  # Express API
│  ├─ routes/               # Route modules (health, register, resolve, history)
│  ├─ storage/              # Storage facade + backends (memory, mongo)
│  ├─ tests/                # Vitest tests for server
│  └─ package.json          # Server scripts (start/dev/test)
├─ netlify/
│  └─ functions/
│     └─ api.js             # Netlify Function wrapping the Express app
├─ netlify.toml             # Netlify build/dev configuration
├─ package.json             # Root package (shared deps, limited scripts)
└─ docs/                    # Documentation (tasks/specs/etc.)
```

#### Requirements
- Node.js 20.x
- npm 10+
- Optional: MongoDB (if you plan to use the `mongo` storage backend)
- Optional: Supabase project (if you plan to use the `supabase` storage backend)
- Optional (for serverless local dev): Netlify CLI (`npm i -g netlify-cli`)

#### Setup
Install dependencies at the repository root, then for the client and server:
```
# From repo root
npm install

# Install client deps
npm install --prefix client

# Install server deps
npm install --prefix server
```

#### Running (Local)
- Run client only (Vite dev server at http://localhost:5173):
```
npm run dev --prefix client
```

- Run server only (Express at http://localhost:3001):
```
npm run dev --prefix server
```

- Full‑stack via Netlify Dev (recommended: proxies API under the same origin):
```
# Requires: npm i -g netlify-cli
netlify dev
# Opens Netlify proxy (default http://localhost:8888) and runs Vite in Netlify mode
```

Entry points
- Client: Vite serves the app from `client/` (default dev port 5173; production build outputs `client/dist`).
- Server: `server/index.js` (listens on `PORT` env or 3001 by default).
- Serverless: `netlify/functions/api.js` wraps the same Express app via `serverless-http`.

#### Scripts
Root (`package.json`)
```
npm test                  # (placeholder) prints message and exits
```

Client (`client/package.json`)
```
npm run dev               # Start Vite dev server
npm run build             # Build production bundle to client/dist
npm run preview           # Preview build locally
npm run test              # Run Vitest once
npm run test:watch        # Run Vitest in watch mode
npm run test:cov          # Run Vitest with coverage
```

Server (`server/package.json`)
```
npm start                 # Start Express server
npm run dev               # Start with nodemon (auto-reload)
npm run test              # Run Vitest once
npm run test:watch        # Run Vitest in watch mode
npm run test:cov          # Run Vitest with coverage
```

#### Environment Variables
Client (Vite) — variables must be prefixed with `VITE_` to be exposed to the client.
- `VITE_API_BASE`: Base URL for API calls used by the client (`client/src/api.js`).
  - Local dev: set in `client/.env.development` (defaults in repo point to `http://localhost:3001`).
  - Netlify dev: provided by `client/.env.netlify` (`/.netlify/functions/api`).
  - Production: set in `client/.env.production` or CI environment to your public API origin.

Server (Express)
- `PORT`: Port for the API server (default 3001).
- `USE_DB`: Storage backend selector: `memory` (default), `supabase`, or `mongo`.
- `SUPABASE_URL`: Your Supabase project URL (required if `USE_DB=supabase`).
- `SUPABASE_KEY`: Your Supabase API key (anon/public is sufficient) (required if `USE_DB=supabase`).
- `MONGO_URL`: MongoDB connection string (default `mongodb://127.0.0.1:27017`).
- `MONGO_DB`: Database name (default `alacarte`).
- `NETLIFY`: When running in Netlify Functions, this is set to `true` to prevent the server from self‑starting (handled by the function runtime).

Netlify (`netlify.toml`)
- Builds the client (`client/dist`) and configures `/.netlify/functions/api` for API requests (`/api/*` redirect is provided).
- Uses Node 20 and bundles functions with `esbuild` (externalizes `mongodb`).

#### API Endpoints (via Express under `/api`)
- `GET /api/health` → `{ status: "ok" }`
- `POST /api/register` → body: `{ lat: number, lon: number, content: any }`
- `POST /api/resolve` → body: `{ lat: number, lon: number, thresholdMeters?: number }` → returns nearest record within threshold
- `GET /api/history` → returns all stored records (order may be recent-first)

Note: Actual field validations and response shapes are defined in the server route handlers.

#### Building the Client
```
npm run build --prefix client
# Output: client/dist
```

#### Testing
Client tests:
```
npm run test --prefix client
npm run test:cov --prefix client
```

Server tests:
```
npm run test --prefix server
npm run test:cov --prefix server
```

#### Deployment
- Netlify (Primary): This repository is optimized for Netlify deployment:
  - Installs root and client dependencies
  - Builds the client into `client/dist`
  - Serves the Express app via a Netlify Function at `/.netlify/functions/api`
  - Redirects `/api/*` to the function and other paths to `index.html` for SPA routing

#### Exporting as APK (via PWABuilder)
This project is configured as a Progressive Web App (PWA) and optimized for export as a native Android APK using [PWABuilder](https://www.pwabuilder.com/).

**Steps to export APK:**
1. **Deploy to Production**: Ensure your application is deployed to a public URL (e.g., via Netlify).
2. **Visit PWABuilder**: Go to [pwabuilder.com](https://www.pwabuilder.com/).
3. **Enter URL**: Paste your production URL and click "Start".
4. **Review Report**: PWABuilder will analyze your PWA manifest. Our `vite.config.js` is already configured with:
    - `standalone` display mode and `portrait` orientation.
    - Standard icons and maskable icons.
    - Categories and description.
    - Placeholder screenshot metadata (you may need to upload actual images in the PWABuilder dashboard for best results).
5. **Package for Stores**: Click "Package for Stores" and select "Android".
6. **Download APK**: Follow the prompts to download your generated APK file.

#### TODOs
- Add a proper license file (see below).
- Document authentication, authorization, and security considerations if/when added.
- Provide deployment steps for non‑Netlify environments (Docker, standalone Node server, etc.), if required.

#### Troubleshooting
- Client cannot reach API in dev: ensure the server is running on `http://localhost:3001` (or use `netlify dev`). Check `VITE_API_BASE` matches your API URL.
- MongoDB backend: ensure `USE_DB=mongo`, `MONGO_URL`, and `MONGO_DB` are correctly set and that the database is reachable.
- Supabase backend:
  - Ensure `USE_DB=supabase`, `SUPABASE_URL`, and `SUPABASE_KEY` are correctly set.
  - You must create a `records` table in your Supabase project with at least `lat` (float8), `lon` (float8), `content` (text/jsonb), and `createdAt` (timestamptz).
  - **Important (RLS)**: If Row Level Security (RLS) is enabled on the `records` table, you must add policies to allow anonymous access. Run the following SQL in your Supabase SQL Editor:
    ```sql
    -- Allow anonymous inserts
    CREATE POLICY "Allow anonymous inserts" ON records FOR INSERT WITH CHECK (true);
    -- Allow anonymous selects
    CREATE POLICY "Allow anonymous selects" ON records FOR SELECT USING (true);
    ```
- Netlify dev: install Netlify CLI and run `netlify dev`. It proxies API requests and applies redirects.

#### License
No license file was found in the repository.

TODO: Choose and add a LICENSE (e.g., MIT, Apache‑2.0) at the project root, then reference it here.
