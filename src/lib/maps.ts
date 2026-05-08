export const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

export const hasGoogleMapsKey = GOOGLE_MAPS_API_KEY.length > 0;

// ─── Delivery fee ──────────────────────────────────────────────────────────

export const STORE_LAT = -17.392267;
export const STORE_LNG = -66.069302;
export const MAX_DELIVERY_KM = 14;

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calcDeliveryFee(km: number): number {
  const d = km * 1.25;
  if (d <= 2) return 5;
  if (d <= 5) return 10;
  if (d <= 8) return 15;
  return 20;
}
