import { View, Text, TouchableOpacity, Linking } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { STORE_LAT, STORE_LNG, mapsSearchUrl } from '@/src/lib/maps';
import { colors } from '@/src/theme/theme';

const REGION = {
  latitude: STORE_LAT,
  longitude: STORE_LNG,
  latitudeDelta: 0.004,
  longitudeDelta: 0.004,
};

export function StorePickupMap() {
  const openInMaps = () => Linking.openURL(mapsSearchUrl(`${STORE_LAT},${STORE_LNG}`));

  return (
    <View className="gap-2">
      <View className="rounded-2xl overflow-hidden border border-brand-border" style={{ height: 190 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={REGION}
        >
          <Marker coordinate={{ latitude: STORE_LAT, longitude: STORE_LNG }} anchor={{ x: 0.5, y: 1 }}>
            <Ionicons name="location" size={40} color={colors.red} />
          </Marker>
        </MapView>
      </View>

      <TouchableOpacity
        onPress={openInMaps}
        activeOpacity={0.8}
        className="flex-row items-center justify-center rounded-xl border border-brand-border bg-white"
        style={{ paddingVertical: 12, gap: 8 }}
      >
        <Ionicons name="map-outline" size={18} color={colors.red} />
        <Text className="text-brand-black font-lemon-bold" style={{ fontSize: 13 }}>Ver en Google Maps</Text>
      </TouchableOpacity>
    </View>
  );
}
