import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { authApi, ApiError, setPendingSignUp } from '@/src/services/authApi';
import { useGoogleSignIn } from '@/src/hooks/useGoogleSignIn';
import { useAppleSignIn } from '@/src/hooks/useAppleSignIn';
import { DEFAULT_COUNTRY, toE164, type CountryCode } from '@/src/components/phone/PhoneNumberInput';

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email.trim());
}

export function useRegisterForm() {
  const { handleGoogleSignIn, isGoogleLoading, googleError } = useGoogleSignIn();
  const { handleAppleSignIn, isAppleLoading, appleError } = useAppleSignIn();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dialCode, setDialCode] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [touched, setTouched] = useState({
    firstName: false, lastName: false, email: false, phone: false, password: false, confirm: false, terms: false,
  });
  const touch = (k: keyof typeof touched) => setTouched((p) => (p[k] ? p : { ...p, [k]: true }));

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = {
    firstName: firstName.trim().length > 0,
    lastName: lastName.trim().length > 0,
    email: isValidEmail(email),
    phone: phone.trim().length >= 7,
    password: password.length >= 8,
    confirm: confirmPassword.length > 0 && confirmPassword === password,
  };

  const canSubmit = Object.values(valid).every(Boolean) && acceptedTerms;

  const errors = {
    firstName: touched.firstName && !valid.firstName ? 'Requerido.' : null,
    lastName: touched.lastName && !valid.lastName ? 'Requerido.' : null,
    email: touched.email && email.length > 0 && !valid.email ? 'Ingresa un correo electrónico válido.' : null,
    phone: touched.phone && phone.length > 0 && !valid.phone ? 'Ingresa un número válido (mín. 7 dígitos).' : null,
    password: touched.password && password.length > 0 && !valid.password ? 'Mínimo 8 caracteres.' : null,
    confirm: touched.confirm && confirmPassword.length > 0 && !valid.confirm ? 'Las contraseñas no coinciden.' : null,
    terms: touched.terms && !acceptedTerms ? 'Debes aceptar los términos para continuar.' : null,
  };

  const bind = (setter: (v: string) => void, key: keyof typeof touched) => (t: string) => {
    setter(t);
    setError(null);
    touch(key);
  };

  const toggleTerms = () => {
    setAcceptedTerms((p) => !p);
    touch('terms');
    setError(null);
  };

  const handleContinue = async () => {
    setTouched({ firstName: true, lastName: true, email: true, phone: true, password: true, confirm: true, terms: true });
    setError(null);
    if (!canSubmit) return;

    setIsLoading(true);
    try {
      await authApi.sendVerification(email.trim());
      setPendingSignUp({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: toE164(dialCode, phone),
        password,
      });
      router.push('/verify-code');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.statusCode === 409 ? 'Este email ya tiene una cuenta. Inicia sesión.' : err.message);
      } else {
        setError('Sin conexión. Verifica tu internet.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    values: { firstName, lastName, email, phone, password, confirmPassword, dialCode, acceptedTerms },
    errors,
    onChange: {
      firstName: bind(setFirstName, 'firstName'),
      lastName: bind(setLastName, 'lastName'),
      email: bind(setEmail, 'email'),
      phone: bind(setPhone, 'phone'),
      password: bind(setPassword, 'password'),
      confirmPassword: bind(setConfirmPassword, 'confirm'),
      dialCode: setDialCode,
    },
    toggleTerms,
    canSubmit,
    isLoading,
    anyLoading: isLoading || isGoogleLoading || isAppleLoading,
    isGoogleLoading,
    isAppleLoading,
    displayError: error ?? googleError ?? appleError,
    handleContinue,
    handleGoogleSignIn,
    handleAppleSignIn,
  };
}
