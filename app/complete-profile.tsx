import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useCompleteProfile } from '@/src/hooks/useCompleteProfile';
import { PhoneVerificationModal } from '@/src/components/phone/PhoneVerificationModal';
import { PhoneNumberInput } from '@/src/components/phone/PhoneNumberInput';
import { AuthLogo } from '@/src/components/auth/AuthLogo';
import { AuthErrorBanner } from '@/src/components/auth/AuthErrorBanner';
import { AuthPrimaryButton } from '@/src/components/auth/AuthPrimaryButton';

export default function CompleteProfileScreen() {
  const f = useCompleteProfile();

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 items-center justify-center px-7 py-10 gap-8">
          <AuthLogo />

          <View className="items-center gap-2">
            <Text className="text-2xl font-lemon-bold text-brand-black text-center">Un paso más</Text>
            <Text className="text-brand-muted font-lemon text-center text-[13px] leading-5">
              Para recibir notificaciones sobre tu pedido necesitamos tu número de WhatsApp.
            </Text>
          </View>

          {f.error && <AuthErrorBanner message={f.error} />}

          <View className="w-full gap-2">
            <Text className="text-brand-black text-[13px] font-lemon-medium">Número de WhatsApp</Text>
            <PhoneNumberInput
              number={f.phone}
              onChangeNumber={f.onChangePhone}
              dial={f.dial}
              onChangeDial={f.setDial}
              error={!!f.error && !f.phoneIsValid}
              editable={!f.isLoading}
            />
          </View>

          <View className="w-full gap-4">
            <AuthPrimaryButton label="Guardar y continuar" onPress={f.handleSave} loading={f.isLoading} />

            <Pressable onPress={f.handleSkip} disabled={f.isLoading} className="active:opacity-60">
              <Text className="text-center text-[13px] font-lemon-medium text-brand-muted">Omitir por ahora</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <PhoneVerificationModal
        visible={f.showVerifyModal}
        onVerified={f.closeVerify}
        onClose={f.closeVerify}
      />
    </KeyboardAvoidingView>
  );
}
