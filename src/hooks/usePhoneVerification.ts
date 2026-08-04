import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { phoneVerificationService } from '@/src/services/phone-verification.service';
import { api } from '@/src/services/api';
import { useAuth } from '@/src/context/AuthContext';
import { DEFAULT_COUNTRY, toE164, type CountryCode } from '@/src/components/phone/PhoneNumberInput';

const CODE_LENGTH = 6;

function destinationFor(from?: string): string {
  if (from === 'checkout') return '/(cliente)/checkout';
  if (from === 'profile') return '/(cliente)/profile';
  return '/(cliente)/';
}

export function usePhoneVerification() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { user, updateUser } = useAuth();

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [dial, setDial] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [savingPhone, setSavingPhone] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const needsPhone = !user?.phone;
  const code = digits.join('');
  const canVerify = code.length === CODE_LENGTH && !verifying;

  const flashSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const errMsg = (e: any, fallback: string) => e?.response?.data?.message ?? e?.message ?? fallback;

  const onChangePhone = (t: string) => {
    setPhoneNumber(t);
    setError(null);
  };

  const handleSavePhoneAndSend = async () => {
    if (phoneNumber.length < 7) {
      setError('Ingresa un número válido (mín. 7 dígitos).');
      return;
    }
    setSavingPhone(true);
    setError(null);
    try {
      const e164 = toE164(dial, phoneNumber);
      await api.patch('/auth/profile', { phone: e164 });
      await updateUser({ phone: e164 });
      await phoneVerificationService.sendCode();
      setCodeSent(true);
      flashSuccess('Código enviado. Revisa tu WhatsApp.');
    } catch (e) {
      setError(errMsg(e, 'No se pudo guardar el número.'));
    } finally {
      setSavingPhone(false);
    }
  };

  const handleSendCode = async () => {
    setSending(true);
    setError(null);
    try {
      await phoneVerificationService.sendCode();
      setCodeSent(true);
      flashSuccess('Código enviado. Revisa tu WhatsApp.');
    } catch (e) {
      setError(errMsg(e, 'No se pudo enviar el código.'));
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (code.length < CODE_LENGTH) {
      setError('Ingresa los 6 dígitos del código.');
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      const res = await phoneVerificationService.verifyCode(code);
      await updateUser(res.user ?? { phoneVerified: true });
      router.replace(destinationFor(from) as any);
    } catch (e) {
      setError(errMsg(e, 'Código incorrecto.'));
      setDigits(Array(CODE_LENGTH).fill(''));
    } finally {
      setVerifying(false);
    }
  };

  return {
    phone: user?.phone ?? null,
    needsPhone,
    digits,
    setDigits,
    dial,
    setDial,
    phoneNumber,
    onChangePhone,
    sending,
    verifying,
    savingPhone,
    codeSent,
    error,
    successMsg,
    canVerify,
    handleSavePhoneAndSend,
    handleSendCode,
    handleVerify,
    goBack: () => router.back(),
  };
}
