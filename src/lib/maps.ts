export const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

export const hasGoogleMapsKey = GOOGLE_MAPS_API_KEY.length > 0;
