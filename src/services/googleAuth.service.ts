import { GoogleSignin } from '@react-native-google-signin/google-signin';

export async function signInWithGoogle(): Promise<string> {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;



  GoogleSignin.configure({ 
    webClientId,
    offlineAccess: false,
    iosClientId,
  });


  await GoogleSignin.hasPlayServices();


  await GoogleSignin.signOut();


  const response = await GoogleSignin.signIn();


  if (response.type !== 'success') {
    if (response.type !== 'cancelled') {
      throw new Error('No se pudo completar el inicio de sesión con Google');
    }
    const err = new Error('Cancelado');
    (err as any).cancelled = true;
    throw err;
  }

  const idToken = response.data?.idToken;


  if (!idToken) {
    throw new Error('Google no devolvió un idToken. Inténtalo nuevamente.');
  }

  return idToken;
}
