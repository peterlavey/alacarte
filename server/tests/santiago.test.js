import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../index.js';
import { initStorage, closeStorage } from '../repositories/storage/index.js';
import path from 'path';
import fs from 'fs/promises';

describe('Santiago Data Integration', () => {
  const testDbPath = path.join(process.cwd(), 'repositories', 'storage', 'santiago_restaurants.json');

  beforeAll(async () => {
    // Force use of our newly generated santiago file
    process.env.USE_DB = 'jsonfile';
    process.env.STORAGE_FILE_PATH = testDbPath;
    await initStorage();
  });

  afterAll(async () => {
    await closeStorage();
  });

  it('should find Tiramisu restaurant by its coordinates', async () => {
    // Tiramisu coordinates: -33.4189, -70.6033
    const response = await request(app)
      .post('/api/resolve')
      .send({
        lat: -33.4189,
        lon: -70.6033,
        thresholdMeters: 30
      });

    expect(response.status).toBe(200);
    expect(response.body.content).toBe('https://tiramisu.cl/nuestra-carta/');
  });

  it('should find a restaurant within 30m of its coordinates', async () => {
    // Slightly offset from Tiramisu: -33.4189, -70.6033
    // Let's use -33.4188, -70.6032 (approx 15m away)
    const response = await request(app)
      .post('/api/resolve')
      .send({
        lat: -33.4188,
        lon: -70.6032,
        thresholdMeters: 30
      });

    expect(response.status).toBe(200);
    expect(response.body.content).toBe('https://tiramisu.cl/nuestra-carta/');
  });

  it('should NOT find a restaurant if too far away', async () => {
    // Way off
    const response = await request(app)
      .post('/api/resolve')
      .send({
        lat: 0,
        lon: 0,
        thresholdMeters: 30
      });

    expect(response.status).toBe(404);
  });
});
