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
