import { useState } from 'react';
import { router } from 'expo-router';
import { authApi, ApiError } from '@/src/services/authApi';

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email.trim());
}

export function useForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const emailIsValid = isValidEmail(email);
  const emailError = emailTouched && email.length > 0 && !emailIsValid ? 'Ingresa un correo electrónico válido.' : null;

  const onChangeEmail = (t: string) => {
    setEmail(t);
    setError(null);
    if (!emailTouched) setEmailTouched(true);
  };

  const handleSubmit = async () => {
    setEmailTouched(true);
    setError(null);
    if (!emailIsValid) return;

    setIsLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 0) {
        setError('Sin conexión. Verifica tu internet.');
      } else {
        // No revelar si el email existe: cualquier respuesta del backend muestra 'enviado'.
        setSent(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    emailError,
    emailIsValid,
    onChangeEmail,
    isLoading,
    error,
    sent,
    handleSubmit,
    goToReset: () => router.replace(`/reset-password?email=${encodeURIComponent(email.trim())}`),
    goToLogin: () => router.replace('/login'),
  };
}
