import { useMemo, useState } from "react";
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
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Eye, EyeOff } from "lucide-react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/src/context/AuthContext";
import { authApi, ApiError } from "@/src/services/authApi";

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email.trim());
}

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailIsValid = useMemo(() => isValidEmail(email), [email]);
  const passwordIsValid = useMemo(() => password.trim().length >= 6, [password]);
  const canSubmit = emailIsValid && passwordIsValid;

  const showEmailError = emailTouched && email.length > 0 && !emailIsValid;
  const showPasswordError = passwordTouched && password.length > 0 && !passwordIsValid;

  const handleLogin = async () => {
    setEmailTouched(true);
    setPasswordTouched(true);
    setError(null);

    if (!canSubmit) return;

    setIsLoading(true);
    try {
      const { accessToken, user } = await authApi.signIn(email.trim(), password);
      await signIn(accessToken, user);
      router.replace("/home");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.statusCode === 401 ? "Credenciales Invalidas" : err.message,
        );
      } else {
        setError("Sin conexión. Verifica tu internet.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#450a0a", "#000000"]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-center justify-center gap-8 px-5 py-10">

            {/* ── Branding ── */}
            <View className="w-full items-center gap-3">
              <View className="flex-row items-center gap-2">
                <Text className="text-5xl font-extrabold text-red-500">OK</Text>
                <Text className="text-5xl font-extrabold text-white">TA</Text>
                <Text className="text-5xl font-extrabold text-red-500">VA</Text>
              </View>
              <Text className="text-4xl font-bold text-white">
                Bienvenido de nuevo
              </Text>
              <Text className="text-gray-400 text-center">
                Inicia sesión en tu cuenta para continuar
              </Text>
            </View>

            {/* ── Formulario ── */}
            <View className="w-full gap-5">

              {/* Error box */}
              {error && (
                <View className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3">
                  <Text className="text-sm text-white">{error}</Text>
                </View>
              )}

              <Text className="text-center text-3xl font-bold text-white">
                Iniciar Sesión
              </Text>

              {/* Email */}
              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-400">
                  Correo electrónico
                </Text>
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError(null);
                    if (!emailTouched) setEmailTouched(true);
                  }}
                  placeholder="tu@ejemplo.com"
                  placeholderTextColor="#4b5563"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  editable={!isLoading}
                  maxLength={254}
                  onSubmitEditing={handleLogin}
                  style={{
                    backgroundColor: "#000",
                    borderWidth: 1,
                    borderColor: showEmailError ? "#ef4444" : "#374151",
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    color: "#d1d5db",
                    fontSize: 16,
                  }}
                />
                {showEmailError && (
                  <Text className="text-sm text-red-500">
                    Ingresa un correo electrónico válido.
                  </Text>
                )}
              </View>

              {/* Contraseña con toggle */}
              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-400">
                  Contraseña
                </Text>
                <View style={{ position: "relative" }}>
                  <TextInput
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setError(null);
                      if (!passwordTouched) setPasswordTouched(true);
                    }}
                    placeholder="**********"
                    placeholderTextColor="#4b5563"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    textContentType="password"
                    editable={!isLoading}
                    maxLength={128}
                    onSubmitEditing={handleLogin}
                    style={{
                      backgroundColor: "#000",
                      borderWidth: 1,
                      borderColor: showPasswordError ? "#ef4444" : "#374151",
                      borderRadius: 8,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      paddingRight: 48,
                      color: "#d1d5db",
                      fontSize: 16,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((v) => !v)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: 0,
                      bottom: 0,
                      justifyContent: "center",
                    }}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#6b7280" />
                    ) : (
                      <Eye size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </View>
                {showPasswordError && (
                  <Text className="text-sm text-red-500">
                    La contraseña debe tener al menos 6 caracteres.
                  </Text>
                )}
              </View>

              {/* Olvidaste tu contraseña */}
              <Pressable className="items-center">
                <Text className="text-sm text-white">
                  Olvidaste Tu Contraseña?
                </Text>
              </Pressable>

              {/* Botón principal */}
              <Pressable
                onPress={handleLogin}
                disabled={!canSubmit || isLoading}
                style={{
                  backgroundColor:
                    canSubmit && !isLoading ? "#b91c1c" : "#7f1d1d",
                  borderRadius: 8,
                  height: 48,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-base font-semibold text-white">
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Text>
                )}
              </Pressable>

              {/* Divisor */}
              <View className="relative my-2">
                <View className="absolute inset-0 flex-row items-center">
                  <View className="flex-1 border-t border-[#4b5563]" />
                </View>
                <View className="items-center">
                  <Text
                    className="px-2 text-sm text-gray-400"
                    style={{ backgroundColor: "transparent" }}
                  >
                    O continúa con
                  </Text>
                </View>
              </View>

              {/* Google */}
              <Pressable
                disabled={isLoading}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  borderWidth: 1,
                  borderColor: "#374151",
                  borderRadius: 8,
                  height: 48,
                  backgroundColor: "transparent",
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <FontAwesome name="google" size={20} color="white" />
                <Text className="text-base font-medium text-white">
                  Continuar con Google
                </Text>
              </Pressable>

              {/* Link a registro */}
              <Pressable
                onPress={() => router.push("/register")}
                disabled={isLoading}
              >
                <Text className="text-center text-sm text-gray-400">
                  No tienes cuenta?{" "}
                  <Text className="text-red-400">Regístrate</Text>
                </Text>
              </Pressable>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
