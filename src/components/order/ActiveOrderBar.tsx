import { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useOrders } from '@/src/context/OrderContext';
import type { OrderStatus } from '@/src/types/order.types';

const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING: '#f59e0b',
  PREPARING: '#3b82f6',
  ON_THE_WAY: '#8b5cf6',
  PICKED_UP: '#22c55e',
  COMPLETED: '#22c55e',
  CANCELLED: '#ef4444',
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Pedido enviado',
  PREPARING: 'Preparando tu pedido',
  ON_THE_WAY: 'En camino',
  PICKED_UP: 'Listo para recoger',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

export function ActiveOrderBar() {
  const { activeOrders } = useOrders();
  const translateY = useRef(new Animated.Value(-60)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isVisible = useRef(false);

  // Slide in/out animation
  useEffect(() => {
    const hasOrders = activeOrders.length > 0;
    if (hasOrders && !isVisible.current) {
      isVisible.current = true;
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else if (!hasOrders && isVisible.current) {
      isVisible.current = false;
      Animated.parallel([
        Animated.timing(translateY, { toValue: -60, duration: 250, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [activeOrders.length]);

  // Pulsing dot animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  if (activeOrders.length === 0 && !isVisible.current) return null;

  const order = activeOrders[0];
  const statusColor = order ? STATUS_COLOR[order.status] : '#f59e0b';
  const statusLabel = order ? STATUS_LABEL[order.status] : '';
  const orderId = order ? order.id.slice(-6).toUpperCase() : '';
  const extraCount = activeOrders.length - 1;

  return (
    <Animated.View style={{ transform: [{ translateY }], opacity }}>
      <TouchableOpacity
        onPress={() => router.push('/(cliente)/orders')}
        activeOpacity={0.85}
        style={{
          backgroundColor: '#0f0f0f',
          borderTopWidth: 1,
          borderTopColor: '#1e1e1e',
          borderLeftWidth: 3,
          borderLeftColor: statusColor,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 14,
          gap: 10,
        }}
      >
        {/* Pulsing dot */}
        <Animated.View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: statusColor,
            opacity: pulseAnim,
          }}
        />

        {/* Status text + order id */}
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '700' }}>
            {statusLabel}
          </Text>
          <Text style={{ color: '#666666', fontSize: 11, marginTop: 1 }}>
            Pedido #{orderId}
            {extraCount > 0 ? `  +${extraCount} más` : ''}
          </Text>
        </View>

        {/* Receipt icon + chevron */}
        <Ionicons name="receipt-outline" size={16} color={statusColor} />
        <Ionicons name="chevron-forward" size={14} color="#444444" />
      </TouchableOpacity>
    </Animated.View>
  );
}
