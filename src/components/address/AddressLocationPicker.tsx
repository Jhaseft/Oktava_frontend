import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { MapPressEvent, MarkerDragStartEndEvent, Region } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import type {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GOOGLE_MAPS_API_KEY, hasGoogleMapsKey } from '@/src/lib/maps';
import type { SelectedLocation } from '@/src/types/location.types';

// ─── Constants ────────────────────────────────────────────────────────────────

type Coords = { latitude: number; longitude: number };

const FALLBACK_COORDS: Coords = { latitude: -17.3895, longitude: -66.1568 };

const FALLBACK_REGION: Region = {
  ...FALLBACK_COORDS,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

const DEV_LOCATION: SelectedLocation = {
  direction: 'Ubicación de prueba - Cochabamba',
  latitude: -17.3895,
  longitude: -66.1568,
  placeId: undefined,
};

// ─── Geocoding ────────────────────────────────────────────────────────────────

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}&language=es`
    );
    const json = (await res.json()) as {
      status: string;
      results: Array<{ formatted_address: string }>;
    };
    if (json.status === 'OK' && json.results.length > 0) {
      return json.results[0].formatted_address;
    }
  } catch {
    // Network error o respuesta inválida — silencioso
  }
  return '';
}

// ─── Public component ─────────────────────────────────────────────────────────

type AddressLocationPickerProps = {
  visible: boolean;
  onClose: () => void;
  onLocationSelected: (location: SelectedLocation) => void;
};

export function AddressLocationPicker({
  visible,
  onClose,
  onLocationSelected,
}: AddressLocationPickerProps) {
  const handleDevLocation = () => {
    onLocationSelected(DEV_LOCATION);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      {hasGoogleMapsKey ? (
        <MapPicker
          visible={visible}
          onClose={onClose}
          onLocationSelected={onLocationSelected}
          onUseDevLocation={handleDevLocation}
        />
      ) : (
        <NoMapKeyView onClose={onClose} onUseDevLocation={handleDevLocation} />
      )}
    </Modal>
  );
}

// ─── Map picker ───────────────────────────────────────────────────────────────

type MapPickerProps = {
  visible: boolean;
  onClose: () => void;
  onLocationSelected: (location: SelectedLocation) => void;
  onUseDevLocation: () => void;
};

function MapPicker({ visible, onClose, onLocationSelected, onUseDevLocation }: MapPickerProps) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const autocompleteRef = useRef<GooglePlacesAutocompleteRef>(null);

  const [marker, setMarker] = useState<Coords>(FALLBACK_COORDS);
  const [direction, setDirection] = useState('');
  const [placeId, setPlaceId] = useState<string | undefined>(undefined);
  const [geocoding, setGeocoding] = useState(false);
  const [initializing, setInitializing] = useState(false);

  // Reinicializa cada vez que el modal se abre
  useEffect(() => {
    if (!visible) return;

    setMarker(FALLBACK_COORDS);
    setDirection('');
    setPlaceId(undefined);
    autocompleteRef.current?.clear();

    setInitializing(true);
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) =>
        status === 'granted'
          ? Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
          : null
      )
      .then(async (loc) => {
        if (!loc) return;
        const coords: Coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setMarker(coords);
        mapRef.current?.animateToRegion(
          { ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 },
          500
        );
        const addr = await reverseGeocode(coords.latitude, coords.longitude);
        if (addr) setDirection(addr);
      })
      .catch(() => {})
      .finally(() => setInitializing(false));
  }, [visible]);

  // Actualiza marcador y hace reverse geocoding
  const updateCoords = useCallback(async (coords: Coords) => {
    setMarker(coords);
    setPlaceId(undefined);
    setGeocoding(true);
    try {
      const addr = await reverseGeocode(coords.latitude, coords.longitude);
      setDirection(addr || `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
    } finally {
      setGeocoding(false);
    }
  }, []);

  const handleMapPress = useCallback(
    (e: MapPressEvent) => {
      Keyboard.dismiss();
      updateCoords(e.nativeEvent.coordinate);
    },
    [updateCoords]
  );

  const handleMarkerDragEnd = useCallback(
    (e: MarkerDragStartEndEvent) => {
      updateCoords(e.nativeEvent.coordinate);
    },
    [updateCoords]
  );

  const handlePlaceSelect = useCallback(
    (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
      if (!details) return;
      const coords: Coords = {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      };
      const newRegion: Region = { ...coords, latitudeDelta: 0.005, longitudeDelta: 0.005 };
      setMarker(coords);
      setPlaceId(details.place_id);
      setDirection(details.formatted_address || data.description);
      mapRef.current?.animateToRegion(newRegion, 500);
    },
    []
  );

  const handleConfirm = () => {
    onLocationSelected({
      direction: direction || `${marker.latitude.toFixed(5)}, ${marker.longitude.toFixed(5)}`,
      latitude: marker.latitude,
      longitude: marker.longitude,
      placeId,
    });
    onClose();
  };

  const HEADER_H = 52;

  return (
    <View style={styles.mapContainer}>
      {/* Mapa ocupa toda la pantalla como fondo */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={FALLBACK_REGION}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton={false}
      >
        <Marker
          coordinate={marker}
          draggable
          onDragEnd={handleMarkerDragEnd}
          pinColor="#ef4444"
        />
      </MapView>

      {/* Header superpuesto */}
      <View style={[styles.header, { top: insets.top, height: HEADER_H }]}>
        {initializing ? (
          <ActivityIndicator size="small" color="#a1a1aa" style={styles.backBtn} />
        ) : (
          <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Seleccionar ubicación</Text>
      </View>

      {/* Autocomplete superpuesto sobre el mapa */}
      <View style={[styles.autocompleteWrapper, { top: insets.top + HEADER_H + 8 }]}>
        <GooglePlacesAutocomplete
          ref={autocompleteRef}
          placeholder="Buscar dirección..."
          onPress={handlePlaceSelect}
          query={{ key: GOOGLE_MAPS_API_KEY, language: 'es' }}
          fetchDetails
          enablePoweredByContainer={false}
          debounce={400}
          minLength={2}
          keyboardShouldPersistTaps="always"
          styles={{
            container: styles.acContainer,
            textInputContainer: styles.acInputContainer,
            textInput: styles.acInput,
            listView: styles.acList,
            row: styles.acRow,
            description: styles.acDescription,
            separator: styles.acSeparator,
            poweredContainer: { display: 'none' },
          }}
          textInputProps={{ placeholderTextColor: '#52525b' }}
          renderLeftButton={() => (
            <View style={styles.acSearchIcon}>
              <Ionicons name="search" size={16} color="#52525b" />
            </View>
          )}
        />
      </View>

      {/* Panel inferior con confirmación */}
      <View style={[styles.bottomPanel, { paddingBottom: Math.max(insets.bottom, 8) + 12 }]}>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={18} color="#ef4444" style={styles.locationIcon} />
          <View style={styles.locationTexts}>
            {geocoding ? (
              <ActivityIndicator size="small" color="#a1a1aa" />
            ) : (
              <Text style={styles.directionText} numberOfLines={2}>
                {direction || 'Toca el mapa o busca una dirección'}
              </Text>
            )}
            <Text style={styles.coordsText}>
              {marker.latitude.toFixed(5)}, {marker.longitude.toFixed(5)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleConfirm}
          activeOpacity={0.85}
          style={styles.confirmBtn}
        >
          <Text style={styles.confirmBtnText}>Confirmar ubicación</Text>
        </TouchableOpacity>

        {/* Botón DEV — visible siempre para facilitar pruebas sin mover el mapa */}
        <TouchableOpacity
          onPress={onUseDevLocation}
          activeOpacity={0.7}
          style={styles.devBtn}
        >
          <Ionicons name="bug-outline" size={13} color="#52525b" />
          <Text style={styles.devBtnText}>Usar ubicación de prueba</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── No-key fallback ──────────────────────────────────────────────────────────

type NoMapKeyViewProps = { onClose: () => void; onUseDevLocation: () => void };

function NoMapKeyView({ onClose, onUseDevLocation }: NoMapKeyViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.noKeyContainer, { paddingTop: insets.top + 8 }]}>
      <View style={styles.noKeyHeader}>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <Ionicons name="close" size={24} color="#a1a1aa" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seleccionar ubicación</Text>
        <View style={styles.noKeyHeaderSpacer} />
      </View>

      <View style={styles.noKeyContent}>
        <View style={styles.noKeyIconWrap}>
          <Ionicons name="map-outline" size={36} color="#52525b" />
        </View>

        <View style={styles.noKeyTexts}>
          <Text style={styles.noKeyTitle}>Mapa no disponible</Text>
          <Text style={styles.noKeyDesc}>
            Agrega{' '}
            <Text style={styles.noKeyMono}>EXPO_PUBLIC_GOOGLE_MAPS_API_KEY</Text>
            {' '}en tu archivo{' '}
            <Text style={styles.noKeyMono}>.env</Text>
            {' '}para habilitar el selector de ubicación.
          </Text>
        </View>

        <View style={styles.devSection}>
          <View style={styles.devDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.devLabel}>DEV</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            onPress={onUseDevLocation}
            activeOpacity={0.7}
            style={styles.devBtnLarge}
          >
            <Ionicons name="bug-outline" size={16} color="#a1a1aa" />
            <Text style={styles.devBtnLargeText}>Usar ubicación de prueba</Text>
          </TouchableOpacity>

          <Text style={styles.devHint}>
            Rellena con coordenadas de Cochabamba para probar el flujo completo.
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // MapPicker
  mapContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.82)',
    zIndex: 10,
    elevation: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
  },
  autocompleteWrapper: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 20,
    elevation: 20,
  },
  acContainer: {
    flex: 0,
  },
  acInputContainer: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  acInput: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 14,
    height: 48,
    marginBottom: 0,
    flex: 1,
  },
  acList: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginTop: 4,
  },
  acRow: {
    backgroundColor: '#18181b',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  acDescription: {
    color: '#fff',
    fontSize: 13,
  },
  acSeparator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: 12,
  },
  acSearchIcon: {
    paddingLeft: 12,
    paddingRight: 4,
    justifyContent: 'center',
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.92)',
    paddingTop: 16,
    paddingHorizontal: 16,
    gap: 10,
    zIndex: 10,
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  locationIcon: {
    marginTop: 1,
  },
  locationTexts: {
    flex: 1,
    gap: 2,
  },
  directionText: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 18,
  },
  coordsText: {
    color: '#52525b',
    fontSize: 11,
  },
  confirmBtn: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  devBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  devBtnText: {
    color: '#52525b',
    fontSize: 12,
  },

  // NoMapKeyView
  noKeyContainer: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  noKeyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    gap: 12,
  },
  noKeyHeaderSpacer: {
    width: 24,
  },
  noKeyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 16,
  },
  noKeyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noKeyTexts: {
    gap: 12,
    alignItems: 'center',
  },
  noKeyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  noKeyDesc: {
    color: '#71717a',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  noKeyMono: {
    color: '#e4e4e7',
  },
  devSection: {
    width: '100%',
    gap: 12,
  },
  devDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  devLabel: {
    color: '#52525b',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  devBtnLarge: {
    backgroundColor: '#27272a',
    borderWidth: 1,
    borderColor: '#3f3f46',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  devBtnLargeText: {
    color: '#d4d4d8',
    fontSize: 14,
    fontWeight: '500',
  },
  devHint: {
    color: '#52525b',
    fontSize: 12,
    textAlign: 'center',
  },
});
