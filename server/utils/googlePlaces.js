import axios from 'axios';

const GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';

/**
 * Finds the nearest restaurant using Google Places API
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
    // 1. Nearby Search to find places of type 'restaurant' or 'bar'
    const response = await axios.get(`${GOOGLE_PLACES_API_URL}/nearbysearch/json`, {
      params: {
        type: 'restaurant, bar',
        location: `${lat},${lon}`,
        radius,
        key: apiKey,
      },
    });

    const results = response.data.results;
    if (!results || results.length === 0) {
      console.log(`Google Places API: No results found for [${lat}, ${lon}] with radius ${radius}m`);
      return null;
    }

    console.log(`Google Places API: Found ${results.length} results for [${lat}, ${lon}]. Using the most relevant: "${results[0].name}"`);
    // Take the first one (usually the most relevant/closest according to Google's ranking)
    const place = results[0];
    
    // 2. Get details to have the website or Google Maps URL as fallback
    const detailsResponse = await axios.get(`${GOOGLE_PLACES_API_URL}/details/json`, {
      params: {
        place_id: place.place_id,
        fields: 'name,website,url,geometry',
        key: apiKey,
      },
    });

    const details = detailsResponse.data.result;
    if (!details) return null;

    return {
      name: details.name,
      lat: details.geometry.location.lat,
      lon: details.geometry.location.lng,
      // We prefer the website (where the menu usually is), if not the Google Maps URL
      content: details.website || details.url,
      place_id: place.place_id
    };
  } catch (error) {
    console.error('Error in Google Places API:', error.response?.data || error.message);
    return null;
  }
}
