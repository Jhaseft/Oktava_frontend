import { View, Text } from 'react-native';
import { colors } from '@/src/theme/theme';
import { formatCurrency } from '@/src/lib/order';
import type { OrderType } from '@/src/types/order.types';

type Props = Readonly<{
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderType: OrderType;
}>;

function Row({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="font-lemon text-brand-muted" style={{ fontSize: 13 }}>{label}</Text>
      {children}
    </View>
  );
}

export function OrderTotals({ subtotal, deliveryFee, total, orderType }: Props) {
  const fee = Number(deliveryFee);
  const freeDelivery = fee === 0;

  return (
    <View className="rounded-2xl border border-brand-border bg-brand-surface" style={{ padding: 14, gap: 6 }}>
      <Row label="Subtotal">
        <Text className="font-lemon-medium text-brand-black" style={{ fontSize: 13 }}>{formatCurrency(subtotal)}</Text>
      </Row>
      <Row label="Delivery">
        <Text className="font-lemon-medium" style={{ fontSize: 13, color: freeDelivery ? '#15803d' : colors.text }}>
          {freeDelivery ? (orderType === 'PICKUP' ? '—' : 'Gratis') : formatCurrency(fee)}
        </Text>
      </Row>
      <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />
      <View className="flex-row items-center justify-between">
        <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 15 }}>Total</Text>
        <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 15 }}>{formatCurrency(total)}</Text>
      </View>
    </View>
  );
}
