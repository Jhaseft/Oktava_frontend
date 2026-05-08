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

  useEffect(() => {
    if (!pending) router.replace("/register");
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const code = digits.join("");

  const handleChangeText = (text: string, index: number) => {
    const cleaned = text.replaceAll(/\D/g, "");
    if (!cleaned) return;

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
    <LinearGradient colors={["#450a0a", "#000000"]} className="flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-center items-center px-6">

          {/* Icon */}
          <View className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 items-center justify-center mb-6">
            <Mail size={28} color="#ef4444" />
          </View>

          <Text className="text-white text-[28px] font-extrabold mb-2">
            Verifica tu correo
          </Text>
          <Text className="text-gray-400 text-sm text-center mb-8">
            Enviamos un codigo de 6 digitos a{"\n"}
            <Text className="text-gray-300 font-semibold">{pending.email}</Text>
          </Text>

          {/* Error */}
          {error && (
            <View className="w-full rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 mb-5">
              <Text className="text-white text-[13px]">{error}</Text>
            </View>
          )}

          {/* OTP inputs */}
          <View className="flex-row gap-2.5 mb-8">
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
                className={`w-11 h-14 rounded-[10px] border bg-[#111] text-white text-[22px] font-bold text-center ${digits[i] ? 'border-[#ef4444]' : 'border-[#374151]'} ${isLoading ? 'opacity-50' : ''}`}
              />
            ))}
          </View>

          {/* Confirm button */}
          <Pressable
            onPress={handleConfirm}
            disabled={code.length !== CODE_LENGTH || isLoading}
            className={`w-full h-12 rounded-lg items-center justify-center mb-5 ${code.length === CODE_LENGTH && !isLoading ? 'bg-[#b91c1c]' : 'bg-[#7f1d1d]'}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base font-semibold">
                Confirmar codigo
              </Text>
            )}
          </Pressable>

          {/* Resend */}
          <View className="flex-row items-center gap-1.5">
            <Text className="text-gray-500 text-[13px]">No recibiste el codigo?</Text>
            {cooldown > 0 ? (
              <Text className="text-gray-500 text-[13px]">Reenviar en {cooldown}s</Text>
            ) : (
              <Pressable onPress={handleResend} disabled={isResending}>
                {isResending ? (
                  <ActivityIndicator size="small" color="#ef4444" />
                ) : (
                  <Text className="text-red-500 text-[13px] font-semibold">
                    Reenviar codigo
                  </Text>
                )}
              </Pressable>
            )}
          </View>

          {/* Back */}
          <Pressable
            onPress={() => { clearPendingSignUp(); router.back(); }}
            className="mt-6"
          >
            <Text className="text-gray-500 text-[13px]">Volver al registro</Text>
          </Pressable>

        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
