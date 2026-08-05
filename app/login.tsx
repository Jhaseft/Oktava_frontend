import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useLoginForm } from '@/src/hooks/useLoginForm';
import { AuthLogo } from '@/src/components/auth/AuthLogo';
import { AuthTextField } from '@/src/components/auth/AuthTextField';
import { AuthErrorBanner } from '@/src/components/auth/AuthErrorBanner';
import { AuthPrimaryButton } from '@/src/components/auth/AuthPrimaryButton';
import { AuthDivider } from '@/src/components/auth/AuthDivider';
import { GoogleButton } from '@/src/components/auth/GoogleButton';
import { AppleButton } from '@/src/components/auth/AppleButton';

export default function LoginScreen() {
  const f = useLoginForm();

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
            <AuthLogo />

            <Text className="text-brand-black text-center text-[12px] font-lemon-bold uppercase leading-[18px] mb-2" style={{ letterSpacing: 0.8 }}>
              INICIA SESIÓN O CREA UNA CUENTA CON{'\n'}TU CORREO ELECTRÓNICO
            </Text>

            {f.displayError && <AuthErrorBanner message={f.displayError} />}

            <AuthTextField
              label="Dirección de correo electrónico"
              required
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
              onSubmitEditing={f.handleLogin}
            />

            <AuthTextField
              label="Contraseña"
              required
              value={f.password}
              onChangeText={f.onChangePassword}
              error={f.passwordError}
              secure
              placeholder="••••••••••"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              editable={!f.isLoading}
              maxLength={128}
              onSubmitEditing={f.handleLogin}
            />

            <Pressable onPress={() => router.push('/forgot-password')} disabled={f.isLoading} className="self-end active:opacity-60">
              <Text className="text-brand-red text-[12px] font-lemon-medium">¿Olvidaste tu contraseña?</Text>
            </Pressable>

            <Text className="text-brand-muted text-[11px] font-lemon leading-4 mb-1">
              Al registro o inicio de sesión, aceptas nuestras{' '}
              <Text className="text-brand-red underline">Políticas de privacidad</Text> y{' '}
              <Text className="text-brand-red underline">Términos y condiciones</Text>
            </Text>

            <AuthPrimaryButton label="Iniciar sesión" onPress={f.handleLogin} loading={f.isLoading} disabled={!f.canSubmit} />

            <AuthDivider />

            <GoogleButton onPress={f.handleGoogleSignIn} loading={f.isGoogleLoading} disabled={f.anyLoading} />

            <AppleButton onPress={f.handleAppleSignIn} loading={f.isAppleLoading} disabled={f.anyLoading} />

            <Pressable onPress={() => router.push('/register')} disabled={f.isLoading} className="active:opacity-60 mt-1">
              <Text className="text-brand-red text-center text-[12px] font-lemon-bold uppercase" style={{ letterSpacing: 0.8 }}>
                ¿NO TIENES CUENTA? REGÍSTRATE
              </Text>
            </Pressable>

            <Pressable onPress={() => router.replace('/(cliente)/')} disabled={f.isLoading} className="mt-2 active:opacity-60">
              <Text className="text-brand-muted text-center mb-10 text-[12px] font-lemon-medium">Ver menú sin cuenta →</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
