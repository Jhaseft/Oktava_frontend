import { View, Text } from 'react-native';
import { OrderStatusIcon } from '@/src/components/order/OrderStatusIcon';
import { statusLabel, statusUI } from '@/src/lib/order';
import type { OrderStatus } from '@/src/types/order.types';

type Props = Readonly<{ status: OrderStatus }>;

export function OrderStatusBadge({ status }: Props) {
  const ui = statusUI(status);
  return (
    <View
      className="flex-row items-center self-start rounded-full"
      style={{ backgroundColor: ui.tint, borderWidth: 1, borderColor: ui.color, gap: 5, paddingHorizontal: 10, paddingVertical: 4 }}
    >
      <OrderStatusIcon status={status} color={ui.color} size={13} />
      <Text className="font-lemon-bold" style={{ color: ui.color, fontSize: 11 }}>{statusLabel(status)}</Text>
    </View>
  );
}
