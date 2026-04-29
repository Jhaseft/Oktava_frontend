import { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { orderService } from '@/src/services/order.service';
import { OrderCard } from '@/src/components/order/OrderCard';
import { LoadingState } from '@/src/components/ui/LoadingState';
import type { Order } from '@/src/types/order.types';

const ACTIVE_STATUSES = new Set(['PENDING', 'CONFIRMED', 'PREPARING', 'READY']);
const POLL_INTERVAL_MS = 8000;

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchOrders().finally(() => setLoading(false));
    timerRef.current = setInterval(fetchOrders, POLL_INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [fetchOrders]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  const handleConfirm = useCallback(async (id: string) => {
    setConfirming(id);
    try {
      const updated = await orderService.confirmReceived(id);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch {}
    finally { setConfirming(null); }
  }, []);

  const active = orders.filter((o) => ACTIVE_STATUSES.has(o.status));
  const history = orders.filter((o) => o.status === 'DELIVERED' || o.status === 'CANCELLED');

  if (loading) return <LoadingState message="Cargando pedidos..." />;

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: insets.top + 8, paddingBottom: 12 }}>
        <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '900' }}>Mis pedidos</Text>
      </View>

      {orders.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Ionicons name="receipt-outline" size={64} color="#333333" />
          <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700' }}>Sin pedidos</Text>
          <Text style={{ color: '#666666', fontSize: 14, textAlign: 'center', paddingHorizontal: 32 }}>
            Aún no has realizado ningún pedido.
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e50909" />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 24 }}
        >
          {/* Active orders */}
          {active.length > 0 && (
            <View style={{ gap: 10 }}>
              <Text style={{ color: '#666666', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Activos
              </Text>
              {active.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onConfirmReceived={() => handleConfirm(order.id)}
                  confirming={confirming === order.id}
                />
              ))}
            </View>
          )}

          {/* History */}
          {history.length > 0 && (
            <View style={{ gap: 10 }}>
              <Text style={{ color: '#666666', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Historial
              </Text>
              {history.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
