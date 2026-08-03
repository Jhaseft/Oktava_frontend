import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import type MapView from 'react-native-maps';
import type { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { setPendingAddressSelect } from '@/src/lib/pendingAddressSelect';
import { addressService } from '@/src/services/address.service';
import { reverseGeocode } from '@/src/services/geocoding.service';
import { STORE_LAT, STORE_LNG, MAX_DELIVERY_KM, haversineKm } from '@/src/lib/maps';
import type { Address } from '@/src/types/address.types';

export type Coords = { latitude: number; longitude: number };
export type AddressView = 'list' | 'picker' | 'form';

const STORE_COORDS: Coords = { latitude: STORE_LAT, longitude: STORE_LNG };
const COCHA_REGION: Region = { ...STORE_COORDS, latitudeDelta: 0.05, longitudeDelta: 0.05 };
const MOVED_THRESHOLD_KM = 0.02; // ~20 m para considerar que el usuario movió el pin

function errorMessage(e: any, fallback: string): string {
  const msg = e?.response?.data?.message;
  return Array.isArray(msg) ? msg.join('\n') : msg ?? fallback;
}

/** Toda la lógica/estado de la pantalla de direcciones (lista → mapa → formulario). */
export function useAddressManager() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const mapRef = useRef<MapView>(null);
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<AddressView>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pickerStart, setPickerStart] = useState<Region>(COCHA_REGION);
  const [center, setCenter] = useState<Coords>(STORE_COORDS);
  const [baseCoords, setBaseCoords] = useState<Coords>(STORE_COORDS);
  const [resolved, setResolved] = useState('');

  const [label, setLabel] = useState('');
  const [direction, setDirection] = useState('');
  const [reference, setReference] = useState('');
  const [saving, setSaving] = useState(false);

  const outOfRange = haversineKm(center.latitude, center.longitude, STORE_LAT, STORE_LNG) > MAX_DELIVERY_KM;

  useEffect(() => {
    addressService
      .getAddresses()
      .then(setAddresses)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const resolveCenter = (coords: Coords) => {
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    geocodeTimer.current = setTimeout(async () => {
      const addr = await reverseGeocode(coords.latitude, coords.longitude);
      if (addr) setResolved(addr);
    }, 350);
  };

  const animateTo = (coords: Coords, duration = 500) =>
    mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 }, duration);

  const centerOnMe = async (onlyIfNearby = false) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      if (onlyIfNearby && haversineKm(coords.latitude, coords.longitude, STORE_LAT, STORE_LNG) >= 40) return;
      animateTo(coords, 600);
    } catch {
      // sin ubicación: se queda en Cochabamba
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setLabel('');
    setDirection('');
    setReference('');
    setResolved('');
    setCenter(STORE_COORDS);
    setBaseCoords(STORE_COORDS);
    setPickerStart(COCHA_REGION);
    setView('picker');
    resolveCenter(STORE_COORDS);
    centerOnMe(true);
  };

  const openEdit = (addr: Address) => {
    const coords = { latitude: Number(addr.latitude), longitude: Number(addr.longitude) };
    setEditingId(addr.id);
    setLabel(addr.label);
    setDirection(addr.direction);
    setReference(addr.reference ?? '');
    setResolved(addr.direction);
    setCenter(coords);
    setBaseCoords(coords);
    setPickerStart({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 });
    setView('picker');
  };

  const onRegionChangeComplete = (region: Region) => {
    const coords = { latitude: region.latitude, longitude: region.longitude };
    setCenter(coords);
    resolveCenter(coords);
  };

  // Del mapa al formulario. Si editas y NO moviste el pin, conserva la dirección.
  const confirmLocation = () => {
    if (outOfRange) return;
    const moved = haversineKm(center.latitude, center.longitude, baseCoords.latitude, baseCoords.longitude) > MOVED_THRESHOLD_KM;
    if ((!editingId || moved) && resolved) setDirection(resolved);
    setView('form');
  };

  const handleSave = async () => {
    if (!label.trim()) {
      Alert.alert('Falta el alias', 'Escribe un nombre para esta dirección (ej: Casa, Trabajo).');
      return;
    }
    if (!direction.trim()) {
      Alert.alert('Falta la dirección', 'Escribe o confirma la dirección.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        label: label.trim(),
        direction: direction.trim(),
        reference: reference.trim() || undefined,
        departament: 'Cochabamba',
        latitude: center.latitude,
        longitude: center.longitude,
      };
      const saved = editingId
        ? await addressService.updateAddress(editingId, payload)
        : await addressService.createAddress(payload);
      setAddresses((prev) =>
        editingId ? prev.map((a) => (a.id === editingId ? saved : a)) : [...prev, saved],
      );
      if (from === 'checkout') {
        setPendingAddressSelect(saved.id);
        router.back();
        return;
      }
      setView('list');
    } catch (e) {
      Alert.alert('Error', errorMessage(e, 'No se pudo guardar la dirección.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (addr: Address) => {
    Alert.alert('Eliminar', `¿Eliminar "${addr.label}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await addressService.deleteAddress(addr.id);
            setAddresses((prev) => prev.filter((a) => a.id !== addr.id));
          } catch (e) {
            Alert.alert('Error', errorMessage(e, 'No se pudo eliminar.'));
          }
        },
      },
    ]);
  };

  const onCardPress = (addr: Address) => {
    if (from === 'checkout') {
      setPendingAddressSelect(addr.id);
      router.back();
      return;
    }
    openEdit(addr);
  };

  return {
    view,
    loading,
    addresses,
    isEditing: editingId != null,
    outOfRange,
    pickerStart,
    mapRef,
    label,
    setLabel,
    direction,
    setDirection,
    reference,
    setReference,
    saving,
    goBack: () => router.back(),
    goToList: () => setView('list'),
    openAdd,
    onCardPress,
    handleDelete,
    onRegionChangeComplete,
    recenterToMe: () => centerOnMe(false),
    confirmLocation,
    handleSave,
  };
}
