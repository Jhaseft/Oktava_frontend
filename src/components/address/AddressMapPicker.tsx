import { forwardRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import type { Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MAX_DELIVERY_KM, STORE_LAT, STORE_LNG } from '@/src/lib/maps';
import { colors } from '@/src/theme/theme';

type Props = {
  isEditing: boolean;
  initialRegion: Region;
  outOfRange: boolean;
  onRegionChangeComplete: (region: Region) => void;
  onBack: () => void;
  onRecenter: () => void;
  onConfirm: () => void;
};

export const AddressMapPicker = forwardRef<MapView, Props>(function AddressMapPicker(
  { isEditing, initialRegion, outOfRange, onRegionChangeComplete, onBack, onRecenter, onConfirm },
  mapRef,
) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 10 }}>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={onBack} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="arrow-back" size={26} color={colors.black} />
          </TouchableOpacity>
          <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 22 }}>
            {isEditing ? 'Editar ubicación' : 'Elige el punto'}
          </Text>
        </View>
        <Text className="font-lemon text-brand-muted mt-1.5" style={{ fontSize: 13 }}>
          Mueve el mapa para colocar el pin en tu dirección.
        </Text>
      </View>

      <View className="flex-row items-center justify-center gap-2 py-3.5" style={{ backgroundColor: colors.black }}>
        <Ionicons name="location" size={18} color="#ffffff" />
        <Text className="text-white font-lemon-bold" style={{ fontSize: 15 }}>Cochabamba</Text>
      </View>

      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          onRegionChangeComplete={onRegionChangeComplete}
          showsUserLocation
          showsMyLocationButton={false}
        >
          <Marker
            coordinate={{ latitude: STORE_LAT, longitude: STORE_LNG }}
            title="OKTAVA"
            description="Nuestro local"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View
              className="w-11 h-11 rounded-full bg-white items-center justify-center"
              style={{
                borderWidth: 2,
                borderColor: colors.red,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Ionicons name="restaurant" size={22} color={colors.red} />
            </View>
          </Marker>
        </MapView>

        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="location" size={44} color={colors.red} style={{ marginTop: -34 }} />
        </View>

        <TouchableOpacity
          onPress={onRecenter}
          activeOpacity={0.85}
          className="absolute w-12 h-12 rounded-full bg-white items-center justify-center"
          style={{
            right: 16,
            bottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Ionicons name="navigate" size={20} color={colors.black} />
        </TouchableOpacity>
      </View>

      <View className="bg-white border-t border-brand-border px-4 pt-3" style={{ paddingBottom: insets.bottom + 12 }}>
        {outOfRange && (
          <Text className="font-lemon text-brand-red mb-2" style={{ fontSize: 12 }}>
            Fuera del área de cobertura. Máximo {MAX_DELIVERY_KM} km desde el local.
          </Text>
        )}

        <TouchableOpacity
          onPress={onConfirm}
          activeOpacity={0.85}
          disabled={outOfRange}
          className="rounded-2xl items-center justify-center py-4"
          style={{ backgroundColor: colors.red, opacity: outOfRange ? 0.6 : 1 }}
        >
          <Text className="text-white font-lemon-bold uppercase tracking-wide" style={{ fontSize: 15 }}>
            Seleccionar dirección
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
