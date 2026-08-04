import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from 'expo-router';

/**
 * Intercepta el botón físico "atrás" (Android) mientras la pantalla está enfocada.
 * `handler` debe devolver `true` para bloquear el back por defecto.
 * Útil tras flujos irreversibles (ej. pedido confirmado) para no volver a
 * pantallas que ya no deberían verse (checkout vacío, QR de pago).
 */
export function useAndroidBackHandler(handler: () => boolean, enabled = true) {
  useFocusEffect(
    useCallback(() => {
      if (!enabled) return;
      const sub = BackHandler.addEventListener('hardwareBackPress', handler);
      return () => sub.remove();
    }, [handler, enabled]),
  );
}
