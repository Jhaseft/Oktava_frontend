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

// ─── Helpers ────────────────────────────────────────────────────────────────

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email.trim());
}

const INPUT_BASE = {
  backgroundColor: "#1a1a1a",
  borderWidth: 1,
  borderColor: "#3a3a3a",
  borderRadius: 6,
  paddingHorizontal: 16,
  paddingVertical: 14,
  color: "#ffffff",
  fontSize: 15,
} as const;

const INPUT_ERROR = { ...INPUT_BASE, borderColor: "#e50909" } as const;

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const { signIn } = useAuth();

  // ── State (sin cambios) ────────────────────────────────────────────────────
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

  // ── Handler (sin cambios) ──────────────────────────────────────────────────
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

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>

            {/* ── Logo ── */}
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 48, fontWeight: "900", color: "#e50909", letterSpacing: -1 }}>OK</Text>
                <Text style={{ fontSize: 48, fontWeight: "900", color: "#ffffff", letterSpacing: -1 }}>TA</Text>
                <Text style={{ fontSize: 48, fontWeight: "900", color: "#e50909", letterSpacing: -1 }}>VA</Text>
              </View>
            </View>

            {/* ── Subtítulo ── */}
            <Text style={{ color: "#ffffff", textAlign: "center", fontSize: 12, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 28, lineHeight: 18 }}>
              INICIA SESIÓN O CREA UNA CUENTA CON{"\n"}TU CORREO ELECTRÓNICO
            </Text>

            {/* ── Error global ── */}
            {error && (
              <View style={{ backgroundColor: "#1a0000", borderWidth: 1, borderColor: "#e50909", borderRadius: 6, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16 }}>
                <Text style={{ color: "#ff4444", fontSize: 13 }}>{error}</Text>
              </View>
            )}

            {/* ── Email ── */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: "#ffffff", fontSize: 13, fontWeight: "600", marginBottom: 8 }}>
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
                onSubmitEditing={handleLogin}
                style={showEmailError ? INPUT_ERROR : INPUT_BASE}
              />
              {showEmailError && (
                <Text style={{ color: "#e50909", fontSize: 12, marginTop: 4 }}>
                  Ingresa un correo electrónico válido.
                </Text>
              )}
            </View>

            {/* ── Contraseña ── */}
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: "#ffffff", fontSize: 13, fontWeight: "600", marginBottom: 8 }}>
                Contraseña *
              </Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError(null);
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
                  style={showPasswordError ? { ...INPUT_ERROR, paddingRight: 48 } : { ...INPUT_BASE, paddingRight: 48 }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  style={{ position: "absolute", right: 14, top: 0, bottom: 0, justifyContent: "center" }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {showPassword
                    ? <EyeOff size={18} color="#666666" />
                    : <Eye size={18} color="#666666" />
                  }
                </TouchableOpacity>
              </View>
              {showPasswordError && (
                <Text style={{ color: "#e50909", fontSize: 12, marginTop: 4 }}>
                  La contraseña debe tener al menos 6 caracteres.
                </Text>
              )}
            </View>

            {/* ── Texto legal ── */}
            <Text style={{ color: "#888888", fontSize: 11, lineHeight: 16, marginBottom: 24 }}>
              Al registro o inicio de sesión, aceptas nuestras{" "}
              <Text style={{ color: "#e50909", textDecorationLine: "underline" }}>Políticas de privacidad</Text>
              {" "}y{" "}
              <Text style={{ color: "#e50909", textDecorationLine: "underline" }}>Términos y condiciones</Text>
            </Text>

            {/* ── Botón principal ── */}
            <Pressable
              onPress={handleLogin}
              disabled={!canSubmit || isLoading}
              style={{
                backgroundColor: canSubmit && !isLoading ? "#b91c1c" : "#7f1d1d",
                borderRadius: 8,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              {isLoading
                ? <ActivityIndicator color="#ffffff" />
                : <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600" }}>
                    Iniciar Sesión
                  </Text>
              }
            </Pressable>

            {/* ── Divisor ── */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: "#333333" }} />
              <Text style={{ color: "#888888", fontSize: 13, marginHorizontal: 14 }}>O</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: "#333333" }} />
            </View>

            {/* ── Google ── */}
            <Pressable
              disabled={isLoading}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                borderWidth: 1,
                borderColor: "#333333",
                borderRadius: 999,
                height: 50,
                marginBottom: 20,
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              <FontAwesome name="google" size={18} color="#ffffff" />
              <Text style={{ color: "#ffffff", fontSize: 13, fontWeight: "600" }}>
                Continuar con Google
              </Text>
            </Pressable>

            {/* ── Link a registro ── */}
            <Pressable
              onPress={() => router.push("/register")}
              disabled={isLoading}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Text style={{ color: "#e50909", textAlign: "center", fontSize: 12, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase" }}>
                ¿NO TIENES CUENTA? REGÍSTRATE
              </Text>
            </Pressable>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
