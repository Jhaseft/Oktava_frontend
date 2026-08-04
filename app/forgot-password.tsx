import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { CheckCircle, Mail } from 'lucide-react-native';
import { colors } from '@/src/theme/theme';
import { useForgotPassword } from '@/src/hooks/useForgotPassword';
import { AuthTextField } from '@/src/components/auth/AuthTextField';
import { AuthErrorBanner } from '@/src/components/auth/AuthErrorBanner';
import { AuthPrimaryButton } from '@/src/components/auth/AuthPrimaryButton';

export default function ForgotPasswordScreen() {
  const f = useForgotPassword();

  if (f.sent) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <View
          className="w-16 h-16 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: 'rgba(22,163,74,0.10)', borderColor: 'rgba(22,163,74,0.30)', borderWidth: 1 }}
        >
          <CheckCircle size={30} color="#16a34a" />
        </View>

        <Text className="text-brand-black text-[24px] font-lemon-bold text-center mb-3">Revisa tu correo</Text>

        <Text className="text-brand-muted text-[14px] font-lemon text-center leading-5 mb-2">
          Si el correo existe, recibirás un código de 6 dígitos para restablecer tu contraseña.
        </Text>

        <Text className="text-brand-muted text-[12px] font-lemon text-center mb-8">El código expira en 15 minutos.</Text>

        <View className="w-full gap-4">
          <AuthPrimaryButton label="Ingresar código" onPress={f.goToReset} />
          <Pressable onPress={f.goToLogin} className="active:opacity-60">
            <Text className="text-brand-muted text-[12px] font-lemon-medium text-center">Volver a iniciar sesión</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="px-6 py-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-4">
            <View className="items-center mb-2">
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(193,18,31,0.06)', borderColor: 'rgba(193,18,31,0.30)', borderWidth: 1 }}
              >
                <Mail size={28} color={colors.red} />
              </View>
            </View>

            <Text className="text-brand-black text-[24px] font-lemon-bold text-center">Recuperar contraseña</Text>

            <Text className="text-brand-muted text-[13px] font-lemon text-center leading-5 mb-2">
              Ingresa tu correo y te enviaremos un código para restablecer tu contraseña.
            </Text>

            {f.error && <AuthErrorBanner message={f.error} />}

            <AuthTextField
              label="Dirección de correo electrónico *"
              value={f.email}
              onChangeText={f.onChangeEmail}
              error={f.emailError}
              placeholder="tu@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              editable={!f.isLoading}
              maxLength={254}
              onSubmitEditing={f.handleSubmit}
            />

            <AuthPrimaryButton label="Enviar código" onPress={f.handleSubmit} loading={f.isLoading} disabled={!f.emailIsValid} />

            <Pressable onPress={f.goToLogin} disabled={f.isLoading} className="active:opacity-60 mt-1">
              <Text className="text-brand-red text-center text-[12px] font-lemon-bold uppercase" style={{ letterSpacing: 0.8 }}>
                VOLVER A INICIAR SESIÓN
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
