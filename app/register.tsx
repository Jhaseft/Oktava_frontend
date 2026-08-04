import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useRegisterForm } from '@/src/hooks/useRegisterForm';
import { PhoneNumberInput } from '@/src/components/phone/PhoneNumberInput';
import { AuthLogo } from '@/src/components/auth/AuthLogo';
import { AuthTextField } from '@/src/components/auth/AuthTextField';
import { AuthErrorBanner } from '@/src/components/auth/AuthErrorBanner';
import { AuthPrimaryButton } from '@/src/components/auth/AuthPrimaryButton';
import { AuthDivider } from '@/src/components/auth/AuthDivider';
import { GoogleButton } from '@/src/components/auth/GoogleButton';
import { TermsCheckbox } from '@/src/components/auth/TermsCheckbox';

export default function RegisterScreen() {
  const f = useRegisterForm();
  const v = f.values;

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
          <View className="items-center justify-center gap-6 px-5 py-10">
            <View className="w-full items-center gap-2">
              <AuthLogo />
              <Text className="text-2xl font-lemon-bold text-brand-black text-center mt-2">Crea tu cuenta gratis</Text>
              <Text className="text-brand-muted font-lemon text-center text-[13px]">
                Crea tu cuenta y comienza a disfrutar de Oktava
              </Text>
            </View>

            <View className="w-full gap-4">
              {f.displayError && <AuthErrorBanner message={f.displayError} />}

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <AuthTextField
                    label="Nombre"
                    value={v.firstName}
                    onChangeText={f.onChange.firstName}
                    error={f.errors.firstName}
                    placeholder="Tu nombre"
                    editable={!f.isLoading}
                    maxLength={100}
                  />
                </View>
                <View className="flex-1">
                  <AuthTextField
                    label="Apellido"
                    value={v.lastName}
                    onChangeText={f.onChange.lastName}
                    error={f.errors.lastName}
                    placeholder="Tu apellido"
                    editable={!f.isLoading}
                    maxLength={100}
                  />
                </View>
              </View>

              <AuthTextField
                label="Correo electrónico"
                value={v.email}
                onChangeText={f.onChange.email}
                error={f.errors.email}
                placeholder="tu@ejemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                editable={!f.isLoading}
                maxLength={254}
              />

              <View className="gap-2">
                <Text className="text-brand-black text-[13px] font-lemon-medium">Número de teléfono</Text>
                <PhoneNumberInput
                  number={v.phone}
                  onChangeNumber={f.onChange.phone}
                  dial={v.dialCode}
                  onChangeDial={f.onChange.dialCode}
                  error={!!f.errors.phone}
                  editable={!f.isLoading}
                />
                {f.errors.phone && <Text className="text-brand-red text-[12px] font-lemon">{f.errors.phone}</Text>}
              </View>

              <AuthTextField
                label="Contraseña"
                value={v.password}
                onChangeText={f.onChange.password}
                error={f.errors.password}
                secure
                placeholder="**********"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password-new"
                textContentType="newPassword"
                editable={!f.isLoading}
                maxLength={128}
              />

              <AuthTextField
                label="Confirmar contraseña"
                value={v.confirmPassword}
                onChangeText={f.onChange.confirmPassword}
                error={f.errors.confirm}
                secure
                placeholder="**********"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password-new"
                textContentType="newPassword"
                editable={!f.isLoading}
                maxLength={128}
              />

              <View className="gap-2">
                <TermsCheckbox checked={v.acceptedTerms} onToggle={f.toggleTerms} disabled={f.isLoading} />
                {f.errors.terms && <Text className="text-brand-red text-[12px] font-lemon">{f.errors.terms}</Text>}
              </View>

              <AuthPrimaryButton label="Continuar" onPress={f.handleContinue} loading={f.isLoading} disabled={!f.canSubmit} />

              <AuthDivider label="O continúa con" />

              <GoogleButton onPress={f.handleGoogleSignIn} loading={f.isGoogleLoading} disabled={f.anyLoading} />

              <Pressable onPress={() => router.push('/login')} disabled={f.isLoading}>
                <Text className="text-center text-[13px] font-lemon text-brand-muted">
                  ¿Ya tienes cuenta? <Text className="text-brand-red font-lemon-bold">Inicia sesión</Text>
                </Text>
              </Pressable>

              <Pressable onPress={() => router.replace('/(cliente)/')} disabled={f.isLoading} className="active:opacity-60">
                <Text className="text-center text-[12px] font-lemon-medium text-brand-muted">Ver menú sin cuenta →</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
