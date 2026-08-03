import { Alert, Linking } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';

const SUPPORT_PHONE = '59162565829';

/** Estado y acciones de la pantalla de perfil. */
export function useProfile() {
  const { user, token, signOut } = useAuth();

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

  const filledFields = [
    user?.firstName,
    user?.lastName,
    user?.email,
    user?.phone,
    user?.phoneVerified,
  ].filter(Boolean).length;
  const completionPct = Math.round((filledFields / 5) * 100);
  const isComplete = completionPct === 100;

  const go = (path: string) => router.push(path as Parameters<typeof router.push>[0]);
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/(cliente)'));
  const callSupport = () => Linking.openURL(`tel:+${SUPPORT_PHONE}`).catch(() => {});

  const logout = () =>
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => signOut() },
    ]);

  return {
    isLoggedIn: !!token,
    initials,
    fullName,
    phone: user?.phone ?? null,
    email: user?.email ?? '',
    completionPct,
    isComplete,
    go,
    goBack,
    callSupport,
    logout,
  };
}
