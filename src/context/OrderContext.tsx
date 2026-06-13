import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { orderService } from '@/src/services/order.service';
import { useAuth } from '@/src/context/AuthContext';
import type { Order } from '@/src/types/order.types';

export const ACTIVE_STATUSES = new Set(['PENDING', 'ACCEPTED', 'PREPARING', 'ON_THE_WAY', 'PICKED_UP']);
const POLL_INTERVAL_MS = 8000;

type OrderContextValue = {
  activeOrders: Order[];
  allOrders: Order[];
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      const data = await orderService.getMyOrders();
      setAllOrders(data);
    } catch {}
  }, [token]);

  const refresh = useCallback(async () => {
    await fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!token) {
      setAllOrders([]);
      return;
    }

    setIsLoading(true);
    fetchOrders().finally(() => setIsLoading(false));

    timerRef.current = setInterval(fetchOrders, POLL_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [token, fetchOrders]);

  const activeOrders = allOrders.filter((o) => ACTIVE_STATUSES.has(o.status));

  return (
    <OrderContext.Provider value={{ activeOrders, allOrders, isLoading, refresh }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders debe usarse dentro de <OrderProvider>');
  return ctx;
}
