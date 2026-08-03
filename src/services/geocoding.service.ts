import { GOOGLE_MAPS_API_KEY } from '@/src/lib/maps';

/**
 * Reverse-geocoding con Google: convierte lat/lng en una dirección legible.
 * Devuelve '' si falla (uso silencioso).
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}&language=es`,
    );
    const json = (await res.json()) as { status: string; results: Array<{ formatted_address: string }> };
    if (json.status === 'OK' && json.results.length > 0) return json.results[0].formatted_address;
  } catch {
    // red o respuesta inválida — silencioso
  }
  return '';
}
