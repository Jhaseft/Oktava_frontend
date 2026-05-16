import type { AuthUser } from '@/src/services/authApi';

/**
 * Decide a dónde redirigir al usuario tras un login exitoso.
 *
 * Lógica actual:
 *   - Sin teléfono          → /complete-profile
 *   - Con teléfono          → /(cliente)/
 *
 * PENDIENTE: cuando se implemente app/verify-phone.tsx como ruta,
 * agregar aquí: if (user.phone && !user.phoneVerified) return '/verify-phone';
 */
export function getPostAuthRedirect(user: AuthUser): string {
  if (!user.phone) return '/complete-profile';
  return '/(cliente)/';
}
