import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Eye, EyeOff, ShieldCheck } from "lucide-react-native";
import { authApi, ApiError } from "@/src/services/authApi";

function isValidPassword(password: string) {
  return password.length >= 6;
}

const inputBase =
  "bg-[#1a1a1a] border border-[#3a3a3a] rounded-md px-4 py-3.5 text-white text-[15px]";
const inputErr =
  "bg-[#1a1a1a] border border-[#e50909] rounded-md px-4 py-3.5 text-white text-[15px]";

export default function ResetPasswordScreen() {
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();

  const [email, setEmail] = useState(emailParam ?? "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [codeTouched, setCodeTouched] = useState(false);
  const [newTouched, setNewTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const codeIsValid = /^\d{6}$/.test(code);
  const newIsValid = isValidPassword(newPassword);
  const confirmIsValid = confirmPassword.length > 0 && confirmPassword === newPassword;
  const canSubmit = email.trim().length > 0 && codeIsValid && newIsValid && confirmIsValid;

  const showCodeError = codeTouched && code.length > 0 && !codeIsValid;
  const showNewError = newTouched && newPassword.length > 0 && !newIsValid;
  const showConfirmError = confirmTouched && confirmPassword.length > 0 && !confirmIsValid;

  const handleSubmit = async () => {
    setCodeTouched(true);
    setNewTouched(true);
    setConfirmTouched(true);
    setError(null);

    if (!canSubmit) return;

    setIsLoading(true);
    try {
      await authApi.resetPassword(email.trim(), code, newPassword);
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.statusCode === 0
            ? "Sin conexión. Verifica tu internet."
            : err.message ?? "El código es inválido o ha expirado."
        );
      } else {
        setError("El código es inválido o ha expirado.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Estado: contraseña actualizada ────────────────────────────────────────
  if (success) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <View className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 items-center justify-center mb-6">
          <ShieldCheck size={30} color="#22c55e" />
        </View>

        <Text className="text-white text-[26px] font-extrabold text-center mb-3">
          ¡Listo!
        </Text>

        <Text className="text-[#888888] text-[14px] text-center leading-5 mb-8">
          Contraseña actualizada correctamente.{"\n"}Ya puedes iniciar sesión con
          tu nueva contraseña.
        </Text>

        <Pressable
          onPress={() => router.replace("/login")}
          className="w-full bg-[#b91c1c] rounded-lg h-12 items-center justify-center active:opacity-80"
        >
          <Text className="text-white text-base font-semibold">
            Ir a iniciar sesión
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
                <ShieldCheck size={28} color="#e50909" />
              </View>
            </View>

            {/* Título */}
            <Text className="text-white text-[26px] font-extrabold text-center mb-2">
              Nueva contraseña
            </Text>

            <Text className="text-[#888888] text-[13px] text-center leading-5 mb-7">
              Ingresa el código de 6 dígitos que enviamos a tu correo y elige
              una nueva contraseña.
            </Text>

            {/* Error global */}
            {error && (
              <View className="bg-[#1a0000] border border-[#e50909] rounded-md px-3.5 py-2.5 mb-4">
                <Text className="text-[#ff4444] text-[13px]">{error}</Text>
              </View>
            )}

            {/* Correo electrónico */}
            <View className="mb-4">
              <Text className="text-white text-[13px] font-semibold mb-2">
                Correo electrónico *
              </Text>
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(null);
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
                className={inputBase}
              />
            </View>

            {/* Código de verificación */}
            <View className="mb-4">
              <Text className="text-white text-[13px] font-semibold mb-2">
                Código de verificación *
              </Text>
              <TextInput
                value={code}
                onChangeText={(text) => {
                  setCode(text.replace(/\D/g, "").slice(0, 6));
                  setError(null);
                  if (!codeTouched) setCodeTouched(true);
                }}
                placeholder="123456"
                placeholderTextColor="#555555"
                keyboardType="number-pad"
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                editable={!isLoading}
                maxLength={6}
                className={showCodeError ? inputErr : inputBase}
              />
              {showCodeError && (
                <Text className="text-[#e50909] text-[12px] mt-1">
                  El código debe ser de 6 dígitos.
                </Text>
              )}
            </View>

            {/* Nueva contraseña */}
            <View className="mb-4">
              <Text className="text-white text-[13px] font-semibold mb-2">
                Nueva contraseña *
              </Text>
              <View className="relative">
                <TextInput
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    setError(null);
                    if (!newTouched) setNewTouched(true);
                  }}
                  placeholder="••••••••••"
                  placeholderTextColor="#555555"
                  secureTextEntry={!showNew}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  editable={!isLoading}
                  maxLength={128}
                  className={`${showNewError ? inputErr : inputBase} pr-12`}
                />
                <TouchableOpacity
                  onPress={() => setShowNew((v) => !v)}
                  className="absolute right-3.5 top-0 bottom-0 justify-center"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {showNew ? (
                    <EyeOff size={18} color="#666666" />
                  ) : (
                    <Eye size={18} color="#666666" />
                  )}
                </TouchableOpacity>
              </View>
              {showNewError && (
                <Text className="text-[#e50909] text-[12px] mt-1">
                  La contraseña debe tener al menos 6 caracteres.
                </Text>
              )}
            </View>

            {/* Confirmar contraseña */}
            <View className="mb-6">
              <Text className="text-white text-[13px] font-semibold mb-2">
                Confirmar contraseña *
              </Text>
              <View className="relative">
                <TextInput
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setError(null);
                    if (!confirmTouched) setConfirmTouched(true);
                  }}
                  placeholder="••••••••••"
                  placeholderTextColor="#555555"
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  editable={!isLoading}
                  maxLength={128}
                  className={`${showConfirmError ? inputErr : inputBase} pr-12`}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-0 bottom-0 justify-center"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {showConfirm ? (
                    <EyeOff size={18} color="#666666" />
                  ) : (
                    <Eye size={18} color="#666666" />
                  )}
                </TouchableOpacity>
              </View>
              {showConfirmError && (
                <Text className="text-[#e50909] text-[12px] mt-1">
                  Las contraseñas no coinciden.
                </Text>
              )}
            </View>

            {/* Botón actualizar */}
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit || isLoading}
              className={`${
                canSubmit && !isLoading ? "bg-[#b91c1c]" : "bg-[#7f1d1d]"
              } rounded-lg h-12 items-center justify-center mb-5`}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white text-base font-semibold">
                  Actualizar contraseña
                </Text>
              )}
            </Pressable>

            {/* Link solicitar nuevo código */}
            <Pressable
              onPress={() => router.push("/forgot-password")}
              disabled={isLoading}
              className="active:opacity-60"
            >
              <Text className="text-[#555555] text-center text-[12px] font-semibold">
                ¿No recibiste el código? Solicitar uno nuevo
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
