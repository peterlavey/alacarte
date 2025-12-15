import serverless from 'serverless-http';
import app, { ensureStorage } from '../../server/index.js';

const baseHandler = serverless(app);

export async function handler(event, context) {
  // Ensure storage is ready in serverless runtime without top-level await
  await ensureStorage();
  return baseHandler(event, context);
}
