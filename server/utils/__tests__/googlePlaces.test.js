import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { findNearbyRestaurant } from '../googlePlaces.js';

vi.mock('axios');

describe('googlePlaces.js - New Google Places API (v1)', () => {
  const apiKey = 'fake-api-key';
  
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_MAPS_API_KEY = apiKey;
  });

  it('should find a nearby restaurant using the new v1 API', async () => {
    const lat = -33.4189;
    const lon = -70.6033;
    const radius = 40;

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
        includedTypes: [
          'restaurant',
          'bar',
          'cafe',
          'bakery',
          'meal_takeaway',
          'meal_delivery',
          'night_club',
          'ice_cream_shop',
          'coffee_shop',
          'pub',
          'brewery',
          'winery'
        ],
        maxResultCount: 6,
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
          'X-Goog-FieldMask': 'places.displayName,places.location,places.websiteUri,places.googleMapsUri,places.id,places.photos'
        }
      }
    );

    expect(result).toEqual([{
      name: 'Test Restaurant',
      lat: -33.41891,
      lon: -70.60331,
      content: 'https://test-restaurant.com',
      place_id: 'ChIJNxW8_6P_YpYR4_17_zX_9_0',
      photo_reference: undefined
    }]);
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

    expect(axios.post).toHaveBeenCalledWith(
      'https://places.googleapis.com/v1/places:searchNearby',
      {
        includedTypes: [
          'restaurant',
          'bar',
          'cafe',
          'bakery',
          'meal_takeaway',
          'meal_delivery',
          'night_club',
          'ice_cream_shop',
          'coffee_shop',
          'pub',
          'brewery',
          'winery'
        ],
        maxResultCount: 6,
        locationRestriction: {
          circle: {
            center: { latitude: 0, longitude: 0 },
            radius: 40
          }
        }
      },
      expect.any(Object)
    );
    expect(result[0].content).toBe('https://maps.google.com/?cid=123');
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
