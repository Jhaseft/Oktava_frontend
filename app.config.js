module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    permissions: [
      ...(config.android?.permissions ?? []),
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
    ],
  },
  ios: {
    ...config.ios,
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
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
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Usamos tu ubicación para encontrar la dirección de entrega.',
      },
    ],
  ],
});
