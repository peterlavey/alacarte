import serverless from 'serverless-http'
import app from '../../../server/index.js'

// Netlify Function handler with explicit logging
const handler = serverless(app)

export const handlerWithLogging = async (event, context) => {
  console.log('--- Netlify Function Start ---');
  console.log('Path:', event.path);
  console.log('Method:', event.httpMethod);
  
  try {
    const result = await handler(event, context);
    console.log('--- Netlify Function End (Success) ---', result.statusCode);
    return result;
  } catch (error) {
    console.error('--- Netlify Function End (Error) ---', error);
    throw error;
  }
}

// Netlify looks for 'handler' by default
export { handlerWithLogging as handler }
