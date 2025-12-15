import serverless from 'serverless-http';
import app, { ensureStorage } from '../../server/index.js';

// Ensure storage is ready in serverless runtime
await ensureStorage();

export const handler = serverless(app);
