import { View, Text, TouchableOpacity } from 'react-native';
import { FieldLabel } from './FieldLabel';
import type { OrderType } from '@/src/types/order.types';

type Props = Readonly<{ value: OrderType; onChange: (type: OrderType) => void }>;

const LABELS: Record<OrderType, string> = {
  PICKUP: 'Recojo en el local',
  DELIVERY: 'Delivery',
};

export function OrderTypeSelector({ value, onChange }: Props) {
  return (
    <View className="gap-2">
      <FieldLabel>Tipo de pedido</FieldLabel>
      <View className="flex-row gap-3">
        {(['PICKUP', 'DELIVERY'] as OrderType[]).map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => onChange(type)}
            activeOpacity={0.7}
            className={`flex-1 rounded-xl border py-3 items-center ${
              value === type ? 'border-brand-red bg-brand-red' : 'border-brand-border bg-white'
            }`}
          >
            <Text className={`font-lemon-bold text-sm ${value === type ? 'text-white' : 'text-brand-muted'}`}>
              {LABELS[type]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
