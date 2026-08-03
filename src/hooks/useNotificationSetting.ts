import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';

/**
 * Estado del permiso de notificaciones + toggle.
 * - Si están desactivadas: pide permiso.
 * - Si ya están activas: no se pueden revocar por código → abre los ajustes del sistema.
 * Se refresca al volver a la app (por si el usuario cambió el permiso en ajustes).
 */
export function useNotificationSetting() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setEnabled(status === 'granted');
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  const toggle = useCallback(async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status === 'granted') {
      Linking.openSettings();
      return;
    }
    const req = await Notifications.requestPermissionsAsync();
    const granted = req.status === 'granted';
    setEnabled(granted);
    if (!granted) Linking.openSettings();
  }, []);

  return { enabled, loading, toggle };
}
