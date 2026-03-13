import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import * as googlePlaces from '../utils/googlePlaces.js';

vi.mock('../utils/googlePlaces.js');

describe('Google Places Integration', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    process.env.GOOGLE_MAPS_API_KEY = 'fake-key';
  });

  it('should resolve restaurant using Google Places API', async () => {
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
    expect(response.body.record.name).toBe('Test Restaurant');
    expect(googlePlaces.findNearbyRestaurant).toHaveBeenCalledWith(lat, lon, 30);
  });

  it('should return 404 if Google Places finds no results', async () => {
    googlePlaces.findNearbyRestaurant.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/resolve')
      .send({ lat: 0, lon: 0, thresholdMeters: 30 });

    expect(response.status).toBe(404);
  });

  it('should return 500 if Google Maps API KEY is missing', async () => {
    const originalKey = process.env.GOOGLE_MAPS_API_KEY;
    delete process.env.GOOGLE_MAPS_API_KEY;

    const response = await request(app)
      .post('/api/resolve')
      .send({ lat: 10, lon: 10, thresholdMeters: 30 });

    expect(response.status).toBe(500);
    expect(googlePlaces.findNearbyRestaurant).not.toHaveBeenCalled();

    process.env.GOOGLE_MAPS_API_KEY = originalKey;
  });
});
