import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme/theme';
import { PAYMENT_OPTIONS, type PaymentMethod } from '@/src/types/checkout.types';
import { FieldLabel } from './FieldLabel';

type Props = Readonly<{ value: PaymentMethod; onChange: (method: PaymentMethod) => void }>;

export function PaymentMethodSelector({ value, onChange }: Props) {
  return (
    <View className="gap-2">
      <FieldLabel>Método de pago</FieldLabel>
      <View className="flex-row gap-3">
        {PAYMENT_OPTIONS.map(({ method, label, icon }) => (
          <TouchableOpacity
            key={method}
            onPress={() => onChange(method)}
            activeOpacity={0.7}
            className={`flex-1 rounded-xl border py-3 items-center gap-1 ${
              value === method ? 'border-brand-red bg-brand-red' : 'border-brand-border bg-white'
            }`}
          >
            <Ionicons name={icon as any} size={20} color={value === method ? colors.white : colors.textMuted} />
            <Text className={`font-lemon-bold text-sm ${value === method ? 'text-white' : 'text-brand-muted'}`}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
