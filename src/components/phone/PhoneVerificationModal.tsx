import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { phoneVerificationService } from '@/src/services/phone-verification.service';
import { useAuth } from '@/src/context/AuthContext';

type Props = {
  visible: boolean;
  onVerified: () => void;
  onClose: () => void;
};

const CODE_LENGTH = 6;

export function PhoneVerificationModal({ visible, onVerified, onClose }: Props) {
  const { user, updateUser, refreshMe } = useAuth();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  function reset() {
    setDigits(Array(CODE_LENGTH).fill(''));
    setCodeSent(false);
    setError(null);
    setSuccessMsg(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSendCode() {
    setSending(true);
    setError(null);
    try {
      await phoneVerificationService.sendCode();
      setCodeSent(true);
      setSuccessMsg('Código enviado. Revisa tu WhatsApp.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'No se pudo enviar el código.');
    } finally {
      setSending(false);
    }
  }

  function handleDigitChange(value: string, index: number) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(key: string, index: number) {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    const code = digits.join('');
    if (code.length < CODE_LENGTH) {
      setError('Ingresa los 6 dígitos del código.');
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      const res = await phoneVerificationService.verifyCode(code);
      if (res.user) {
        await updateUser(res.user);
      } else {
        await refreshMe();
      }
      reset();
      onVerified();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Código incorrecto.');
      setDigits(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  }

  const code = digits.join('');
  const canVerify = code.length === CODE_LENGTH && !verifying;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View className="flex-1 bg-black/70 justify-center px-5">
        <View className="bg-zinc-900 rounded-2xl border border-white/10 p-6 gap-5">

          {/* Header */}
          <View className="gap-1">
            <Text className="text-white text-xl font-bold">Verifica tu número</Text>
            <Text className="text-zinc-400 text-sm leading-5">
              Te enviaremos un código por WhatsApp para confirmar tu número antes de realizar el pedido.
            </Text>
            {user?.phone && (
              <Text className="text-zinc-500 text-xs mt-1">
                Número: {user.phone}
              </Text>
            )}
          </View>

          {/* Success message */}
          {successMsg && (
            <View className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
              <Text className="text-green-400 text-sm">{successMsg}</Text>
            </View>
          )}

          {/* Error */}
          {error && (
            <View className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <Text className="text-red-400 text-sm">{error}</Text>
            </View>
          )}

          {/* Send code button — shown before and after (for resend) */}
          {!codeSent ? (
            <Pressable
              onPress={handleSendCode}
              disabled={sending}
              className={`rounded-xl py-3.5 items-center ${sending ? 'bg-zinc-700' : 'bg-red-600'}`}
            >
              {sending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-white font-semibold text-base">Enviar código</Text>
              )}
            </Pressable>
          ) : (
            <>
              {/* OTP input */}
              <View className="gap-2">
                <Text className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                  Código de 6 dígitos
                </Text>
                <View className="flex-row gap-2 justify-between">
                  {digits.map((d, i) => (
                    <TextInput
                      key={i}
                      ref={(r) => { inputRefs.current[i] = r; }}
                      value={d}
                      onChangeText={(v) => handleDigitChange(v, i)}
                      onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                      keyboardType="number-pad"
                      maxLength={1}
                      className={`flex-1 aspect-square rounded-xl border text-center text-white text-xl font-bold bg-zinc-800 ${
                        d ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholderTextColor="#52525b"
                    />
                  ))}
                </View>
              </View>

              {/* Verify button */}
              <Pressable
                onPress={handleVerify}
                disabled={!canVerify}
                className={`rounded-xl py-3.5 items-center ${
                  canVerify ? 'bg-red-600' : 'bg-zinc-700'
                }`}
              >
                {verifying ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-white font-semibold text-base">Verificar</Text>
                )}
              </Pressable>

              {/* Resend */}
              <Pressable onPress={handleSendCode} disabled={sending} className="items-center">
                <Text className="text-zinc-500 text-sm">
                  {sending ? 'Enviando...' : '¿No recibiste el código? Reenviar'}
                </Text>
              </Pressable>
            </>
          )}

          {/* Cancel */}
          <Pressable onPress={handleClose} className="items-center">
            <Text className="text-zinc-600 text-sm">Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
