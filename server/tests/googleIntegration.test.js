import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app, { ensureStorage } from '../index.js';
import * as googlePlaces from '../utils/googlePlaces.js';
import { __clearAll } from '../repositories/storage/memory.js';

vi.mock('../utils/googlePlaces.js');

describe('Google Places Integration', () => {
  beforeEach(async () => {
    await ensureStorage();
    if (process.env.USE_DB === 'memory') {
      await __clearAll();
    }
    vi.clearAllMocks();
    process.env.GOOGLE_MAPS_API_KEY = 'fake-key';
  });

  it('should fallback to Google Places if no local record is found', async () => {
    const lat = -33.4189;
    const lon = -70.6033;
    
    // Mocking Google Places response
    googlePlaces.findNearbyRestaurant.mockResolvedValue({
      name: 'Test Restaurant',
      lat: -33.41891,
      lon: -70.60331,
      content: 'https://test-restaurant.com',
      place_id: 'place123'
    });

    const response = await request(app)
      .post('/api/resolve')
      .send({ lat, lon, thresholdMeters: 30 });

    expect(response.status).toBe(200);
    expect(response.body.content).toBe('https://test-restaurant.com');
    expect(response.body.record.metadata.source).toBe('google_places');
    expect(googlePlaces.findNearbyRestaurant).toHaveBeenCalledWith(lat, lon, 30);
  });

  it('should return 404 if both local and Google Places fail', async () => {
    googlePlaces.findNearbyRestaurant.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/resolve')
      .send({ lat: 0, lon: 0, thresholdMeters: 30 });

    expect(response.status).toBe(404);
  });

  it('should not call Google Places if API KEY is missing', async () => {
    const originalKey = process.env.GOOGLE_MAPS_API_KEY;
    delete process.env.GOOGLE_MAPS_API_KEY;

    const response = await request(app)
      .post('/api/resolve')
      .send({ lat: 10, lon: 10, thresholdMeters: 30 });

    expect(response.status).toBe(404);
    expect(googlePlaces.findNearbyRestaurant).not.toHaveBeenCalled();

    process.env.GOOGLE_MAPS_API_KEY = originalKey;
  });
});
