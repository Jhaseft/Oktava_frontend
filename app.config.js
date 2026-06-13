// La key de Google Maps debe quedar SIEMPRE en el manifest nativo. EAS no lee
// el .env al evaluar este archivo, así que usamos un valor literal como respaldo.
const GOOGLE_MAPS_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? 'AIzaSyBAH5XtP0PMsRl5UpBNymFGO17msAmTLkM';

module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    config: {
      ...config.android?.config,
      googleMaps: {
        apiKey: GOOGLE_MAPS_API_KEY,
      },
    },
    permissions: [
      ...(config.android?.permissions ?? []),
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
    ],
  },
  ios: {
    ...config.ios,
    config: {
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    },
    infoPlist: {
      ...config.ios?.infoPlist,
      NSLocationWhenInUseUsageDescription:
        'Usamos tu ubicación para encontrar la dirección de entrega.',
      NSLocationAlwaysAndWhenInUseUsageDescription:
        'Usamos tu ubicación para encontrar la dirección de entrega.',
    },
  },
  plugins: [
    ...(config.plugins ?? []),
    'expo-font',
    'expo-splash-screen',
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Usamos tu ubicación para encontrar la dirección de entrega.',
      },
    ],
  ],
});
