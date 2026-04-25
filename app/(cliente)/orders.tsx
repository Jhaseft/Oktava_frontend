import { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { orderService } from '@/src/services/order.service';
import { OrderCard } from '@/src/components/order/OrderCard';
import { LoadingState } from '@/src/components/ui/LoadingState';
import { EmptyState } from '@/src/components/ui/EmptyState';
import type { Order } from '@/src/types/order.types';

const ACTIVE_STATUSES = new Set(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED']);
const POLL_INTERVAL_MS = 8000;

export default function OrdersScreen() {
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
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
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

  const active = orders.filter((o) => ACTIVE_STATUSES.has(o.status) && o.status !== 'DELIVERED');
  const history = orders.filter((o) => o.status === 'DELIVERED' || o.status === 'CANCELLED');

  if (loading) return <LoadingState message="Cargando pedidos..." />;

  return (
    <FlatList
      className="flex-1 bg-black"
      contentContainerStyle={{ paddingBottom: 24 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ef4444" />}
      ListHeaderComponent={
        <View className="px-5 pt-14 pb-2">
          <Text className="text-white text-2xl font-bold">Mis pedidos</Text>
        </View>
      }
      data={[]}
      renderItem={null}
      ListEmptyComponent={
        orders.length === 0 ? (
          <EmptyState title="Sin pedidos" description="Aún no has realizado ningún pedido." />
        ) : (
          <View className="px-5 gap-6">
            {active.length > 0 && (
              <View className="gap-3">
                <Text className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Activos</Text>
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
            {history.length > 0 && (
              <View className="gap-3">
                <Text className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Historial</Text>
                {history.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </View>
            )}
          </View>
        )
      }
    />
  );
}
