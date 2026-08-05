import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { authApi, ApiError } from '@/src/services/authApi';
import { useGoogleSignIn } from '@/src/hooks/useGoogleSignIn';
import { useAppleSignIn } from '@/src/hooks/useAppleSignIn';

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email.trim());
}

export function useLoginForm() {
  const { signIn } = useAuth();
  const { handleGoogleSignIn, isGoogleLoading, googleError, clearGoogleError } = useGoogleSignIn();
  const { handleAppleSignIn, isAppleLoading, appleError, clearAppleError } = useAppleSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailIsValid = useMemo(() => isValidEmail(email), [email]);
  const passwordIsValid = useMemo(() => password.trim().length >= 6, [password]);
  const canSubmit = emailIsValid && passwordIsValid;

  const emailError = emailTouched && email.length > 0 && !emailIsValid ? 'Ingresa un correo electrónico válido.' : null;
  const passwordError =
    passwordTouched && password.length > 0 && !passwordIsValid ? 'La contraseña debe tener al menos 6 caracteres.' : null;

  const onChangeEmail = (t: string) => {
    setEmail(t);
    setError(null);
    clearGoogleError();
    clearAppleError();
    if (!emailTouched) setEmailTouched(true);
  };

  const onChangePassword = (t: string) => {
    setPassword(t);
    setError(null);
    clearGoogleError();
    clearAppleError();
    if (!passwordTouched) setPasswordTouched(true);
  };

  const handleLogin = async () => {
    setEmailTouched(true);
    setPasswordTouched(true);
    setError(null);
    if (!canSubmit) return;

    setIsLoading(true);
    try {
      const { accessToken, user } = await authApi.signIn(email.trim(), password);
      await signIn(accessToken, user);
      router.replace('/(cliente)/');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.statusCode === 401 ? 'Credenciales inválidas' : err.message);
      } else {
        setError('Sin conexión. Verifica tu internet.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    password,
    emailError,
    passwordError,
    onChangeEmail,
    onChangePassword,
    canSubmit,
    isLoading,
    anyLoading: isLoading || isGoogleLoading || isAppleLoading,
    isGoogleLoading,
    isAppleLoading,
    displayError: error ?? googleError ?? appleError,
    handleLogin,
    handleGoogleSignIn,
    handleAppleSignIn,
  };
}
