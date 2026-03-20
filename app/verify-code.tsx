import { useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function VerifyCodeScreen() {
  const params = useLocalSearchParams<{ email: string }>();
  const email = typeof params.email === "string" ? params.email : "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const joinedCode = useMemo(() => code.join(""), [code]);
  const canContinue = joinedCode.length === 6;

  const handleVerify = () => {
    if (!canContinue) return;

    router.push({
      pathname: "/complete-profile",
      params: { email },
    });
  };

  const handleChange = (value: string, index: number) => {
    const cleanValue = value.replace(/[^0-9]/g, "").slice(-1); // Solo números

    const newCode = [...code];
    newCode[index] = cleanValue;
    setCode(newCode);

    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 justify-center px-7 gap-10">
        <View className="gap-5">
          <Text className="text-center text-5xl font-extrabold text-[#E10600]">
            OK<Text className="text-white">TA</Text>VA
          </Text>
          <Text className=" text-center text-lg font-bold leading-5 text-white">
            ACABAMOS DE ENVIARTE UN MENSAJE{" "}
          </Text>
          <Text className="text-center text-lg font-medium leading-5 text-gray-400">
            Por favor ingresa el código de verificación que acabamos de enviarte
            a tu correo electrónico.
          </Text>
        </View>

        <View>
          <View className=" flex-row justify-between">
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(value) => handleChange(value, index)}
                onKeyPress={(e) => handleBackspace(e.nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                className={`h-14 w-12 border rounded-[10px] bg-[#111111] text-xl font-bold text-white ${
                  digit ? "border-[#E10600]" : "border-[#3A3A3A]"
                }`}
              />
            ))}
          </View>
        </View>

        <View className="mt-5 gap-5">
          <Pressable
            onPress={handleVerify}
            disabled={!canContinue}
            className={`h-12 items-center justify-center rounded-full ${
              canContinue ? "bg-[#E10600]" : "bg-[#5C1414]"
            }`}
          >
            <Text className="text-base font-medium text-white">
              VERIFICAR CODIGO
            </Text>
          </Pressable>

          <View className="gap-3">
            <Text className="text-center text-lg font-medium leading-5 text-white">
              Tu código va a expirar en X:XX segundos
            </Text>
            <Pressable>
              <Text className="text-center text-lg font-medium leading-5 text-[#E10600]">
                REENVIAR CÓDIGO
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
