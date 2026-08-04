import { useState } from 'react';
import { router } from 'expo-router';
import { api } from '@/src/services/api';
import { useAuth } from '@/src/context/AuthContext';
import { DEFAULT_COUNTRY, toE164, type CountryCode } from '@/src/components/phone/PhoneNumberInput';

export function useCompleteProfile() {
  const { updateUser } = useAuth();
  const [dial, setDial] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const phoneIsValid = phone.length >= 7;

  const onChangePhone = (t: string) => {
    setPhone(t);
    setError(null);
  };

  const handleSave = async () => {
    if (!phoneIsValid) {
      setError('Ingresa un número válido (mín. 7 dígitos).');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const e164 = toE164(dial, phone);
      await api.patch('/auth/profile', { phone: e164 });
      await updateUser({ phone: e164 });
      setShowVerifyModal(true);
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo guardar el número. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const goHome = () => router.replace('/(cliente)/');
  const closeVerify = () => {
    setShowVerifyModal(false);
    goHome();
  };

  return {
    dial,
    setDial,
    phone,
    onChangePhone,
    isLoading,
    error,
    phoneIsValid,
    showVerifyModal,
    handleSave,
    handleSkip: goHome,
    closeVerify,
  };
}
