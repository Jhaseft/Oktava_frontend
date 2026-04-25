import { View, Text, TextInput, Switch } from 'react-native';
import { Button } from '@/src/components/ui/Button';
import type { CreateAddressDto } from '@/src/types/address.types';

type AddressFormProps = {
  value: CreateAddressDto;
  onChange: (value: CreateAddressDto) => void;
  onSubmit: () => void;
  loading?: boolean;
  submitLabel?: string;
};

export function AddressForm({ value, onChange, onSubmit, loading, submitLabel = 'Guardar' }: AddressFormProps) {
  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Calle / Dirección *</Text>
        <TextInput
          value={value.street}
          onChangeText={(t) => onChange({ ...value, street: t })}
          placeholder="Ej: Av. Los Álamos 123"
          placeholderTextColor="#52525b"
          className="bg-zinc-900 text-white rounded-xl px-4 py-3 border border-white/10 text-sm"
        />
      </View>

      <View className="gap-1">
        <Text className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Ciudad *</Text>
        <TextInput
          value={value.city}
          onChangeText={(t) => onChange({ ...value, city: t })}
          placeholder="Ej: Lima"
          placeholderTextColor="#52525b"
          className="bg-zinc-900 text-white rounded-xl px-4 py-3 border border-white/10 text-sm"
        />
      </View>

      <View className="gap-1">
        <Text className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Referencia</Text>
        <TextInput
          value={value.reference ?? ''}
          onChangeText={(t) => onChange({ ...value, reference: t || undefined })}
          placeholder="Ej: Frente al parque"
          placeholderTextColor="#52525b"
          className="bg-zinc-900 text-white rounded-xl px-4 py-3 border border-white/10 text-sm"
        />
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-zinc-300 text-sm">Dirección principal</Text>
        <Switch
          value={value.isDefault ?? false}
          onValueChange={(v) => onChange({ ...value, isDefault: v })}
          trackColor={{ false: '#27272a', true: '#ef4444' }}
          thumbColor="#fff"
        />
      </View>

      <Button
        label={submitLabel}
        onPress={onSubmit}
        loading={loading}
        disabled={!value.street.trim() || !value.city.trim()}
      />
    </View>
  );
}
