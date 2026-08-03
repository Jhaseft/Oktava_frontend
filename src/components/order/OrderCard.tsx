import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/src/components/ui/Badge';
import type { Order, OrderStatus } from '@/src/types/order.types';
import { colors } from '@/src/theme/theme';

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Pago pendiente',
  PENDING:         'Pendiente',
  ACCEPTED:        'Aceptado',
  PREPARING:       'Preparando',
  ON_THE_WAY:      'En camino',
  PICKED_UP:       'Listo para recoger',
  PAYMENT_FAILED:  'Pago fallido',
  COMPLETED:       'Completado',
  CANCELLED:       'Cancelado',
};

const STATUS_VARIANT: Record<OrderStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  PENDING_PAYMENT: 'warning',
  PENDING:         'warning',
  ACCEPTED:        'info',
  PREPARING:       'info',
  ON_THE_WAY:      'info',
  PICKED_UP:       'success',
  PAYMENT_FAILED:  'danger',
  COMPLETED:       'success',
  CANCELLED:       'danger',
};

type OrderCardProps = Readonly<{
  order: Order;
  onPress?: () => void;
  onConfirmReceived?: () => void;
  confirming?: boolean;
}>;

export function OrderCard({ order, onPress, onConfirmReceived, confirming }: OrderCardProps) {
  const canConfirm = order.status === 'ON_THE_WAY' || order.status === 'PICKED_UP';
  const items = order.items ?? [];
  const statusLabel = STATUS_LABELS[order.status] ?? order.status;
  const statusVariant = STATUS_VARIANT[order.status] ?? 'default';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
      className="bg-white rounded-2xl p-4 gap-3 border border-brand-border"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-brand-black font-lemon-bold text-sm">#{order.orderNumber}</Text>
        <Badge label={statusLabel} variant={statusVariant} />
      </View>

      {items.length > 0 && (
        <View className="gap-1">
          {items.map((item) => (
            <View key={item.id} className="gap-0.5">
              <View className="flex-row justify-between">
                <Text className="text-brand-black font-lemon text-sm flex-1 mr-2" numberOfLines={1}>
                  {item.quantity}× {item.productName}
                </Text>
                <Text className="text-brand-muted font-lemon text-sm">Bs. {Number(item.subtotal).toFixed(0)}</Text>
              </View>
              {(item.selectedOptions?.length ?? 0) > 0 && (
                <Text className="text-brand-muted font-lemon text-xs" numberOfLines={1}>
                  {item.selectedOptions.map((o) => o.optionName).join(' · ')}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      <View className="h-px bg-brand-border" />

      <View className="flex-row justify-between items-center">
        <Text className="text-brand-muted font-lemon text-xs">
          {order.orderType === 'DELIVERY' ? 'Delivery' : 'Recojo en tienda'}
        </Text>
        <Text className="text-brand-black font-lemon-bold">Bs. {Number(order.total).toFixed(0)}</Text>
      </View>

      {onPress && (
        <View className="flex-row items-center justify-end gap-1">
          <Text className="text-brand-muted font-lemon text-xs">Ver detalle</Text>
          <Ionicons name="chevron-forward" size={12} color={colors.textMuted} />
        </View>
      )}

      {canConfirm && onConfirmReceived && (
        <TouchableOpacity
          onPress={onConfirmReceived}
          disabled={confirming}
          activeOpacity={0.7}
          className="rounded-xl py-2.5 items-center"
          style={{ backgroundColor: '#25D366' }}
        >
          <Text className="text-white font-lemon-bold text-sm uppercase tracking-wide">
            {confirming ? 'Confirmando...' : 'Confirmar recibido'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
