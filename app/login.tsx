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
import { Eye, EyeOff } from "lucide-react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/src/context/AuthContext";
import { authApi, ApiError } from "@/src/services/authApi";
import { useGoogleSignIn } from "@/src/hooks/useGoogleSignIn";

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email.trim());
}

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { handleGoogleSignIn, isGoogleLoading, googleError, clearGoogleError } = useGoogleSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayError = error ?? googleError;
  const anyLoading = isLoading || isGoogleLoading;

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
      router.replace("/(cliente)/");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.statusCode === 401 ? "Credenciales inválidas" : err.message);
      } else {
        setError("Sin conexión. Verifica tu internet.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = "bg-[#1a1a1a] border border-[#3a3a3a] rounded-md px-4 py-3.5 text-white text-[15px]";
  const inputErr  = "bg-[#1a1a1a] border border-[#e50909] rounded-md px-4 py-3.5 text-white text-[15px]";

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

            {/* Logo */}
            <View className="items-center mb-3">
              <View className="flex-row">
                <Text className="text-5xl font-black text-[#e50909]">OK</Text>
                <Text className="text-5xl font-black text-white">TA</Text>
                <Text className="text-5xl font-black text-[#e50909]">VA</Text>
              </View>
            </View>

            {/* Subtítulo */}
            <Text
              className="text-white text-center text-[12px] font-bold uppercase mb-7 leading-[18px]"
              style={{ letterSpacing: 0.8 }}
            >
              INICIA SESIÓN O CREA UNA CUENTA CON{"\n"}TU CORREO ELECTRÓNICO
            </Text>

            {/* Error global (email/password o Google) */}
            {displayError && (
              <View className="bg-[#1a0000] border border-[#e50909] rounded-md px-3.5 py-2.5 mb-4">
                <Text className="text-[#ff4444] text-[13px]">{displayError}</Text>
              </View>
            )}

            {/* Email */}
            <View className="mb-4">
              <Text className="text-white text-[13px] font-semibold mb-2">
                Dirección de correo electrónico *
              </Text>
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(null);
                  clearGoogleError();
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
                onSubmitEditing={handleLogin}
                className={showEmailError ? inputErr : inputBase}
              />
              {showEmailError && (
                <Text className="text-[#e50909] text-[12px] mt-1">
                  Ingresa un correo electrónico válido.
                </Text>
              )}
            </View>

            {/* Contraseña */}
            <View className="mb-2">
              <Text className="text-white text-[13px] font-semibold mb-2">
                Contraseña *
              </Text>
              <View className="relative">
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError(null);
                    clearGoogleError();
                    if (!passwordTouched) setPasswordTouched(true);
                  }}
                  placeholder="••••••••••"
                  placeholderTextColor="#555555"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  textContentType="password"
                  editable={!isLoading}
                  maxLength={128}
                  onSubmitEditing={handleLogin}
                  className={`${showPasswordError ? inputErr : inputBase} pr-12`}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-0 bottom-0 justify-center"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {showPassword
                    ? <EyeOff size={18} color="#666666" />
                    : <Eye size={18} color="#666666" />
                  }
                </TouchableOpacity>
              </View>
              {showPasswordError && (
                <Text className="text-[#e50909] text-[12px] mt-1">
                  La contraseña debe tener al menos 6 caracteres.
                </Text>
              )}
            </View>

            {/* Olvidé mi contraseña */}
            <Pressable
              onPress={() => router.push("/forgot-password")}
              disabled={isLoading}
              className="self-end mt-1 mb-3 active:opacity-60"
            >
              <Text className="text-[#e50909] text-[12px]">
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>

            {/* Texto legal */}
            <Text className="text-[#888888] text-[11px] leading-4 mb-6">
              Al registro o inicio de sesión, aceptas nuestras{" "}
              <Text className="text-[#e50909] underline">Políticas de privacidad</Text>
              {" "}y{" "}
              <Text className="text-[#e50909] underline">Términos y condiciones</Text>
            </Text>

            {/* Botón principal */}
            <Pressable
              onPress={handleLogin}
              disabled={!canSubmit || isLoading}
              className={`${canSubmit && !isLoading ? "bg-[#b91c1c]" : "bg-[#7f1d1d]"} rounded-lg h-12 items-center justify-center mb-6`}
            >
              {isLoading
                ? <ActivityIndicator color="#ffffff" />
                : <Text className="text-white text-base font-semibold">Iniciar Sesión</Text>
              }
            </Pressable>

            {/* Divisor */}
            <View className="flex-row items-center mb-5">
              <View className="flex-1 h-px bg-[#333333]" />
              <Text className="text-[#888888] text-[13px] mx-3.5">O</Text>
              <View className="flex-1 h-px bg-[#333333]" />
            </View>

            {/* Google */}
            <Pressable
              onPress={handleGoogleSignIn}
              disabled={anyLoading}
              className={`flex-row items-center justify-center gap-2.5 border border-[#333333] rounded-full h-[50px] mb-5 ${anyLoading ? "opacity-50" : ""}`}
            >
              {isGoogleLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <FontAwesome name="google" size={18} color="#ffffff" />
                  <Text className="text-white text-[13px] font-semibold">
                    Continuar con Google
                  </Text>
                </>
              )}
            </Pressable>

            {/* Link a registro */}
            <Pressable
              onPress={() => router.push("/register")}
              disabled={isLoading}
              className="active:opacity-60"
            >
              <Text
                className="text-[#e50909] text-center text-[12px] font-bold uppercase"
                style={{ letterSpacing: 0.8 }}
              >
                ¿NO TIENES CUENTA? REGÍSTRATE
              </Text>
            </Pressable>

            {/* Ver menú sin cuenta */}
            <Pressable
              onPress={() => router.replace("/(cliente)/")}
              disabled={isLoading}
              className="mt-4 active:opacity-60"
            >
              <Text className="text-[#555555] text-center text-[12px] font-semibold">
                Ver menú sin cuenta →
              </Text>
            </Pressable>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
