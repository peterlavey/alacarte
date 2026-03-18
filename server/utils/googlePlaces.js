import axios from 'axios';

const GOOGLE_PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchNearby';

/**
 * Finds the nearest restaurant using Google Places API (v1)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Search radius in meters (max 50000)
 * @returns {Promise<Object|null>} The nearest place found or null
 */
export async function findNearbyRestaurant(lat, lon, radius = 50) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.warn('GOOGLE_MAPS_API_KEY is not configured. Skipping Google search.');
    return null;
  }

  try {
    const response = await axios.post(
      GOOGLE_PLACES_API_URL,
      {
        includedTypes: ['restaurant', 'bar'],
        maxResultCount: 1,
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lon },
            radius: 1500
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

    const places = response.data.places;
    if (!places || places.length === 0) {
      console.log(`Google Places API: No results found for [${lat}, ${lon}] with radius ${radius}m`);
      return null;
    }

    const place = places[0];
    console.log(`Google Places API: Found ${places.length} results for [${lat}, ${lon}]. Using the most relevant: "${place.displayName?.text}"`);

    return {
      name: place.displayName?.text,
      lat: place.location?.latitude,
      lon: place.location?.longitude,
      // We prefer the websiteUri (where the menu usually is), if not the Google Maps URI
      content: place.websiteUri || place.googleMapsUri,
      place_id: place.id
    };
  } catch (error) {
    console.error('Error in Google Places API:', error.response?.data || error.message);
    return null;
  }
}
