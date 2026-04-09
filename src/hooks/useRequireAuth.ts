import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';

/**
 * Hook de protección de rutas.
 * Si no hay sesión (tras hidratar), redirige a /login.
 * Retorna isLoading e isAuthenticated para que el layout pueda
 * evitar renderizar contenido privado antes de confirmar la sesión.
 */
export function useRequireAuth() {
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
      router.replace('/login');
    }
  }, [token, isLoading]);

  return {
    isLoading,
    isAuthenticated: !!token,
  };
}
