import { View, Text, TouchableOpacity } from 'react-native';
import { Badge } from '@/src/components/ui/Badge';
import type { Order, OrderStatus } from '@/src/types/order.types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Preparando',
  READY: 'Listo',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const STATUS_VARIANT: Record<OrderStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  PREPARING: 'info',
  READY: 'success',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

type OrderCardProps = {
  order: Order;
  onConfirmReceived?: () => void;
  confirming?: boolean;
};

export function OrderCard({ order, onConfirmReceived, confirming }: OrderCardProps) {
  const canConfirm = order.status === 'DELIVERED' || order.status === 'READY';

  return (
    <View className="bg-zinc-900 rounded-2xl p-4 gap-3 border border-white/5">
      <View className="flex-row items-center justify-between">
        <Text className="text-zinc-400 text-xs">
          #{order.id.slice(-8).toUpperCase()}
        </Text>
        <Badge label={STATUS_LABELS[order.status]} variant={STATUS_VARIANT[order.status]} />
      </View>

      <View className="gap-1">
        {order.items.map((item) => (
          <View key={item.id} className="flex-row justify-between">
            <Text className="text-zinc-300 text-sm">
              {item.quantity}× {item.productName}
            </Text>
            <Text className="text-zinc-400 text-sm">S/ {item.subtotal.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View className="h-px bg-white/10" />

      <View className="flex-row justify-between items-center">
        <Text className="text-zinc-400 text-xs">
          {order.type === 'DELIVERY' ? 'Delivery' : 'Recojo en tienda'}
        </Text>
        <Text className="text-white font-bold">S/ {order.total.toFixed(2)}</Text>
      </View>

      {canConfirm && onConfirmReceived && (
        <TouchableOpacity
          onPress={onConfirmReceived}
          disabled={confirming}
          activeOpacity={0.7}
          className="bg-green-700 rounded-xl py-2 items-center"
        >
          <Text className="text-white font-semibold text-sm">
            {confirming ? 'Confirmando...' : 'Confirmar recibido'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
