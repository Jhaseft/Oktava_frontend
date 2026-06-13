import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { api } from '@/src/services/api';
import { useAuth } from '@/src/context/AuthContext';
import { PhoneVerificationModal } from '@/src/components/phone/PhoneVerificationModal';
import {
  PhoneNumberInput,
  DEFAULT_COUNTRY,
  toE164,
  type CountryCode,
} from '@/src/components/phone/PhoneNumberInput';

export default function CompleteProfileScreen() {
  const { updateUser } = useAuth();
  const [dial, setDial] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const phoneIsValid = phone.length >= 7;

  async function handleSave() {
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
  }

  function handleSkip() {
    router.replace('/(cliente)/');
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 items-center justify-center px-7 py-10 gap-8">

          {/* Logo */}
          <View className="flex-row">
            <Text className="text-5xl font-black text-[#e50909]">OK</Text>
            <Text className="text-5xl font-black text-white">TA</Text>
            <Text className="text-5xl font-black text-[#e50909]">VA</Text>
          </View>

          {/* Título */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-white text-center">Un paso más</Text>
            <Text className="text-gray-400 text-center text-sm leading-5">
              Para recibir notificaciones sobre tu pedido necesitamos tu número de WhatsApp.
            </Text>
          </View>

          {/* Error */}
          {error && (
            <View className="w-full rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3">
              <Text className="text-sm text-white">{error}</Text>
            </View>
          )}

          {/* Input */}
          <View className="w-full gap-2">
            <Text className="text-sm font-medium text-gray-400">Número de WhatsApp</Text>
            <PhoneNumberInput
              number={phone}
              onChangeNumber={(t) => {
                setPhone(t);
                setError(null);
              }}
              dial={dial}
              onChangeDial={setDial}
              error={!!error && !phoneIsValid}
              editable={!isLoading}
            />
          </View>

          {/* Guardar */}
          <Pressable
            onPress={handleSave}
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#7f1d1d' : '#b91c1c',
              borderRadius: 8,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-semibold text-white">Guardar y continuar</Text>
            )}
          </Pressable>

          {/* Omitir */}
          <Pressable onPress={handleSkip} disabled={isLoading}>
            <Text className="text-sm text-gray-600">Omitir por ahora</Text>
          </Pressable>

        </View>
      </ScrollView>

      {/* Modal de verificación — se muestra justo después de guardar el teléfono */}
      <PhoneVerificationModal
        visible={showVerifyModal}
        onVerified={() => {
          setShowVerifyModal(false);
          router.replace('/(cliente)/');
        }}
        onClose={() => {
          setShowVerifyModal(false);
          router.replace('/(cliente)/');
        }}
      />
    </KeyboardAvoidingView>
  );
}
