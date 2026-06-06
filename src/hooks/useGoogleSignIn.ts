import { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { signInWithGoogle } from '@/src/services/googleAuth.service';
import { authApi } from '@/src/services/authApi';
import { getPostAuthRedirect } from '@/src/lib/authRedirect';

export function useGoogleSignIn() {
  const { signIn } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    setGoogleError(null);

    try {
      const idToken = await signInWithGoogle();
      const { accessToken, user } = await authApi.googleSignIn(idToken);
      await signIn(accessToken, user);
      router.replace(getPostAuthRedirect(user) as any);
    } catch (err: any) {
      console.log('[GoogleSignIn] ERROR completo:', err);
      console.log('[GoogleSignIn] err.message:', err?.message);
      console.log('[GoogleSignIn] err.code:', err?.code);
      console.log('[GoogleSignIn] err.cancelled:', err?.cancelled);
      if (err?.cancelled) return;
      setGoogleError(err?.message ?? 'No se pudo iniciar sesión con Google. Inténtalo nuevamente.');
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return {
    handleGoogleSignIn,
    isGoogleLoading,
    googleError,
    clearGoogleError: () => setGoogleError(null),
  };
}
