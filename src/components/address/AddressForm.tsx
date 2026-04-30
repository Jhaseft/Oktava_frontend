import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/src/components/ui/Button';
import { AddressLocationPicker } from '@/src/components/address/AddressLocationPicker';
import type { CreateAddressDto } from '@/src/types/address.types';
import type { SelectedLocation } from '@/src/types/location.types';

type AddressFormProps = {
  value: CreateAddressDto;
  onChange: (value: CreateAddressDto) => void;
  onSubmit: () => void;
  loading?: boolean;
  submitLabel?: string;
};

const inputClass = 'bg-zinc-900 text-white rounded-xl px-4 py-3 border border-white/10 text-sm';
const labelClass = 'text-zinc-400 text-xs font-medium uppercase tracking-wider';

export function AddressForm({ value, onChange, onSubmit, loading, submitLabel = 'Guardar' }: AddressFormProps) {
  const [pickerVisible, setPickerVisible] = useState(false);

  const hasLocation = !isNaN(value.latitude) && !isNaN(value.longitude);

  const isValid =
    value.label.trim().length > 0 &&
    value.direction.trim().length > 0 &&
    value.departament.trim().length > 0 &&
    !isNaN(value.latitude) &&
    !isNaN(value.longitude);

  const handleLocationSelected = (location: SelectedLocation) => {
    onChange({
      ...value,
      direction: location.direction,
      latitude: location.latitude,
      longitude: location.longitude,
      placeId: location.placeId,
    });
  };

  return (
    <>
      <AddressLocationPicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onLocationSelected={handleLocationSelected}
      />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="gap-4 pb-4">

          {/* Etiqueta */}
          <View className="gap-1">
            <Text className={labelClass}>Etiqueta *</Text>
            <TextInput
              value={value.label}
              onChangeText={(t) => onChange({ ...value, label: t })}
              placeholder="Ej: Casa, Trabajo, Oficina"
              placeholderTextColor="#52525b"
              className={inputClass}
            />
          </View>

          {/* Selector de ubicación */}
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className={labelClass}>Ubicación *</Text>
              <TouchableOpacity
                onPress={() => setPickerVisible(true)}
                activeOpacity={0.7}
                className="flex-row items-center gap-1"
              >
                <Ionicons name="map-outline" size={13} color="#f87171" />
                <Text className="text-red-400 text-xs font-medium">
                  {hasLocation ? 'Cambiar ubicación' : 'Seleccionar en mapa'}
                </Text>
              </TouchableOpacity>
            </View>

            {hasLocation && (
              <TouchableOpacity
                onPress={() => setPickerVisible(true)}
                activeOpacity={0.8}
                className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 flex-row items-center gap-3"
              >
                <Ionicons name="location" size={18} color="#f87171" />
                <View className="flex-1">
                  <Text className="text-white text-sm" numberOfLines={1}>
                    {value.direction}
                  </Text>
                  <Text className="text-zinc-500 text-xs mt-0.5">
                    {value.latitude.toFixed(5)}, {value.longitude.toFixed(5)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#52525b" />
              </TouchableOpacity>
            )}
          </View>

          {/* Dirección (editable manualmente o pre-llenado por el picker) */}
          <View className="gap-1">
            <Text className={labelClass}>Dirección *</Text>
            <TextInput
              value={value.direction}
              onChangeText={(t) => onChange({ ...value, direction: t })}
              placeholder="Ej: Av. Los Álamos 123"
              placeholderTextColor="#52525b"
              className={inputClass}
            />
          </View>

          {/* Departamento */}
          <View className="gap-1">
            <Text className={labelClass}>Piso / Depto / Casa *</Text>
            <TextInput
              value={value.departament}
              onChangeText={(t) => onChange({ ...value, departament: t })}
              placeholder="Ej: Piso 3, Depto 5B"
              placeholderTextColor="#52525b"
              className={inputClass}
            />
          </View>

          {/* Coordenadas (editables manualmente o pre-llenadas por el picker) */}
          <View className="flex-row gap-3">
            <View className="flex-1 gap-1">
              <Text className={labelClass}>Latitud *</Text>
              <TextInput
                value={isNaN(value.latitude) ? '' : String(value.latitude)}
                onChangeText={(t) => onChange({ ...value, latitude: parseFloat(t) })}
                placeholder="-17.3895"
                placeholderTextColor="#52525b"
                keyboardType="numbers-and-punctuation"
                className={inputClass}
              />
            </View>
            <View className="flex-1 gap-1">
              <Text className={labelClass}>Longitud *</Text>
              <TextInput
                value={isNaN(value.longitude) ? '' : String(value.longitude)}
                onChangeText={(t) => onChange({ ...value, longitude: parseFloat(t) })}
                placeholder="-66.1568"
                placeholderTextColor="#52525b"
                keyboardType="numbers-and-punctuation"
                className={inputClass}
              />
            </View>
          </View>

          {/* Referencia */}
          <View className="gap-1">
            <Text className={labelClass}>Referencia</Text>
            <TextInput
              value={value.reference ?? ''}
              onChangeText={(t) => onChange({ ...value, reference: t || undefined })}
              placeholder="Ej: Frente al parque, portón gris"
              placeholderTextColor="#52525b"
              className={inputClass}
            />
          </View>

          {/* Contacto */}
          <View className="gap-1">
            <Text className={labelClass}>Contacto</Text>
            <TextInput
              value={value.contact ?? ''}
              onChangeText={(t) => onChange({ ...value, contact: t || undefined })}
              placeholder="Ej: Juan - 987654321"
              placeholderTextColor="#52525b"
              className={inputClass}
            />
          </View>

          <Button
            label={submitLabel}
            onPress={onSubmit}
            loading={loading}
            disabled={!isValid}
          />
        </View>
      </ScrollView>
    </>
  );
}
