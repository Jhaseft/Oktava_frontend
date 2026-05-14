import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { CheckCircle, Mail } from "lucide-react-native";
import { authApi, ApiError } from "@/src/services/authApi";

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email.trim());
}

const inputBase =
  "bg-[#1a1a1a] border border-[#3a3a3a] rounded-md px-4 py-3.5 text-white text-[15px]";
const inputErr =
  "bg-[#1a1a1a] border border-[#e50909] rounded-md px-4 py-3.5 text-white text-[15px]";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const emailIsValid = isValidEmail(email);
  const showEmailError = emailTouched && email.length > 0 && !emailIsValid;

  const handleSubmit = async () => {
    setEmailTouched(true);
    setError(null);

    if (!emailIsValid) return;

    setIsLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 0) {
        setError("Sin conexión. Verifica tu internet.");
      } else {
        // Para cualquier respuesta del backend mostramos 'enviado'
        // — no revelar si el email existe o no
        setSent(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Estado: código enviado ─────────────────────────────────────────────────
  if (sent) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <View className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 items-center justify-center mb-6">
          <CheckCircle size={30} color="#22c55e" />
        </View>

        <Text className="text-white text-[26px] font-extrabold text-center mb-3">
          Revisa tu correo
        </Text>

        <Text className="text-[#888888] text-[14px] text-center leading-5 mb-2">
          Si el correo existe, recibirás un código de 6 dígitos para restablecer
          tu contraseña.
        </Text>

        <Text className="text-[#555555] text-[12px] text-center mb-8">
          El código expira en 15 minutos.
        </Text>

        <Pressable
          onPress={() =>
            router.replace(
              `/reset-password?email=${encodeURIComponent(email.trim())}`
            )
          }
          className="w-full bg-[#b91c1c] rounded-lg h-12 items-center justify-center mb-4 active:opacity-80"
        >
          <Text className="text-white text-base font-semibold">
            Ingresar código
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/login")}
          className="active:opacity-60"
        >
          <Text className="text-[#555555] text-[12px] font-semibold">
            Volver a iniciar sesión
          </Text>
        </Pressable>
      </View>
    );
  }

  // ─── Estado: formulario ─────────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-black">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          className="px-6 py-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>
            {/* Ícono */}
            <View className="items-center mb-6">
              <View className="w-16 h-16 rounded-full bg-[#1a0000] border border-[#e50909]/30 items-center justify-center">
                <Mail size={28} color="#e50909" />
              </View>
            </View>

            {/* Título */}
            <Text className="text-white text-[26px] font-extrabold text-center mb-2">
              Recuperar contraseña
            </Text>

            <Text className="text-[#888888] text-[13px] text-center leading-5 mb-7">
              Ingresa tu correo y te enviaremos un código para restablecer tu
              contraseña.
            </Text>

            {/* Error global */}
            {error && (
              <View className="bg-[#1a0000] border border-[#e50909] rounded-md px-3.5 py-2.5 mb-4">
                <Text className="text-[#ff4444] text-[13px]">{error}</Text>
              </View>
            )}

            {/* Email */}
            <View className="mb-6">
              <Text className="text-white text-[13px] font-semibold mb-2">
                Dirección de correo electrónico *
              </Text>
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(null);
                  if (!emailTouched) setEmailTouched(true);
                }}
                placeholder="tu@ejemplo.com"
                placeholderTextColor="#555555"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                editable={!isLoading}
                maxLength={254}
                onSubmitEditing={handleSubmit}
                className={showEmailError ? inputErr : inputBase}
              />
              {showEmailError && (
                <Text className="text-[#e50909] text-[12px] mt-1">
                  Ingresa un correo electrónico válido.
                </Text>
              )}
            </View>

            {/* Botón enviar */}
            <Pressable
              onPress={handleSubmit}
              disabled={!emailIsValid || isLoading}
              className={`${
                emailIsValid && !isLoading ? "bg-[#b91c1c]" : "bg-[#7f1d1d]"
              } rounded-lg h-12 items-center justify-center mb-5`}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white text-base font-semibold">
                  Enviar código
                </Text>
              )}
            </Pressable>

            {/* Link volver */}
            <Pressable
              onPress={() => router.back()}
              disabled={isLoading}
              className="active:opacity-60"
            >
              <Text
                className="text-[#e50909] text-center text-[12px] font-bold uppercase"
                style={{ letterSpacing: 0.8 }}
              >
                VOLVER A INICIAR SESIÓN
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
