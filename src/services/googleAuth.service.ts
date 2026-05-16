import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

// Configurar una sola vez al importar el módulo
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

/**
 * Abre el selector de cuentas de Google y devuelve el idToken.
 * Lanza:
 *   - { code: statusCodes.SIGN_IN_CANCELLED }  → usuario canceló
 *   - { code: statusCodes.PLAY_SERVICES_NOT_AVAILABLE } → sin Play Services
 *   - { code: statusCodes.IN_PROGRESS } → ya hay un intento en curso
 *   - Error genérico → idToken ausente u otro fallo
 */
export async function signInWithGoogle(): Promise<string> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const response = await GoogleSignin.signIn();

  // En v13+, signIn devuelve { type: 'success' | 'cancelled', data }
  if (response.type === 'cancelled') {
    const err = new Error('Inicio de sesión cancelado por el usuario.');
    (err as any).code = statusCodes.SIGN_IN_CANCELLED;
    throw err;
  }

  const idToken = response.data?.idToken;
  if (!idToken) {
    throw new Error('Google no devolvió un idToken. Inténtalo nuevamente.');
  }

  return idToken;
}
