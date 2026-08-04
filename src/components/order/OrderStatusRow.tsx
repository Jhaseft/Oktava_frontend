import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme/theme';
import { OrderStatusBadge } from '@/src/components/order/OrderStatusBadge';
import type { OrderStatus, OrderType } from '@/src/types/order.types';

type Props = Readonly<{ status: OrderStatus; orderType: OrderType }>;

export function OrderStatusRow({ status, orderType }: Props) {
  const isDelivery = orderType === 'DELIVERY';
  return (
    <View className="flex-row items-center flex-wrap" style={{ gap: 10 }}>
      <OrderStatusBadge status={status} />
      <View
        className="flex-row items-center rounded-full border border-brand-border"
        style={{ gap: 5, paddingHorizontal: 10, paddingVertical: 4 }}
      >
        <Ionicons name={isDelivery ? 'bicycle-outline' : 'storefront-outline'} size={13} color={colors.textMuted} />
        <Text className="font-lemon text-brand-muted" style={{ fontSize: 12 }}>
          {isDelivery ? 'Delivery' : 'Recojo en local'}
        </Text>
      </View>
    </View>
  );
}
