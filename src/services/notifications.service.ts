import { api } from './api';

/**
 * Guarda el Expo push token del usuario autenticado en el backend.
 * Requiere sesión iniciada (el endpoint está protegido por JWT).
 */
export async function registerPushToken(token: string): Promise<void> {
  await api.post('/notifications/token', { token });
}
