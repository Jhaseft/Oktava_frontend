import { useEffect, useState, useCallback } from 'react';
import { AppState } from 'react-native';
import { checkVersion, VersionStatus } from '@/src/services/appVersion.service';

type GuardState = {
  status: VersionStatus | null;
  loading: boolean;
};

/**
 * Comprueba el estado de versión al montar y cada vez que la app vuelve
 * a primer plano (para detectar una versión mínima publicada mientras la
 * app estaba en background).
 */
export function useVersionGuard() {
  const [state, setState] = useState<GuardState>({ status: null, loading: true });

  const run = useCallback(async () => {
    try {
      const status = await checkVersion();
      setState({ status, loading: false });
    } catch {
      setState({ status: null, loading: false });
    }
  }, []);

  useEffect(() => {
    run();

    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') run();
    });
    return () => sub.remove();
  }, [run]);

  return {
    loading: state.loading,
    status: state.status,
    mustUpdate: state.status?.mustUpdate ?? false,
    recheck: run,
  };
}
