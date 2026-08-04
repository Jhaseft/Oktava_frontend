import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { usePhoneVerification } from '@/src/hooks/usePhoneVerification';
import { PhoneNumberInput } from '@/src/components/phone/PhoneNumberInput';
import { AuthLogo } from '@/src/components/auth/AuthLogo';
import { AuthErrorBanner } from '@/src/components/auth/AuthErrorBanner';
import { AuthPrimaryButton } from '@/src/components/auth/AuthPrimaryButton';
import { OtpInput } from '@/src/components/auth/OtpInput';

export default function VerifyPhoneScreen() {
  const f = usePhoneVerification();

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-6 py-8" keyboardShouldPersistTaps="handled">
          <View className="gap-5">
            <AuthLogo />

            <View className="gap-1">
              <Text className="text-brand-black text-xl font-lemon-bold text-center">Verifica tu número</Text>
              <Text className="text-brand-muted text-sm font-lemon text-center leading-5">
                {f.needsPhone
                  ? 'Ingresa tu número de WhatsApp para verificarlo antes de realizar el pedido.'
                  : 'Te enviaremos un código por WhatsApp para confirmar tu número antes de realizar el pedido.'}
              </Text>
              {f.phone && <Text className="text-brand-muted text-xs font-lemon text-center mt-1">Número: {f.phone}</Text>}
            </View>

            {f.successMsg && (
              <View className="rounded-xl px-4 py-3" style={{ backgroundColor: 'rgba(22,163,74,0.10)', borderColor: 'rgba(22,163,74,0.30)', borderWidth: 1 }}>
                <Text className="text-sm font-lemon-medium" style={{ color: '#16a34a' }}>{f.successMsg}</Text>
              </View>
            )}

            {f.error && <AuthErrorBanner message={f.error} />}

            {f.needsPhone && !f.codeSent ? (
              <View className="gap-3">
                <PhoneNumberInput
                  number={f.phoneNumber}
                  onChangeNumber={f.onChangePhone}
                  dial={f.dial}
                  onChangeDial={f.setDial}
                  error={!!f.error && f.phoneNumber.length < 7}
                  editable={!f.savingPhone}
                />
                <AuthPrimaryButton label="Guardar número y enviar código" onPress={f.handleSavePhoneAndSend} loading={f.savingPhone} />
              </View>
            ) : !f.codeSent ? (
              <AuthPrimaryButton label="Enviar código" onPress={f.handleSendCode} loading={f.sending} />
            ) : (
              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-brand-muted text-xs font-lemon-medium uppercase tracking-wider">Código de 6 dígitos</Text>
                  <OtpInput value={f.digits} onChange={f.setDigits} editable={!f.verifying} />
                </View>

                <AuthPrimaryButton label="Verificar" onPress={f.handleVerify} loading={f.verifying} disabled={!f.canVerify} />

                <Pressable onPress={f.handleSendCode} disabled={f.sending} className="items-center">
                  <Text className="text-brand-muted text-sm font-lemon-medium">
                    {f.sending ? 'Enviando...' : '¿No recibiste el código? Reenviar'}
                  </Text>
                </Pressable>
              </View>
            )}

            <Pressable onPress={f.goBack} className="items-center mt-1">
              <Text className="text-brand-muted text-sm font-lemon">Cancelar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
