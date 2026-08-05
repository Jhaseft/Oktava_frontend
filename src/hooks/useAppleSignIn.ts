import { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { signInWithApple } from '@/src/services/appleAuth.service';
import { authApi } from '@/src/services/authApi';
import { getPostAuthRedirect } from '@/src/lib/authRedirect';

export function useAppleSignIn() {
  const { signIn } = useAuth();
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [appleError, setAppleError] = useState<string | null>(null);

  async function handleAppleSignIn() {
    setIsAppleLoading(true);
    setAppleError(null);

    try {
      const credential = await signInWithApple();
      const { accessToken, user } = await authApi.appleSignIn(credential);
      await signIn(accessToken, user);
      router.replace(getPostAuthRedirect(user) as any);
    } catch (err: any) {
      // El usuario canceló el diálogo nativo: no mostrar error.
      if (err?.code === 'ERR_REQUEST_CANCELED') return;
      setAppleError(err?.message ?? 'No se pudo iniciar sesión con Apple. Inténtalo nuevamente.');
    } finally {
      setIsAppleLoading(false);
    }
  }

  return {
    handleAppleSignIn,
    isAppleLoading,
    appleError,
    clearAppleError: () => setAppleError(null),
  };
}
