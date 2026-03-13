import axios from 'axios';

const GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';

/**
 * Busca el restaurante más cercano usando Google Places API
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @param {number} radius - Radio de búsqueda en metros (máximo 50000)
 * @returns {Promise<Object|null>} El lugar más cercano encontrado o null
 */
export async function findNearbyRestaurant(lat, lon, radius = 50) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.warn('GOOGLE_MAPS_API_KEY no está configurada. Saltando búsqueda en Google.');
    return null;
  }

  try {
    // 1. Nearby Search para encontrar lugares de tipo 'restaurant' o 'bar'
    const response = await axios.get(`${GOOGLE_PLACES_API_URL}/nearbysearch/json`, {
      params: {
        location: `${lat},${lon}`,
        radius,
        type: 'restaurant', // También podrías incluir 'bar' si es necesario
        key: apiKey,
      },
    });

    const results = response.data.results;
    if (!results || results.length === 0) {
      return null;
    }

    // Tomamos el primero (que suele ser el más relevante/cercano según el ranking de Google)
    const place = results[0];
    
    // 2. Obtener detalles para tener el sitio web o la URL de Google Maps como fallback
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
      // Preferimos el sitio web (donde suele estar la carta), si no la URL de Google Maps
      content: details.website || details.url,
      place_id: place.place_id
    };
  } catch (error) {
    console.error('Error en Google Places API:', error.response?.data || error.message);
    return null;
  }
}
