import { useState } from 'react';
import { router } from 'expo-router';
import { statusCodes } from '@react-native-google-signin/google-signin';
import { useAuth } from '@/src/context/AuthContext';
import { signInWithGoogle } from '@/src/services/googleAuth.service';
import { authApi } from '@/src/services/authApi';
import { getPostAuthRedirect } from '@/src/lib/authRedirect';

/**
 * Hook compartido por login.tsx y register.tsx.
 * Orquesta todo el flujo Google Sign-In → backend → sesión → redirect.
 */
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
      const code: string | number | undefined = err?.code;

      // Cancelación silenciosa — no mostrar error
      if (code === statusCodes.SIGN_IN_CANCELLED) return;

      // Ya hay un intento en curso — ignorar silenciosamente
      if (code === statusCodes.IN_PROGRESS) return;

      if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setGoogleError('Google Play Services no está disponible en este dispositivo.');
        return;
      }

      setGoogleError('No se pudo iniciar sesión con Google. Inténtalo nuevamente.');
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
