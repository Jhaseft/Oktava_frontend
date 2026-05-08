import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Mail } from "lucide-react-native";
import { useAuth } from "@/src/context/AuthContext";
import { authApi, ApiError, getPendingSignUp, clearPendingSignUp } from "@/src/services/authApi";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60;
const SLOT_IDS = ['s0', 's1', 's2', 's3', 's4', 's5'];

export default function VerifyCodeScreen() {
  const { signIn } = useAuth();

  const pending = getPendingSignUp();

  const [digits, setDigits] = useState<string[]>(new Array(CODE_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  const inputRefs = useRef<(TextInput | null)[]>(new Array(CODE_LENGTH).fill(null));

  // If user lands here without pending data, redirect back
  useEffect(() => {
    if (!pending) router.replace("/register");
  }, []);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const code = digits.join("");

  const handleChangeText = (text: string, index: number) => {
    const cleaned = text.replaceAll(/\D/g, "");
    if (!cleaned) return;

    // Handle paste: distribute across remaining slots
    if (cleaned.length > 1) {
      const newDigits = [...digits];
      let slot = index;
      for (const ch of cleaned) {
        if (slot >= CODE_LENGTH) break;
        newDigits[slot] = ch;
        slot++;
      }
      setDigits(newDigits);
      const nextFocus = Math.min(slot, CODE_LENGTH - 1);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);
    setError(null);

    if (index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace") {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      } else if (index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleResend = async () => {
    if (!pending || cooldown > 0 || isResending) return;
    setIsResending(true);
    setError(null);
    try {
      await authApi.sendVerification(pending.email);
      setDigits(new Array(CODE_LENGTH).fill(""));
      setCooldown(RESEND_COOLDOWN);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sin conexion. Verifica tu internet.");
    } finally {
      setIsResending(false);
    }
  };

  const handleConfirm = async () => {
    if (code.length !== CODE_LENGTH || !pending || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const { accessToken, user } = await authApi.signUp({ ...pending, verificationCode: code });
      clearPendingSignUp();
      await signIn(accessToken, user);
      router.replace("/(cliente)/");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Sin conexion. Verifica tu internet.");
      }
      setDigits(new Array(CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  if (!pending) return null;

  return (
    <LinearGradient colors={["#450a0a", "#000000"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>

          {/* Icon */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "rgba(239,68,68,0.1)",
              borderWidth: 1,
              borderColor: "rgba(239,68,68,0.3)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <Mail size={28} color="#ef4444" />
          </View>

          <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800", marginBottom: 8 }}>
            Verifica tu correo
          </Text>
          <Text style={{ color: "#9ca3af", fontSize: 14, textAlign: "center", marginBottom: 32 }}>
            Enviamos un codigo de 6 digitos a{"\n"}
            <Text style={{ color: "#d1d5db", fontWeight: "600" }}>{pending.email}</Text>
          </Text>

          {/* Error */}
          {error && (
            <View
              style={{
                width: "100%",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "rgba(239,68,68,0.5)",
                backgroundColor: "rgba(239,68,68,0.1)",
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginBottom: 20,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 13 }}>{error}</Text>
            </View>
          )}

          {/* OTP inputs */}
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 32 }}>
            {SLOT_IDS.map((id, i) => (
              <TextInput
                key={id}
                ref={(ref) => { inputRefs.current[i] = ref; }}
                value={digits[i]}
                onChangeText={(text) => handleChangeText(text, i)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                editable={!isLoading}
                style={{
                  width: 44,
                  height: 56,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: digits[i] ? "#ef4444" : "#374151",
                  backgroundColor: "#111",
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: "700",
                  textAlign: "center",
                  opacity: isLoading ? 0.5 : 1,
                }}
              />
            ))}
          </View>

          {/* Confirm button */}
          <Pressable
            onPress={handleConfirm}
            disabled={code.length !== CODE_LENGTH || isLoading}
            style={{
              width: "100%",
              height: 48,
              borderRadius: 8,
              backgroundColor: code.length === CODE_LENGTH && !isLoading ? "#b91c1c" : "#7f1d1d",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                Confirmar codigo
              </Text>
            )}
          </Pressable>

          {/* Resend */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ color: "#6b7280", fontSize: 13 }}>No recibiste el codigo?</Text>
            {cooldown > 0 ? (
              <Text style={{ color: "#6b7280", fontSize: 13 }}>Reenviar en {cooldown}s</Text>
            ) : (
              <Pressable onPress={handleResend} disabled={isResending}>
                {isResending ? (
                  <ActivityIndicator size="small" color="#ef4444" />
                ) : (
                  <Text style={{ color: "#ef4444", fontSize: 13, fontWeight: "600" }}>
                    Reenviar codigo
                  </Text>
                )}
              </Pressable>
            )}
          </View>

          {/* Back */}
          <Pressable
            onPress={() => { clearPendingSignUp(); router.back(); }}
            style={{ marginTop: 24 }}
          >
            <Text style={{ color: "#6b7280", fontSize: 13 }}>Volver al registro</Text>
          </Pressable>

        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
