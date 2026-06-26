import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { AppState } from 'react-native';
import { getStoreStatus, StoreStatus } from '@/src/services/store.service';

const POLL_INTERVAL_MS = 60000; // refresca el estado cada 60s

type StoreStatusContextValue = {
  isOpen: boolean;
  message: string;
  status: StoreStatus | null;
  refresh: () => Promise<void>;
};

const StoreStatusContext = createContext<StoreStatusContextValue | null>(null);

export function StoreStatusProvider({ children }: { children: React.ReactNode }) {
  // Por defecto abierto (fail-open) hasta que llegue la primera respuesta.
  const [status, setStatus] = useState<StoreStatus | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    const s = await getStoreStatus();
    setStatus(s);
  }, []);

  useEffect(() => {
    refresh();

    timerRef.current = setInterval(refresh, POLL_INTERVAL_MS);
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') refresh();
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      sub.remove();
    };
  }, [refresh]);

  return (
    <StoreStatusContext.Provider
      value={{
        isOpen: status?.isOpen ?? true,
        message: status?.message ?? '',
        status,
        refresh,
      }}
    >
      {children}
    </StoreStatusContext.Provider>
  );
}

export function useStoreStatus() {
  const ctx = useContext(StoreStatusContext);
  if (!ctx) throw new Error('useStoreStatus debe usarse dentro de <StoreStatusProvider>');
  return ctx;
}
