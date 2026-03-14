import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { findNearbyRestaurant } from '../googlePlaces.js';

vi.mock('axios');

describe('googlePlaces.js - New Google Places API (v1)', () => {
  const apiKey = 'AIzaSyCTHgZ-ugy6z_KR5wiepE43VBZoDoF3PD8';
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should find a nearby restaurant using the new v1 API', async () => {
    const lat = -33.4189;
    const lon = -70.6033;
    const radius = 50;

    const mockResponse = {
      data: {
        places: [
          {
            name: 'places/ChIJNxW8_6P_YpYR4_17_zX_9_0',
            id: 'ChIJNxW8_6P_YpYR4_17_zX_9_0',
            displayName: { text: 'Test Restaurant', languageCode: 'en' },
            location: { latitude: -33.41891, longitude: -70.60331 },
            websiteUri: 'https://test-restaurant.com',
            googleMapsUri: 'https://maps.google.com/?cid=123'
          }
        ]
      }
    };

    axios.post.mockResolvedValue(mockResponse);

    const result = await findNearbyRestaurant(lat, lon, radius);

    expect(axios.post).toHaveBeenCalledWith(
      'https://places.googleapis.com/v1/places:searchNearby',
      {
        includedTypes: ['restaurant', 'bar'],
        maxResultCount: 1,
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lon },
            radius: radius
          }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.displayName,places.location,places.websiteUri,places.googleMapsUri,places.id'
        }
      }
    );

    expect(result).toEqual({
      name: 'Test Restaurant',
      lat: -33.41891,
      lon: -70.60331,
      content: 'https://test-restaurant.com',
      place_id: 'ChIJNxW8_6P_YpYR4_17_zX_9_0'
    });
  });

  it('should fallback to googleMapsUri if websiteUri is missing', async () => {
    const mockResponse = {
      data: {
        places: [
          {
            id: 'ChIJNxW8_6P_YpYR4_17_zX_9_0',
            displayName: { text: 'Test Restaurant' },
            location: { latitude: -33.41891, longitude: -70.60331 },
            googleMapsUri: 'https://maps.google.com/?cid=123'
          }
        ]
      }
    };

    axios.post.mockResolvedValue(mockResponse);

    const result = await findNearbyRestaurant(0, 0);

    expect(result.content).toBe('https://maps.google.com/?cid=123');
  });

  it('should return null if no results found', async () => {
    axios.post.mockResolvedValue({ data: {} });

    const result = await findNearbyRestaurant(0, 0);

    expect(result).toBeNull();
  });

  it('should return null on API error', async () => {
    axios.post.mockRejectedValue(new Error('API error'));

    const result = await findNearbyRestaurant(0, 0);

    expect(result).toBeNull();
  });
});
