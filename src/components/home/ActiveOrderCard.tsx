import { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useOrders } from '@/src/context/OrderContext';
import { colors } from '@/src/theme/theme';
import type { OrderStatus } from '@/src/types/order.types';

const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING_PAYMENT: '#f59e0b',
  PENDING: '#f59e0b',
  ACCEPTED: '#3b82f6',
  PREPARING: '#3b82f6',
  ON_THE_WAY: '#8b5cf6',
  PICKED_UP: '#22c55e',
  PAYMENT_FAILED: '#ef4444',
  COMPLETED: '#22c55e',
  CANCELLED: '#ef4444',
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Pago pendiente',
  PENDING: 'Pedido enviado',
  ACCEPTED: 'Pedido aceptado',
  PREPARING: 'Preparando tu pedido',
  ON_THE_WAY: 'En camino',
  PICKED_UP: 'Listo para recoger',
  PAYMENT_FAILED: 'Pago fallido',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

export function ActiveOrderCard() {
  const { activeOrders } = useOrders();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  if (activeOrders.length === 0) return null;

  const order = activeOrders[0];
  const statusColor = STATUS_COLOR[order.status];
  const statusLabel = STATUS_LABEL[order.status];
  const orderId = order.id.slice(-6).toUpperCase();
  const extraCount = activeOrders.length - 1;

  return (
    <TouchableOpacity
      onPress={() => router.push('/(cliente)/orders')}
      activeOpacity={0.85}
      className="mx-4 mb-1 mt-2 rounded-2xl bg-white overflow-hidden"
      style={{ borderWidth: 1, borderColor: colors.border, borderLeftWidth: 4, borderLeftColor: statusColor }}
    >
      <View className="flex-row items-center gap-3 px-4 py-4">
        <View className="w-11 h-11 rounded-full items-center justify-center" style={{ backgroundColor: `${statusColor}1a` }}>
          <Ionicons name="receipt-outline" size={22} color={statusColor} />
        </View>

        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            <Animated.View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: statusColor, opacity: pulse }} />
            <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 14 }}>
              {statusLabel}
            </Text>
          </View>
          <Text className="font-lemon text-brand-muted" style={{ fontSize: 12 }}>
            Pedido #{orderId}
            {extraCount > 0 ? `  ·  +${extraCount} más` : ''}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}
