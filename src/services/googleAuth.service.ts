import { GoogleSignin } from '@react-native-google-signin/google-signin';

export async function signInWithGoogle(): Promise<string> {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

  console.log('[GoogleSignIn] webClientId:', webClientId);
  console.log('[GoogleSignIn] iosClientId:', iosClientId);

  GoogleSignin.configure({ 
    webClientId,
    offlineAccess: false,
    iosClientId,
  });

  console.log('[GoogleSignIn] hasPlayServices...');
  await GoogleSignin.hasPlayServices();

  console.log('[GoogleSignIn] signOut previo...');
  await GoogleSignin.signOut();

  console.log('[GoogleSignIn] llamando signIn...');
  const response = await GoogleSignin.signIn();
  console.log('[GoogleSignIn] response.type:', response.type);

  if (response.type !== 'success') {
    if (response.type !== 'cancelled') {
      throw new Error('No se pudo completar el inicio de sesión con Google');
    }
    const err = new Error('Cancelado');
    (err as any).cancelled = true;
    throw err;
  }

  const idToken = response.data?.idToken;
  console.log('[GoogleSignIn] idToken recibido:', idToken ? `${idToken.slice(0, 20)}...` : 'NINGUNO');

  if (!idToken) {
    throw new Error('Google no devolvió un idToken. Inténtalo nuevamente.');
  }

  return idToken;
}
