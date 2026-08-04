import { View, Text, TouchableOpacity } from 'react-native';
import { AddressCard } from '@/src/components/address/AddressCard';
import { Button } from '@/src/components/ui/Button';
import { FieldLabel } from './FieldLabel';
import type { Address } from '@/src/types/address.types';

type Props = Readonly<{
  addresses: Address[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onManage: () => void;
}>;

export function DeliveryAddressSection({ addresses, loading, selectedId, onSelect, onManage }: Props) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <FieldLabel>Dirección</FieldLabel>
        <TouchableOpacity onPress={onManage} activeOpacity={0.7}>
          <Text className="text-brand-red text-sm font-lemon-medium">Gestionar</Text>
        </TouchableOpacity>
      </View>

      {loading && <Text className="text-brand-muted text-sm font-lemon">Cargando direcciones...</Text>}

      {!loading && addresses.length === 0 && (
        <View className="gap-2">
          <Text className="text-brand-muted text-sm font-lemon">No tienes direcciones guardadas.</Text>
          <Button label="Agregar dirección" variant="secondary" onPress={onManage} />
        </View>
      )}

      {!loading && addresses.length > 0 && (
        <View className="gap-2">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              selected={selectedId === addr.id}
              onSelect={() => onSelect(addr.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
