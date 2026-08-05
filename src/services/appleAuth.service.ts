import * as AppleAuthentication from 'expo-apple-authentication';

export type AppleCredential = {
  identityToken: string;
  appleUserId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
};

export async function signInWithApple(): Promise<AppleCredential> {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  const { identityToken, fullName, email, user } = credential;

  if (!identityToken) {
    throw new Error('Apple no devolvió un token. Inténtalo nuevamente.');
  }

  // Apple solo envía nombre/email en el PRIMER inicio de sesión; luego llegan null.
  // El identificador estable es `user` (Apple user id).
  return {
    identityToken,
    appleUserId: user,
    email: email ?? null,
    firstName: fullName?.givenName ?? null,
    lastName: fullName?.familyName ?? null,
  };
}
