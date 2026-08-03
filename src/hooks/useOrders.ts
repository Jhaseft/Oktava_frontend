import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { orderService } from '@/src/services/order.service';
import type { Order } from '@/src/types/order.types';

const POLL_INTERVAL_MS = 8000;

// Filtro pensado por lo que le interesa al usuario, no por cada estado crudo:
// "Pendientes" = todo lo que NO está entregado ni cancelado (en curso).
export type OrderFilter = 'all' | 'pending' | 'delivered' | 'cancelled';

export const ORDER_FILTERS: { key: OrderFilter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'delivered', label: 'Entregados' },
  { key: 'cancelled', label: 'Cancelados' },
];

function matchesFilter(status: Order['status'], filter: OrderFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'delivered') return status === 'COMPLETED';
  if (filter === 'cancelled') return status === 'CANCELLED';
  return status !== 'COMPLETED' && status !== 'CANCELLED';
}

/** Carga, refresco periódico y acciones de "Mis pedidos". */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState<OrderFilter>('all');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setOrders(await orderService.getMyOrders());
    } catch {
      // silencioso; se reintenta en el próximo poll
    }
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

  const confirmReceived = useCallback(async (id: string) => {
    setConfirming(id);
    try {
      const updated = await orderService.confirmReceived(id);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch {
      // silencioso
    } finally {
      setConfirming(null);
    }
  }, []);

  const visible = useMemo(
    () => orders.filter((o) => matchesFilter(o.status, filter)),
    [orders, filter],
  );

  return {
    orders,
    visible,
    filter,
    setFilter,
    loading,
    refreshing,
    confirming,
    selected,
    setSelected,
    onRefresh,
    confirmReceived,
  };
}
